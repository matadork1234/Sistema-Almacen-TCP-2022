import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { filenameExt } from 'src/helpers/filename';
import { imageFileFilter } from 'src/helpers/image-file-filter';
import { SelectModel } from 'src/helpers/select-model';
import { UserParam } from '../auth/common/decorators/user.decorator';
import { AuthJwtGuard } from '../auth/guards/auth-jwt.guard';
import { User } from '../user/entities/user.entity';
import { ManagerDTO } from './DTOs/manager.dto';
import { Manager } from './entities/manager.entity';
import { ManagerService } from './manager.service';

const MULTER_OPTIONS: MulterOptions = {
    storage: diskStorage({
        destination: './files/img-manager',
        filename: filenameExt
    }),
    fileFilter: imageFileFilter
}

@Controller('manager')
export class ManagerController {

    constructor(private readonly managerService: ManagerService) {}

    @Get()
    @UseGuards(AuthJwtGuard)
    async getAllManagers(): Promise<Manager[]> {
        return await this.managerService.getAllManagers();
    }

    @Get('/getSelectManagers')
    @UseGuards(AuthJwtGuard)
    async getSelectManagers(): Promise<SelectModel[]> {
        return await this.managerService.getSelectManagers();
    }
    
    @Get('/findManagerByUser')
    @UseGuards(AuthJwtGuard)
    async findManagerByUser(@UserParam() { id }: User): Promise<Manager> {
        return await this.managerService.findManagerByUser(id);
    }

    @Get(':id')
    @UseGuards(AuthJwtGuard)
    async getManagerById(@Param('id', ParseIntPipe) id: number): Promise<Manager> {
        return await this.managerService.getManagerById(id);
    }

    @Post()
    @UseGuards(AuthJwtGuard)
    async registerManager(@Body() managerDTO: ManagerDTO, @UserParam() { id }: User): Promise<Manager> {
        return await this.managerService.registerManager(managerDTO, id);
    }

    @Patch('updateStatusManager/:id')
    @UseGuards(AuthJwtGuard)
    async updateStatusManager(@Param('id', ParseIntPipe) id: number, @Body() data: any): Promise<Manager> {
        return await this.managerService.updateStatusManager(id, data);
    }

    @Put('uploadImageManager/:id')
    @UseGuards(AuthJwtGuard)
    @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
    async uploadImageManager(@Param('id', ParseIntPipe) managerId: number, @UploadedFile() file: Express.Multer.File, @UserParam() { id }: User): Promise<Manager> {
        return await this.managerService.uploadImageManager(managerId, file, id);
    }

    @Put(':id')
    @UseGuards(AuthJwtGuard)
    async updateManager(@Param('id', ParseIntPipe) managerId: number, @Body() managerDTO: ManagerDTO, @UserParam() { id }: User): Promise<Manager> {
        return await this.managerService.updateManager(managerId, managerDTO, id);
    }

    @Delete(':id')
    @UseGuards(AuthJwtGuard)
    async deleteManager(@Param('id', ParseIntPipe) id: number): Promise<Manager> {
        return await this.managerService.deleteManager(id);
    }

}
