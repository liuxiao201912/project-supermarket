<template>
    <div class="top">
        <el-row>
            <el-col :span="12">
                <div  class="title">
                    <i class="el-icon-menu"></i>
                    华联超市管理系统
                </div>
            </el-col>
            <el-col :span="12">
                <div class="top-right">
                    <el-row>
                        <el-col :span="18">
                            欢迎您! 
                            <el-dropdown @command="handleCommand">
                                <!-- 名字 -->
                                <span class="username el-dropdown-link">
                                    {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <!-- 下拉菜单 -->
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                        <el-col :span="6">
                            <div class="avatar">
                                <img width="100%" height="100%" :src="avatarUrl" alt="">
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      avatarUrl: "http://127.0.0.1:8080/avatar.jpg"
    };
  },
  methods: {
    handleCommand(command) {
      // this.$message('click on item ' + command);
      if (command === "logout") {
        //清除token
        window.localStorage.removeItem("token");
        //弹提示
        this.$message({
          type: "sucess",
          message: "您已经退出成功！"
        });
        //跳到登录页
        this.$router.push("/login");
      } else {
        //否则跳转到个人中心
        this.$router.push("/personal");
      }
    }
  },
  //显示当前用户
  created() {
    this.username = window.localStorage.getItem("username");
  }
};
</script>

<style lang="less">
.top {
  margin: 0;
  padding: 0;
  background-color: rgba(28, 96, 160, 0.5);
  width: 100%;
  height: 100%;
  border-bottom: 2px solid #ccc;
  .title {
    text-align: left;
    font-size: 20px;
    font-weight: 900;
    margin-left: 20px;color: #222;
  }
  .top-right {
  color: #222;
    text-align: right;
    .username {
      font-weight: 600;
    }
    .avatar {color: #222;
      width: 52px;
      height: 52px;
      margin-top: 4px;
      margin-left: 30px;
      border-radius: 50%;
      img {
        border-radius: 50%;
      }
    }
  }
}
</style>

