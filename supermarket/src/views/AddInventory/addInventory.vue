<template>
    <div class="addInventory">
        <!--卡片组件-->
        <el-card class="box-card"> 
          <!-- 标题 -->
              <div slot="header" class="clearfix">
                  <span>添加库存</span>
              </div>
              <div class="text item">
          <!-- 内容 -->
         <div>
           <el-form ref="addInForm" :model="addInForm" label-width="80px" :rules="rules" label-position="top">
                <el-form-item label="商品条形码" prop="barCode">
                    <el-input v-model="addInForm.barCode"></el-input>
                </el-form-item>
                    <el-form-item label="商品名称" prop="proName">
                    <el-input v-model="addInForm.proName"></el-input>
                </el-form-item>
       
                <el-form-item label="进价" prop="price">
                    <el-input v-model="addInForm.price"></el-input>元
                     
                 <el-form-item label="入库" prop="warehousing">
                    <el-input v-model="addInForm.warehousing"></el-input>
                </el-form-item> 
                
                </el-form-item>
                    <el-form-item label="库存" prop="inventory">
                    <el-input v-model="addInForm.inventory" placeholder="计重商品单位为千克"></el-input><br>
                </el-form-item>
          
                 
                   <el-form-item label="已售" prop="sales">
                    <el-input v-model="addInForm.sales"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('addInForm')">入库</el-button>
                </el-form-item>
            </el-form>
        </div>

                <!-- 面板内容 -->
                  
        </div>
    </el-card>
 </div>
</template>

<script>
//引入qs
import qs from "qs";
export default {
  data() {
    return {
      addInForm: {
        barCode: "",
        proName: "",
        price: "",
        warehousing: "",
        inventory: "",
        sales: ""
      },

      rules: {
        barCode: [
          { required: true, message: "请输入商品条形码", trigger: "blur" }
        ],
        proName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入进价", trigger: "blur" }],
        warehousing: [
          { required: true, message: "请输入入库数量", trigger: "blur" }
        ],
        inventory: [
          { required: true, message: "请输入库存数量", trigger: "blur" }
        ],
        sales: [{ required: true, message: "请输入已售数量", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(addInForm) {
      this.$refs[addInForm].validate(valid => {
        if (valid) {
          //获取参数，发送给后端
          let params = {
            barCode: this.addInForm.barCode,
            proName: this.addInForm.proName,
            price: this.addInForm.price,
            warehousing: this.addInForm.warehousing,
            inventory: this.addInForm.inventory,
            sales: this.addInForm.sales
          };
          this.axios
            .post("http://127.0.0.1:666/stock/stockadd", qs.stringify(params))
            .then(response => {
              let { error_code, reason } = response.data;
              //前端根据返回的数据，弹出相应的提示
              if (error_code === 0) {
                //如果成功，就弹出成功的提示
                this.$message({
                  type: "success",
                  message: reason
                });
                this.$router.push("/stockmanage")
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
        } else {
          console.log("不可以!");
        }
      });
    }
  }
};
</script>


<style lang="less">
.addInventory {
  .el-card {
    .el-card__header {
      font-style: 20px;
      text-align: left;
      background-color: #f1f1f1;
      border: 1px solid #ccc;
      font-weight: 600;
    }
    .el-card__body {
      .el-form {
        text-align: left;
        .el-form-item {
          .el-input {
            width: 240px !important;
          }
        }
      }
    }
  }
}
</style>
