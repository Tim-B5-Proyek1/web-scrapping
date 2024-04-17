import scrapy


class MangaSpider(scrapy.Spider):
    name = "manga-spider"
    start_urls = ["https://myanimelist.net/topmanga.php"]

    def parse(self, response, **kwargs):
        for mangas in response.css('tr.ranking-list'):
            yield {
                'rank': mangas.css('span.lightLink.top-anime-rank-text::text').get(),
                'title': mangas.css('a.hoverinfo_trigger.fs14.fw-b::text').get(),
                'image': mangas.css('img.lazyload::attr(data-src)').get()
            }

        next_page = response.css("a.link-blue-box.next::attr(href)").get()
        if next_page is not None:
            next_page_url = response.urljoin(next_page)
            yield response.follow(next_page_url, callback=self.parse)
