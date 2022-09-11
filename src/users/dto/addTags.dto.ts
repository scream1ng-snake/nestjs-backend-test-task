import { IsArray } from "class-validator";

export class AddTagsDto {

  @IsArray({message: "укажите массив tag id"})
  readonly tags: number[];
}