import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toNewsArticleDto } from '../common/mappers/entity.mappers';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const articles = await this.prisma.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return articles.map(toNewsArticleDto);
  }

  async findOne(slug: string) {
    const article = await this.prisma.newsArticle.findUnique({
      where: { slug },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return toNewsArticleDto(article);
  }
}
