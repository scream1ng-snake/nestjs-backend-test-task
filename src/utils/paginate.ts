import { HttpException, HttpStatus } from "@nestjs/common"

export function Paginate(page: number = 1, length: number = 10) {
  if (page <= 0 || length <= 0) {
    throw new HttpException("Неверные параметры пагинации", HttpStatus.BAD_REQUEST)
  }
  return {
    length,
    offset: page * length - length
  }
}