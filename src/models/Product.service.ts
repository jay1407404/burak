import { Product, ProductInput, ProductUpdateInput } from "../libs/types/types/product";
import ProductModel from "../schema/Product.model";
import Errors from "../libs/types/utils/Errors";
import { HttpCode } from "../libs/types/utils/Errors";
import { Message } from "../libs/types/utils/Errors";
import mongoose from "mongoose";

class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = ProductModel;
    }

    /** SPA */

    /** SSR */

    public async getAllproducts(): Promise<Product[]> {
        const result = (await this.productModel.find().exec()) as unknown as Product[];
        return result;
    }

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {
            const product = await this.productModel.create(input) as unknown as Product;
            return product;

        } catch (err) {
            console.error("Error, model:createNewProduct:", err);
            if (err instanceof mongoose.Error.ValidationError) {
                const message = Object.values(err.errors)
                    .map(error => error.message)
                    .join("; ");
                throw new Errors(HttpCode.BAD_REQUEST, message);
            }
            if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
                throw new Errors(
                    HttpCode.BAD_REQUEST,
                    "A product with this name, size, and volume already exists. Use a different name or edit the existing product."
                );
            }
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async updateChoosenProduct(
        id: string,
        input: ProductUpdateInput
    ): Promise<Product> {
        // string => ObjectId
        id = shapeIntoMongooseObjectId(id);
        const result = await this.productModel
            .findOneAndUpdate({ _id: id }, input, { new: true })
            .exec() as unknown as Product | null;
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

        return result;
    }
}

export default ProductService;
function shapeIntoMongooseObjectId(id: string): string {
    return id;
}

