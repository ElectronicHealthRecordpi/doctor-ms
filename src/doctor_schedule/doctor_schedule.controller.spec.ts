import { Test, TestingModule } from '@nestjs/testing';
import { DoctorScheduleController } from './doctor_schedule.controller';
import { DoctorScheduleService } from './doctor_schedule.service';

describe('DoctorScheduleController', () => {
  let controller: DoctorScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorScheduleController],
      providers: [DoctorScheduleService],
    }).compile();

    controller = module.get<DoctorScheduleController>(DoctorScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
