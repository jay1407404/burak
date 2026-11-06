import { View, ViewInput } from "../libs/types/types/view";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";
import ViewModel from "../schema/View.model";


class ViewService {
    private readonly viewModel;

    constructor() {
        this.viewModel = ViewModel;
    }

    public async checkViewExistance(input: ViewInput): Promise<View | null> {
        return await this.viewModel.
            findOne({
                memberId: input.memberId,
                viewRefId: input.viewRefId,
                viewGroup: input.viewGroup,
            })
            .exec() as unknown as View | null;

    }

    public async insertMemberView(input: ViewInput): Promise<View | null> {
        try {
            return await this.viewModel.create(input) as unknown as View;

        } catch (err) {
            if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
                return null;
            }
            console.log("Error, insertMemberView:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }
}

export default ViewService;
