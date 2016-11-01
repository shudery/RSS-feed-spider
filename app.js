var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var fs = require('fs');
var async = require('async');
var rssXML = require('./rssXML.js').xml;
var itemXML = require('./rssXML.js').item;


var app = express();
//allow custom header and CORS
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

//路由
app.get('/', function(req, res) {
    //解析查询字符串
    var val = req.query.site;
    //引入对应站点配置文件
    site = require('./site/' + val);

    //爬取主页
    superagent.get(site.homeUrl)
        .end(function(err, homeRes) {
            err && console.log(err);
            //下载主页内容
            var $ = cheerio.load(homeRes.text);
            //文章概要
            site.getItems($, itemXML)
                .then((items) => {
                    var datas = rssXML.replace(/{items}/, items)
                        .replace(/{rssTitle}/, site.rssTitle)
                        .replace(/{homeUrl}/gi, site.homeUrl)
                        .replace(/{imgTitle}/, site.imgTitle)
                        .replace(/{imgUrl}/, site.imgUrl)
                        .replace(/{desc}/, site.desc)
                        .replace(/{pubDate}/, site.pubDate);
                    //返回内容
                    res.send(datas);
                })

        })
});

app.listen(process.env.PORT || 5000, () => {
    console.log('port 5000 listen now.')
});
