import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTagDto {
  @IsString({message: "Никнейм должен быть строкой"})
  @IsOptional()
  readonly name?: string;

  @IsNumber({}, {message: "sortOrder должен быть number"})
  @IsOptional()
  readonly sortOrder?: number;
}