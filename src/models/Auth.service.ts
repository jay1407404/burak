import { resolve } from "path";
import { Member } from "../libs/types/types/member";
import jwt from "jsonwebtoken";
import { AUTH_TIMER } from "../libs/types/utils/config";
import Errors, { HttpCode, Message } from "../libs/types/utils/Errors";

class AuthService {
    static createToken(result: Member): any {
        throw new Error("Method not implemented.");
    }
    constructor() { }

    public async createToken(payload: Member) {
        return new Promise((resolve, reject) => {
            const duration = `${AUTH_TIMER}h`;
            jwt.sign(
                payload,
                process.env.SECRET_TOKEN as string,
                {
                    expiresIn: duration,
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
}

export default AuthService;