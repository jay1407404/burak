import { Member } from "../libs/types/types/member";
import { Order, OrderItemInput } from "../libs/types/types/order";
import { shapeIntoMongooseObjectId } from "../libs/types/utils/config";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { Types } from "mongoose";


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
        const memberId = shapeIntoMongooseObjectId(member._id);
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + (item.itemPrice * item.itemQuantity);
        }, 0);
        const delivery = amount < 100 ? 5 : 0; // Example delivery fee logic

        try {
            const newOrder: Order = await this.orderModel.create({
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
}

export default OrderService;
