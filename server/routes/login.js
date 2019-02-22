var express = require('express');
var router = express.Router();

// 引入jwt 登录页面用
const jwt = require('jsonwebtoken');
// 定义秘钥  登录页面用
const secretKey = 'liuxiao';

//引入连接数据库模块,引入自定义模块的方法
var connection = require('./connect');

router.get('/', function (req, res, next) {
    res.render('index', { title: '这是登录页面路由' });
});

// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
    // 设置响应头 解决跨域(目前最主流的方式)
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

//登录页面的路由
router.post('/checklogin', function (req, res) {
    //res.send("1");
    //接收前端发送的参数
    let { username, password } = req.body;
    //构造sql
    const sqlstr = `select * from account where username='${username}' and password='${password}'`
    console.log(sqlstr);
    connection.query(sqlstr, (err, data) => {
        if (err) throw err;

        //判断用户名和账号在数据库中能否找到
        if (!data.length) {
            res.send({ 'error_code': 1, 'reason': '请检查用户名或密码哦!' });

        } else {//如果有数据，那么就验证一致性
            //深拷贝
            let obj = data[0];
            //转字符串
            let objstr = JSON.stringify(obj);
            //转为新对象
            let newobj = JSON.parse(objstr);
            // console.log(newobj);
            // 生成token
            const token = jwt.sign(newobj, secretKey, { expiresIn: 60 * 60*240 })
            res.send({
                'error_code': 0,
                'reason': '登陆成功啦!',
                token,
                username: newobj.username

            })
        }



    })

})

module.exports = router;
