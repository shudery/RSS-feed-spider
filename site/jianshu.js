var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var homeUrl = 'http://www.jianshu.com',
    imgTitle = '简书',
    imgUrl = 'http://baijii-common.b0.upaiyun.com/icons/favicon.ico',
    rssTitle = '简书',
    desc = '读书的地方',
    pubDate = '20161220';

function getItems($, num, itemXML) {
    return new Promise((resolve, reject) => {
        var items = '';
        var links = [];
        var lists = $('.have-img');
        lists.each(function(i, val) {
            if (i >= num) {
                return
            }
            var itemUrl = homeUrl + $(this).find('.title a').attr('href');
            var itemTitle = $(this).find('.title a').text();
            var itemDate = $(this).find('.list-top .time').attr('data-shared-at');
            var author = $(this).find('.list-top .author-name').text();
            var guid = $(this).find('.title a').attr('href');
            var item = itemXML;
            links.push(itemUrl);
            item = item.replace(/{itemUrl}/gi, itemUrl)
                .replace(/{itemTitle}/gi, itemTitle)
                .replace(/{itemDate}/gi, itemDate)
                .replace(/{itemDesc}/gi, '{' + itemUrl + '}')
                .replace(/{author}/gi, author)
                .replace(/{guid}/gi, guid)
            items += item;
        });
        var arr = [];
        async.mapLimit(links, 5, function(url, callback) {
            console.log(url)
            superagent.get(url)
                .end(function(err, homeRes) {
                    err && console.log(err);
                    //下载文章内容
                    var $ = cheerio.load(homeRes.text);
                    //文章概要
                    var content = $('.show-content').html();
                    callback(null, {
                        link: url,
                        content: content,
                    })
                })

        }, function(err, result) {
            result.forEach((val) => {
                var reg = new RegExp('{' + val.link + '}')
                items = items.replace(reg, val.content)
            })
            resolve(items);
        })
    })

}
module.exports = {
    homeUrl,
    imgUrl,
    imgTitle,
    rssTitle,
    desc,
    pubDate,
    getItems,
}
