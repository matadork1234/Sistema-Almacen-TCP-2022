import { ConfigService } from '@nestjs/config';
import { Logger, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/constant';
import { SeederApp } from './config/seeder-app';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';

const crPath = '/etc/apache2/sites-available/1.crt';
const pkPath = '/etc/apache2/sites-available/1.key';
const cfPath = '/etc/apache2/sites-available/1.ca';
const options: NestApplicationOptions = {}

if (fs.existsSync(crPath) && fs.existsSync(pkPath) && fs.existsSync(cfPath)){
  options.httpsOptions = {
    cert: fs.readFileSync(crPath),
    key: fs.readFileSync(pkPath),
    ca: fs.readFileSync(pkPath)
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const config = app.get(ConfigService);

  const PORT_SERVER = config.get(PORT);
  
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.setGlobalPrefix('api');

  await SeederApp(config);

  await app.listen(PORT_SERVER);
  logger.log(`Server is running in ${ await app.getUrl() }`)
}
bootstrap();
