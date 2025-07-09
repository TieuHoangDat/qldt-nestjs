import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS
  app.enableCors({
    origin: '*', // Cho phép tất cả các origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // middleware
  app.useGlobalPipes(new ValidationPipe())

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Quản lý Đào tạo') // Đặt tên phù hợp với dự án của bạn
    .setDescription('Tài liệu API cho hệ thống quản lý đào tạo')
    .setVersion('1.0')
    .addBearerAuth() // Thêm dòng này để hỗ trợ JWT Bearer Token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
