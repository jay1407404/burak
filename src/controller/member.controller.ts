import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { LoginInput, Member, MemberInput } from "../libs/types/types/member";
import Errors from "../libs/types/utils/Errors";
import AuthService from "../models/Auth.service";
import { token } from "morgan";

const memberService = new MemberService();
const authServie = new AuthService();


const memberController: T = {};
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup ");
        const input: MemberInput = req.body,
            result: Member = await memberService.signup(input);
        const token = await AuthService.createToken(result);

        // TODO: TOKENS AUTHENTICATION

        res.json({ member: result });
    } catch (err) {
        console.log("Error, signup:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
        //res.json({});
    }

};


memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login");

        const input: LoginInput = req.body;
        const result = await memberService.login({ input }),
            token = AuthService.createToken(result);
        console.log("token =>", token);
        // TODO: TOKENS AUTHENTICATION



        res.json({ member: result });
    } catch (err) {
        console.log("Error, login:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};

export default memberController; 