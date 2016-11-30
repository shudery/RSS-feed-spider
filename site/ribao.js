var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');

//基本信息
var homeUrl = 'http://chuansong.me/account/rmrbwx',
    imgTitle = '人民日报',
    imgUrl = '',
    rssTitle = '人民日报',
    desc = '人民日报',
    pubDate = '';

/**
 * 爬取主页，获得文章基本信息
 * @param  {[type]} $       [主页内容]
 * @param  {[type]} num     [限制文章数量]
 * @param  {[type]} itemXML [文章xml模板]
 * @return {[type]}         [{links,items}]
 */
function getItems(resText, num, itemXML) {
    return new Promise((resolve, reject) => {
        //下载主页内容
        var $ = cheerio.load(resText);
        var items = '';
        var links = [];
        var lists = $('.feed_item_question');
        lists.each(function(i, val) {
            //文章数量限制
            if (i >= num) {
                //将拼接的xml和爬取的Link抛出
                resolve({
                    items,
                    links,
                })
            }
            var itemUrl = 'http://chuansong.me' + $(this).find('.question_link').attr('href');
            var itemTitle = $(this).find('.question_link').text();
            var itemDate = $(this).find('.timestamp').text();
            var author = '';
            var guid = itemUrl.slice(-15);
            console.log({
                i,
                itemUrl,
                itemTitle,
                itemDate,
                author,
            });
            //保存链接
            links.push(itemUrl);
            //拼xml
            var item = itemXML.replace(/{itemUrl}/, itemUrl)
                .replace(/{itemTitle}/, itemTitle)
                .replace(/{itemDate}/, itemDate)
                .replace(/{itemDesc}/, '{' + itemUrl + '}')
                .replace(/{author}/, author)
                .replace(/{guid}/, guid)
            items += item;
        });
        resolve({
            items,
            links,
        })
    })

}
/**
 * 爬取文章概要，主页没有的话，需要二次爬取
 * @param  {[type]} obj [{links,items}]
 * @return {[type]}     [items]
 */
function getDesc(obj) {
    return new Promise((resolve, reject) => {
        var links = obj.links;
        var items = obj.items;
        var arr = [];
        //爬取并发控制
        async.mapLimit(links, 5, function(url, callback) {
            console.log('desc:' + url)
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
            //result是一个数组，收集的所有callback的第二个参数值

            result.forEach((val) => {
                    var reg = new RegExp('{' + val.link + '}')
                    items = items.replace(reg, val.content)
                })
                //将items的desc补充完整 
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
    getDesc,
}
