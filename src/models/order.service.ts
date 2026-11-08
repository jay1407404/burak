import { OrderStatus } from "../libs/types/enums/order.enum";
import { Member } from "../libs/types/types/member";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/types/order";
import { shapeIntoMongooseObjectId } from "../libs/types/utils/config";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { Types } from "mongoose";
import MemberService from "./Member.service";


class OrderService {
    private readonly orderModel;
    private readonly ordertItemModel;
    private readonly memberService;

    constructor() {
        this.orderModel = OrderModel;
        this.ordertItemModel = OrderItemModel;
        this.memberService = new MemberService;
    }

    public async createOrder(
        member: Member,
        input: OrderItemInput[]):
        Promise<Order> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + (item.itemPrice * item.itemQuantity);
        }, 0);
        const delivery = amount < 100 ? 5 : 0; // Example delivery fee logic

        try {
            const newOrder = await this.orderModel.create({
                orderTotal: amount + delivery,
                orderDelivery: delivery,
                memberId: memberId,
            });
            const orderId = newOrder._id;
            console.log("orderId:", orderId);
            await this.recordOrderItem(orderId, input);

            return newOrder;
        } catch (err) {
            console.log("Error, createOrder:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }

    }

    private async recordOrderItem(
        orderId: Types.ObjectId,
        input: OrderItemInput[]
    ): Promise<void> {
        const promisedList = input.map(async (item: OrderItemInput) => {
            await this.ordertItemModel.create({
                ...item,
                orderId: orderId,
                productId: shapeIntoMongooseObjectId(item.itemProductId),
            });
            return "INSERTED";
        });
        const orderItemsState = await Promise.all(promisedList);
        console.log("promisedList, promisedList")
    }

    public async getMyorders(
        member: Member,
        inquiry: OrderInquiry
    ): Promise<Order[]> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const matches = { memberId: memberId, orderStatus: inquiry.OrderStatus };

        const result = await this.orderModel.aggregate([
            { $match: matches },
            { $sort: { updatedAt: -1 } },
            { $skip: (inquiry.page - 1) * inquiry.limit },
            { $limit: inquiry.limit },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderitems",

                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderitems.productId",
                    foreignField: "_id",
                    as: "productData"
                }
            }
        ])
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    public async updateOrder(
        member: Member,
        input: OrderUpdateInput
    ): Promise<Order> {
        const memberId = shapeIntoMongooseObjectId(member._id),
            orderId = shapeIntoMongooseObjectId(input.orderId),
            orderStatus = input.orderStatus;
        const result = await this.orderModel.findOneAndUpdate({
            memberId: memberId,
            _id: orderId,
        },
            { orderStatus: orderStatus },
            { new: true }
        )
            .exec();
        if (!result) throw new Errors(
            HttpCode.NOT_MODIFIED,
            Message.UPDATE_FAILED);

        if (orderStatus === OrderStatus.PROCESS) {
            await this.memberService.addUserPoint(member, 1);
        }
        return result;
    }
}

export default OrderService;
