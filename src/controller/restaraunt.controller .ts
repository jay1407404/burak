import { Request, Response } from "express";
import { T } from "../libs/types/types/common";
import MemberService from "../models/Member.service";
import { MemberInput } from "../libs/types/types/member";
import { MemberType } from "../libs/types/enums/member.enum";

const restarauntController: T = {};
restarauntController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome")
        // LOGIC
        // SERVICE MODEL
        //...
        res.send("Home Page")
    } catch (err) {
        console.log("Error, goHome:", err);
    }
};

restarauntController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin")
        res.send("Login Page")
    } catch (err) {
        console.log("Error, getLogin:", err);
    }
};

restarauntController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup")
        res.send("Signup Page")
    } catch (err) {
        console.log("Error, getSignup:", err);
    }
};

restarauntController.processLogin = (req: Request, res: Response) => {
    try {
        console.log("processLogin");
        res.send("DONE");
    } catch (err) {
        console.log("Error, processLogin:", err);
    }
};

restarauntController.processSignup = async (req: Request, res: Response) => {
    try {
        console.log("processSignup ");
        console.log("body:", req.body);


        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.RESTARAUNT;


        const memberService = new MemberService();
        const result = await memberService.processSignup(newMember);


        res.send(result);
    } catch (err) {
        console.log("Error, processSignup :", err);
        res.send(err);
    }
};



export default restarauntController; 