import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTagDto {
  @ApiPropertyOptional({example: "New Name", description: "Задать новое название тега, не обязательное"})
  @IsString({message: "Никнейм должен быть строкой"})
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({example: 0, description: "Задать новый sortOrder тегу, не обязательное"})
  @IsNumber({}, {message: "sortOrder должен быть number"})
  @IsOptional()
  readonly sortOrder?: number;
}