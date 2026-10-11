import { ObjectId } from "mongoose";
import {
    ProductCollection,
    ProductSize,
    ProductStatus
} from "../enums/product.enum";

export interface Product {
    _id: Object;
    productStatus: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productLeftCount: number;
    productPrice: number;
    productSize: ProductSize;
    productVolume: number;
    productDesc?: string;
    productImages: string[];
    productViews: number;

}

export interface ProductInput {
    productStatus?: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productLeftCount: number;
    productPrice: number;
    productSize?: ProductSize;
    productVolume?: number;
    productDesc?: string;
    productImages?: string[];
    productViews?: number;

}