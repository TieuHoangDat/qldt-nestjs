import { Module } from '@nestjs/common';
import { GroupRegistrationController } from './groupRegistration.controller';
import { GroupRegistrationService } from './groupRegistration.service';

@Module({
  controllers: [GroupRegistrationController],
  providers: [GroupRegistrationService]
})
export class GroupRegistrationModule {}
