<template>
    <div  class="extend-h-w">
         <el-container class="extend-h-w" direction = "vertical">
              <el-row class ="sl-item-h100" type = "flex" justify = "center" align ="middle">
                     <h2 class = "sl-title">套装列表</h2>
               </el-row>
               <el-container class="extend-h-w" direction = "vertical">
                   <el-row :gutter = "10">
                         <el-col :lg = "4"  :md= "6"><el-input v-model="suitName" placeholder="请输入套装名称"></el-input></el-col>  
                         <el-col :lg = "4"  :md= "5">
                             <el-date-picker
                                      class = "extend-w"
                                      type="date"
                                      placeholder="套装时间"
                                      v-model="suitDate"
                                      value-format = "yyyy-MM-dd"
                                      >
                                    </el-date-picker>
                         </el-col> 
                         <el-col :lg = "4"  :md= "3">
                             <el-button icon="el-icon-search" @click="getlist()" circle></el-button>
                         </el-col>
                   </el-row>
                   <br/>
                   <el-row type = "flex" class="extend-h-w">
                       <el-table
                            :data="list"
                            scope="scope"
                            border
                            style="width: 100%">
                             <el-table-column
                             type="index" label="序号"
                             header-align="center" align="center"
                            width="80">
                            </el-table-column>
                             <el-table-column
                            prop="suitName"
                            label="套装名称"
                            width="380">
                            </el-table-column>
                            <el-table-column
                            prop="suitDate"
                            label="套装日期"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="suitDesc"
                            label="套装描述">
                            </el-table-column>
                            <el-table-column
                            label="操作"
                            width="200">
                            <template slot-scope="suitId">
                                 <el-button
                                @click.native.prevent="editRow(suitId)"
                                type="text"
                                size="small">
                                编辑
                                </el-button>
                                <el-button
                                @click.native.prevent="deleteRow(suitId)"
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
                list:[],
                suitName:'',
                suitDate:''
            }
        },mounted() {
            this.getlist();
        },methods:{
             getlist(){
                var _this=this;
                this.$http.post(
                    "api/suit/suit/findAllProjectPage",
                    {
                        suitName:_this.suitName,
                        suitDate:_this.suitDate
                    },
                    res => {
                        if(res.data.code==200){
                            _this.list=res.data.data.list;
                        }
                    }
                );
            },
            deleteRow(obj){
                var _this=this;
                var suitId=obj.row.suitId;
                this.$http.post(
                    "api/suit/suit/delSuit",
                    {
                        suitId:suitId
                    },
                    res => {
                        if(res.data.code==200){
                            alert("删除成功");
                            _this.getlist();
                        }
                    }
                );
            },
            editRow(obj){
                var suitId=obj.row.suitId;
                this.$router.push({
                    path: '/SuitEdit',
                    query: {
                        suitId: suitId
                    }
                })
            }
        }
    }
</script>

<style scoped>
.sl-title {
  font-size: 20px;
  font-family: "PingFang SC", "微软雅黑";
  line-height: 0.6rem;
}
</style>