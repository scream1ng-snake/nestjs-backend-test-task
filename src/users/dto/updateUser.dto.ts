import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length, Matches } from "class-validator";

export class UpdateUserDto {

  @ApiPropertyOptional({example: "example@gmil.com", description: "Почтовый адрес"})
  @IsEmail({}, {message: "Некоректный почтовый адрес"})
  @IsOptional()
  readonly email?: string;
  
  @ApiPropertyOptional({example: "Example12345", description: "Пароль"})
  @Length(8, 32, {message: "Пароль должен быть от 8 до 32 символов"})
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы.'})
  @IsOptional()
  readonly password?: string;

  @ApiPropertyOptional({example: "Example", description: "Никнейм"})
  @IsString({message: "Никнейм должен быть строкой"})
  @Length(4, 20, {message: "Никнейм пользоввателя должен быть от 4 до 20 символов"})
  @IsOptional()
  readonly nickname?: string;
}