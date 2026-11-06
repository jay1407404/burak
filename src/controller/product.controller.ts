import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { AdminRequest, ExtendedRequest } from "../libs/types/types/member";
import { ProductInput, ProductInquiry } from "../libs/types/types/product";
import { ProductCollection } from "../libs/types/enums/product.enum";

const productService = new ProductService();

const productController: T = {};

//** SPA */

productController.getProducts = async (req: Request, res: Response) => {
    try {
        console.log("getProducts");
        const { page, limit, order, productCollection, search } = req.query;
        const inquiry: ProductInquiry = {
            order: String(order),
            page: Number(page),
            limit: Number(limit),
        };
        if (productCollection) {
            inquiry.productCollection =
                productCollection as ProductCollection;
        }
        if (search) inquiry.search = String(search);

        const result = await productService.getProducts(inquiry);


        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("getProduct");
        const { id } = req.params;
        const memberId = req.member?._id ?? null,
            result = await productService.getProduct(memberId, id);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
}

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
