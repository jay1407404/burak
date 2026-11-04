import express from "express";
const router = express.Router();
import memberController from "./src/controller/member.controller";
import uploader from "./src/libs/types/utils/uploder";

/** MEMBER */
router.post("/login", memberController.login);
router.post("/signup", memberController.signup);
router.post("/member/logout",
    memberController.verifyAuth,
    memberController.logout
);
router.get("/member/detail",
    memberController.verifyAuth,
    memberController.getMemberDetail);

router.post("/member/update",
    memberController.verifyAuth,
    uploader("members").single("memberImage"),
    memberController.updateMember
);

export default router;
