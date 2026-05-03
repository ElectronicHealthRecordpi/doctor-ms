import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { BasePrismaService } from 'src/common/base-prisma.service';

@Injectable()
export class DoctorService extends BasePrismaService {
  protected readonly logger = new Logger(DoctorService.name);

  async create(createDoctorDto: CreateDoctorDto) {
    const { name, lastName, dateOfBirth, licenseNumber, phone } = createDoctorDto;

    const licenseExists = await this.valueExists(
      this.doctor,
      'licenseNumber',
      licenseNumber,
      'doctor',
    );
    if (licenseExists)
      throw new ConflictException(`Doctor con número de licencia "${licenseNumber}" ya existe`);

    return await this.doctor.create({
      data: {
        name,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        licenseNumber,
        phone,
      },
    });
  }

  async findAll() {
    return await this.hasRecords(this.doctor, 'doctores');
  }

  async findOne(id: string) {
    await this.ensureExists(this.doctor, id, 'Doctor');
    return await this.doctor.findUnique({ where: { id } });
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    // await this.ensureExists(this.doctor, id, 'Doctor');
    const user = await this.findOne(id);
    const { licenseNumber, dateOfBirth, ...rest } = updateDoctorDto;
    if (licenseNumber) {
      const licenseExists = await this.valueExists(
        this.doctor,
        'licenseNumber',
        licenseNumber,
        'doctor',
        id,
      );
      if (licenseExists)
        throw new ConflictException(`Doctor con número de licencia "${licenseNumber}" ya existe`);
    }
    try {
      return await this.doctor.update({
        where: { id },
        data: {
          ...rest,
          ...(licenseNumber && { licenseNumber }),
          ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        },
      });
    } catch (err: any) {
      this.logger.error(`Error al actualizar doctor con ID ${id}: ${err.message}`);
      throw new InternalServerErrorException(err.message);

    }

  }

  async remove(id: string) {
    return await this.softDelete(this.doctor, id, 'Doctor');
  }
}
