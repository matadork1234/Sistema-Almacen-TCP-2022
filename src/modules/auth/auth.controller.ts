import { Body, Controller, Post } from '@nestjs/common';
import { UserDTO } from '../user/DTOs/user.dto';
import { AuthService } from './auth.service';
import { ResponseToken } from './common/helpers/response-token';
import { LoginDTO } from './DTOs/login.dto';
import { RegisterDTO } from './DTOs/register.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() registerDTO: RegisterDTO): Promise<UserDTO> {
        console.log(registerDTO);
        return await this.authService.signup(registerDTO);
    }

    @Post('signin')
    async signin(@Body() loginDTO: LoginDTO): Promise<ResponseToken> {
        return await this.authService.signin(loginDTO);
    }
}
