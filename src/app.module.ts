import { Module } from '@nestjs/common';
import { DoctorModule } from './doctor/doctor.module';
import { SpecialtyModule } from './specialty/specialty.module';
import { OfficeModule } from './office/office.module';
import { DoctorScheduleModule } from './doctor_schedule/doctor_schedule.module';

@Module({
  imports: [DoctorModule, SpecialtyModule, OfficeModule, DoctorScheduleModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
