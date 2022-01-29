import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { SelectModel } from 'src/helpers/select-model';
import { RegisterDTO } from '../auth/DTOs/register.dto';
import { UserDTO } from './DTOs/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {

    }

    @Get()
    async getAllUsers(): Promise<UserDTO[]> {
        return await this.userService.getAllUsers();
    }

    
    @Get('getSelectUsers')
    async getSelectUsers(): Promise<SelectModel[]> {
        return await this.userService.getSelectUsers();
    }

    @Get('getSelectUsersCustomers')
    async getSelectUsersCustomers(): Promise<SelectModel[]> {
        return await this.userService.getSelectUsersCustomers();
    }
    
    @Get(':id')
    async findUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
        return await this.userService.findUserById(id);
    }

    @Post()
    async registerUser(@Body() userDTO: RegisterDTO): Promise<UserDTO> {
        return await this.userService.registerUser(userDTO);
    }

    @Patch('updateStatusUser/:id')
    async updateStatusUser(@Param('id', ParseIntPipe) id: number, @Body() data: any): Promise<UserDTO> {
        return await this.userService.updateStatusUser(id, data);
    }

    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDTO: RegisterDTO): Promise<UserDTO> {
        return await this.userService.updateUser(id, userDTO);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
        return await this.userService.deleteUser(id);
    }

}
