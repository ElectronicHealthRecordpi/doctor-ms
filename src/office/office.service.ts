import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { BasePrismaService } from 'src/common/base-prisma.service';

@Injectable()
export class OfficeService extends BasePrismaService {
  protected readonly logger = new Logger(OfficeService.name);

  async create(createOfficeDto: CreateOfficeDto) {
    const { number, floor, indications } = createOfficeDto;
    const officeExists = await this.valueExists(this.office, 'number', number, 'consultorio');
    if (officeExists)
      throw new ConflictException(`Consultorio con número "${number}" ya existe`);
    return await this.office.create({ data: { number, floor, indications } });
  }

  async findAll() {
    return await this.hasRecords(this.office, 'consultorios');
  }

  async findOne(id: string) {
    await this.ensureExists(this.office, id, 'Consultorio');
    return await this.office.findUnique({ where: { id } });
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto) {
    await this.ensureExists(this.office, id, 'Consultorio');
    const { number } = updateOfficeDto;

    if (number !== undefined) {
      const numExists = await this.valueExists(this.office, 'number', number, 'consultorio', id);
      if (numExists)
        throw new ConflictException(`Consultorio con número "${number}" ya existe`);
    }

    return await this.office.update({ where: { id }, data: updateOfficeDto });
  }

  async remove(id: string) {
    return await this.softDelete(this.office, id, 'Consultorio');
  }
}
