import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
  @IsString({message: "Никнейм должен быть строкой"})
  readonly name: string;

  @IsNumber({}, {message: "sortOrder должен быть number"})
  @IsOptional()
  readonly sortOrder: number;
}