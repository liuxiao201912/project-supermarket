<template>
    <div class="accountAdd">
                    <!--卡片组件-->
            <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>添加账号</span>
            </div>
        <div class="text item">
            <!-- 表单容器 -->

            
                      <el-form :model="accountAddForm" status-icon :rules="rules" ref="accountAddForm" label-width="100px" class="accountAddForm">

                      <el-form-item label="账号" prop="username">
                          <el-input type="text" v-model="accountAddForm.username" autocomplete="off"></el-input>
                      </el-form-item>

                      <el-form-item label="密码" prop="password">
                          <el-input type="password" v-model="accountAddForm.password" autocomplete="off"></el-input>
                      </el-form-item>

                      <el-form-item label="确认密码" prop="checkpass">
                          <el-input v-model="accountAddForm.checkpass"></el-input>
                      </el-form-item>

                      <el-form-item label="选择用户组" prop="userGroup">
                              <el-select v-model="accountAddForm.userGroup" placeholder="请选择用户组">
                              <el-option label="普通用户" value="普通用户"></el-option>
                              <el-option label="高级用户" value="高级用户"></el-option>
                              </el-select>
                      </el-form-item>

                      <el-form-item>
                          <el-button type="primary" @click="submitForm('accountAddForm')">添加</el-button>
                          <el-button @click="resetForm('accountAddForm')">重置</el-button>
                      </el-form-item>

                      </el-form>
            </div>
          </el-card>

    </div>
</template>

<script>
//引入qs
import qs from "qs";
export default {
  data() {
    //自定义密码验证
    const pass = (rule, value, callback) => {
      //   alert(this.accountAddForm.checkpass.length);
      if (value === "") {
        // 如果密码为空，提示输入密码
        callback(new Error("请再次输入密码"));
      } else if (value.length > 5 || value.length < 3) {
        // 如果密码不为空，判断其长度
        callback(new Error("长度在 3 到 5 个字符"));
      } else {
        if (this.accountAddForm.checkpass !== "") {
          //验证两次密码是否一致
          this.$refs.accountAddForm.validateField("checkpass");
        }
        callback();
      }
    };
    // 自定义再次输入密码验证
    const check = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.accountAddForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        //成功的回调
        callback();
      }
    };
    return {
      accountAddForm: {
        username: "",
        password: "",
        checkpass: "",
        userGroup: ""
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
          // alert("提交成功，可以发给后端!");
          let params = {
            username: this.accountAddForm.username,
            password: this.accountAddForm.password,
            usergroup: this.accountAddForm.userGroup
          };
          // console.log(params)
          //通过axios发给后端
          this.axios.post("http://127.0.0.1:666/account/accountadd",
              qs.stringify(params)
            )
            .then(response => {
          // console.log("3");
           
              let {error_code,reason}=response.data
              //前端根据返回的数据，弹出相应的提示
              if (error_code === 0) {
                //如果成功，就弹出成功的提示
                this.$message({
                  type: 'success',
                  message: reason
                });
              } else {
                //失败就弹出失败的提示
                this.$message({
                  message: reason
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
          // console.log(params);
         
       this.$router.push("/accountmanage");
        } else {
          console.log("提交失败，不可以发给后端!!");
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
.accountAdd {
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
