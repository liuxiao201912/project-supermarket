<template>
<div class="login">

  <!-- 表单容器 -->
  <div class="login-wrapper">
   
     <h1 class="login-title">
       <i class="el-icon-menu"></i>  
         华联超市管理系统-登录
    </h1>
<el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="loginForm">

  <el-form-item label="账    号" prop="username" >
    <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
  </el-form-item>

  <el-form-item label="密    码" prop="password">
    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
  </el-form-item>

  <el-form-item label="确认密码" prop="checkpass">
    <el-input  type="password" v-model="loginForm.checkpass"></el-input>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
    <el-button @click="resetForm('loginForm')">重置</el-button>
  </el-form-item>

</el-form>
  </div>
</div>
</template>
<script>
//引入qs
import qs from "qs";

export default {
  data() {
    const pass = (rule, value, callback) => {
      //   alert(this.loginForm.checkpass.length);
      if (value === "") {
        // 如果密码为空，提示输入密码
        callback(new Error("请再次输入密码"));
      } else if (value.length > 5 || value.length < 3) {
        // 如果密码不为空，判断其长度
        callback(new Error("长度在 3 到 5 个字符"));
      } else {
        if (this.loginForm.checkpass !== "") {
          //验证两次密码是否一致
          this.$refs.loginForm.validateField("checkpass");
        }
        callback();
      }
    };
    // 自定义再次输入密码验证
    const check = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.loginForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        //成功的回调
        callback();
      }
    };
    return {
      //登录表单的数据
      loginForm: {
        username: "",
        password: "",
        checkpass: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [{ required: true, validator: pass, trigger: "blur" }],
        checkpass: [{ required: true, validator: check, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //如果所有表单验证通过，就提交
          //收集账号和密码
          let params = {
            username: this.loginForm.username,
            password: this.loginForm.password
          };
          // console.log(params);
          //发送ajax给后端，发送账号和密码
          this.axios
            .post("http://127.0.0.1:666/login/checklogin", qs.stringify(params))
            .then(response => {
              // console.log(response.data);
              //接收后端响应回来的数据
              let {error_code,reason, token,username}=response.data;
              //判断成功
              if(error_code==0){
                // 把token存在浏览器的本地存储中
                window.localStorage.setItem('token', token);
                // 把用户名存入本地存储
                window.localStorage.setItem('username', username);
                
                // 弹成功提示
                this.$message({
                  type: 'success',
                  message: reason
                })
                //跳转到后端首页
                this.$router.push('/');
              }else{
                this.$message.error(reason);
              }

            })
            .catch(err => {
              console.log(err);
            });

          // alert("提交成功，可以发给后端!");
          // this.$router.push("/");
        } else {
          // console.log("提交失败，不可以发给后端!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      //获取整个表单，调用重置方法
      this.$refs[formName].resetFields();
    }
  }
};
</script>


<style lang="less">
#app {
  height: 100%;
  .login {
    width: 100%;
    height: 100%;
  //  background-color: #2d3a4b;
 background: url('./bg.jpg');
 height: 100%;
background-size:100%;

    .login-wrapper {
      width: 500px;
      height: 350px;
      background-color: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      padding: 20px 40px 10px 10px;
      .login-title {
        color: #fff;
        font-weight: 800;
        font-size: 22px;
        text-align: left;
        margin-left: 58px;
      }
      .el-form{
        .el-form-item{
          .el-form-item__label{
            color: #fff;
          }
          
        }
             
      }
    }
  }
}
</style>
