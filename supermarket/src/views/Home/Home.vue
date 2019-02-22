<template>
<div class="home">
<!--卡片组件-->
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>管理信息</span>
  </div>
  <div class="text item">
   
 <el-alert
  
      title="商品总数:5。已经销售的总金额:850.00。库存商品总价:1234.56"
      type="info"
      show-icon>
  </el-alert>
  <el-alert
      title="导入数据"
      type="success"
      show-icon>
  </el-alert>

  <el-row :gutter="20">
        <!-- 左边卡片 -->
        <el-col :span="12">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
            <span>销售排行</span>
          </div>
          <div  class="text item">
                 <el-table
                    :data="saleData"
                    style="width: 100%">

                    <el-table-column
                      prop="shopName"
                      label="商品名称"
                      width="180">
                    </el-table-column>

                    <el-table-column
                      prop="saleCount"
                      label="销量"
                      width="180">
                    </el-table-column>
                </el-table>
          </div>
        </el-card>
        </el-col>
        <!-- 右边卡片 -->
        <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>缺货的商品</span>
                </div>
                <div  class="text item">
                     <el-table
                    :data="goodsData"
                    style="width: 100%">

                        <el-table-column
                          prop="goodsName"
                          label="商品名称"
                          width="180">
                        </el-table-column>

                        <el-table-column
                          prop="Stock"
                          label="库存"
                          width="180">
                        </el-table-column>

                        
                           <el-table-column label="操作">
                              <template slot-scope="operation">
                                <el-button
                                  size="mini"
                                 >入库</el-button>
                                
                              </template>
                            </el-table-column>
                      
                    </el-table>
                </div>
              </el-card>
        </el-col>
</el-row>
  
  </div>
</el-card>

</div>
</template>
<script>
export default {
  data() {
    return {
      // 销售排行
     saleData: [
        {
          shopName: "海飞丝",
          saleCount: 70,
        },
        {
          shopName: "蒂花之秀",
          saleCount: 25,
        },
        {
          shopName: "康王",
          saleCount: 23,
        },
        {
          shopName: "雨洁",
          saleCount: 20,
          
        }
      ],
      //缺货的商品
       goodsData: [
        {
          goodsName: "我的优乐美",
          Stock: 0,
          operation:"入库"
        }, {
          goodsName: "我的优乐美",
          Stock: 0,
          operation:"入库"
        }, {
          goodsName: "我的优乐美",
          Stock: 0,
          operation:"入库"
        }
        
      ]
    };
  }
};
</script>
<style lang="less">
.home {
  .el-card {
    .el-card__header {
      font-style: 20px;
      text-align: left;
      background-color: #f1f1f1;
          border: 1px solid #ccc;
      
      font-weight: 600;
    }
    .el-card__body {
      .item {
        .el-alert {
          margin-bottom: 26px;
          background-color: rgba(176, 210, 243, 0.2);
          border: 1px solid #ccc;
        }
      }
    }
  }
}
</style>


