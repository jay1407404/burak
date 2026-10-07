import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/types/member";
import { MemberType } from "../libs/types/enums/member.enum";
import { Message } from "../libs/types/types/Errors";


const memberService = new MemberService();


const restarauntController: T = {};
restarauntController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome")
        res.render("home")
    } catch (err) {
        console.log("Error, goHome:", err);
    }
};

restarauntController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup")
        res.render("signup")
    } catch (err) {
        console.log("Error, getSignup:", err);
    }
};


restarauntController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin")
        res.render("login")
    } catch (err) {
        console.log("Error, getLogin:", err);
    }
};

restarauntController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processSignup ");

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.RESTARAUNT;
        const result = await memberService.processSignup(newMember);

        // TODO: SESSIONS AUTHENTICATION

        req.session.member = result;
        req.session.save(function () {
            res.send(result);
        });
    } catch (err) {
        console.log("Error, processSignup :", err);
        res.send(err);
    }

};

restarauntController.processLogin = async (req: Request, res: Response) => {
    try {
        console.log("processLogin");

        console.log("body:", req.body);
        const result = await memberService.processLogin({ input: req.body });
        // TODO: SESSIONS AUTHENTICATION


        res.send(result);
    } catch (err) {
        console.log("Error, processLogin:", err);
        res.send(err);
    }
};

restarauntController.checkAuthSession = (
    req: AdminRequest,
    res: Response
) => {
    try {
        console.log("checkAuthSession");

        if (req.session?.member)
            res.send(`<script>alert("${req.session.member.memberNick}")</script>`);
        else
            res.send(`<script>alert('${Message.NOT_AUTHENTICATED}')</script>`);
    } catch (err) {
        console.log("Error, checkAuthSession:", err);
        res.send(err);
    }
};



export default restarauntController; 