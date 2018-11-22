<template>
    <div class="ppt-view">
        <h3 class="title search-title">
            <div>
               <el-date-picker
                v-model="startTime"
                size="small"
                type="date"
                placeholder="开始时间">
                </el-date-picker>
                <el-date-picker
                v-model="endTime"
                type="date"
                size="small"
                placeholder="结束时间">
                </el-date-picker>
                 <el-button icon="el-icon-search" size="small" circle @click="getlist"></el-button>
            </div>
        </h3>
        <div class="view">
            <div class="zhou">
                <span class="zhoutop">产品</span>
                <span class="zhoucenter">套装(时间)</span>
                <span class="zhoubottom">项目</span>
            </div>
        <ul class="viewbar">
            <li v-for="item in list" :key="item.suitId">
                <div class="linetop">
                     <ul>
                         <li :key="versionlist.versionId" :title="versionlist.productName+versionlist.verName" v-for="versionlist in item.versionVos">{{versionlist.productName}}{{versionlist.verName}}</li>
                     </ul>
                </div>
                <div class="line">
                    <b></b>
                    <span :title="item.suitName+formatDate(item.suitDate)">{{item.suitName}}（{{formatDate(item.suitDate)}}）</span>
                </div>
                <div class="linebottom">
                     <ul>
                         <li :title="projectVos.name" :key="projectVos.projectId" v-for="projectVos in item.projectVos">{{projectVos.name}}</li>
                     </ul>
                </div>
            </li>
        </ul>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import{ CHANGE_TITLE } from '../../model/store/storetypes.js'
    export default {
        data() {
            return {
                list:[],
                startTime:'',
                endTime:''
            }
        },mounted() {
            this[CHANGE_TITLE]('产品计划升级套装情况');
            this.getlist();
        },methods:{
            ...mapMutations([CHANGE_TITLE]),
            getlist(){
                var _this=this;
                this.$http.get(
                    "api/suit/view2/findAllSuitInfo",
                    {
                        startTime:_this.startTime,
                        endTime:_this.endTime
                    },
                    res => {
                        if (res.status === 200) {
                           _this.list=res.data.data.list;
                        }
                    }
                );
            },
            formatDate(cellValue){
                return this.$moment(cellValue).format("YYYY-MM-DD");
            }
        }
    }
</script>

<style scoped>
.ppt-view {}
 /*滚动条样式*/
.viewbar::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height:16px;
}
.viewbar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(32,62,92,0.4);
}
.viewbar::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(32,62,92,0.2);
}
.view {
    position: relative;
    margin: 70px;
    height: calc(100% - 180px);
    width:auto;
}
.title {
    font-size: 0.3rem;
    margin:0 0 0 0.8rem;
    font-family: 微软雅黑;
}
.search-title {
    height: 45px;
    line-height: 45px;
}
.title div.fr{
    margin-right: 3rem;
}
.zhou{
    position: absolute;
    height: 100%;
    border-left: 1px solid #b5d2ec;
    width:1rem;
}
.zhoutop{
    position: absolute;
    top:-0.3rem;
    left: -0.2rem;
    font-weight: 600;
    font-size: 0.2rem;
}
.zhoucenter{
    position: absolute;
    top:50%;
    left:-1rem;
    font-size: 0.2rem;
    font-weight: 600;
}
.zhoubottom{
    position: absolute;
    bottom:-0.3rem;
    left:-0.2rem;
    font-size: 0.2rem;
    font-weight: 600;
}
.viewbar{
   height: 100%;
   width:auto;
   overflow:hidden;
  white-space: nowrap;
  overflow-x:scroll;overflow-y:hidden;
  vertical-align:top;
  -webkit-overflow-scrolling : touch;

}
.viewbar > li{
    width: 3.5rem;
    height: 6.8rem;
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.line{
    border-top:1px solid #b5d2ec;
    height: 0.3rem;
    line-height: 0.3rem;
    margin:0.1rem 0;
    padding: 0 0.3rem;
    position: relative;
}
.line b{
    width:10px;
    height: 10px;
    background: #599dd6;
    border-radius: 50%;
    position: absolute;
    left: 0.5rem;
    top:-5px;
}
.line span{
    font-size: 0.2rem;
    font-weight: 600;
    color:#00ac50;
}
.linetop,.linebottom{
    padding:0 0.5rem;
    height: 3.4rem;
    position: relative;
}
.linetop ul{
    height: auto;
    position: absolute;
    bottom:10px;
}
.linebottom ul{
    height: auto;
    position: absolute;
    top:10px; 
}
.linetop li,.linebottom li{
    line-height: 0.26rem;
    font-size: 0.14rem;
    overflow: hidden;
    width:100%;
   
}
.linetop li:hover,.linebottom li:hover{
    animation: 5s wordsLoop linear normal;
}
    @keyframes wordsLoop {
        0% {
            transform: translateX(0px);
            -webkit-transform: translateX(0px);
        }
        100% {
            transform: translateX(-100%);
            -webkit-transform: translateX(-100%);
        }
    }

    @-webkit-keyframes wordsLoop {
        0% {
            transform: translateX(0px);
            -webkit-transform: translateX(0px);
        }
        100% {
            transform: translateX(-100%);
            -webkit-transform: translateX(-100%);
        }
    }
</style>