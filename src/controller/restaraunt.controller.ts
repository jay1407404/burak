import { NextFunction, Request, Response } from "express";
import "express-session";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/types/member";
import { MemberType } from "../libs/types/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import { Member } from "../libs/types/types/member";

declare module "express-session" {
    interface SessionData {
        member?: Member;
    }
}


const memberService = new MemberService();


const restarauntController: T = {};

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

restarauntController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        const { memberNick, memberPhone, memberPassword, confirmPassword } = req.body;
        if (
            typeof memberNick !== "string" || !memberNick.trim() ||
            typeof memberPhone !== "string" || !memberPhone.trim() ||
            typeof memberPassword !== "string" || !memberPassword
        ) {
            throw new Errors(HttpCode.BAD_REQUEST, "Please fill in all required fields.");
        }
        if (memberPassword !== confirmPassword) {
            throw new Errors(HttpCode.BAD_REQUEST, "Passwords do not match. Please check them.");
        }
        if (!req.file) {
            throw new Errors(HttpCode.BAD_REQUEST, "Please choose a restaurant image.");
        }
        if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
            throw new Errors(HttpCode.BAD_REQUEST, "Please choose a JPG, JPEG, or PNG image.");
        }

        const newMember: MemberInput = {
            memberNick: memberNick.trim(),
            memberPhone: memberPhone.trim(),
            memberPassword,
            memberType: MemberType.RESTARAUNT,
            memberImage: req.file.path,
        };
        const result = await memberService.processSignup(newMember);

        req.session.member = result;
        req.session.save(function (err) {
            if (err) {
                console.error("Error saving signup session:", err);
                res.status(HttpCode.INTERNAL_SERVER_ERROR).send(
                    'Your account was created, but automatic login failed. Please <a href="/admin/login">log in</a>.'
                );
                return;
            }
            res.redirect("/admin/product/all");
        });
    } catch (err) {
        console.log("Error, processSignup :", err);
        const message
            = err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
        const alertMessage = JSON.stringify(message).replace(/</g, "\\u003c");
        res.send(`<script>alert(${alertMessage});window.location.replace('/admin/signup')</script>`
        );
    }

};

restarauntController.processLogin = async (req: Request, res: Response) => {
    try {
        console.log("processLogin");

        console.log("body:", req.body);
        const result = await memberService.processLogin({ input: req.body });
        // TODO: SESSIONS AUTHENTICATION

        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        })

    } catch (err) {
        console.log("Error, processLogin:", err);
        const message
            = err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}");window.location.replace('/admin/login')</script>`
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

restarauntController.getUsers = async (req: Request, res: Response) => {
    try {
        console.log("getUsers")
        const result = await memberService.getUsers();
        console.log("result:", result);

        res.render("users", { users: result });

    } catch (err) {
        console.log("Error, getUsers:", err);
        res.redirect("/admin/login");
    }
};

restarauntController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenUser");

        const result = await memberService.updateChosenUser(req.body.memberId, req.body.chosen);

        res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log("Error, updateChosenUser:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
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

export default restarauntController;
