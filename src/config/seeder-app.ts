import { ConfigService } from "@nestjs/config";
import { AppRoles } from "src/app-roles";
import { CategoryProduct } from "src/modules/category-product/entities/category-item.entity";
import { OrderStatusCode } from "src/modules/order-status-code/entities/order-status-code.entity";
import { UnitMeasure } from "src/modules/unit-measure/entities/unit-measure.entity";
import { User } from "src/modules/user/entities/user.entity";
import { getRepository } from "typeorm";
import { EMAIL, PASSWORD, USERNAME_DEFAULT } from "./constant";

export const SeederApp = async (config: ConfigService): Promise<void> => {
    var username = config.get<string>(USERNAME_DEFAULT);
    var password = config.get<string>(PASSWORD);
    var email = config.get<string>(EMAIL);
    var userRepository = getRepository<User>(User);
    var categoryRepository = getRepository<CategoryProduct>(CategoryProduct);
    var unitMeasureRepository = getRepository<UnitMeasure>(UnitMeasure);
    var statusOrderRepository = getRepository<OrderStatusCode>(OrderStatusCode);


    var userExists = await userRepository.findOne({
        username: username
    });

    if (!userExists) {
        var user = new User();
        user.username = username;
        user.password = password;
        user.email = email;
        user.role = AppRoles.ADMIN;
        user.isActive = true;

        await userRepository.save(user);
    }

    var categories: any[] = [{name: 'General', codeCategory: 1}, { name:'Limpieza-Cafeteria', codeCategory: 2 }, { name: 'Eléctrico', codeCategory: 3 }, { name: 'Biblioteca', codeCategory: 4 }, { name: 'Repuesto Vehículos', codeCategory: 5}, { name: 'Magistrador-Jefatura', codeCategory: 6}, { name: 'RRHH', codeCategory: 7}];

    categories.forEach(async value => {
        var i: number = 1
        var dataCategory = categoryRepository.find({
            where: {
                name: value.name
            }
        });

        if ((await dataCategory).length === 0) {
            var category = new CategoryProduct();
            category.codeCategory = value.codeCategory
            category.description = '';
            category.name = value.name;

            await categoryRepository.save(category);
        }
        i++;
    });

    var unitMeasures: any[] = [ { name: 'CADA UNO-1', codeUnit: 1, nameSigma: 'PZA' }, { name: 'CADA UNO-2', codeUnit: 2, nameSigma: 'CAJA' }, { name: 'CADA UNO-3', codeUnit: 3, nameSigma: 'PAR' }, { name: 'METROS', codeUnit: 4, nameSigma: 'METROS' }, { name: 'CADA UNO-4', codeUnit: 5, nameSigma: 'PAQUETE' }];

    unitMeasures.forEach(async value => {
        var dataUnit = unitMeasureRepository.find({
            where: {
                name: value.name
            }
        });

        if((await dataUnit).length === 0) {
            var unitMeasure = new UnitMeasure();
            unitMeasure.name = value.name;
            unitMeasure.nameSigma = value.nameSigma;
            unitMeasure.codeUnit = value.codeUnit;
            unitMeasure.description = '';
            unitMeasure.isActive = true;

            await unitMeasureRepository.save(unitMeasure);
        }
    });

    var statusOrders = ['Registrado', 'Autorizado', 'Entregado', 'Anulado'];
    
    statusOrders.forEach(async (value, index) => {
        var dataOrder = statusOrderRepository.find({
            where: {
                description: value
            }
        });

        if ((await dataOrder).length === 0) {
            var statusOrderCode = new OrderStatusCode();

            statusOrderCode.description = value;
            statusOrderCode.isActive = true;
            statusOrderCode.statusCode = (index + 1).toString()
            
            await statusOrderRepository.save(statusOrderCode);
        }
    })
    

}