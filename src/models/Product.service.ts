import { Product, ProductInput } from "../libs/types/types/product";
import ProductModel from "../schema/Product.model";
import Errors from "../libs/types/types/Errors";
import { HttpCode } from "../libs/types/types/Errors";
import { Message } from "../libs/types/types/Errors";

class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = ProductModel;
    }

    /** SPA */

    /** SSR */

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {
            const product = await this.productModel.create(input) as unknown as Product;
            return product;

        } catch (err) {
            console.error("Error, model:createNewProduct:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }


}

export default ProductService;
