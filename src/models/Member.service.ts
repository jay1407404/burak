import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput } from "../libs/types/types/member";
import Errors, { HttpCode, Message } from "../libs/types/types/Errors";
import { MemberType } from "../libs/types/enums/member.enum";
import * as bcrypt from "bcryptjs";

class MemberService {
    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }

    /** SSR */


    public async processSignup(input: MemberInput): Promise<Member> {
        // const exist = await this.memberModel
        //     .findOne({ memberPhone: input.memberPhone })
        //     .exec();
        // if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);


        console.log("before:", input.memberPassword);
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
        console.log("after:", input.memberPassword);


        try {
            const result = await this.memberModel.create(input) as unknown as Member;
            result.memberPassword = "";
            return result;
        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    /** SPA */
    public async signup(input: MemberInput): Promise<Member> {
        try {
            const exist = await this.memberModel.findOne({
                $or: [
                    { memberNick: input.memberNick },
                    { memberPhone: input.memberPhone }
                ]
            });

            if (exist)
                throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);

            input.memberPassword = await bcrypt.hash(input.memberPassword, 10);

            const result = await this.memberModel.create(input) as unknown as Member;

            result.memberPassword = "";
            return result;
        } catch (err) {
            console.log("Error, model:signup", err);
            throw err;
        }
    }


    public async login({ input }: { input: LoginInput; }): Promise<Member> {
        // TODO: Consider member status later
        const member = await this.memberModel
            .findOne(
                { memberNick: input.memberNick },
                { memberNick: 1, memberPassword: 1 }
            )
            .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        const isMatch = await bcrypt.compare(
            input.memberPassword,
            member.memberPassword
        );

        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSSWORD);
        }

        const result = await this.memberModel.findById(member.id).lean().exec();
        if (!result) {
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        }

        return result as unknown as Member;
    }


    public async processLogin({ input }: { input: LoginInput; }): Promise<Member> {
        const member = await this.memberModel
            .findOne(
                { memberNick: input.memberNick },
                { memberNick: 1, memberPassword: 1 }

            )
            .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        const isMatch = await bcrypt.compare(
            input.memberPassword,
            member.memberPassword
        );

        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSSWORD);
        }

        const result = await this.memberModel.findById(member.id).lean().exec();

        if (!result) {
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        }

        return result as unknown as Member;
    }
}

export default MemberService;