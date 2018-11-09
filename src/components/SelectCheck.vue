<template>
    <div>
       <el-row>
            <el-col :span="11">
                <div class="text-c">
                    产品版本列表
                </div>
                <!-- <span >产品版本列表</span> -->
                <el-input size = "small">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <div class = "selectBox-box">
                    <div class = "selectBox-l" v-for = "(item,index) in eidtlist"
                     :key = 'index'
                     @click = "getval(item,index)"
                     :class = "{'active':index === activeIndex}"
                    >{{item.name}}</div>
                    
                </div>
            </el-col> 
            <el-col :span="11" :offset = "2">
                <div class="text-c">产品版本列表</div>
                <el-input size = "small">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <div class = "selectBox-box">
                    <div class = "selectBox-r">
                        <el-checkbox-group v-model="checkedCities">
                            <el-checkbox class="selectBox-check" v-for="(item,index) in eidtlist" :label="index+1" :key="index">{{item.title}}</el-checkbox>
                         </el-checkbox-group>
                    </div>
                   
                </div>
            </el-col> 
        </el-row>
    </div>
</template>
<script>
export default {
    name:'sl-selectcheck',
    props:{
        checkObj:{
            type:Object,
            default:function(){
                return {
                    msg:'haha'
                }
            }
        }
    },
    data(){
        let n =1
        return {
            radioL:-1,
            eidtlist:new Array(10).fill({
                title:'你哈'+n++,
                name:'sdds'+n++,
                id:n++
            }),
            selectVal:'',
            checkedCities:[],
            activeIndex:-1
        }
    },
    mounted () {
        // this.value.msg = "ni hao ";
    },
    methods:{
        getval(item,index){
            this.activeIndex = index
            // this.checkObj = item
        }
    }
}
</script>
<style>
.text-c{
    margin-bottom: 10px;

}

</style>
<style scoped>
.selectBox-box{
    height:200px;
    border:1px solid #dcdfe6;
    border-top:none;
    padding-top:10px;
    overflow: auto;
}
.selectBox-box >div{
    /* box-sizing:border-box; */

  
}
.selectBox-box .selectBox-l{
    padding-left:10px;  
    margin-bottom: 10px;
}
.selectBox-box .selectBox-l:hover{
    color:#409EFF;
    cursor: pointer;
   
}
.selectBox-box .selectBox-r{
      height: 100%;
      padding-left:10px; 
}
.selectBox-check{
    display: block;
}
.selectBox-check + .selectBox-check {
    margin-left:0;
}
</style>

