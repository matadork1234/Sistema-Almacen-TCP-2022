import { mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { SelectModel } from "src/helpers/select-model";
import { CategoryProductDTO } from "../DTOs/category-product.dto";
import { CategoryProduct } from "../entities/category-item.entity";

@Injectable()
export class CategoryProductMapper extends AutomapperProfile {

    constructor(
        @InjectMapper()
        mapper: Mapper
    ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper.createMap(CategoryProduct, SelectModel)
                .forMember(dest => dest.id, mapFrom(src => src.id))
                .forMember(dest => dest.text, mapFrom(src => src.name));

            // mapper.createMap(CategoryProduct, CategoryProductDTO)
            //     .forMember(dest => dest.id, mapFrom(src => src.id))
            //     .forMember(dest => dest.code, mapFrom(src => src.code))
            //     .forMember(dest => dest.name, mapFrom(src => src.name))
            //     .forMember(dest => dest.description, mapFrom(src => src.description))
            //     .forMember(dest => dest.parentCategoryId, mapFrom(src => src.parentCategoryId))
            //     .forMember(dest => dest.nameParentCategory, mapFrom(src => src.parentCategory.name));
        }
    }

}