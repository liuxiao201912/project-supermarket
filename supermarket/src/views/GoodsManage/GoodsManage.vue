<template>
  <div class="goodsmanage">
        <!--卡片组件-->
        <el-card class="box-card"> 
          <!-- 标题 -->
              <div slot="header" class="clearfix">
                  <span>商品管理</span>
              </div>
              <div class="text item">
          <!-- 内容 -->
    <div>
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="所属分类">
                            <el-select v-model="searchForm.cateName" placeholder="所属分类">
                                <el-option label="全部" value="全部"></el-option>
                                <el-option label="酒水类" value="酒水类"></el-option>
                                <el-option label="水果类" value="水果类"></el-option>
                                <el-option label="电子类" value="电子类"></el-option>
                                <el-option label="食品类" value="食品类"></el-option>
                                <el-option label="生活用品" value="生活用品"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字">
                            <el-input v-model="searchForm.keyWord" placeholder="商品名称或条形码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 面板内容 -->
                <div class="text item">
                    <!-- 账号管理列表 -->
                    <el-table ref="userlist" :data="goodstableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                        <!-- 选择框 -->
                        <el-table-column type="selection">
                        </el-table-column>
                        <!-- 条形码 -->
                        <el-table-column prop="barCode" label="条形码">
                        </el-table-column>
                        <!-- 商品名称 -->
                        <el-table-column prop="goodsName" label="商品名称">
                        </el-table-column>
                        <!-- 所属分类 -->
                        <el-table-column prop="cateName" label="所属分类">
                        </el-table-column>
                        <!-- 售价 -->
                        <el-table-column prop="salePrice" label="售价">
                        </el-table-column>
                        <!-- 是否存销 -->
                        <el-table-column prop="discount" label="是否存销">
                        </el-table-column>
                        <!-- 日期 -->
                        <el-table-column label="日期">
                            <template slot-scope="scope">{{ scope.row.cdate | formatCdate }}</template>
                        </el-table-column>
                        <!-- 操作 -->
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
                    <el-dialog title="修改商品信息" :visible.sync="flag" width="40%">
                        <!-- 修改表单 -->
                        <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                            <!-- 账号 -->
                            <el-form-item label="条形码" prop="barCode">
                                <el-input type="text" v-model="editForm.barCode" autocomplete="off"></el-input>
                            </el-form-item>
                            <!-- 密码 -->
                            <el-form-item label="商品名称" prop="goodsName">
                                <el-input type="text" v-model="editForm.goodsName" autocomplete="off"></el-input>
                            </el-form-item>
                            <!-- 用户组 -->
                            <el-form-item label="所属分类" prop="cateName">
                                <el-select v-model="editForm.cateName" placeholder="请选择用户组">
                                 <el-option label="全部" value="全部"></el-option>
                                <el-option label="酒水类" value="酒水类"></el-option>
                                <el-option label="水果类" value="水果类"></el-option>
                                <el-option label="电子类" value="电子类"></el-option>
                                <el-option label="食品类" value="食品类"></el-option>
                                <el-option label="生活用品" value="生活用品"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="flag = false">取 消</el-button>
                            <el-button type="primary" @click="saveEdit">确 定</el-button>
                        </div>
                    </el-dialog>

                    <!-- 分页组件 -->
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
                    <!-- 批量删除按钮 -->
                    <div style="margin-top: 20px">
                        <el-button type="danger" @click="batchDel">批量删除</el-button>
                        <el-button @click="cancelSelect()">取消选择</el-button>
                    </div>
                </div>
              
          
             
        </div>
    </el-card>
 </div>
</template>
<script>
// 引入moment 事件格式化插件
import moment from "moment";
// 引入qs模块 用于处理post方式产参数
import qs from "qs";

