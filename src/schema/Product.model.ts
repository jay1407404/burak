import mongoose, { Schema } from 'mongoose';
import {
    ProductStatus,
    ProductCollection,
    ProductSize,
    ProductVolume,
} from '../libs/types/enums/product.enum';

const ProductSchema = new Schema(
    {
        productStatus: {
            type: String,
            enum: ProductStatus,
            default: ProductStatus.PAUSE,
        },

        productCollection: {
            type: String,
            // Accept the former spelling for products already stored in MongoDB.
            enum: [...Object.values(ProductCollection), "DESERT"],
            required: true,
        },

        productName: {
            type: String,
            required: true,
        },

        productPrice: {
            type: Number,
            required: true,
        },

        productLeftCount: {
            type: Number,
            required: true,
        },

        productSize: {
            type: String,
            enum: ProductSize,
            default: ProductSize.NORMAL,
        },

        productVolume: {
            type: Number,
            enum: ProductVolume,
            default: ProductVolume.MEDIUM,
        },

        productDesc: {
            type: String,
        },

        productImages: {
            type: [String],
            default: [],
        },

        productViews: {
            type: Number,
            default: 0,
        },


    }, { timestamps: true }      //updatedAt, createAt
);

ProductSchema.index(
    { productName: 1, productSize: 1, productVolume: 1 },
    { unique: true } as mongoose.IndexOptions
);

export default mongoose.model("Product", ProductSchema);
