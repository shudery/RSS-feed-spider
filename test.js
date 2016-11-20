var superagent = require('superagent');

// superagent.get('www.jianshu.com')
//     .end((err, res) => {
//         console.log(res.text)
//     })
var request = require('request');

var http = require('http');
var url = 'http://c.open.163.com/opensg/opensg.do?callback=jQuery191008052917586194552_1479621726582&uuid=b5959f10-8e48-11e6-99e5-07941142be9f&ursid=&count=6&_=1479621726586';

http.get(url,res=>{
    var html= '';
    res.on('data',function(data){
        html += data;
        //绑定监听数据流，并将数据保存到html
    })

    res.on('end',function(){
    	var obj = html.match(/1479621726582\((.*)\)/)[1];
        (JSON.parse(obj)).result.forEach((val,i)=>{
        	var info = val.iteminfo;
            var itemUrl = info.url;
            var itemTitle = info.title;
            var itemDate = '';
            var author = '';
            var desc = "<img src='" + info.imgurl + "'>"
            var guid = itemUrl.slice(-15);
            console.log({
                i,
                itemUrl,
                itemTitle,
                itemDate,
                desc,
                author,
            });
        })
    })
}).on('error',function(){
    console.log('there are some error')
})