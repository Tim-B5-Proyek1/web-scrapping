import scrapy
from ..items import MangaItem


class MangaSpider(scrapy.Spider):
    name = "manga-spider"
    start_urls = ["https://myanimelist.net/topmanga.php"]

    def parse(self, response, **kwargs):
        for manga in response.css('tr.ranking-list'):
            detail_page_url = manga.css('a.hoverinfo_trigger.fs14.fw-b::attr(href)').get()
            yield response.follow(detail_page_url, callback=self.parse_manga)

        next_page = response.css("a.link-blue-box.next::attr(href)").get()
        if next_page is not None:
            next_page_url = "https://myanimelist.net/topmanga.php" + next_page
            yield response.follow(next_page_url, callback=self.parse)

    def parse_manga(self, response):
        manga_item = MangaItem()
        manga_item['rank'] = response.css('.ranked strong::text').get()
        manga_item['popularity'] = response.css('.popularity strong::text').get()
        manga_item['title'] = response.css('.h1-title span::text').get()
        manga_item['image'] = response.css('img.lazyload::attr(data-src)').get()
        manga_item['score'] = response.css('div.score-label::text').get()
        manga_item['sinopsis'] = response.css('h2+ span::text').get()
        manga_item['tipe'] = response.css('h2+ .spaceit_pad a::text').get()
        manga_item['genre'] = [genre.strip() for genre in response.css('.spaceit_pad:nth-child(20) a::text').extract()]
        manga_item['theme'] = [theme.strip() for theme in response.css('.spaceit_pad:nth-child(21) a::text').extract()]
        serialization_element = response.css('.spaceit_pad:nth-child(23) a::text').get()
        manga_item['serialization'] = serialization_element.strip() if serialization_element else None
        manga_item['author'] = [author.strip() for author in
                                response.css('.spaceit_pad:nth-child(24) a::text').extract()]

        yield manga_item
