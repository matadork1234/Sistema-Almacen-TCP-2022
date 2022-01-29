import { mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { CategoryCustomerDTO } from "../DTOs/category-customer.dto";
import { CategoryCustomer } from "../entities/category-customer.entity";

export class CategoryCustomerMapper extends AutomapperProfile {

    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    
    mapProfile(): MappingProfile {
        return;
        // return (mapper) => {
        //     mapper.createMap(CategoryCustomer, CategoryCustomerDTO)
        //         .forMember(dest => dest.customerId, mapFrom(src => src.customerId))
        //         .forMember(dest => dest.categories, mapFrom)
        // }
    }

}