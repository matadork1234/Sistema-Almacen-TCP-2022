import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRoles } from 'src/app-roles';
import { SelectModel } from 'src/helpers/select-model';
import { In, Not, Repository } from 'typeorm';
import { RegisterDTO } from '../auth/DTOs/register.dto';
import { UserDTO } from './DTOs/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectMapper()
        private readonly mapper: Mapper
    ) {

    }

    async findUserById(id: number): Promise<User> {
        var  dataUser = await this.userRepository.findOne(id);
        
        if (!dataUser) {
            throw new NotFoundException('Not exists user');
        }
        return dataUser;
    }

    async getSelectUsers(): Promise<SelectModel[]> {
        var dataUsers = await this.userRepository.find({
            where: {
                isActive: true,
                role: In([AppRoles.STOCK, AppRoles.AUTHORIZE, AppRoles.MANAGER])
            },
            select: ['id', 'username']
        });

        console.log(dataUsers);

        return this.mapper.mapArray(dataUsers, SelectModel, User);
    }

    async getSelectUsersCustomers(): Promise<SelectModel[]> {
        var dataUsers = await this.userRepository.find({
            where: {
                isActive: true,
                role: AppRoles.CUSTOMER
            },
            select: ['id', 'username']
        });
        return this.mapper.mapArray(dataUsers, SelectModel, User);
    }

    async findUserByName(username: string): Promise<User> {
        var dataUser = await this.userRepository.findOne({ username });

        if (!dataUser) {
            throw new NotFoundException('Not exists user');
        }
        
        return dataUser;
    }

    async registerUser(registerDTO: RegisterDTO): Promise<UserDTO> {

        var data =  await this.userRepository.findOne({ username: registerDTO.username });

        if (data) {
            throw new UnauthorizedException('User exists');
        }
        
        var newUser = new User();
        newUser.username = registerDTO.username;
        newUser.password = registerDTO.password;
        newUser.email = registerDTO.email;
        newUser.role = registerDTO.role;
        newUser.isActive = true;

        var dataUser = await this.userRepository.save(newUser);

        return dataUser;
    }

    async updateUser(id: number, registerDTO: RegisterDTO): Promise<UserDTO> {
        var dataUser = await this.findUserById(id);

        try {
            dataUser.email = registerDTO.email;
            dataUser.username = registerDTO.username;
            dataUser.role = registerDTO.role;

            await this.userRepository.save(dataUser);

            return dataUser;

        } catch (error) {
            throw new BadRequestException(error.detail);
        }

    }

    async updateStatusUser(id: number, data: any): Promise<UserDTO> {
        var dataUser = await this.findUserById(id);

        try {
            if (dataUser.isActive) {
                dataUser.isActive = false;
            } else {
                dataUser.isActive = true;
            }

            await this.userRepository.save(dataUser);

            return dataUser;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

    async getAllUsers(): Promise<UserDTO[]> {
        var dataUser = await this.userRepository.find({
            where: {
                role: Not('ADMIN')
            }
        });

        return dataUser;
    }

    async deleteUser(id: number): Promise<UserDTO> {
        var dataUser = await this.findUserById(id);

        try {
            await this.userRepository.remove(dataUser);

            return dataUser;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }
}
