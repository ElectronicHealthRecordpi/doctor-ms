import { daysOfWeek } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDoctorScheduleDto {
    @IsUUID()
    @IsNotEmpty()
    doctorId!: string;

    @IsUUID()
    @IsNotEmpty()
    officeId!: string;

    @IsEnum(daysOfWeek)
    dayOfWeek!: daysOfWeek;

    @IsDateString()
    startTime!: string;

    @IsDateString()
    endTime!: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
