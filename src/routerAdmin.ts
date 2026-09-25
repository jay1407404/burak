import express from "express";
const routerAdmin = express.Router();
import restarauntController from "./controller/restaraunt.controller ";

routerAdmin.get("/", restarauntController.goHome)

routerAdmin.get("/login", restarauntController.getLogin);

routerAdmin.get("/signup", restarauntController.getSignup);

export default routerAdmin;