
<template>
    <div class="incomingStatistics">
      <!--卡片组件-->
     <el-card class="box-card">
            <div slot="header" class="clearfix info">
                <span>进货统计</span>
            </div>
          <div class="text item">
             <div id="main" style="height:400px"></div>
          </div>
          
        </el-card>
    </div>
</template>

<script>
//引入echarts

import echarts from 'echarts';
export default {
    data(){
        return{

        }
    },methods:{},
         //dom加载完时的一个生命周期
mounted(){
    //初始化dom，
    var myChart=echarts.init(document.getElementById("main"));
    //路径配置
       var option = {
                    tooltip: {
                        show: true
                    },
                    legend: {
                        data:['进货量']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ["1月","2月","3月","4月","5月","6月","7月","8月"]
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            "name":"进货量",
                            "type":"bar",
                            "data":[135, 68, 140, 220, 160, 130,85,60]
                        }
                    ]
                };
        
                // 为echarts对象加载数据 
                myChart.setOption(option); 
                //发送ajax给后端，获取一份数据
              let sales=[100,40,90,120,88,65,45,80];
                myChart.setOption();
            }
        


    }

</script>


<style lang="less">
.incomingStatistics {
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
      
      }
      
    
  }
}
</style>

