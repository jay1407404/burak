import MemberModel from "../schema/Member.model";
import { Member, MemberInput } from "../libs/types/types/member";
import Errors, { HttpCode, Message } from "../libs/types/types/Errors";
import { MemberType } from "../libs/types/enums/member.enum";

class MemberService {
    private readonly memberModel;


    constructor() {
        this.memberModel = MemberModel;
    }

    public async processSignup(input: MemberInput): Promise<Member> {
        console.log("========== SIGNUP DEBUG ==========");
        console.log("INPUT:", input);
        console.log("PHONE:", input.memberPhone);

        const exist = await this.memberModel
            .findOne({ memberPhone: input.memberPhone })
            .exec();

        console.log("EXIST:", exist);
        console.log("DATABASE:", this.memberModel.db.name);
        console.log("COLLECTION:", this.memberModel.collection.name);
        console.log("==================================");

        if (exist) {
            throw new Error("Member already exists");
        }

        const result = await this.memberModel.create(input);
        return result;
    }
}

export default MemberService;     