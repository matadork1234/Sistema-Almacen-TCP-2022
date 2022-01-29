import { registerAs } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { join } from "path"

export const databaseOptions = (): TypeOrmModuleOptions => {
    return {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.POSTGRES_PORT, 10),
        entities: [join(__dirname, '../**/**/*.entity{.ts,.js}')],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        logger: 'file'
    }
}

export default registerAs('database', () => ({
    config: databaseOptions()
}));