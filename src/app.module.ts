import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { CourseController } from './course/course.controller';
import { NotificationModule } from './notification/notification.module';
import { GroupModule } from './group/group.module';
import { GroupRegistrationModule } from './groupRegistration/groupRegistration.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    CourseModule,
    NotificationModule,
    GroupModule,
    GroupRegistrationModule,
    PrismaModule
  ],
  // controllers: [CourseController],
})
export class AppModule {}
