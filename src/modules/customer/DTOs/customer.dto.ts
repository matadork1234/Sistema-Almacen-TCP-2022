export class CustomerDTO {
    firstName: string;
    lastName: string;
    documentIdentity: string;
    expeditionDocument: string;
    emailAddress: string;
    phoneNumber?: string;
    imageCustomer?: string;
    codeBiometric: number;
    jobPosition: string;
    isActive: boolean;
    userId: number;
}