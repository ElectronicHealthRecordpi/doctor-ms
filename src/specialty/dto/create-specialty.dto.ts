import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";
export class CreateSpecialtyDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @Transform(({ value }) => value?.trim())
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    @Transform(({ value }) => value?.trim())
    description!: string;
}
