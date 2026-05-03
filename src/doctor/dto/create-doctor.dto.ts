import { IsDateString, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    @Transform(({ value }) => value?.trim())
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    @Transform(({ value }) => value?.trim())
    lastName!: string;

    @IsDateString()
    dateOfBirth!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(30)
    @Transform(({ value }) => value?.trim())
    licenseNumber!: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(\+591)?[67]\d{7}$/, {
        message: 'Teléfono inválido (ej: 71234567 o +59171234567)'
    })
    phone!: string;
}
