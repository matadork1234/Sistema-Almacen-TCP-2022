import { mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { OrderDetailDTO } from "../DTOs/order-detail.dto";
import { Order } from "../entities/order.entity";

export class OrderMapper extends AutomapperProfile {

    constructor(
        @InjectMapper() mapper: Mapper
    ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper.createMap(Order, OrderDetailDTO)
                .forMember(dest => dest.id, mapFrom(src => src.id))
                .forMember(dest => dest.customerId, mapFrom(src => src.customerId))
                .forMember(dest => dest.firstNameCustomer, mapFrom(src => src.customer.firstName))
                .forMember(dest => dest.lastNameCustomer, mapFrom(src => src.customer.lastName))
                .forMember(dest => dest.jobPosition, mapFrom(src => src.customer.jobPosition))
                .forMember(dest => dest.imageCustomer, mapFrom(src => src.customer.imageCustomer))
                .forMember(dest => dest.codeQr,  mapFrom(src => src.codeQr))
                .forMember(dest => dest.createdAt, mapFrom(src => src.createdAt))
                .forMember(dest => dest.updatedAt, mapFrom(src => src.updatedAt))
                .forMember(dest => dest.customerComments, mapFrom(src => src.customerComments))
                .forMember(dest => dest.numberOrder, mapFrom(src => src.numberOrder))
                .forMember(dest => dest.numberOrderFormat, mapFrom(src => src.numberOrderFormat));
                //.forMember(dest => dest.statusOrder, mapFrom(src => src.orderStatus.filter(orde => order.isActive == true) 
        }
    }

}