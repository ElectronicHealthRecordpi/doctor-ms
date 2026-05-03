import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { BasePrismaService } from 'src/common/base-prisma.service';

@Injectable()
export class SpecialtyService extends BasePrismaService {
  protected readonly logger = new Logger(SpecialtyService.name);

  async create(createSpecialtyDto: CreateSpecialtyDto) {
    const { name, description } = createSpecialtyDto;
    const specialtyExists = await this.valueExists(
      this.specialty, 'name', name, 'especialidad'
    );
    if (specialtyExists)
      throw new ConflictException(`Especialidad con nombre "${name}" ya existe`);
    return await this.specialty.create({
      data: {
        name,
        description
      }
    });

  }

  async findAll() {
    return await this.hasRecords(this.specialty, 'especialidades');
  }

  async findOne(id: string) {
    await this.ensureExists(this.specialty, id, 'Especialidad');
    return await this.specialty.findUnique({ where: { id } });
  }

  async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto) {
    await this.ensureExists(this.specialty, id, 'Especialidad');
    const { name } = updateSpecialtyDto;

    if (name) {
      const nameExists = await this.valueExists(this.specialty, 'name', name, 'especialidad', id);
      if (nameExists)
        throw new ConflictException(`Especialidad con nombre "${name}" ya existe`);
    }

    return await this.specialty.update({
      where: { id },
      data: updateSpecialtyDto,
    });
  }

  async remove(id: string) {
    return await this.softDelete(this.specialty, id, 'Especialidad');
  }
}
