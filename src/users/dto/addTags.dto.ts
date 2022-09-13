import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class AddTagsDto {
  
  @ApiProperty({example: [1,2,3,4,5], description: "Массив id тегов", required: true})
  @IsArray({message: "укажите массив tag id"})
  readonly tags: number[];
}