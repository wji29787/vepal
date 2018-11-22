<template>
    <div  class="extend-h-w suit-list">
         <el-container class="extend-h-w" direction = "vertical">
              <el-row class="sl-item-h100" type="flex" justify="center" align="middle">
                    <h2 class="suit-title">套装列表</h2>
               </el-row>
               <el-container class="extend-h-w" direction="vertical">
                   <el-row :gutter="10">
                        <el-col :lg ="4"  :md="6">
                            <el-select v-model="suitName" filterable clearable size="small">
                                <el-option v-for="(item, index) in selectSuitNameList"
                                        :key="index"
                                        :label="item.suitName"
                                        :value="item.suitName">
                                </el-option>
                            </el-select>
                        </el-col>  
                        <el-col :lg ="4"  :md="5">
                             <el-date-picker class = "extend-w"
                                            type="date"
                                            size="small"
                                            placeholder="套装时间"
                                            v-model="suitDate"
                                            value-format = "yyyy-MM-dd">
                            </el-date-picker>
                         </el-col> 
                         <el-col :lg="16" :md="3">
                             <el-button type="primary" size="small" @click="getlist()">搜索</el-button>
                             <el-button type="primary" size="small" @click="deleteAllRow()">批量删除</el-button>
                         </el-col>
                   </el-row>
                   <br/>
                   <el-row type="flex" class="extend-h-w">
                       <el-table
                            :data="list"
                            scope="scope"
                            border
                            class="table-view"
                            :row-style="tableRowStyle"
                            ref="multipleTable"
                            @selection-change="handleSelectionChange"
                            style="width: 100%">
                            <el-table-column
                            type="selection"
                            width="55">
                            </el-table-column>
                            <el-table-column
                            type="index" label="序号"
                            header-align="center" align="center"
                            width="80">
                            </el-table-column>
                             <el-table-column
                            prop="suitName"
                            label="套装名称"
                            width="380">
                            <template slot-scope="scope">
                                <el-popover el-popover trigger="hover" placement="top">
                                    套装名称 : {{scope.row.suitName}}
                                <span slot="reference">{{scope.row.suitName}}</span>
                                </el-popover>
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="suitDate"
                            label="套装日期"
                            width="180">
                            <template slot-scope="scope">
                                <el-popover el-popover trigger="hover" placement="top">
                                    套装名称 : {{scope.row.suitDate}}
                                <span slot="reference">{{scope.row.suitDate}}</span>
                                </el-popover>
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="suitDesc"
                            label="套装描述">
                            <template slot-scope="scope">
                                <el-popover el-popover trigger="hover" placement="top">
                                    套装名称 : {{scope.row.suitDesc}}
                                <span slot="reference">{{scope.row.suitDesc}}</span>
                                </el-popover>
                            </template>
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
const SUIT_NAME_SELECT = '/api/suit/suit/findAllSuitName';
    export default {
        data() {
            return {
                list:[],
                suitName:'',
                suitDate:'',
                multipleSelection:[],
                selectSuitNameList: []
            }
        },mounted() {
            this.getSuitNameList();
            this.getlist();
        },methods:{
            getSuitNameList () {
                let _data = {};
                this.$http.post(SUIT_NAME_SELECT, _data, res => {
                    this.$nextTick(() => {
                        this.selectSuitNameList = [];
                        if (res.data.code === 200) {
                            let listData = res.data.data.list;
                            if (listData && Array.isArray(listData) && listData.length) {
                                this.selectSuitNameList = listData;
                            }
                        }
                    });
                });
            },
            //批量选择
             handleSelectionChange(val) {
                this.multipleSelection = val;
             },
             getlist(){
                let _this = this;
                this.$http.post(
                    "api/suit/suit/findAllProjectPage",
                    {
                        suitName:_this.suitName,
                        suitDate:_this.suitDate
                    },
                    res => {
                        if(res.data.code === 200){
                            _this.list = res.data.data.list;
                        }
                    }
                );
            },
            /*单个删除*/
            deleteRow (obj) {
                var _this = this;
                this.$confirm('此操作将永久删除该套装, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var suitId = obj.row.suitId;
                    this.$http.post(
                        "api/suit/suit/delSuit",
                        {
                            suitId:suitId
                        },
                        res => {
                            if(res.data.code === 200){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                _this.getlist();
                            }
                        }
                    );
                
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
             /*批量删除*/
            deleteAllRow (obj) {
                var _this = this;
                 if(_this.multipleSelection.length > 0){
                    this.$confirm('此操作将永久删除该套装, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var suitId = '';
                    for(var i = 0; i < _this.multipleSelection.length; i++){
                        suitId += _this.multipleSelection[i].suitId + ',';
                    }
                    suitId = suitId.substring(0,suitId.length-1);
                    this.$http.post(
                        "api/suit/suit/delSuit",
                        {
                            suitId:suitId
                        },
                        res => {
                            if(res.data.code === 200){
                                _this.getlist();
                            }
                        }
                    );
                
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
                 }else{
                    this.$message({
                        message: '请选择删除的套装',
                        type: 'warning'
                    });
                }
            },
            editRow(obj){
                var suitId = obj.row.suitId;
                this.$router.push({
                    name: 'addSuit',
                    query: {
                        suitId: suitId
                    }
                })
            },
            tableRowStyle (row, rowIndex) {
                console.log(row, 'rowsss');
            }
        }
    }
</script>

<style scoped>
.suit-list {}
.suit-list .suit-title {
    position: fixed;
    font-size: 16px;
    color: white;
    right: 20px;
    top: 21px;
}
.suit-list .el-table::before {
    height: 0px;        
}
.sl-title {
  font-size: 20px;
  font-family: "PingFang SC", "微软雅黑";
  line-height: 0.6rem;
}
.el-table {
    overflow-y: auto;
}
</style>