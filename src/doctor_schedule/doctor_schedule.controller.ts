import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorScheduleService } from './doctor_schedule.service';
import { CreateDoctorScheduleDto } from './dto/create-doctor_schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';

@Controller('doctor-schedule')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) { }

  @Post()
  create(@Body() createDoctorScheduleDto: CreateDoctorScheduleDto) {
    return this.doctorScheduleService.create(createDoctorScheduleDto);
  }

  @Get()
  findAll() {
    return this.doctorScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorScheduleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto) {
    return this.doctorScheduleService.update(id, updateDoctorScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorScheduleService.remove(id);
  }
}
