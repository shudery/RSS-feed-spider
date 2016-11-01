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
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.get('/', function(req, res) {
	var val = req.query.site;
    var site = require('./site/' + val);
    rssXML = rssXML.replace(/{rssTitle}/, site.rssTitle)
        .replace(/{homeUrl}/gi, site.homeUrl)
        .replace(/{imgTitle}/, site.imgTitle)
        .replace(/{imgUrl}/, site.imgUrl)
        .replace(/{desc}/, site.desc)
        .replace(/{pubDate}/, site.pubDate)

    superagent.get(site.homeUrl)
        .end(function(err, homeRes) {
            if (err) {
                console.log(err)
            }
            var $ = cheerio.load(homeRes.text);
            var items = site.getItems($, itemXML);
            var datas = rssXML.replace(/{items}/, items);
            res.send(datas);
        })
});



app.listen(process.env.PORT || 5000, () => {
    console.log('port 5000 listen now.')
});
