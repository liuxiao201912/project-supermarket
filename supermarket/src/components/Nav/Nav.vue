<template>
    <!-- adside -->
  <el-menu
          background-color="#2d3a4b"
          text-color=#fff
          active-text-color="rgb(64, 158, 255)"
          router
          unique-opened
         :default-active="this.$route.path"
     >
      <!-- 1 -->
      <!-- 一级菜单导航 -->
      <el-submenu :index="(index+1)+''" v-for="(nav,index) in navMeau" :key="index">
        <template slot="title"><i :class="nav.icon"></i>{{nav.title}}</template>
          <!-- 二级菜单导航 -->
                <el-menu-item 
                :key="index" 
                 v-if="nav.children && nav.children.length"
                v-for="(subm,index) in nav.children"  
                :index="subm.path">
             {{subm.subTitle}}
               </el-menu-item>
      </el-submenu>
 </el-menu>
</template>
<script>
export default {
  data() {
    return {
      //权限菜单
      navMeau: [
        {
          title: "系统管理",
          icon: "el-icon-setting",
          children: [
           {
              subTitle: "系统管理",
                path: "/"
           }
          ]
        },
        {
          title: "账号管理",
          icon: "el-icon-menu",
          children: [
            {
                subTitle: "账号管理",
                path: "/accountmanage"
            },
            {
                subTitle: "添加账号",
                path: "/accountAdd" 
            },
            {
                subTitle: "密码修改",
                path: "/passwordModify"
              
            }
          ]
        },
        {
          title: "商品管理",
          icon: "el-icon-goods",
          children: [
            {
                subTitle: "商品管理",
                path: "/goodsmanage"   
            },
            {
                subTitle: "添加商品",
                path: "/goodsadd"
            }
          ]
        },
        {
          title: "销售管理",
          icon: "el-icon-date",
          children: [
            {
                subTitle: "销售统计",
                path: "/salesStatistics"     
            },
            {
                subTitle: "进货统计",
                path: "/incomingStatistics"
            }
          ]
        },
        {
          title: "库存管理",
          icon: "el-icon-upload",
          children: [
            {
                subTitle: "库存管理",
                path: "/stockmanage"              
            },
            {
                subTitle: "添加库存",
                path: "/addInventory"
              
            }
          ]
        }
      ]
    };
  }
};
</script>
<style lang="less">
.el-menu {
  border: none;
  .el-submenu {
    .el-submenu__title {
      color: #fff;
    }
  }
  .el-menu-item {
    color: #fff;
  }
}
</style>


