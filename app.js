var express = require('express');
var superagent = require('superagent');
var async = require('async');
var template = require('./rssXML.js');

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
    var num = req.query.num || 10;
    var desc = req.query.desc || false;
    //引入对应站点配置文件
    var site = require('./site/' + val);
    var rssXML = template.xml;
    var itemXML = template.item;
    //爬取主页
    superagent.get(site.homeUrl)
        //开启buffer，获取返回的js文件，非js文件不冲突
        .buffer(true)
        // .set('Host', 'chuansong.me')
        // .set('Upgrade-Insecure-Requests', '1')
        .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36')
        .end(function(err, homeRes) {
            err && console.log(err);
            //文章概要
            if (desc) {
                site.getItems(homeRes.text, num, itemXML)
                    .then((obj) => {
                        return site.getDesc(obj)
                    })
                    .then((items) => {
                        console.log('catch desc:' + site.rssTitle)
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
            } else {

                //不爬详细内容
                site.getItems(homeRes.text, num, itemXML)
                    .then((obj) => {
                        console.log('no catch desc:' + site.rssTitle)
                        var items = obj.items;
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
            }

        })
});

app.listen(process.env.PORT || 5000, () => {
    console.log('port 5000 listen now.')
});
