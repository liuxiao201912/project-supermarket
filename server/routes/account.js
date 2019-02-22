var express = require('express');
var router = express.Router();
//引入fs
var fs=require("fs");
var path=require("path");
//在node后端处理上传文件的模块
// var multer =require("multer");
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


//添加账号的路由accountadd
router.post('/accountadd', function (req, res) {
  //接收前端发过来的数据
  let { username, password, usergroup } = req.body;
  console.log('接收前端发过来的数据', username, password, usergroup);
  //把数据存入数据库
  //构造增加账号的sql语句
  const sqlstr = `insert into account(username,password,usergroup) values('${username}','${password}','${usergroup}')`;
  //执行sql语句
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      res.send({ 'error_code': 0, 'reason': '插入数据成功' });
    } else {
      res.send({ 'error_code': 1, 'reason': '插入数据失败' });
    }
  })
});

//账号列表的路由accountlist
// router.get('/accountlist', function (req, res) {
//   //接收前端发来的数据

//   //查询所有数据
//   //构造sql语句
//   const sqlstr = 'select * from account order by ctime desc';

//   // const sqlstr = 'select * from account order by ctime desc';
//   //执行sql语句
//   connection.query(sqlstr, (err, data) => {
//     if (err) throw err;
//     res.send(data);
//   })

// })
//管理界面的分页功能/accountlistByPage
router.get('/accountlistByPage', function (req, res) {

  //接收前端发来的当前页和每页的条数
  let { currentPage, pageSize } = req.query;
  console.log(currentPage, pageSize);
  pageSize = pageSize ? pageSize : 3;
  currentPage = currentPage ? currentPage : 2;
  //构造sql
  let sqlstr = `select * from account order by ctime desc`;
  console.log(sqlstr);
  //执行sql
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    //发送总页数给前端
    let total = data.length;
    console.log(total);
    //分页条件
    let n = (currentPage - 1) * pageSize;
    sqlstr += ` limit ${n}, ${pageSize}`;

    console.log("这是sqlstr", n)

    // //构造sql
    connection.query(sqlstr, (err, data) => {
      if (err) throw err;
      res.send(
        {
          total,
          data
        })
      // res.send(data);
    })
  })

})
//删除账号的路由accountdel
router.get('/accountdel', function (req, res) {
  //查询所有数据
  //构造sql语句
  //接收id
  //debugger;  
  let { id } = req.query;
  let sqlstr = `delete from account where id = ${id}`;
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
//修改账号的路由accountedit
router.get('/accountedit', function (req, res) {
  //接收前端发送的数据和id
  // res.send("1")
  let { id } = req.query;
  //构造sql
  let sqlstr = `select * from account where id=${id}`;
  console.log(sqlstr)
  //执行sql
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    res.send(data);
  })
})
//保存修改账号的路由/accountsaveedit
router.post('/accountsaveedit', function (req, res) {
  //  res.send("2")
  //接收前端发来的新数据和原来id
  let { username, usergroup, editId } = req.body;
  //构造sql
  let sqlstr = `update account set username='${username}',usergroup='${usergroup}' where id=${editId}`;
  console.log("后端接收到的新数据", sqlstr);
  //执行sql
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
//批量删除账号的路由/accountbatchdel
router.get('/accountbatchdel', function (req, res) {
  //接收前端发来的请求,接收id
  let { delId } = req.query;
  console.log(delId);
  //构造sql
  let sqlstr = `delete from account where id in (${delId})`
  console.log("批量删除的数据", sqlstr)
  //执行sql
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    console.log(data);
    if (data.affectedRows > 0) {
      res.send({ "error_code": 0, "reason": "批量删除成功" })
    } else {
      res.send({ "error_code": 1, "reason": "批量删除失败" })
    }
  })
})



//---------------------------------------------------------------

//修改密码
//接收前端发来的参数
router.get('/editpwd', function (req, res) {
  // res.send("1");
  //接手前端发来的账号和密码
  let { username, oldpassword } = req.query;
  console.log(username, oldpassword);
  const sqlstr = `select * from account where username='${username}' and password='${oldpassword}'`;
  console.log(sqlstr);
  //如果账号和密码和数据库的账号密码一致，就返回给前端
  connection.query(sqlstr, (err, data) => {
    if (err) throw err;
    if (data.length) { // 如果查询出数据 证明正确
      res.send({ "error_code": 0, "reason": "旧密码正确!" });
    } else { // 否则就是不正确
      res.send({ "error_code": 1, "reason": "旧密码错误!" })
    }
  })
})
//保存修改的密码/savepwd
router.post('/savepwd', function (req, res) {
  //接收前端发来的新旧密码和账号
  let { username, oldpassword, newpassword } = req.body;
  //构造sql
  const sqlstr = `update account set password='${newpassword}' where username='${username}' and password='${oldpassword}'`;

  //执行sql
  connection.query(sqlstr, (err, data) => {

    if (err) throw err;
    // 判断
    if (data.affectedRows > 0) {
      // 成功
      res.send({ "error_code": 0, "reason": "密码修改成功!请重新登录!" })
    } else {
      // 失败
      res.send({ "error_code": 1, "reason": "密码修改失败!" })
    }
  })
})

//==========================================================
//个人中心
router.get('/accountinfo',(req,res)=>{
res.send("1")
}
)

module.exports = router;
