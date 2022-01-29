import { mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { SelectModel } from "src/helpers/select-model";
import { Manager } from "../entities/manager.entity";

@Injectable()
export class ManagerMapper extends AutomapperProfile {

    constructor(
        @InjectMapper()
        mapper: Mapper
    ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper.createMap(Manager, SelectModel)
                .forMember(dest => dest.id, mapFrom(src => src.id))
                .forMember(dest => dest.text, mapFrom(src => src.fullName));
        }
    }

}