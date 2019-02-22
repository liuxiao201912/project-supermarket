<template>
    <div class="accountManage">
          <!--卡片组件-->
          <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>账号管理</span>
          </div>
          <div class="text item">
          <!-- 表单容器 -->
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">

                    <el-table-column
                      type="selection"
                    >
                    </el-table-column>
                    
                    <el-table-column
                      prop="username"
                      label="用户名称"
                      >
                    </el-table-column>

                    <el-table-column
                      prop="usergroup"
                      label="用户组"
                      >
                  
                    </el-table-column>

                    <el-table-column
                      prop="ctime"
                      label="创建时间">
                      <template slot-scope="scope">
                        {{scope.row.ctime|filterCtime}}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              @click="handleEdit(scope.row.id)">
                              <i class="el-icon-edit"></i>
                              修改</el-button>
                            <el-button
                              size="mini"
                              type="danger"
                              @click="handleDelete(scope.row.id)">
                              <i class="el-icon-delete"></i>
                              删除</el-button>
                          </template>
                      
              </el-table-column>
            </el-table>
          <!-- 批量删除 -->
              <div style="margin-top: 20px;text-align:left;">
                  <el-button @click="batchDel">批量删除</el-button>
                  <el-button @click="cancelSelect()">取消选择</el-button>
            </div>
          <!--分页 -->   
            <el-pagination style="margin-top: 20px;text-align:left;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[1, 2, 3, 4]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          <!-- 修改时弹出的模态框 -->
            <el-dialog title="账号修改" :visible.sync="flag"  width="460px">
                    <el-form :model="editForm" label-width="100px">
                        <el-form-item label="账号" prop="username">
                            <el-input type="text" style="width:210px;" v-model="editForm.username" autocomplete="off"></el-input>
                        </el-form-item>
                    
                      <el-form-item label="选择用户组" prop="usergroup">
                          <el-select v-model="editForm.usergroup" placeholder="请选择用户组">
                          <el-option label="普通用户" value="普通用户"></el-option>
                          <el-option label="高级用户" value="高级用户"></el-option>
                          </el-select>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="flag=false">取 消</el-button>
                      <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
              </el-dialog>
          
            </div>
        </el-card>
    </div>
</template>

