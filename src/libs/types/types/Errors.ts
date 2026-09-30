export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FIRBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
    SOMETHING_WENT_WRONG = "SOMETHING WENT WRONG!",
    NO_DATA_FOUND = "No data is found!",
    CREATE_FAILED = "Create is failed!",
    UPDATE_FAILED = "Update is failed!",

    USED_NICK_PHONE = "You are inserting already used nick or phone!",
    NO_MEMBER_NICK = "No member with that member nick!",
    WRONG_PASSSWORD = "Wrong password, please try again!"
}

class Errors extends Error {
    public code: HttpCode;
    public mesage: Message | undefined;

    constructor(statusCode: HttpCode, statusMessage: Message) {
        super();
        this.code = statusCode;
        this.message = statusMessage;
    }
}

export default Errors;