import { ObjectId, Types } from "mongoose";

export interface OrderItem {
    _id: ObjectId;
    itemQuantity: number;
    itemPrice: number;
    orderId: ObjectId;
    productId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    _id: Types.ObjectId;
    orderTotal: number;
    orderDelivery: number;
    orderStatus: string;
    memberId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItemInput {
    itemQuantity: number;
    itemPrice: number;
    itemProductId: ObjectId;
    orderId?: ObjectId;
}
