import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, getManager, Repository } from 'typeorm';
import { AssetDTO } from './DTOs/asset.dto';
import { Assets } from './entities/assets.entity';
import fs from 'fs';

@Injectable()
export class AssetService {

    constructor(
        @InjectRepository(Assets)
        private readonly assetRepository: Repository<Assets>
    ) {}

    async getAllAssets(): Promise<Assets[]> {
        var dataAssets = await this.assetRepository.find();
        return dataAssets;
    }

    async searchAssetsByCode(code: string): Promise<Assets> {
        var dataAssets = await this.assetRepository.findOne({
            where: {
                codeAsset: Equal(code),
                isActive: true
            }
        });

        return dataAssets;
    }

    
    async getAssetById(id: number): Promise<Assets> {
        var dataAssets = await this.assetRepository.findOne(id);
        
        if (!dataAssets) throw new NotFoundException('Assets not exists');
        
        return dataAssets;
    }
    
    async registerAssets(assetDTO: AssetDTO): Promise<Assets> {
        var dataAsset = this.assetRepository.create(assetDTO);
        
        try {
            dataAsset.isActive = true;
            await this.assetRepository.save(dataAsset);
            return dataAsset;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }
    
    async registerManyAssets(assetDTO: AssetDTO[]): Promise<void> {
        var listAssets: Assets[] = [];
        await getManager().transaction(async entityTransacionManager => {
            try {
                for (let index = 0; index < assetDTO.length; index++) {
                    var assets = new Assets();
                    assets.codeAsset = assetDTO[index].codeAsset;
                    assets.descriptionAsset = assetDTO[index].descriptionAsset;
                    assets.responsable = assetDTO[index].responsable;
                    assets.isActive = true;
                    
                    listAssets.push(assets);
                }
                await entityTransacionManager.save(listAssets);
            } catch (error) {
                throw new BadRequestException(error.detail);
            }
        });
    }

    async uploadImage(id: number, file: Express.Multer.File): Promise<Assets> {
        var dataAssets = await this.assetRepository.findOne(id);
        
        if (file) {
            if (dataAssets.imageAsset == null) {
                dataAssets.imageAsset = file.filename;
            } else {
                await fs.unlinkSync(`./files/img-assets/${ dataAssets.imageAsset }`);
                dataAssets.imageAsset = file.filename;
            }
        }

        try {
            await this.assetRepository.save(dataAssets);
            return dataAssets;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }
    
    async updateAssets(id: number, assetDTO: AssetDTO): Promise<Assets> {
        var dataAssets = await this.getAssetById(id);

        try {
            let dataEditAssets = Object.assign(dataAssets, assetDTO);
            await this.assetRepository.save(dataEditAssets);

            return dataEditAssets
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async changeStatusAssets(id: number, status: any): Promise<Assets> {
        var dataAssets = await this.getAssetById(id);

        try {
            if (dataAssets.isActive) {
                dataAssets.isActive = false;
            } else {
                dataAssets.isActive = true
            }
            await this.assetRepository.save(dataAssets);
            return dataAssets;
        } catch (error) {
            throw new BadRequestException(error.detail)            
        }
    }

    async deleteAssets(id: number): Promise<Assets> {
        var dataAssets = await this.getAssetById(id);

        try {
            await this.assetRepository.remove(dataAssets);
            return dataAssets;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }
}
