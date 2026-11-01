import express from "express";
const router = express.Router();
import memberController from "./src/controller/member.controller";

/** MEMBER */
router.post("/login", memberController.login);
router.post("/signup", memberController.signup);
router.post("/member/logout",
    memberController.verifyAuth,
    memberController.logout);
router.get("/member/detail", memberController.verifyAuth);

export default router;