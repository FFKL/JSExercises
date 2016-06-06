var request = require('request'),
    cheerio = require('cheerio');

request('https://habrahabr.ru', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('.post').each(function (i, element) {
            var title = $(this).find('.post__title_link');
            var body = $(this).find('.content');
            console.log(title.text());
            console.log(body.text().replace(/[\r\n]{2,}/gi, '\r\n'));
        })
    }
})