import { mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { SelectModel } from "src/helpers/select-model";
import { ProductVendor } from "../entities/product-vendor.entity";

@Injectable()
export class ProductVendorMapper extends AutomapperProfile {

    constructor(
        @InjectMapper()
        mapper: Mapper
    ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper.createMap(ProductVendor, SelectModel)
                .forMember(dest => dest.id, mapFrom(src => src.id))
                .forMember(dest => dest.text, mapFrom(src => src.name));
        }
    }

}