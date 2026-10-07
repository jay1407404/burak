import express from "express";
const routerAdmin = express.Router();
import restarauntController from "./src/controller/restaraunt.controller ";

/** Restaraunt */
routerAdmin.get("/", restarauntController.goHome)
routerAdmin
    .get("/login", restarauntController.getLogin)
    .post("/login", restarauntController.processLogin);
routerAdmin
    .get("/signup", restarauntController.getSignup)
    .post("/signup", restarauntController.processSignup);

routerAdmin.get("/check-me", restarauntController.checkAuthSession);

/** Product */
/** User */
export default routerAdmin;

