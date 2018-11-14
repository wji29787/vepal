<template>
    <div  class="extend-h-w">
         <el-container class="extend-h-w" direction = "vertical">
              <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                     <h2 class = "sl-title">套装列表</h2>
               </el-row>
               <el-container class="extend-h-w" direction = "vertical">
                   <el-row :gutter = "10">
                         <el-col :lg = "4"  :md= "6"><el-input placeholder="请输入套装名称"></el-input></el-col>  
                         <el-col :lg = "4"  :md= "5">
                             <el-date-picker
                                      class = "extend-w"
                                      type="date"
                                      placeholder="套装时间"
                                      value-format = "yyyy-MM-dd"
                                      >
                                    </el-date-picker>
                         </el-col> 
                   </el-row>
                   <br/>
                   <el-row type = "flex" class="extend-h-w">
                       <el-table
                            :data="tableData"
                            border
                            style="width: 100%">
                             <el-table-column
                            prop="number"
                            label="序号"
                            width="80">
                            </el-table-column>
                             <el-table-column
                            prop="name"
                            label="套装名称"
                            width="380">
                            </el-table-column>
                            <el-table-column
                            prop="date"
                            label="套装日期"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="miaoshu"
                            label="套装描述">
                            </el-table-column>
                            <el-table-column
                            label="操作"
                            width="200">
                            <template slot-scope="scope">
                                 <el-button
                                @click.native.prevent="deleteRow(scope.$index, tableData4)"
                                type="text"
                                size="small">
                                编辑
                                </el-button>
                                <el-button
                                @click.native.prevent="deleteRow(scope.$index, tableData4)"
                                type="text"
                                size="small">
                                删除
                                </el-button>
                            </template>
                            </el-table-column>
                        </el-table>
                   </el-row>
               </el-container>
         </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                 tableData: [{
                        number:'1',
                        date: '2016-05-02',
                        name: 'SP1',
                        miaoshu: '智能运维统一接口服务'
                        }, {
                        number:'2',
                        date: '2016-05-04',
                        name: 'SP2',
                        miaoshu: '智能运维统一接口服务'
                        }, {
                        number:'3',
                        date: '2016-05-01',
                        name: 'SP3',
                        miaoshu: '智能运维统一接口服务'
                        }, {
                        number:'4',
                        date: '2016-05-03',
                        name: 'SP4',
                        miaoshu: '智能运维统一接口服务'
                        }]
            }
        },
    }
</script>

<style scoped>
.sl-title {
  font-size: 20px;
  font-family: "PingFang SC", "微软雅黑";
  line-height: 0.6rem;
}
</style>