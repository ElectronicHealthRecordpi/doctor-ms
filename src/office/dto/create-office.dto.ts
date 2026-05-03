import { IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOfficeDto {
    @IsInt()
    @Min(1)
    number!: number;

    @IsInt()
    @Min(0)
    floor!: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(300)
    @Transform(({ value }) => value?.trim())
    indications!: string;
}
