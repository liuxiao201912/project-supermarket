<template>
    <div class="stockmanage">
        <!--卡片组件-->
        <el-card class="box-card"> 
          <!-- 标题 -->
              <div slot="header" class="clearfix">
                  <span>库存管理</span>
              </div>
              <div class="text item">
          <!-- 内容 -->
            <el-form ref="stockmaForm" :model="stockmaForm" label-width="80px">
                <span>分类：</span>
                        <el-form-item>
                            <el-select v-model="stockmaForm.region" placeholder="----请选择分类----">
                                <el-option label="日用类" value="日用类"></el-option>
                                <el-option label="生活类" value="生活类"></el-option>
                            </el-select>
                        </el-form-item>
                            <span>关键字：</span>
                        <el-form-item>
                            <el-input
                            placeholder="请输入内容"
                            v-model="stockmaForm.input"
                            clearable>
                            </el-input>
                        </el-form-item>
                <span>（商品名称，条形码）<el-button type="success">查询</el-button></span>
            </el-form>
            <el-table
                :data="inventoryData"
                style="width: 100%">
                <el-table-column
                label="商品条形码">
                    <template slot-scope="scope">
                        <span>{{ scope.row.barCode }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                label="商品名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.proName }}</span>
                    </template>
                </el-table-column>
               
                <el-table-column
                label="进价(元)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.price }}</span>
                    </template>
                </el-table-column>
                
                <el-table-column
                label="入库">
                    <template slot-scope="scope">
                        <span>{{ scope.row.warehousing}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                label="库存">
                    <template slot-scope="scope">
                        <span>{{ scope.row.inventory}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column
                label="已售">
                   <template slot-scope="scope">
                        <span>{{ scope.row.sales}}</span>
                    </template>
                </el-table-column>
           
                  
                    <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
                                    <i class="el-icon-edit"></i>
                                </el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                                    <i class="el-icon-delete"></i>
                                </el-button>
                            </template>
                        </el-table-column> 
           </el-table>
                         <!-- 修改弹出的模态框 -->
            <el-dialog title="修改库存信息" :visible.sync="flag" width="400">
                <!-- 修改表单 -->
                <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                        <!-- 条形码 -->
                        <el-form-item label="条形码" prop="barCode" >
                            <el-input type="text" v-model="editForm.barCode" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 商品名称 -->
                        <el-form-item label="商品名称" prop="proName">
                            <el-input type="text" v-model="editForm.proName" autocomplete="off"></el-input>
                        </el-form-item>
                           

                        <!-- 进价 -->
                                 <el-form-item label="进价" prop="price">
                            <el-input type="text" v-model="editForm.price" autocomplete="off"></el-input>
                        </el-form-item>
                         <!-- 入库 -->
                                 <el-form-item label="入库" prop="warehousing">
                            <el-input type="text" v-model="editForm.warehousing" autocomplete="off"></el-input>
                        </el-form-item>
                           <!-- 库存 -->
                                 <el-form-item label="库存" prop="inventory">
                            <el-input type="text" v-model="editForm.inventory" autocomplete="off"></el-input>
                        </el-form-item>
                        
                           <!-- 库存 -->
                                 <el-form-item label="已售" prop="sales">
                            <el-input type="text" v-model="editForm.sales" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="flag = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
                </el-dialog>

                    <!-- 分页 -->
                <div style="margin-top: 20px">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[1, 2,3,4]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                      </el-pagination>
                </div>
        
          
             
        </div>
    </el-card>
 </div>
</template>

<script>
import qs from 'qs';
export default {
  data() {
    return {
      total: 0, // 数据总条数
      currentPage: 1, // 当前页
      pageSize: 3, // 默认每页显示3条
      stockmaForm: {
        region: "",
        input: "",
        flag:false,
       
      }, inventoryData:[],flag:false,
        editForm: {  
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
        warehousing: [{ required: true, message: "请输入入库数量", trigger: "blur" }
        ],
        inventory: [
          { required: true, message: "请输入库存数量", trigger: "blur" }
        ],
        sales: [{ required: true, message: "请输入已售数量", trigger: "blur" }],
        
      }
    };
  },
  //===============================生命周期的钩子函数，在页面加载完成之前触发
  created() {
    // 页面加载 请求数据
    this.getstockListByPage();
  },
  methods: {
    //==================================按照分页显示数据的函数
    getstockListByPage() {
      //收集当前页和当前页的条数
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      // console.log(currentPage, pageSize);
      //发送请求给后端
      this.axios
        .get("http://127.0.0.1:666/stock/stocklistbypage", {
          params: {
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
        })
        .then(response => {
          //   赋值给对应的变量
          let { total, data } = response.data;
          // alert("q233:"+total);
          this.total = total;
          this.inventoryData = data;
          // 如果当前页没有数据 且 排除第一页
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getstockListByPage();
          }
        //   console.log(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //===================================分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getstockListByPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getstockListByPage();
    },
    //===================================修改
    handleEdit(id) {
     //携带id发送ajax请求后端
       let  editId=this.id;
        this.axios.get(`http://127.0.0.1:666/stock/stockedit?id=${id}`)
        .then(response=>{
            this.flag=true;
            //接收后端响应回来的数据，并回填
            let rst=response.data[0];
            this.editForm.barCode=rst.barCode;
            this.editForm.proName=rst.proName;
            this.editForm.price=rst.price;
            this.editForm.warehousing=rst.warehousing;
            this.editForm.inventory=rst.inventory;
            this.editForm.sales=rst.sales;
            this.editId=rst.id;
           this.getstockListByPage();

            // console.log(response.data)
        })
        .catch(err=>{
            console.log(err);
        })

         
     
    },
//==================================保存修改
saveEdit(){   //传参，并回填
        let params={
            barCode:this.editForm.barCode,
        proName:this.editForm.proName,
        price:this.editForm.price,
        warehousing:this.editForm.warehousing,
        inventory:this.editForm.inventory,
        sales:this.editForm.sales,
        editId:this.editId
        }; 
        // console.log(params);
  this.axios.post(`http://127.0.0.1:666/stock/savestockedit`, qs.stringify(params))
     
 .then(response=>{
           
       
        let { error_code, reason } = response.data;
          if (error_code === 0) {
            this.$message({
              type: "success",
              message: reason
            });
             this.flag = false;
            this.getstockListByPage();
        
          } else {
            this.$message.err(reason);
          }
      
            // console.log(response.data)
        })
        .catch(err=>{
            console.log(err);
        })

         
     
    },
    // =========================================================删除
    handleDelete(id) {
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get(`http://127.0.0.1:666/stock/stockdel?id=${id}`)
            .then(response => {
              let { error_code, reason } = response.data;

              if (error_code === 0) {
                //如果成功，就弹出成功的提示
                this.$message({
                  type: "success",
                  message: reason
                });
                this.getstockListByPage();
              } else {
                //失败就弹出失败的提示
                this.$message({
                  message: reason
                });
              }
            // console.log(response.data)
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });

      this.getstockListByPage();
    }
  }
};
</script>


<style lang="less">
.stockmanage {
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
          width: 220px;
          display: inline-block;
          .el-form-item__content {
            .el-select {
              width: 220px;
            }
          }
        }
      }
    }
  }
}
</style>
