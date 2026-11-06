import { Product, ProductInput, ProductInquiry, ProductUpdateInput } from "../libs/types/types/product";
import ProductModel from "../schema/Product.model";
import Errors from "../libs/types/utils/Errors";
import { HttpCode } from "../libs/types/utils/Errors";
import { Message } from "../libs/types/utils/Errors";
import mongoose, { ObjectId } from "mongoose";
import { T } from "../libs/types/common";
import { ProductStatus } from "../libs/types/enums/product.enum";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/types/view";
import { ViewGroup } from "../libs/types/enums/view.enum";

class ProductService {
    private readonly productModel;
    public viewService;


    constructor() {
        this.productModel = ProductModel;
        this.viewService = new ViewService();
    }

    /** SPA */

    public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
        const match: T = { productStatus: ProductStatus.PROCESS };

        if (inquiry.productCollection)
            match.productCollection = inquiry.productCollection;
        if (inquiry.search) {
            const search = inquiry.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            match.productName = { $regex: search, $options: "i" };
        }

        const sort: T =
            inquiry.order === "productPrice"
                ? { [inquiry.order]: 1 }
                : { [inquiry.order]: -1 };

        const result = await this.productModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                { $skip: (inquiry.page - 1) * inquiry.limit },
                { $limit: inquiry.limit },
            ])
            .exec();

        return result as unknown as Product[];
    }


    public async getProduct(
        memberId: ObjectId | null,
        id: string
    ): Promise<Product> {
        const productId = shapeIntoMongooseObjectId(id);

        let result = await this.productModel
            .findOne({
                _id: productId,
                productStatus: ProductStatus.PROCESS,
            })
            .exec();

        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        if (memberId) {
            // Check Existence
            const input: ViewInput = {
                memberId: memberId,
                viewRefId: productId,
                viewGroup: ViewGroup.PRODUCT,
            };
            const existView = await this.viewService.checkViewExistance(input);

            console.log("existView:", existView);
            if (!existView) {
                // Insert View
                const view = await this.viewService.insertMemberView(input);
                if (!view) return result as unknown as Product;

                // Increase Counts
                result = await this.productModel
                    .findOneAndUpdate(
                        { _id: productId },
                        { $inc: { productViews: +1 } },
                        { new: true }
                    )
                    .exec();
                if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
            }

        }

        return result as unknown as Product;
    }

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
        const productId = shapeIntoMongooseObjectId(id);
        const result = await this.productModel
            .findOneAndUpdate({ _id: productId }, input, { new: true })
            .exec() as unknown as Product | null;
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

        return result;
    }
}

export default ProductService;
function shapeIntoMongooseObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
}

