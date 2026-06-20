import { Controller, Get, Param } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.newsService.findOne(slug);
  }
}
