import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class FindByParamsDto {
  @IsNumberString({}, {message: "должно быть числом"})
  @IsOptional()
  readonly sortOrder?: number;

  @IsString({message: "должно быть строковым"})
  @IsOptional()
  readonly name?: string;

  @IsNumberString({}, {message: "должно быть числом"})
  @IsOptional()
  readonly page?: number;

  @IsNumberString({}, {message: "должно быть числом"})
  @IsOptional()
  readonly limit?: number;
}