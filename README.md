## RSS-feed-spider

#### 功能介绍
可以自己制作各大网站，内容频道的文章RSS格式输出源，通过爬虫工具抓取内容，输出RSS阅读器能够识别的XML格式，部署在PASS平台可以供阅读器订阅。

#### 工作原理
利用site目录下写好的各站点基本信息，根据页面结构写好模板，利用爬虫爬取页面，抓取相关信息填入RSS-XML模板中，将模板返回到客户端，服务端使用Node.js和web应用快速搭建框架express，爬虫用superagent，pass平台使用heroku(国外不太稳定)

#### 查询参数
每个RSS订阅源的格式为：https://daguo-rss.herokuapp.com/?site={}
可以在订阅url后面添加查询参数，如?site=jianshu&num=20&desc=true

> site：站点名字
 num：抓取文章数量，默认10，没有翻页逻辑，最多主页全部文章
 desc：是否抓取描述，需要二次爬取，不稳定，默认不开

#### 完成站点
- [简书热门频道](https://daguo-rss.herokuapp.com/?site=jianshu)
- [果壳](https://daguo-rss.herokuapp.com/?site=guoke)
- [掘金前端](https://daguo-rss.herokuapp.com/?site=juejin)
- [TED](https://daguo-rss.herokuapp.com/?site=ted)
- [前端早读课](https://daguo-rss.herokuapp.com/?site=zaoduke)
- [Hacker News](https://daguo-rss.herokuapp.com/?site=hacker)
- ~~电子科技大学UESTC新闻~~
- ~~下厨房流行菜谱~~
- ~~卢松松好文分享~~
- ~~微信自媒体~~
- ~~开发者头条~~