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
        try {
            const exist = await this.memberModel
                .findOne({ memberPhone: input.memberPhone })
                .exec();

            console.log("exist:", exist);

            if (exist) {
                throw new Error("Member already exists");
            }

            const result = await this.memberModel.create(input);
            return result;
        } catch (err) {
            console.log("REAL ERROR:", err);
            throw err;
        }
    }
}

export default MemberService;     