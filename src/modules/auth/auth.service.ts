import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserDTO } from '../user/DTOs/user.dto';
import { UserService } from '../user/user.service';
import { LoginDTO } from './DTOs/login.dto';
import { RegisterDTO } from './DTOs/register.dto';
import { ResponseToken } from './common/helpers/response-token';

@Injectable()
export class AuthService {

    constructor(private userService: UserService,
                private jwtService: JwtService) {   
    }

    async signup(registerDTO: RegisterDTO): Promise<UserDTO> {
        return await this.userService.registerUser(registerDTO);
    }


    async signin(loginDTO: LoginDTO): Promise<ResponseToken> {
        var dataUser = await this.userService.findUserByName(loginDTO.username);

        if (dataUser && await compare(loginDTO.password, dataUser.password)) {
            var { password, ...result} = dataUser;
            const payload = { sub: result.id, username: result.username, rol: result.role }

            return {
                user: dataUser,
                token: await this.jwtService.signAsync(payload)
            }
        }

        throw new UnauthorizedException('Credentials Incorrects');
    }

}
