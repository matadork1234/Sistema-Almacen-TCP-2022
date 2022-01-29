import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { filenameExt } from 'src/helpers/filename';
import { AuthJwtGuard } from '../auth/guards/auth-jwt.guard';
import { AssetService } from './asset.service';
import { AssetDTO } from './DTOs/asset.dto';
import { imageFileFilter } from '../../helpers/image-file-filter'
import { Assets } from './entities/assets.entity';
import { FileInterceptor } from '@nestjs/platform-express';

const MULTER_OPTIONS: MulterOptions = {
    storage: diskStorage({
        destination: './files/img-assets',
        filename: filenameExt
    }),
    fileFilter: imageFileFilter
}

@Controller('asset')
export class AssetController {

    constructor(private readonly assetService: AssetService) {}

    @Get()
    @UseGuards(AuthJwtGuard)
    async getAllAssets(): Promise<Assets[]> {
        return await this.assetService.getAllAssets();
    }

    @Get('searchAssetByCode/:code')
    async searchAssetByCode(@Param('code') code: string): Promise<Assets> {
        return await this.assetService.searchAssetsByCode(code);
    }

    @Get(':id')
    @UseGuards(AuthJwtGuard)
    async getAssetById(@Param('id', ParseIntPipe) id: number): Promise<Assets> {
        return await this.assetService.getAssetById(id);
    }
    
    @Post('registerManyAssets')
    @UseGuards(AuthJwtGuard)
    async registerManyAssets(@Body() assetDTO: AssetDTO[]): Promise<void> {
        return await this.assetService.registerManyAssets(assetDTO);
    }

    @Post()
    @UseGuards(AuthJwtGuard)
    async registerAssets(@Body() assetDTO: AssetDTO): Promise<Assets> {
        return await this.assetService.registerAssets(assetDTO);
    }

    @Patch(':id')
    @UseGuards(AuthJwtGuard)
    async updateStatusAssets(@Param('id', ParseIntPipe) id: number, @Body() data: any): Promise<Assets> {
        return await this.assetService.updateAssets(id, data);
    }

    @Put('uploadImageAssets/:id')
    @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
    @UseGuards(AuthJwtGuard)
    async uploadImageAssets(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File): Promise<Assets> {
        return await this.assetService.uploadImage(id, file);
    }

    @Put(':id')
    @UseGuards(AuthJwtGuard)
    async updateAssets(@Param('id', ParseIntPipe) id: number, @Body() assetDTO: AssetDTO ): Promise<Assets> {
        return await this.assetService.updateAssets(id, assetDTO);
    }

    @Delete(':id')
    async deleteAssets(@Param('id', ParseIntPipe) id: number): Promise<Assets> {
        return await this.assetService.deleteAssets(id);
    }

}
