import { Response } from "express";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/types/member";
import Errors, { HttpCode } from "../libs/types/utils/Errors";
import OrderService from "../models/order.service";
import { OrderInquiry } from "../libs/types/types/order";
import { OrderStatus } from "../libs/types/enums/order.enum";


const orderService = new OrderService();
const orderController: T = {};
orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("createOrder");
        const result = await orderService.createOrder(req.member, req.body);

        res.status(HttpCode.CREATED).json(result);
    } catch (err) {
        console.log("Error, createOrder:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("getmMyOrders");
        const { page, limit, orderStatus } = req.query;
        const inquiry: OrderInquiry = {
            page: Number(page ?? 1),
            limit: Number(limit ?? 10),
            OrderStatus: (orderStatus ?? OrderStatus.PAUSE) as OrderStatus,
        };
        console.log("inquiry:", inquiry)
        const result = await orderService.getMyorders(req.member, inquiry);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getMyOrders:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

export default orderController;
