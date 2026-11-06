import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { AdminRequest } from "../libs/types/types/member";
import { ProductInput, ProductInquiry } from "../libs/types/types/product";
import { ProductCollection } from "../libs/types/enums/product.enum";

const productService = new ProductService();

const productController: T = {};

//** SPA */

productController.getProducts = async (req: Request, res: Response) => {
    try {
        console.log("getProducts");
        const { page = "1", limit = "10", order = "createdAt", productCollection, search } = req.query;
        if (
            typeof page !== "string" ||
            typeof limit !== "string" ||
            typeof order !== "string" ||
            !Number.isSafeInteger(Number(page)) || Number(page) < 1 ||
            !Number.isSafeInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100 ||
            !Number.isSafeInteger((Number(page) - 1) * Number(limit)) ||
            !["createdAt", "updatedAt", "productPrice", "productViews", "productName"].includes(order) ||
            (productCollection !== undefined &&
                (typeof productCollection !== "string" ||
                    !Object.values(ProductCollection).includes(productCollection as ProductCollection))) ||
            (search !== undefined && (typeof search !== "string" || search.length > 200))
        ) {
            throw new Errors(HttpCode.BAD_REQUEST, "Invalid product query parameters");
        }
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
