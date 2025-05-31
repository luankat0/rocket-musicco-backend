import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		}),
	);

	// Configuração do Swagger
	const config = new DocumentBuilder()
		.setTitle('RocketLab Shopping API')
		.setDescription('API para sistema de compras online')
		.setVersion('1.0')
		.addTag('products', 'Operações relacionadas a produtos')
		.addTag('users', 'Operações relacionadas a usuários')
		.addTag('cart', 'Operações relacionadas ao carrinho de compras')
		.addTag('orders', 'Operações relacionadas a pedidos')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
	console.log('Application is running on: http://localhost:3000');
	console.log('API Documentation available at: http://localhost:3000/api');
}

void bootstrap();