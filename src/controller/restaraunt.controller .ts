import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/types/member";
import { MemberType } from "../libs/types/enums/member.enum";
import { HttpCode, Message } from "../libs/types/types/Errors";



const memberService = new MemberService();


const restarauntController: T = {};
restarauntController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome")
        res.render("home")
    } catch (err) {
        console.log("Error, goHome:", err);
        res.redirect("/admin");
    }
};

restarauntController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup")
        res.render("signup")
    } catch (err) {
        console.log("Error, getSignup:", err);
        res.redirect("/admin"); ``
    }
};


restarauntController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin")
        res.render("login")
    } catch (err) {
        console.log("Error, getLogin:", err);
        res.redirect("/admin");
    }
};

restarauntController.processSignup = async (
    req: AdminRequest,
    res: Response
) => {
    const file = req.file;
    console.log("Uploaded file:", file);

    const newMember: MemberInput = req.body;
    console.log("Before image:", newMember.memberImage);

    if (!file) throw new Error("Image file not uploaded");

    newMember.memberImage = file.filename;
    newMember.memberType = MemberType.RESTARAUNT;

    console.log("After image:", newMember.memberImage);

    const result = await memberService.processSignup(newMember);
    try {
        const file = req.file;

        if (!file) throw new Error("Please upload an image");

        const newMember: MemberInput = req.body;
        newMember.memberImage = file.filename;
        newMember.memberType = MemberType.RESTARAUNT;

        const result = await memberService.processSignup(newMember);

        req.session.member = result;
        req.session.save(() => res.redirect("/admin/product/all"));
    } catch (err) {
        console.log("Error, processSignup:", err);
        res.status(400).send(
            err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG
        );
    }
};

restarauntController.processLogin = async (req: Request, res: Response) => {
    try {
        console.log("processLogin");

        console.log("body:", req.body);
        const result = await memberService.processLogin({ input: req.body });

        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        });

    } catch (err) {
        console.log("Error, processLogin:", err);
        const message
            = err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}");window.location.replace('admin/login')</script>`
        );
    }
};

restarauntController.logout = async (
    req: Request,
    res: Response
) => {
    try {
        console.log("logout");
        req.session.destroy(function () {
            res.redirect("/admin");
        });
    } catch (err) {
        console.log("Error, logout:", err);
        res.redirect("/admin");
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
        const message
            = err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}");window.location.replace('admin/login')</script>`
        );
    }
};

restarauntController.verifyRestaraunt = (
    req: AdminRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.session?.member?.memberType === MemberType.RESTARAUNT) {
        req.member = req.session.member;
        next();
    } else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(
            `<script>alert("${message}"); window.location.replace('/admin/login');</script>`
        );
    }
};

export default restarauntController; 