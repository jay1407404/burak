import express from "express";
const routerAdmin = express.Router();
import productController from "./src/controller/product.controller";
import restarauntController from "./src/controller/restaraunt.controller";

/** Restaurant */
routerAdmin.get("/", restarauntController.goHome)
routerAdmin
    .get("/login", restarauntController.getLogin)
    .post("/login", restarauntController.processLogin);
routerAdmin
    .get("/signup", restarauntController.getSignup)
    .post("/signup", restarauntController.processSignup);
routerAdmin.get("/logout", restarauntController.logout);
routerAdmin.get("/check-me", restarauntController.checkAuthSession);

/** Product */
routerAdmin.get(
    "/product/all",
    restarauntController.verifyRestaraunt,
    productController.getAllProducts
);

routerAdmin.post("/product/create", productController.createNewProduct);

routerAdmin.post("/product/:id", productController.updateChoosenProduct);


/** User */
export { routerAdmin };

