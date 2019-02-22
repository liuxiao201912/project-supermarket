<template>
    <div class="personal">
      <!--卡片组件-->
     <el-card class="box-card">
            <div slot="header" class="clearfix info">
                <span>个人中心</span>
            </div>
          <div class="info">
           
        <h3>账号信息</h3>
        <p>账&emsp;号：&emsp;{{userInfo.username}} <input type="text"></p>
        <p>用户组：&emsp;{{userInfo.usergroup}} <input type="text"></p>
        <p>创建时间：{{userInfo.ctime|filterCtime}} <input type="text"></p>

          </div>
            <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          
        </el-card>
    </div>
</template>

<script>
//引入moment
import moment from 'moment';
export default {
  data() {
    return {
      //用户信息
      userInfo: {
        username: '',
        username:'',
        ctime:''
      },//头像地址
        avatarUrl: ''

    };
  },
  methods:{
    //生命周期的钩子函数
    created(){
      this.getAccountInfo();
    },
    //获取账号信息
    getAccountInfo(){
     this.get('http://127.0.0.1:666/account/accountinfo')
     .then(response=>{
       console.log(response.data)
     })
     .catch(err=>{
       console.log(err);
     })
    },
    // 头像上传
      handleAvatarSuccess(res, file) {
    this.avatarUrl = URL.createObjectURL(file.raw);
  },
  beforeAvatarUpload(file) {
    const isJPG = file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      this.$message.error("上传头像图片只能是 JPG 格式!");
    }
    if (!isLt2M) {
      this.$message.error("上传头像图片大小不能超过 2MB!");
    }
    return isJPG && isLt2M;
  }
}
  };

</script>


<style lang="less">
.personal {
  .el-card {
    .el-card__header {
      font-style: 20px;
      text-align: left;
      background-color: #f1f1f1;
      border: 1px solid #ccc;
      font-weight: 600;
    }
    .el-card__body {
      text-align: left;
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
      // .item {
      //   .el-form {
      //     width: 300px;
      //     .el-form-item {
      //       .el-form-item__label {
      //         height: 35px;
      //         line-height: 35px;
      //       }
      //       .el-form-item__content {
      //         height: 35px;
      //         line-height: 35px;
      //         .el-input__inner {
      //           height: 35px;
      //           line-height: 35px;
      //         }
      //       }
      //     }
      //   }
      // }
    }
  }
}
</style>
