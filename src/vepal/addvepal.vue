<template>
    <div class="addvepal-layer">
        <h3 class="addvepal-layer-title">添加套装</h3>
        <ul>
            <li>
                <label>SP名称：</label>
                <input type="text" v-model="suitName" />
            </li>
             <li>
                <label>时间：</label>
                <input type="text"  v-model="suitDate"/>
            </li>
             <li>
                <label>详细信息：</label>
                <textarea v-model="suitDescription"></textarea>
            </li>
            <li class="clearfix">
                <label>产品：</label>
                <div  class="producttree">
                    <ul class="ztree" id="ztreedemo"></ul>
                </div>
            </li>
            <li>
                <a href="javascript:;" @click="save" class="addbtn">保存</a>
            </li>
        </ul>
    </div>
</template>

<script>
import 'ztree'
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import 'ztree/js/jquery.ztree.core.js'
import 'ztree/js/jquery.ztree.excheck.js'

    export default {
        data() {
            return {
                nodeData:[
                 	{ id:1, pId:0, name:"Pamir", open:true},
                    { id:11, pId:1, name:"5.5.5", open:true},
                    { id:111, pId:11, name:"TOP录播支持"},
                    { id:12, pId:1, name:"5.6.x", open:true},
                    { id:121, pId:12, name:"TOP音频录制"},
                    { id:2, pId:0, name:"Gis天眼", open:true},
                    { id:22, pId:2, name:"1.15.0", open:true},
                    { id:221, pId:22, name:"TOP会议支持", open:true},
                    { id:3, pId:0, name:"启明2视联终端", checked:true, open:true},
                    { id:2, pId:0, name:"PamirMobile"},
                ],
                setting:{
                    view:{
                        showIcon:false
                    },
                    check: {
                        enable: true,
                        chkboxType:{"Y":"ps","N":"ps"}
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    }
                },
                suitName:'', //SP名称
                suitDate:'', //时间
                suitDescription:'', //详细信息
                issueId:''  //产品
            }
        },
        mounted:function(){
            this.getzt();
        },methods:{
            getzt:function(){
                $.fn.zTree.init($("#ztreedemo"),this.setting,this.nodeData);
            },
            save:function(){
                var _this=this;

                //获取ztree被选中节点的值
                // var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
                // nodes=treeObj.getCheckedNodes(true),
                // sueIdstr="";
                // for(var i=0;i<nodes.length;i++){
                //     sueIdstr+=nodes[i].id + ",";
                // }
                // _this.issueId=sueIdstr;

                //请求保存接口
                this.$http.get('http://192.168.95.74:8085/suit/addSuit',{
                        suitName:_this.suitName,
                        suitDate:_this.suitDate,
                        suitDescription:_this.suitDescription, 
                        issueId:2
                    },(res)=>{
                        if(res.status===200){
                            if(callback){
                                callback(res.data)
                                alert("保存成功");
                            }
                        }else{
                            console.log(res) 
                        }
                })
            }
        }
    }
</script>

<style scoped>
.addvepal-layer{
    width:6rem;
    height: 6rem;
    margin:2rem auto;
    font-family:微软雅黑;
    box-shadow: 0 0 5px 1px #ccc;
    font-size: 0.16rem;
}
.addvepal-layer-title{
    width: 100%;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    font-size: 0.2rem;
    background: rgba(74, 163, 222, 1);
    color:#fff;
}

.addvepal-layer ul li{
    line-height: 0.5rem;
    margin-top:0.1rem;
    height: auto;
    width: 6rem;
}
.addvepal-layer ul li label{
    float: left;
    width:1.2rem;
    text-align: right;
}
.addvepal-layer ul li input{
    height: 0.3rem;
    line-height: 0.3rem;
    width:4rem;
    padding:0 0.1rem;
    border:1px solid #ccc;
}
 .addvepal-layer ul li textarea{
    height: 0.8rem;
    width:4rem;
    resize: none;
    padding:0.1rem;
    border:1px solid #ccc;
 }
 .producttree{
     width:4.2rem;
     height: 2rem;
     background: #f5f5f5;
     float: left;
     overflow-y:auto;
 }
 .addbtn{
     background: rgba(74, 163, 222, 1);
     width:1rem;
     text-align: center;
     height: 0.3rem;
     line-height: 0.3rem;
     display: block;
     color:#fff;
     margin-left:2.5rem;
 }
</style>