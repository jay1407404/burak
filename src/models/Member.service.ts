import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/types/member";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import { MemberStatus, MemberType } from "../libs/types/enums/member.enum";
// @ts-ignore bcryptjs does not provide type declarations in this project.
import bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/types/utils/config";

class MemberService {
    static processSignup(newMember: any) {
        throw new Error("Method not implemented.");
    }
    private readonly memberModel;

    constructor() {
        this.memberModel = MemberModel;
    }

    public async updateMember(
        member: Member,
        input: MemberUpdateInput
    ): Promise<Member> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const result = await this.memberModel
            .findOneAndUpdate(
                { _id: memberId }, input, { new: true })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        return result as unknown as Member;
    }

    public async getTopUsers(): Promise<Member[]> {
        const result = await this.memberModel.find({
            memberStatus: MemberStatus.ACTIVE,
            memberPoints: { $gt: 1 },
        })
            .sort({ memberPoints: -1 })
            .limit(4)
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result as unknown as Member[];
    }

    /** SSR */


    public async processSignup(input: MemberInput): Promise<Member> {

        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            const result = await this.memberModel.create(input) as unknown as Member;
            result.memberPassword = "";
            return result;
        } catch (err) {
            console.log("Signup database error:", err);
            if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
                throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
            }
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async getRestaurant(): Promise<Member[]> {
        const result = await this.memberModel.find({
            memberType: MemberType.RESTARAUNT
        })
            .exec();
        if (result.length === 0) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result as unknown as Member[];
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

    public async getMemberDetail(member: Member): Promise<Member> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const result = await this.memberModel
            .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
            .exec();

        if (!result) throw new Errors(HttpCode.NOT_FOUND,
            Message.NO_DATA_FOUND);

        return result as unknown as Member;
    }


    public async login({ input }: { input: LoginInput; }): Promise<Member> {
        const member = await this.memberModel
            .findOne(
                {
                    memberNick: input.memberNick,
                    memberStatus: { $ne: MemberStatus.DELETE }
                },
                { memberNick: 1, memberPassword: 1, memberStatus: 1 }
            )
            .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        else if (member.memberStatus === MemberStatus.BLOCK) {
            throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER)
        }



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

    public async getUsers(): Promise<Member[]> {
        const result = await this.memberModel.find().exec();

        return result as unknown as Member[];
    }

    public async updateChosenUser(input: MemberUpdateInput, body: any): Promise<Member[]> {
        input._id = shapeIntoMongooseObjectId(input._id);
        const result = await this.memberModel
            .findByIdAndUpdate({ _id: input._id }, input, { new: true })
            .exec();

        return result as unknown as Member[];
    }
}



export default MemberService;
