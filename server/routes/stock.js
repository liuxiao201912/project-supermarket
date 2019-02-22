var express = require('express');
var router = express.Router();

// 引入jwt 登录页面用
const jwt = require('jsonwebtoken');
// 定义秘钥  登录页面用
const secretKey = 'liuxiao';

//引入连接数据库模块,引入自定义模块的方法
var connection = require('./connect');

router.get('/', function (req, res, next) {
    res.render('index', { title: '这是库存管理路由' });
});

// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
    // 设置响应头 解决跨域(目前最主流的方式)
    res.header('Access-Control-Allow-Origin', '*');
    next();
})
// ============================================================添加商品
//添加库存
router.post('/stockadd', (req, res) => {

    let { barCode, proName, price, warehousing, inventory, sales } = req.body;
    //构造sql

    const sqlstr = `insert into stock(barCode,proName,price,warehousing,inventory,sales)
values(?,?,?,?,?,?)`
    // console.log(sqlstr)
    //参数
    let parstr = [barCode, proName, price, warehousing, inventory, sales];
    connection.query(sqlstr, parstr, function (err, data) {
        if (err) throw err;
        // 判断受影响的行数
        if (data.affectedRows > 0) {
            // 如果大于0 代表插入成功 那么就给前端返回成功的数据对象
            res.send({ "error_code": 0, "reason": "添加商品成功" });
        } else {
            // 失败：返回给前端失败的数据对象
            res.send({ "error_code": 1, "reason": "添加商品失败" });
        }
    })
})

// console.log(sqlstr);
//库存管理
router.get('/stocklistbypage', (req, res) => {
    //接收前端发来的当前页和每页的条数
    let { currentPage, pageSize } = req.query;
    console.log(currentPage, pageSize);
    pageSize = pageSize ? pageSize : 3;
    currentPage = currentPage ? currentPage : 2;
    //构造sql
    let sqlstr = `select * from stock order by ctime desc`;
    console.log(sqlstr);
    //执行sql
    connection.query(sqlstr, (err, data) => {
        if (err) throw err;
        //发送总页数给前端
        let total = data.length;
        console.log(total);
        // 分页条件
        let n = (currentPage - 1) * pageSize;
        sqlstr += ` limit ${n}, ${pageSize}`;

        // console.log("这是sqlstr", n)

        // //构造sql
        connection.query(sqlstr, (err, data) => {
            if (err) throw err;
            res.send(
                {
                    total,
                    data
                })
        })

    })
})

//库存管理===============删除
router.get('/stockdel', (req, res) => {
    // res.send("1");
    let { id } = req.query;
    let sqlstr = `delete from stock where id = ${id}`;
    console.log(sqlstr);
    //使用连接对象的query方法，执行这个sql语句
    connection.query(sqlstr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ 'error_code': 0, 'reason': '删除数据成功' });

        } else {
            res.send({ 'error_code': 1, 'reason': '删除数据失败' });

        }
    })

})
//=======================修改
router.get('/stockedit',(req,res)=>{
    let { id } = req.query;
  //构造sql
  let sqlstr = `select * from stock where id=${id}`;
  console.log(sqlstr)
  //执行sql
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    res.send(data);
  })
})
//保存修改账号的路由
router.post('/savestockedit', function (req, res) {
  // res.send("2")
  //接收前端发来的新数据和原来id
  let { barCode, proName, price,warehousing,inventory,sales,editId } = req.body;

  //构造sql
  let sqlstr = `update stock set barCode='${barCode}',proName='${proName}',price='${price}',warehousing='${warehousing}',inventory='${inventory}',sales='${sales}' where id=${editId}`;
  console.log("后端接收到的新数据", sqlstr);
  // //执行sql
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    // //如果受影响的数据大于0，则修改成功，响应数据给前端成功的信息
    if (data.affectedRows > 0) {
      res.send({ 'error_code': 0, 'reason': '修改数据成功' });
    } else {//修改信息失败，响应失败的信息给后端
      res.send({ 'error_code': 1, 'reason': '修改数据失败' });
    }
    console.log(data);
  })
 })
module.exports = router;