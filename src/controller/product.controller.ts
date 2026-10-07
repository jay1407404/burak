import { Request, Response } from "express";
import Errors from "../libs/types/types/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";

const productService = new ProductService();

const productController: T = {};
productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts ");
        res.render("products");
    } catch (err) {
        console.log("Error, getAllProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

productController.createNewProduct = async (req: Request, res: Response) => {
    try {
        console.log(".createNewProduct ");
        res.render("create-product");
    } catch (err) {
        console.log("Error, createNewProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

productController.updateChoosenProduct = async (req: Request, res: Response) => {
    try {
        console.log(".updateChoosenProduct ");
    } catch (err) {
        console.log("Error, updateChoosenProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

export default productController;