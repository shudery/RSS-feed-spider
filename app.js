var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var rssXML = require('./rssXML.js').xml;
var itemXML = require('./rssXML.js').item;

var app = express();
//allow custom header and CORS
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
});

var homeUrl = 'http://www.jianshu.com';
imgTitle = '简书'
imgUrl = 'http://baijii-common.b0.upaiyun.com/icons/favicon.ico'
rssTitle = '简书'
desc = '读书的地方'
pubDate = '20161220'
rssXML = rssXML.replace(/{rssTitle}/,rssTitle)
		.replace(/{homeUrl}/gi,homeUrl)
		.replace(/{imgTitle}/,imgTitle)
		.replace(/{imgUrl}/,imgUrl)
		.replace(/{desc}/,desc)
		.replace(/{pubDate}/,pubDate)

app.get('/', function(req, res) {
	superagent.get(homeUrl)
		.end(function(err, homeRes) {
			if (err) {
				console.log(err)
			}
			var items = '';
			var $ = cheerio.load(homeRes.text);
			var lists = $('.have-img');
			lists.each(function(i, val) {
				var itemUrl = homeUrl + $(this).find('.title a').attr('href');
				var itemTitle = $(this).find('.title a').text();
				var itemDate = $(this).find('.list-top .time').attr('data-shared-at');
				var itemDesc = '???';
				var author = $(this).find('.list-top .author-name').text();
				var guid = $(this).find('.title a').attr('href');
				var item = itemXML;
				item = item.replace(/{itemUrl}/gi,itemUrl)
				    .replace(/{itemTitle}/gi,itemTitle)
				    .replace(/{itemDate}/gi,itemDate)
				    .replace(/{itemDesc}/gi,itemDesc)
				    .replace(/{author}/gi,author)
				    .replace(/{guid}/gi,guid)
				console.log(item);
				items += item;
			})

			var datas = rssXML.replace(/{items}/,items);
			res.send(datas);
		})
});




function get(url, callback) {
	

}

app.listen(process.env.PORT || 5000,()=>{
	console.log('port 5000 listen now.')
});