export default {
  data() {
    return {
      searchForm: {
        // 搜索表单
        cateName: "", // 分类名
        keyWord: "" // 关键字
      },
      total: 0, // 数据总条数
      currentPage: 1, // 当前页
      pageSize: 3, // 默认每页显示3条
      flag: false, // 控制修改模态框的显示和隐藏的变量
      goodstableData: [], // 用户账号列表的数据
      editId: "", // 保存要修改的数据的id
      seletedUser: [], // 保存选中的用户数据
      selectedData: [],
      // 和修改表单双向绑定的数据
      editForm: {
        barCode: "",
        goodsName: "",
        cateName: ""
      },
      // 验证的字段 修改表单的验证规则
      rules: {
        // 验证用户名
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }, // 非空验证
          { min: 3, max: 6, message: "长度必须 3 到 6 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证密码
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }, // 非空验证
          { min: 3, max: 6, message: "长度必须 3 到 6 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证用户组
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "change" } // 非空验证
        ]
      }
    };
  },
  //===============================生命周期的钩子函数，在页面加载完成之前触发
  created() {
    // 页面加载 请求数据
    this.getGoodsListByPage();
  },
  methods: {
    //==================================按照分页显示数据的函数
    getGoodsListByPage() {
      //收集当前页和当前页的条数
      let currentPage = this.currentPage;
      let pageSize = this.pageSize;
      // console.log(currentPage, pageSize);
      //发送请求给后端
      this.axios
        .get("http://127.0.0.1:666/goods/goodslistbypage", {
          params: {
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            cateName: this.searchForm.cateName,
            keyWord: this.searchForm.keyWord
          }
        })
        .then(response => {
          //   赋值给对应的变量
          let { total, data } = response.data;
          // alert("q233:"+total);
          this.total = total;
          this.goodstableData = data;
          // 如果当前页没有数据 且 排除第一页
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getGoodsListByPage();
          }
          // console.log(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //===================================分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoodsListByPage();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsListByPage();
    },

    search() {
      //把后台相应的数据渲染页面

      //调用分页列表
      this.getGoodsListByPage();
    },
    //=================================选中状态改变功能
    handleSelectionChange(val) {
      this.selectedData = val;
      // console.log(val);
    },
    //=================================批量删除
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
            .get(`http://127.0.0.1:666/goods/goodsbatchdel`, {
              params: { delId }
            })
            .then(response => {
              // 接收错误码和提示信息
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
                this.getGoodsListByPage();
              } else {
                this.$message.error(reason);
              }
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
      this.$refs.userlist.clearSelection();
    },
    //=================================修改编辑
    handleEdit(id) {
      //点击删除按钮，触发函数，发送带id的请求给后端
      this.editId = id;
      // alert("1")
      //获取id
      this.axios
        .get(`http://127.0.0.1:666/goods/goodsedit?id=${id}`)
        .then(response => {
          //点击修改就开启模态框
          this.flag = true;
          // console.log(response.data[0]);
          //接收后端返回的数据数据回填
          let rst = response.data[0];
          console.log(rst);
          this.editForm.barCode = rst.barCode;
          this.editForm.goodsName = rst.goodsName;
          this.editForm.cateName = rst.cateName;
          this.editId=rst.id;
          // console.log(response.data[0]);
     
          // this.getGoodsListByPage();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //=================================保存修改
    saveEdit() {
      //收集新数据和原来id
      let params = {
        barCode: this.editForm.barCode,
        goodsName: this.editForm.goodsName,
        cateName: this.editForm.cateName,
        editId: this.editId
      };
      console.log(params);
      //发送请求给后端
      this.axios
        .post(`http://127.0.0.1:666/goods/goodsaveedit`, qs.stringify(params))
        .then(response => {
          //接收后端发来的修改成功信息
          let { error_code, reason } = response.data;
          if (error_code === 0) {
            this.$message({
              type: "success",
              message: reason
            });
            this.flag = false;
            this.getGoodsListByPage();
          } else {
            this.$message.err(reason);
          }

          console.log(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //=====================================删除
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
            .get(`http://127.0.0.1:666/goods/goodsdel?id=${id}`)
            .then(response => {
              //接收后端返回的信息
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                this.$message({
                  type: "success",
                  message: reason
                });

                this.getGoodsListByPage();
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

  // 过滤器
  filters: {
    // 过滤器
    formatCdate(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  }
};
</script>
<style lang="less">
.goodsmanage {
  text-align: left;
  .el-card {
    .el-card__header {
      font-style: 20px;
      text-align: left;
      background-color: #f1f1f1;
      border: 1px solid #ccc;
      font-weight: 600;
    }
  }
}
</style>
