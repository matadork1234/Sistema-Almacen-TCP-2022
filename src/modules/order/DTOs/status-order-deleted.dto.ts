import { TStatusDeleted } from "../enums/status-deleted.enum";

export class StatusOrderDeletedDTO {
    observationOrder: string;
    statusDeleted: TStatusDeleted;
}