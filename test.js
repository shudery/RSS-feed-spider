var superagent = require('superagent');

superagent.get('www.jianshu.com')
    .end((err, res) => {
        console.log(res.text)
    })
