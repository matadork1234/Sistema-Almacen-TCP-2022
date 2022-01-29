import { OrderQrDTO } from "../DTOs/order-qr.dto"

export const generateQr = (orderQrDTO: OrderQrDTO): string => {
    return `NOMBRE COMPLETO: ${ orderQrDTO.firstName } ${orderQrDTO.lastName} | 
        NUMERO DE CARNET: ${ orderQrDTO.numberDocumentIdentity } | 
        NUMERO DE ORDEN: ${ orderQrDTO.numberOrder } |
        FECHA DE ORDEN: ${ orderQrDTO.registerAt } |`;
}