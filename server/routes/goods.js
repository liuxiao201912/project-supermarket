var express = require('express');
var router = express.Router();

// 引入jwt 登录页面用
const jwt = require('jsonwebtoken');
// 定义秘钥  登录页面用
const secretKey = 'liuxiao';

//引入连接数据库模块,引入自定义模块的方法
var connection = require('./connect');

router.get('/', function (req, res, next) {
    res.render('index', { title: '这是商品管理路由' });
});

// 统一设置响应头 解决跨域问题
router.all('*', (req, res, next) => {
    // 设置响应头 解决跨域(目前最主流的方式)
    res.header('Access-Control-Allow-Origin', '*');
    next();
})
// ============================================================添加商品
router.post('/goodsadd', (req, res) => {

  // 接收参数
  let {cateName, barCode, goodsName, costPrice, marketPrice, salePrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc} = req.body;
  // 构造sql
  const sqlStr = `insert into goods(cateName, barCode, goodsName, costPrice, marketPrice, salePrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc) 
  values(?,?,?,?,?,?,?,?,?,?,?,?)`;

  // 参数
  const sqlParams = [cateName, barCode, goodsName, costPrice, marketPrice, salePrice, goodsNum, goodsWeight, unit, discount, promotion, goodsDesc]; 

  // 执行sql
  connection.query(sqlStr, sqlParams, (err, data) => {
    if (err) throw err;
    // 判断受影响的行数
    if (data.affectedRows > 0) {  
      // 如果大于0 代表插入成功 那么就给前端返回成功的数据对象
      res.send({"error_code": 0, "reason":"添加商品成功"});
    } else {
      // 失败：返回给前端失败的数据对象
      res.send({"error_code": 1, "reason":"添加商品失败"});
    }
  })
})

// 按照分页显示商品列表
router.get('/goodslistbypage', (req, res) => {
  
  // //接收前端发来的当前页和每页的条数
  // let { currentPage, pageSize } = req.query;
  // console.log(currentPage, pageSize);
  // pageSize = pageSize ? pageSize : 3;
  // currentPage = currentPage ? currentPage : 2;
  // //构造sql
  // let sqlstr = `select * from goods order by ctime desc`;
  // console.log(sqlstr);
  // //执行sql
  // connection.query(sqlstr, (err, data) => {
  //   if (err) throw err;
  //   //发送总页数给前端
  //   let total = data.length;
  //   console.log(total);
    //分页条件
//     let n = (currentPage - 1) * pageSize;
//     sqlstr += ` limit ${n}, ${pageSize}`;

//     console.log("这是sqlstr", n)

//     // //构造sql
//     connection.query(sqlstr, (err, data) => {
//       if (err) throw err;
//       res.send(
//         {
//           total,
//           data
//         })
//       // res.send(data);
//     })
//   })

// })
  // 接收前端参数
  let {pageSize, currentPage, cateName, keyWord} = req.query;

  // 默认值
  pageSize = pageSize ? pageSize : 3;
  currentPage = currentPage ? currentPage : 1

  // 构造sql语句 （查询所有数据 按照时间排序）
  let sqlStr = `select * from goods where 1 = 1`;
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    // 计算数据总条数
    let total = data.length;

    // 分类名不为空 且 全部 那么 就拼接分类条件
    if (cateName !== "" && cateName !== "全部") {
      sqlStr += ` and cateName='${cateName}'`;
    }

    // 如果关键字不为空 就要拼接关键字查询条件
    if (keyWord !== "") {
      sqlStr += ` and (goodsName like "%${keyWord}%" or barCode like "%${keyWord}%")`
    }

    console.log('查询语句:', sqlStr)

    // 再次按照 查询的条件查询数据 重新计算数据的总条数
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      total = data.length;
    })

    // 拼接排序
    sqlStr += ` order by ctime desc`;

    // 分页条件 (跳过多少条)
    let n = (currentPage - 1) * pageSize;
    // 拼接分页的sql语句
    sqlStr += ` limit ${n}, ${pageSize}`;

    // 执行sql语句 （查询对应页码的数据）
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      // 把数据返回给前端 两个数据 数据总条数 total 和 对应页码的数据 data
      res.send({
        total,
        data
      })
    })
  })
})

//==============================================改
router.get('/goodsedit',(req,res)=>{
  //  接收前端发送的数据和id
  // res.send("1")
  let { id } = req.query;
  //构造sql
  let sqlstr = `select * from goods where id=${id}`;
  console.log(sqlstr)
  //执行sql
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    res.send(data);
  })
})
//保存修改账号的路由
router.post('/goodsaveedit', function (req, res) {
  // res.send("2")
  //接收前端发来的新数据和原来id
  let { barCode, goodsName, cateName,editId } = req.body;
  console.log(barCode, goodsName, cateName,editId);
  //构造sql
  let sqlstr = `update goods set barCode='${barCode}',goodsName='${goodsName}',cateName='${cateName}' where id=${editId}`;
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

 //删除功能
 router.get('/goodsdel',(req,res)=>{
  let { id } = req.query;
  let sqlstr = `delete from goods where id = ${id}`;
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
//批量删除
router.get("/goodsbatchdel",(req,res)=>{
  // res.send("1")

  let { delId } = req.query;
  console.log(delId);
  //构造sql
  let sqlstr = `delete from goods where id in (${delId})`
  console.log("批量删除的数据", sqlstr)
  //执行sql
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    // console.log(data);
    if (data.affectedRows > 0) {
      res.send({ "error_code": 0, "reason": "批量删除成功" })
    } else {
      res.send({ "error_code": 1, "reason": "批量删除失败" })
    }
  })
})
//查询
router.post("/search",(req,res)=>{
// 接收参数
let {cateName, keyWord} = req.body;

// 构造sql
let sqlStr = `select * from goods where 1 = 1`;

// 分类名不为空 且 全部 那么 就拼接分类条件
if (cateName !== "" && cateName !== "全部") {
  sqlStr += ` and cateName='${cateName}'`;
}

// 如果关键字不为空 就要拼接关键字查询条件
if (keyWord !== "") {
  sqlStr += ` and (goodsName like "%${keyWord}%" or barCode like "%${keyWord}%")`
}

// 执行sql
connection.query(sqlStr, (err, data) => {
  if (err) throw err;
  res.send(data);
})
})

module.exports = router;