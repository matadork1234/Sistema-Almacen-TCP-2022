import { mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { OrderDetailDTO } from "src/modules/order/DTOs/order-detail.dto";
import { OrderStatus } from "../entities/order-status.entity";

@Injectable()
export class OrderStatusMapper extends AutomapperProfile {

    constructor( @InjectMapper() mapper: Mapper ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper.createMap(OrderStatus, OrderDetailDTO)
            .forMember(dest => dest.id, mapFrom(src => src.id))
            .forMember(dest => dest.customerId, mapFrom(src => src.order.customerId))
            .forMember(dest => dest.firstNameCustomer, mapFrom(src => src.order.customer.firstName))
            .forMember(dest => dest.lastNameCustomer, mapFrom(src => src.order.customer.lastName))
            .forMember(dest => dest.jobPosition, mapFrom(src => src.order.customer.jobPosition))
            .forMember(dest => dest.imageCustomer, mapFrom(src => src.order.customer.imageCustomer))
            .forMember(dest => dest.codeQr,  mapFrom(src => src.order.codeQr))
            .forMember(dest => dest.createdAt, mapFrom(src => src.order.createdAt))
            .forMember(dest => dest.updatedAt, mapFrom(src => src.order.updatedAt))
            .forMember(dest => dest.customerComments, mapFrom(src => src.order.customerComments))
            .forMember(dest => dest.numberOrder, mapFrom(src => src.order.numberOrder))
            .forMember(dest => dest.numberOrderFormat, mapFrom(src => src.order.numberOrderFormat));
        }
    }

}