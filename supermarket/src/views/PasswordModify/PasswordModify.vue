<template>
    <div class="passwordModify">
   <!--卡片组件-->
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>修改密码</span>
  </div>
  <div class="text item">
   
  <!-- 表单容器 -->

            <el-form :model="passwordModify" status-icon :rules="rules" ref="passwordModify" label-width="100px" class="passwordModify">

            <el-form-item label="原密码" prop="oldpassword">
                <el-input type="text" v-model="passwordModify.oldpassword" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="newpassword">
                <el-input type="password" v-model="passwordModify.newpassword" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="确认新密码" prop="checknewpass">
                <el-input v-model="passwordModify.checknewpass"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('passwordModify')">修改</el-button>
                <el-button @click="resetForm('passwordModify')">重置</el-button>
            </el-form-item>

            </el-form>
  </div>
 

    
</el-card>
    </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    //自定义密码验证
    const newpass = (rule, value, callback) => {
      if (value === "") {
        // 如果密码为空，提示输入密码
        callback(new Error("请输入新密码"));
      } else if (value.length < 3 || value.length > 6) {
        callback(new Error("长度在 3 - 6 位"));
      } else {
        if (this.passwordModify.checknewpass !== "") {
          //验证两次密码是否一致
          this.$refs.passwordModify.validateField("checknewpass");
        }
        callback();
      }
    };
    // 自定义新密码验证
    const checkpass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value !== this.passwordModify.newpassword) {
        callback(new Error("两次密码不一致"));
      } else {
        //成功的回调
        callback();
      }
    };
    //自定密码是否是正确的函数
    const oldpass = (rule, value, callback) => {
      // 获取当前登录的账户
      let username = window.localStorage.getItem("username");
      //发送axios给后端
      this.axios
        .get(
          `http://127.0.0.1:666/account/editpwd?oldpassword=${value}&username=${username}`
        )
        .then(response => {
          console.log(response.data);
          // 接收后端返回的错误码 和 提示信息
          let { error_code, reason } = response.data;
          if (error_code !== 0) {
            //不正确
            callback(new Error(reason));
          } else {
            // 正确的回调 绿色的勾勾
            callback();
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    return {
      passwordModify: {
        oldpassword: "",
        newpassword: "",
        checknewpass: ""
      },
      rules: {
        oldpassword: [{ required: true, validator: oldpass, trigger: "blur" }],
        newpassword: [{ required: true, validator: newpass, trigger: "blur" }],
        checknewpass: [
          { required: true, validator: checkpass, trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //获取新旧
          let params = {
            username: window.localStorage.username,
            oldpassword: this.passwordModify.oldpassword,
            newpassword: this.passwordModify.newpassword
          };
          //发送ajax给后端
          this.axios
            .post(`http://127.0.0.1:666/account/savepwd`, qs.stringify(params))

            .then(response => {
              console.log(response.data);
              // 接收后端返回的错误码 和 提示信息
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                // 清除token
                window.localStorage.removeItem("token");
                //弹出成功的提示
                this.$message({
                  type: "success",
                  message: reason
                });
                //跳到登录页面
                this.$router.push("/login");
              } else {
                // 弹出错误提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }else{
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
.passwordModify {
  .el-card {
    .el-card__header {
      font-style: 20px;
      text-align: left;
      background-color: #f1f1f1;
      border: 1px solid #ccc;
      font-weight: 600;
    }
    .el-form-item__content {
      width: 300px;
    }
  }
}
</style>
