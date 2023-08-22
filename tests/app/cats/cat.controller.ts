import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCatDto } from './create-cat.dto';

@Controller('cats')
export class CatController {
  @Post()
  async createCat(@Body() createCatDto: CreateCatDto) {
    return createCatDto;
  }
}
