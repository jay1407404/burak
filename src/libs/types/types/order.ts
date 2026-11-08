import { ObjectId, Types } from "mongoose";
import { OrderStatus } from "../enums/order.enum";
import { Product } from "./product";

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
    //** from aggregations */
    orderItems?: OrderItem[];
    productData?: Product[];
}

export interface OrderItemInput {
    itemQuantity: number;
    itemPrice: number;
    itemProductId: ObjectId;
    orderId?: ObjectId;
}

export interface OrderInquiry {
    page: number;
    limit: number;
    OrderStatus: OrderStatus;
}

export interface OrderUpdateInput {
    orderId: string;
    orderStatus: OrderStatus;
}
