import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class FindByParamsDto {
  @ApiPropertyOptional({example: 0, description: "сортировка по полю sortOrder, по умолчанию 0, не обязательное"})
  @IsNumberString({}, {message: "должно быть числом"})
  @IsOptional()
  readonly sortOrder?: number;

  @ApiPropertyOptional({example: 0, description: "сортировка по полю name, не обязательное"})
  @IsString({message: "должно быть строковым"})
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({example: 1, description: "параметр пагинции, page по умолчанию 1, не обязательное"})
  @IsNumberString({}, {message: "должно быть числом"})
  @IsOptional()
  readonly page?: number;

  @ApiPropertyOptional({example: 10, description: "параметр пагинции, limit по умолчанию 10, не обязательное"})
  @IsNumberString({}, {message: "должно быть числом"})
  @IsOptional()
  readonly limit?: number;
}