var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');

//基本信息
var homeUrl = 'http://c.open.163.com/opensg/opensg.do?callback=jQuery191008052917586194552_1479621726582&uuid=b5959f10-8e48-11e6-99e5-07941142be9f&ursid=&count=6&_=1479621726586',
    imgTitle = 'TED',
    imgUrl = 'http://c.open.163.com/favicon.ico',
    rssTitle = 'TED',
    desc = 'TED',
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
        var items = '';
        var links = [];
        var obj = JSON.parse(resText.match(/1479621726582\((.*)\)/)[1]);
        obj.result.forEach(function(val, i) {
            var info = val.iteminfo;
            //文章数量限制
            if (i >= num) {
                //将拼接的xml和爬取的Link抛出
                resolve({
                    items,
                    links,
                })
            }
            var itemUrl = info.url;
            var itemTitle = info.title;
            var itemDate = '';
            var author = '';
            var desc = ""
            var guid = itemUrl.slice(-15);
            console.log({
                i,
                itemUrl,
                itemTitle,
                itemDate,
                desc,
                author,
            });
            //保存链接
            links.push(itemUrl);
            //拼xml
            var item = itemXML.replace(/{itemUrl}/, itemUrl)
                .replace(/{itemTitle}/, itemTitle)
                .replace(/{itemDate}/, itemDate)
                .replace(/{itemDesc}/, '{' + itemUrl + '}\n' + desc)
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
