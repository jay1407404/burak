import { OrderStatus } from "../libs/types/enums/order.enum";
import { Member } from "../libs/types/types/member";
import { Order, OrderInquiry, OrderItemInput } from "../libs/types/types/order";
import { shapeIntoMongooseObjectId } from "../libs/types/utils/config";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { ClientSession, Types } from "mongoose";


class OrderService {
    private readonly orderModel;
    private readonly ordertItemModel;

    constructor() {
        this.orderModel = OrderModel;
        this.ordertItemModel = OrderItemModel;
    }

    public async createOrder(
        member: Member,
        input: OrderItemInput[]):
        Promise<Order> {
        if (!Array.isArray(input) || !input.length || input.some(item =>
            !item || !Number.isSafeInteger(item.itemQuantity) || item.itemQuantity <= 0 ||
            !Number.isFinite(item.itemPrice) || item.itemPrice < 0 ||
            !Types.ObjectId.isValid(String(item.itemProductId))
        )) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        const memberId = shapeIntoMongooseObjectId(member._id);
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + (item.itemPrice * item.itemQuantity);
        }, 0);
        const delivery = amount < 100 ? 5 : 0; // Example delivery fee logic
        if (!Number.isFinite(amount)) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        const session = await this.orderModel.db.startSession();
        try {
            let newOrder!: Order;
            await session.withTransaction(async () => {
                [newOrder] = await this.orderModel.create([{
                    orderTotal: amount + delivery,
                    orderDelivery: delivery,
                    memberId: memberId,
                }], { session });

                const orderId = newOrder._id;
                console.log("orderId:", orderId);
                await this.recordOrderItem(orderId, input, session);
            });

            return newOrder;
        } catch (err) {
            console.log("Error, createOrder:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        } finally {
            await session.endSession();
        }

    }

    private async recordOrderItem(
        orderId: Types.ObjectId,
        input: OrderItemInput[],
        session: ClientSession
    ): Promise<void> {
        await this.ordertItemModel.insertMany(input.map((item: OrderItemInput) => ({
            itemQuantity: item.itemQuantity,
            itemPrice: item.itemPrice,
            orderId: orderId,
            productId: shapeIntoMongooseObjectId(item.itemProductId),
        })), { session });
    }

    public async getMyorders(
        member: Member,
        inquiry: OrderInquiry
    ): Promise<Order[]> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        if (!Number.isSafeInteger(inquiry.page) || inquiry.page < 1 ||
            !Number.isSafeInteger(inquiry.limit) || inquiry.limit < 1 ||
            !Object.values(OrderStatus).includes(inquiry.OrderStatus)
        ) throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
        const matches = { memberId: memberId, orderStatus: inquiry.OrderStatus };

        const result = await this.orderModel.aggregate([
            { $match: matches },
            { $sort: { updatedAt: -1, _id: -1 } },
            { $skip: (inquiry.page - 1) * inquiry.limit },
            { $limit: inquiry.limit },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderItems",
                },
            },
        ])
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }
}

export default OrderService;
