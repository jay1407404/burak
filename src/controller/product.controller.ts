import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { AdminRequest } from "../libs/types/types/member";
import { ProductInput } from "../libs/types/types/product";

const productService = new ProductService();

const productController: T = {};

//** SPA */

//** SSR */

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        const data = await productService.getAllproducts();

        res.render("products", { products: data });
    } catch (err) {
        console.log("Error, getAllProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {

        if (!req.files?.length) {
            throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
        }

        const data: ProductInput = req.body;
        data.productImages = req.files?.map(ele => {
            return ele.path
        });

        await productService.createNewProduct(data);
        res.send(
            `<script>alert("Successful creation");window.location.replace('/admin/product/all')</script>`
        );
    } catch (err) {
        console.log("Error, createNewProduct:", err);
        const message =
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        const alertMessage = JSON.stringify(message).replace(/</g, "\\u003c");
        res.send(
            `<script>alert(${alertMessage});window.location.replace('/admin/product/all')</script>`
        );
    }
};

productController.updateChoosenProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const result = await productService.updateChoosenProduct(id, req.body);


        res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log("Error, updateChoosenProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

export default productController;
