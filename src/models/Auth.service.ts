import { Member } from "../libs/types/types/member";
import jwt from "jsonwebtoken";
import { AUTH_TIMER } from "../libs/types/utils/config";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";

class AuthService {
    private readonly secretToken;

    constructor() {
        this.secretToken = process.env.SECRET_TOKEN as string;
    }

    public async createToken(payload: Member): Promise<string> {
        // Mongoose documents must be converted to plain objects before signing.
        const tokenPayload = JSON.parse(JSON.stringify(payload));
        delete tokenPayload.memberPassword;
        return new Promise<string>((resolve, reject) => {
            jwt.sign(
                tokenPayload,
                this.secretToken,
                {
                    expiresIn: AUTH_TIMER * 3600,
                },
                (err, token) => {
                    if (err)
                        reject(
                            new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
                        );
                    else resolve(token as string);
                }
            );
        });
    }
    public async checkAuth(token: string): Promise<Member> {
        try {
            const result = jwt.verify(token, this.secretToken);
            if (typeof result === "string" || !result._id || !result.memberNick) {
                throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
            }
            return result as unknown as Member;
        } catch {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
        }
    }
}

export default AuthService;
