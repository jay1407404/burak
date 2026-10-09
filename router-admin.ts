import express from "express";
const routerAdmin = express.Router();
import productController from "./src/controller/product.controller";
import restarauntController from "./src/controller/restaraunt.controller";
import makeUploader from "./src/libs/types/utils/uploder";

const uploadProductImage = makeUploader("products");

/** Restaurant */
routerAdmin.get("/", restarauntController.goHome)
routerAdmin
    .get("/login", restarauntController.getLogin)
    .post("/login", restarauntController.processLogin);
routerAdmin
    .get("/signup", restarauntController.getSignup)
    .post("/signup",
        makeUploader("members").single("memberImage"),
        restarauntController.processSignup);
routerAdmin.get("/logout", restarauntController.logout);
routerAdmin.get("/check-me", restarauntController.checkAuthSession);

/** Product */
routerAdmin.get(
    "/product/all",
    restarauntController.verifyRestaraunt,
    productController.getAllProducts
);

routerAdmin.post(
    "/product/create",
    restarauntController.verifyRestaraunt,
    makeUploader("products").array("productImage", 5),
    //uploadProductImage.single("productImage"),
    productController.createNewProduct
);

routerAdmin.post(
    "/product/:id",
    restarauntController.verifyRestaraunt,
    makeUploader("products").single("productImage"),
    productController.updateChoosenProduct
);


/** User */
export { routerAdmin };

