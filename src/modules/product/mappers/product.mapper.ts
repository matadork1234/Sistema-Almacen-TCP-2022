import { mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ProductDTO } from "../DTOs/product.dto";
import { SearchProductDTO } from "../DTOs/search-product.dto";
import { Product } from "../entities/product.entity";

@Injectable()
export class ProductMapper extends AutomapperProfile {

    constructor(
        @InjectMapper() mapper: Mapper
    ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper.createMap(Product, SearchProductDTO)
                .forMember(dest => dest.id, mapFrom(src => src.id))
                .forMember(dest => dest.codeProductSigma, mapFrom(src => src.codeProductSigma))
                .forMember(dest => dest.imageProduct, mapFrom(src => src.imageProduct))
                .forMember(dest => dest.descriptionCatalogue, mapFrom(src => src.descriptionCatalogue))
                .forMember(dest => dest.descriptionStock, mapFrom(src => src.descriptionStock))
                .forMember(dest => dest.nameCategory, mapFrom(src => src.category.name))
                .forMember(dest => dest.nameUnit, mapFrom(src => src.unitMeasure.name))
                .forMember(dest => dest.stock, mapFrom(src => src.stock))
                .forMember(dest => dest.isToner, mapFrom(src => src.isToner))
        }
    }

}