import { Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { HistoryProductDTO } from "../DTOs/history-product.dto";
import { OrderItem } from "../entities/order-item.entity";

export class OrderItemMapper extends AutomapperProfile {

    constructor(
        @InjectMapper() mapper: Mapper
    ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
           
        }
    }

}