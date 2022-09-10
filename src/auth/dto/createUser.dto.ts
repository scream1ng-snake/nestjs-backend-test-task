import { IsEmail, IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, {message: "Некоректный почтовый адрес"})
  readonly email: string;

  @Length(8, 32, {message: "Пароль должен быть от 8 до 32 символов"})
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы.'})
  readonly password: string;

  @IsString({message: "Никнейм должен быть строкой"})
  @Length(4, 20, {message: "Никнейм пользоввателя должен быть от 4 до 20 символов"})
  readonly nickname: string;
}