# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class MangaItem(scrapy.Item):
    rank = scrapy.Field()
    popularity = scrapy.Field()
    title = scrapy.Field()
    image = scrapy.Field()
    score = scrapy.Field()
    sinopsis = scrapy.Field()
    tipe = scrapy.Field()
    genre = scrapy.Field()
    theme = scrapy.Field()
    serialization = scrapy.Field()
    author = scrapy.Field()
    pass
