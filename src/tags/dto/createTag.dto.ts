import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
  @ApiProperty({example: "Example", description: "Название тега", required: true})
  @IsString({message: "Никнейм должен быть строкой"})
  readonly name: string;

  @ApiPropertyOptional({example: 0, description: "sortOrder по умолчанию 0, не обязательное"})
  @IsNumber({}, {message: "sortOrder должен быть number"})
  @IsOptional()
  readonly sortOrder: number;
}