<script>
//引入moment时间模块
import moment from "moment";
import qs from "qs";
export default {
  data() {
    return {
      tableData: [],
      //修改
      flag: false, //模态框为true是显示，false是隐藏
      editForm: {
        username: "",
        usergroup: ""
      },  rules: {
        barCode: [
          { required: true, message: "请输入商品条形码", trigger: "blur" }
        ],
        proName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入进价", trigger: "blur" }],
        warehousing: [{ required: true, message: "请输入入库数量", trigger: "blur" }
        ]
        },
      editId: "",
      selectedData: [],
      currentPage: 2,
      pageSize: 3,
      total: 0
    };
  },
  //生命周期的钩子函数 created 自动触发 vue组件实例对象创建完成，dom还没有绑定 这个函数里面适合发送ajax请求，获取数据
  created() {
    console.log("在vue渲染的过程中自动触发");
    //     this.getAccountListByPage();
    this.getAccountListByPage();
  },
  methods: {
    //按照分页显示数据的函数
    getAccountListByPage() {
      //收集当前页和当前页的条数
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      // console.log(currentPage, pageSize);
      //发送请求给后端
      this.axios
        .get("http://127.0.0.1:666/account/accountlistByPage", {
          params: {
            currentPage,
            pageSize
          }
        })
        .then(response => {
          //赋值给对应的变量
          let { total, data } = response.data;
          // alert("q233:"+total);
          this.total = total;
          this.tableData = data;
          // 如果当前页没有数据 且 排除第一页
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getAccountListByPage();
          }
          // console.log("前端接收到后端返回的数据", response.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //=================================分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccountListByPage();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccountListByPage();

      // console.log(`当前页: ${val}`);
    },
    //================================选中状态改变功能
    handleSelectionChange(val) {
      this.selectedData = val;
      console.log(val);
    },
    //=================================批量删除
    //批量删除
    batchDel() {
      //收集需要删除的id，循环出来
      let delId = this.selectedData.map(v => v.id);
      //如果什么都不选，就弹出提示
      if (!delId.length) {
        this.$message.error("请选择以后再操作!");
        return;
      }
      //console.log(delId);
      //确认用户是否需要删除
      this.$confirm("你确定要批量删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(response => {
          //确定批量删除在执行then 发送ajax给后端，发送id
          this.axios
            .get(`http://127.0.0.1:666/account/accountbatchdel`, {
              params: { delId }
            })
            .then(response => {   // 接收错误码和提示信息
              let { error_code, reason } = response.data;
              // 判断
              if (error_code === 0) {
                // 成功
                // 弹出成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                //刷新页面
                this.getAccountListByPage();
              } else {
                this.$message.error(reason);
              } //刷新页面
              //  this.getAccountListByPage();
              // console.log("后端返回删除的数据", response.data);
            })
            .catch(err => {
              console.log(err);
            });

          // console.log(response.data);
        })
        .catch(err => {
          // 弹出取消删除的提示
          this.$message({
            type: "info",
            message: "已取消批量删除"
          });
        });
    },
    //取消选择
    cancelSelect() {
      this.$refs.multipleTable.clearSelection();
    },
    //=================================修改功能

    handleEdit(id) {
      //点击修改按钮，触发函数，发送带id的请求给后端
      this.editId = id;
      // alert("1")
      //获取id
      this.axios
        .get(`http://127.0.0.1:666/account/accountedit?id=${id}`)
        .then(response => {
          //点击修改就开启模态框
          this.flag = true;
          // console.log(response.data[0]);

          //接收后端返回的数据数据回填
          let rst = response.data[0];
          console.log(rst);
          this.editForm.username = rst.username;
          this.editForm.usergroup = rst.usergroup;
          // console.log(response.data[0]);
          //点击修改就开启模态框
          this.flag = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // ================================保存修改
    saveEdit() {
      //   //收集新数据和原来id
      let params = {
        username: this.editForm.username,
        usergroup: this.editForm.usergroup,
        editId: this.editId
      };
      console.log(params);
      //发送请求给后端
      this.axios
        .post(
          `http://127.0.0.1:666/account/accountsaveedit`,
          qs.stringify(params)
        )
        .then(response => {
          //接收后端发来的修改成功信息
          let { error_code, reason } = response.data;
          if (error_code === 0) {
            this.$message({
              type: "success",
              message: reason
            });
            this.flag = false;
            this.getAccountListByPage();
          } else {
            this.$message.err(reason);
          }

          console.log(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //=================================删除功能
    handleDelete(id) {
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //如果确定删除就执行then,发送请求给后端，发送id给后端
          // 发送ajax 把id传给后端
          this.axios
            .get(`http://127.0.0.1:666/account/accountdel?id=${id}`)
            .then(response => {
              //接收后端返回的信息
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                this.$message({
                  type: "success",
                  message: reason
                });

                this.getAccountListByPage();
              } else {
                this.$message.error(reason);
              }
              console.log("后端返回删除的数据", response.data);
            })
            .catch(err => {
              // 弹出取消删除的提示
              console.log(err);
            });
        })
        .catch(err => {
          // 弹出取消删除的提示
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  //过滤器
  filters: {
    //过滤时间的函数
    filterCtime(ctime) {
      return moment(ctime).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>


<style lang="less">
.accountManage {
  .el-card {
    .el-card__header {
      font-style: 20px;
      text-align: left;
      background-color: #f1f1f1;
      border: 1px solid #ccc;
      font-weight: 600;
    }
     .el-card__body {
        .el-dialog {
          .el-dialog__header {
            font-weight: 700;
          }
          .el-dialog__body {
            .el-form {
              width: 80%;
            }
          }
        }
      }
  }
}
</style>


