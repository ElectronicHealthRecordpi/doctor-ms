import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateDoctorScheduleDto } from './dto/create-doctor_schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { BasePrismaService } from 'src/common/base-prisma.service';

@Injectable()
export class DoctorScheduleService extends BasePrismaService {
  protected readonly logger = new Logger(DoctorScheduleService.name);

  async create(createDoctorScheduleDto: CreateDoctorScheduleDto) {
    const { doctorId, officeId, dayOfWeek, startTime, endTime, isActive } = createDoctorScheduleDto;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start)
      throw new BadRequestException('La hora de fin debe ser posterior a la hora de inicio');

    await this.ensureExists(this.doctor, doctorId, 'Doctor');
    await this.ensureExists(this.office, officeId, 'Consultorio');

    const doctorConflict = await this.doctorSchedule.findFirst({
      where: { doctorId, dayOfWeek, isActive: true, isDeleted: false },
    });
    if (doctorConflict)
      throw new ConflictException(
        `El doctor ya tiene un horario activo para el día ${dayOfWeek}`,
      );

    const officeConflict = await this.doctorSchedule.findFirst({
      where: { officeId, dayOfWeek, isActive: true, isDeleted: false },
    });
    if (officeConflict)
      throw new ConflictException(
        `El consultorio ya está ocupado por otro doctor el día ${dayOfWeek}`,
      );

    return await this.doctorSchedule.create({
      data: {
        doctorId,
        officeId,
        dayOfWeek,
        startTime: start,
        endTime: end,
        isActive: isActive ?? true,
      },
      include: { doctor: true, office: true },
    });
  }

  async findAll() {
    return await this.hasRecords(this.doctorSchedule, 'horarios');
  }

  async findOne(id: string) {
    await this.ensureExists(this.doctorSchedule, id, 'Horario');
    return await this.doctorSchedule.findUnique({
      where: { id },
      include: { doctor: true, office: true },
    });
  }

  async update(id: string, updateDoctorScheduleDto: UpdateDoctorScheduleDto) {
    await this.ensureExists(this.doctorSchedule, id, 'Horario');
    const { doctorId, officeId, dayOfWeek, startTime, endTime, ...rest } = updateDoctorScheduleDto;

    const start = startTime ? new Date(startTime) : undefined;
    const end = endTime ? new Date(endTime) : undefined;

    if (start && end && end <= start)
      throw new BadRequestException('La hora de fin debe ser posterior a la hora de inicio');

    if (doctorId) await this.ensureExists(this.doctor, doctorId, 'Doctor');
    if (officeId) await this.ensureExists(this.office, officeId, 'Consultorio');

    if (doctorId || dayOfWeek) {
      const current = await this.doctorSchedule.findUnique({ where: { id } });
      const checkDoctorId = doctorId ?? current!.doctorId;
      const checkDay = dayOfWeek ?? current!.dayOfWeek;

      const doctorConflict = await this.doctorSchedule.findFirst({
        where: { doctorId: checkDoctorId, dayOfWeek: checkDay, isActive: true, isDeleted: false, id: { not: id } },
      });
      if (doctorConflict)
        throw new ConflictException(
          `El doctor ya tiene un horario activo para el día ${checkDay}`,
        );
    }

    if (officeId || dayOfWeek) {
      const current = await this.doctorSchedule.findUnique({ where: { id } });
      const checkOfficeId = officeId ?? current!.officeId;
      const checkDay = dayOfWeek ?? current!.dayOfWeek;

      const officeConflict = await this.doctorSchedule.findFirst({
        where: { officeId: checkOfficeId, dayOfWeek: checkDay, isActive: true, isDeleted: false, id: { not: id } },
      });
      if (officeConflict)
        throw new ConflictException(
          `El consultorio ya está ocupado por otro doctor el día ${checkDay}`,
        );
    }

    return await this.doctorSchedule.update({
      where: { id },
      data: {
        ...rest,
        ...(doctorId && { doctorId }),
        ...(officeId && { officeId }),
        ...(dayOfWeek && { dayOfWeek }),
        ...(start && { startTime: start }),
        ...(end && { endTime: end }),
      },
      include: { doctor: true, office: true },
    });
  }

  async remove(id: string) {
    return await this.softDelete(this.doctorSchedule, id, 'Horario', { isActive: false });
  }
}
