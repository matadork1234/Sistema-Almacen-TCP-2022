import { SelectModel } from "src/helpers/select-model";
import { Customer } from "src/modules/customer/entities/customer.entity";

export class CategoryCustomerDTO {
    id: number;
    customerId: number;
    categories: SelectModel[];
    customer: Customer;
}