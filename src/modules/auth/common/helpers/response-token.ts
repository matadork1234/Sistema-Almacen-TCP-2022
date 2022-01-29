import { UserDTO } from "src/modules/user/DTOs/user.dto";

export class ResponseToken {
    user: UserDTO;
    token: string;
}