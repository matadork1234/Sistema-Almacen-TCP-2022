import { mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { SelectModel } from "src/helpers/select-model";
import { OrderStatusCode } from "../entities/order-status-code.entity";

@Injectable()
export class OrderStatusCodeMapper extends AutomapperProfile {

    constructor(
        @InjectMapper() mapper: Mapper
    ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper.createMap(OrderStatusCode, SelectModel)
                .forMember(m => m.id, mapFrom(src => src.id))
                .forMember(m => m.text, mapFrom(src => src.description));
        }
    }

}