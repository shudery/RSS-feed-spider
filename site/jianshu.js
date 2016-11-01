var homeUrl = 'http://www.jianshu.com',
imgTitle = '简书',
imgUrl = 'http://baijii-common.b0.upaiyun.com/icons/favicon.ico',
rssTitle = '简书',
desc = '读书的地方',
pubDate = '20161220';
function getItems($,itemXML) {
    var items = '';
    var lists = $('.have-img');
    lists.each(function(i, val) {
        var itemUrl = homeUrl + $(this).find('.title a').attr('href');
        var itemTitle = $(this).find('.title a').text();
        var itemDate = $(this).find('.list-top .time').attr('data-shared-at');
        var itemDesc = '???';
        var author = $(this).find('.list-top .author-name').text();
        var guid = $(this).find('.title a').attr('href');
        var item = itemXML;
        item = item.replace(/{itemUrl}/gi, itemUrl)
            .replace(/{itemTitle}/gi, itemTitle)
            .replace(/{itemDate}/gi, itemDate)
            .replace(/{itemDesc}/gi, itemDesc)
            .replace(/{author}/gi, author)
            .replace(/{guid}/gi, guid)
        items += item;
    });
    return items;
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
