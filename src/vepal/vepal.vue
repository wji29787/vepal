<template>
  <div>
    <el-button type="text" class="elbutton"  @click="getzt">新增套装</el-button>
    <span class="version">套装展示<strong>v1.0.1</strong></span>
    <el-dialog 
      title="添加套装"
      :visible="dialogVisible" width="50%"
      @close="dialogVisible = false"
      >
          <div class="addvepal-layer">
            <ul>
                <li>
                    <label>SP名称：</label>
                    <el-input v-model="suitName" class="elinput" placeholder="请输入内容"></el-input>
                </li>
                <li>
                    <label>时间：</label>
                    <div class="block">
                        <el-date-picker
                        v-model="suitDate"
                        type="date"
                        placeholder="选择日期"
                        class="suitDate"
                        >
                        </el-date-picker>
                    </div>
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
            </ul>
        </div>
    
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
    
   <!-- <el-scrollbar>
      
    </el-scrollbar> -->
    <div class = "dinner">
      <div id="container">
      </div>
    </div> 
    <!-- editproject -->
    <el-dialog
      :visible="projectEdit.visible"
      @close="projectEdit.visible=false"
      :title = "projectEdit.title"
      center
      width = "6rem"
      >
      <el-container direction="vertical">
         <el-row  class = "edit-item" :gutter = 20
          >
            <el-col class="edit-item-label" :span = "6">项目名称:</el-col>
            <el-col  :span = "18"><el-input size="small" v-model="projectEdit.projectName"></el-input></el-col>      
        </el-row>
          <el-row  class = "edit-item" :gutter = 20
          >
            <el-col class="edit-item-label" :span = "6">项目优先级:</el-col>
            <el-col :span = "18">
              <el-select v-model="projectEdit.priorityID" placeholder="请选择" size="small" class = "edit-select">
                <el-option
                  v-for="item in projectEdit.data"
                  :key="item.priorityID"
                  :label="item.priorityName"
                  :value="item.priorityID">
                </el-option>
              </el-select>
            </el-col>      
          </el-row>
      </el-container>
      <div slot="footer" class ="sp-footer">
        <el-button @click="projectEdit.visible=false">取 消</el-button>
        <el-button type="primary" @click="editProjectSave">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <el-input ref = "editText" v-model="input" class = "edit-text"  @blur = "saveText" @change="handleText" placeholder="请输入内容"></el-input> -->
    <!-- <input type="text" class = "edit-text"/> -->
    <!-- <sl-dialog :value="showProject" :offset="offsetProject" :position="'absolute'" class="">
       dfsdfsdfsf
    </sl-dialog> -->
    <!-- <sl-dialog :value="showSp" :offset="offsetSp" :position="'absolute'">
      <div class="dialogStyle"> {{deilSp.suitDescription}}</div>
    </sl-dialog> -->
    <!-- <sl-dialog :value="showProduct" :offset="offsetProduct" :position="'absolute'">
       <div  class="dialogStyle">
          <div
             v-for = "(item, index) in deilProduct"
             :key = "item.actionbody"
          >
            <p>{{item.actionbody}}</p>
          </div>
       </div>
    </sl-dialog> -->
    <!-- project-dialog -->
    <el-dialog  
      :visible="projectDetil.visible"
      @close="projectDetil.visible=false"
      :title = "projectDetil.title"
      center
      width = "6rem"
      >
      <el-container direction="vertical">
          <el-row  class = "sp-item" :gutter = 20
            v-for = "(item, $index) in projectDetil.data"
            :key ="$index"
          >
            <el-col class="sp-item-label" :span = "6">{{item.name}}:</el-col>
            <el-col :class = "{'dialog-item-val' : $index ===3}" :span = "18">{{item.val}}</el-col>
          </el-row>
        </el-container>
    </el-dialog>
    <!-- sp-dialog -->
    <el-dialog 
      :visible="spDetil.visible"
      @close="spDetil.visible=false"
      :title = "spDetil.title"
      center
      width = "6rem"
      >
        <el-container direction="vertical">
          <el-row  class = "sp-item" :gutter = 20
            v-for = "(item, $index) in spDetil.data"
            :key ="$index"
          >
            <el-col class="sp-item-label" :span = "6">{{item.name}}:</el-col>
            <el-col class="sp-item-val" :class = "{'dialog-item-val' : $index ===4}" :span = "18">{{item.val}}</el-col>
          </el-row>
        </el-container>
    </el-dialog>
    <!-- product-dialog -->
    <el-dialog
      :visible="productDetil.visible"
      @close="productDetil.visible=false"
      :title = "productDetil.title"
      center
      width = "8rem"
      >
      <el-container direction="vertical">
          <el-row></el-row>
          <el-row  class = "sp-item" :gutter = 20
            v-for = "(item, $index) in productDetil.data"
            :key ="$index"
          >
            <el-col class="sp-item-label" :span = "6">{{item.name}}:</el-col>
            <el-col class="sp-item-val" :class = "{'dialog-item-val' : $index ===3 || $index ===4}" :span = "18">
              <template v-if="$index === 4">
                  <div 
                    v-for = "(kval, $l) in item.val"
                     :key="kval.id">
                     {{($l+1)+': '+kval.actionbody}}
                  </div> 
              </template>
              <template v-else> 
                  {{item.val}}
             </template>
              
            </el-col>
          </el-row>
          <br>
          
          <hr>
          <br>
          <el-container direction="vertical">
            <el-col :span = "24">历史版本</el-col>
            <el-table 
             :data="productDetil.spData"
              max-height="250"
              width="100%"
              :show-header = "false"
             >
              <el-table-column prop="sp" label="版本" width="100">
              </el-table-column>
              <el-table-column prop="fileSize" label="文件大小fileSize" width="100">
              </el-table-column>
              <el-table-column  label="更新记录">
                <template slot-scope="scope">
                    <el-button type="text" @click="productClick(scope.row)" size="small">查看记录</el-button>
                </template>
              </el-table-column>
              <el-table-column label="下载">
                <template slot-scope="scope">
                    <el-button type="text" @click="productDown(scope.row)" size="small">下载</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="data" label="时间">
              </el-table-column>
            </el-table>
          </el-container>
      </el-container>

      <el-dialog
          width="30%"
          :title = "productDetil.inner.title"
          :visible.sync = "productDetil.inner.visible"
          @close = "projectDetil.inner.visible=false"
          append-to-body>
          <el-container class="dialog-item-val sp-item" direction="vertical">
              <el-col 
                v-for="(t,k) in productDetil.inner.data"
                :key="k"
              >
              {{t.body}}
              </el-col>
          </el-container>
          
      </el-dialog>
    </el-dialog>
  </div>

</template>

<script>
import 'ztree'
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import 'ztree/js/jquery.ztree.core.js'
import 'ztree/js/jquery.ztree.excheck.js'
import zrender from "zrender";
import * as util from '../assets/js/util.js'
import  {
  rect,
  rem,
  line,
  ellipse,
  circle,
  textFormat,
  arc,
  text,
  image
} from "../assets/js/util.js";
let DEFAULT = {
  hInterval: rem(20), // 上下间隔
  width: rem(200),
  height: rem(70),
  verH: rem(80), //套装盒高度
  groupWidth: rem(200 * 3 + 260 * 2), //包装盒宽
  fontSize: rem(18),
  xInterval: rem(260),
  lineColor: "#cacaca",
  lineHoverColor: "red",
  mCirclefontSize: rem(15),
  mCirclefontColor: "",
  mCircleFillColor: "#F5F5F5",
  imageW:rem(30),
  imageH:rem(30)
};
let tlData = [
  {
    name: "项目名称",
    bgColor: "rgba(74, 163, 222, 1)",
    color: "#fff"
  },
  {
    name: "套装",
    bgColor: "rgba(119, 141, 252, 1)",
    color: "#fff"
  },
  {
    name: "相关版本",
    bgColor: "rgba(131, 220, 220, 1)",
    color: "#fff"
  }
];


export default {
  name: "Dinner",
  data() {
    const item = {
        sp: 'pamir',
        fileSize: '1220MB',
        upRecord: '更新记录',
        down:'下载',
        data:'2018/12/15'
      };

    return {
      zr: "",
      w: 0,
      h: 0,
      groupH: rem(50), //元素组起始位置
      groupArr: [],
      list: [],
      dragBox: null, // 显示框元素
      tipShow: false,
      bscroll:true, // 是否加载
      pageNo:1,
      pageSize:10, // 初始每页数据数
      lastPage:false, //最后一页
      // 项目详情
      projectDetil:{
        title:'项目详细',
        visible:false,
        data:[{
          name:'项目名称',
          val:'',
          type:'projectName'
        },{
          name:'创建时间',
          val:'',
          type:'createDate'
        },{
          name:'相关文档',
          val:'',
          type:'projectId'
        },{
          name:'需求描述',
          val:'',
          type:'description'
        }]
      },
      // showProject: false,
      // offsetProject: [0, 0],
      // deilProject: {},
      //产品详情
      productDetil:{
        title:'产品详细',
        visible:false,
        data:[{
          name:'产品名称',
          val:'',
          type:'productName'
        },{
          name:'版本',
          val:'',
          type:'productVersion'
        },{
          name:'版本研发负责人',
          val:'',
          type:'productRDPerson'
        },{
          name:'描述',
          val:'',
          type:'productDesc'
        },{
          name:'备注',
          val:'',
          type:'remark'
        }],
        spData: Array(20).fill(item),
        inner:{
           visible:false,
           title:'更新记录',
           data:Array(20).fill({body:'sdfsdfsdfsdfsdfsdfsdf'})
        }
      },
      // showProduct: false,
      // offsetProduct: [0, 0],
      // deilProduct: [],
      //套装详情
      spDetil:{
         title:'套装详细',
         visible:false,
         data:[{
           name:'套装名称',
           val:'',
           type:'suitName'
         },{
            name:'发布时间',
            val:'',
            type:'suitDate'
         },{
            name:'联调负责人',
            val:'',
            type:'suitAdjustingPerson'
         },{
            name:'测试负责人',
            val:'',
            type:'suitsuitTestPersonName'
         },{
            name:'功能详情',
            val:'',
            type:'suitDescription'
         }]    
      },
      // 项目编辑
      projectEdit:{
        title:'项目编辑',
        visible:false,
        data:[],
        projectName:'',
        priorityID:'',
        projectId:'',
        curtPriorityEl:null,
        curtEl:null,
        index:-1,
      },
      // showSp:false,
      // offsetSp:[0,0],
      dialogVisible: false,
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
      issueId:'',//产品
      deilSp: { suitDescription: "sdsdsd" }
    };
  },
  created() {
    // this.$slMsg.show('sdfsdf')
  },
  watch: {
    // offset
  },
  mounted() {
    this.render();
    this.dragTextBox();
    this.getData();
    let that = this;
    let timer = null;
    window.addEventListener("resize", function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        that.resetData();
        that.init(that.list);
      }, 300);
    });
    this.fnScroll()
    
  },
  methods: {
    handleText(val){
      // console.log(this.input);
      console.log(val)
      // this.curtEl.attr({
      //   style:{
      //     text :val
      //   }
      // })
    },
    saveText(){
      this.curtEl.attr({
        style:{
          text : textFormat(this.input, 18, 38)
        }
      })
    },
    /**获取ztree数据并且渲染**/
    getzt(){
      var _this=this;
        _this.dialogVisible=true;
        setTimeout(()=>{
           this.$http.get('/api/product/findAllProduct',(res)=>{
                    if(res.status===200){
                          var nodeList=[];
                          // { id:1, pId:0, name:"Pamir", open:true},
                          // { id:11, pId:1, name:"5.5.5", open:true},
                           var productslist=res.data.data.products;
                            for(var i=0;i<productslist.length;i++){
                                var obj={"id":productslist[i].productId,pId:0,"name":productslist[i].productName + productslist[i].productVersion||'',open:true};
                                nodeList.push(obj);
                                if(productslist[i].projectList.length>0){
                                    var cplist=productslist[i].projectList;
                                    for(var j=0;j<cplist.length;j++){
                                        var obj={"id":cplist[j].projectId,pId:productslist[i].productId,"name":cplist[j].projectName,open:true};
                                        nodeList.push(obj);
                                    }
                                }
                            }
                        _this.nodeData=nodeList;
                        $.fn.zTree.init($("#ztreedemo"),_this.setting,_this.nodeData);
                    }else{
                        console.log(res) 
                    }
            })
         
        },100)
    },
    save(){
      var _this=this;
      //获取ztree被选中节点的值
      var treeObj=$.fn.zTree.getZTreeObj("ztreedemo"),
      nodes=treeObj.getCheckedNodes(true),
      sueIdstr="";
      for(var i=0;i<nodes.length;i++){
          if(nodes[i].pId==0||nodes[i].pId==null){
             sueIdstr+=nodes[i].id + ",";
          }
      }
      if(sueIdstr.length>0){
          _this.issueId=sueIdstr.substring(0,sueIdstr.length-1);
      }
      if(_this.suitName.length==0){
          alert("SP名称不能为空");
          return;
      }
      if(_this.suitDate.length==0){
          alert("套装日期不能为空");
          return;
      }
      if(_this.suitDescription.length==0){
          alert("套装描述不能为空");
          return;
      }
      if(_this.issueId.length==0){
          alert("请选择套装产品");
          return;
      }
      //请求保存接口
      this.$http.get('/api/suit/addSuit',{
              suitName:_this.suitName,
              suitDate:_this.suitDate,
              suitDescription:_this.suitDescription, 
              issueId:_this.issueId
          },(res)=>{
              if(res.status===200){
                      alert("保存成功");
              }else{
                  console.log(res) 
              }
      })
      _this.dialogVisible = false;
  },
    render() {
      let container = document.getElementById("container");
      this.zr = zrender.init(container);
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
    },
    resetData() {
      this.groupH = rem(50);
      this.groupArr = [];
      this.dragBox = null;
      this.bscroll = true // 是否加载
      this.pageNo = 1
      //this.pageSize = 10 // 初始每页数据数
      this.lastPage = false //最后一页
      this.zr.clear();
      this.zr.resize();
      this.w = this.zr.getWidth();
      this.h = this.zr.getHeight();
      DEFAULT = {
        hInterval: rem(20), // 上下间隔
        width: rem(200),
        height: rem(70),
        verH: rem(80), //套装盒高度
        groupWidth: rem(200 * 3 + 260 * 2), //包装盒宽
        fontSize: rem(18),
        xInterval: rem(260),
        lineColor: "#cacaca",
        lineHoverColor: "red",
        mCirclefontSize: rem(15),
        mCirclefontColor: "",
        mCircleFillColor: "#F5F5F5",
        imageW:rem(30),
        imageH:rem(30)
      };
    },
    getData(pageNo) {
      if(!this.bscroll){
        return 
      } 
      this.bscroll =false
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$http.post("/api/suit/findAllSuitInfo",{
        pageNo:pageNo?pageNo:1,
        pageSize:this.pageSize
      },res => {
        loading.close()
        setTimeout(()=>{
               this.bscroll =true 
            },350)
        if (res.status === 200) {
          if (res.data.code === 200) {
           
            if(res.data.data.suits && res.data.data.suits.length <this.pageSize){
              this.lastPage =true;
            }
            if(this.list.length===0){
                this.list = res.data.data.suits;
            }else{
             this.list= this.list.concat(res.data.data.suits)
            }
            
            this.groupPosition(res.data.data.suits);
            
          } else {
            if(pageNo >1){
              this.pageNo -= 1
            }
            this.$message(res.data.msg);
          }
        } else {
          if(pageNo >1){
              this.pageNo -= 1
          }
          this.$message(res.status);
        }
        
      });
    },
    init(data) {
      // console.log(data)
      // this.titleGroup();
      this.groupPosition(data);
      this.dragTextBox();
    },
    titleGroup: function() {
      // 盒子宽
      let widthBase = rem(150);
      // 盒子高
      let heightBase = rem(50);
      // 水平间隔
      let winterval = rem(260);
      // 垂直间隔
      let hInterval = rem(50);
      // 盒子 圆角 r
      let r = rem(10);
      // 文字size
      let fontSize = rem(20);
      // 配置项
      let rectTleOpt = {
        width: widthBase,
        height: heightBase,
        r: r
      };
      // 标题包围盒
      let group = new zrender.Group();
      tlData.forEach((t, i) => {
        let rectEl = rect({
          shape: {
            x: i == 0 ? 0 : (widthBase + winterval) * i,
            y: 0,
            ...rectTleOpt
          },
          style: {
            fill: t.bgColor,
            text: t.name,
            textFill: "#fff",
            fontSize: fontSize
          }
        });
        group.add(rectEl);
      });
      //获取包围盒
      var rectGroup = group.getBoundingRect();
      let position = [(this.w - rectGroup.width) / 2, this.groupH];
      // 包围盒距离顶部得高度
      this.groupH += rectGroup.height + hInterval;
      group.position = position;
      this.zr.add(group);
    },
    cteateRectL(data, positionObj) {
      if (!data.length) return;
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = DEFAULT.xInterval;
      // line x轴
      let lineLX = DEFAULT.width;
      //项目盒子基准尺寸
      let rectLOpt = {
        width: DEFAULT.width,
        height: DEFAULT.height,
        r: rem(10)
      };
      // 包围盒总高度
      let group = new zrender.Group();
      if (data.length == 1) {
        let g = new zrender.Group();
        
        let rectEl = rect({
          shape: {
            x: 0,
            y: (groupH - DEFAULT.height) / 2,
            ...rectLOpt
          },
          style: {
            fill: tlData[0].bgColor,
            text: textFormat(data[0].projectName, 18, 38),
            textFill: tlData[0].color,
            fontSize: DEFAULT.fontSize
            // textLineHeight:DEFAULT.fontSize
          },
          projectId: data[0].projectId
        });
        let lineEl = line({
          shape: {
            x1: lineLX,
            y1: groupH / 2,
            x2: lineLX + xInterval,
            y2: groupH / 2
          },
          style: {
            fill: DEFAULT.lineColor,
            stroke: DEFAULT.lineColor
          }
        });
        let imageEl = image({
          style:{
            image:require('./edit.png'),
            x:DEFAULT.width - DEFAULT.imageW + 3,
            y:(groupH - DEFAULT.imageH) / 2,
            width:DEFAULT.imageW,
            height:DEFAULT.imageH
          }
        })
        imageEl.hide()
        g.add(rectEl)
        g.add(lineEl)
        g.add(imageEl)
        
        let textGroup = this.createText(data[0]);
        textGroup.position = [
          -((DEFAULT.width * 2) / 3 + DEFAULT.height / 2),
          (groupH - DEFAULT.height) / 2
        ];
        g.add(textGroup);
        group.add(g);
      } else {
        data.forEach((t, i) => {
          let g = new zrender.Group();
          let rectEl = rect({
            shape: {
              x: 0,
              y: (DEFAULT.height + positionObj.L) * i,
              ...rectLOpt
            },
            style: {
              fill: tlData[0].bgColor,
              text: textFormat(t.projectName, 18, 38),
              textFill: tlData[0].color,
              fontSize: DEFAULT.fontSize
              // textLineHeight:30
            },
            projectId: t.projectId
          });
          let lineEl = line({
            shape: {
              x1: lineLX,
              y1: DEFAULT.height / 2 + (DEFAULT.height + positionObj.L) * i,
              x2: lineLX + xInterval,
              y2: groupH / 2
            },
            style: {
              fill: DEFAULT.lineColor,
              stroke: DEFAULT.lineColor
            }
          });
          let imageEl = image({
            style:{
              image:require('./edit.png'),
              x:DEFAULT.width - DEFAULT.imageW + 3,
              y:(DEFAULT.height -DEFAULT.imageH) / 2 + (DEFAULT.height + positionObj.L) * i,
              width:DEFAULT.imageW,
              height:DEFAULT.imageH 
            }
          })
          imageEl.hide()
          g.add(rectEl);
          g.add(lineEl);
          g.add(imageEl);
          let textGroup = this.createText(t);
          textGroup.position = [
            -((DEFAULT.width * 2) / 3 + DEFAULT.height / 2),
            (DEFAULT.height + positionObj.L) * i
          ];
          g.add(textGroup);

          group.add(g);
        });
      }

      return group;
    },
    cteateRectR(data, positionObj) {
      if (!data.length) return;
      //  包围盒子得高度
      let groupH = positionObj.H;
      // 水平间隔
      let xInterval = DEFAULT.xInterval;
      // line x轴
      let lineRX = DEFAULT.width * 2 + DEFAULT.xInterval;
      //项目盒子基准尺寸
      let rectLOpt = {
        width: DEFAULT.width,
        height: DEFAULT.height,
        r: rem(10)
      };
      // 包围盒总高度
      let group = new zrender.Group();
      if (data.length == 1) {
        let g = new zrender.Group();
        let rectEl = rect({
          shape: {
            x: DEFAULT.groupWidth - DEFAULT.width,
            y: (groupH - DEFAULT.height) / 2,
            ...rectLOpt
          },
          style: {
            fill: tlData[2].bgColor,
            text: textFormat(`${data[0].productName+' '+data[0].productVersion}`, 20, 40),
            textFill: tlData[2].color,
            fontSize: DEFAULT.fontSize
          },
          productId: data[0].productId
        });
        let lineEl = line({
          shape: {
            x1: lineRX,
            y1: groupH / 2,
            x2: lineRX + xInterval,
            y2: groupH / 2
          },
          style: {
            fill: DEFAULT.lineColor,
            stroke: DEFAULT.lineColor
          }
        });
        g.add(rectEl);
        g.add(lineEl);
        group.add(g);
      } else {
        data.forEach((t, i) => {
          let g = new zrender.Group();
          let rectEl = rect({
            shape: {
              x: DEFAULT.groupWidth - DEFAULT.width,
              y: (DEFAULT.height + positionObj.R) * i,
              ...rectLOpt
            },
            style: {
              fill: tlData[2].bgColor,
              text: textFormat(`${t.productName+' '+t.productVersion}`, 20, 40),
              textFill: tlData[2].color,
              fontSize: DEFAULT.fontSize
            },
            productId: t.productId
          });
          let lineEl = line({
            shape: {
              x1: lineRX,
              y1: groupH / 2,
              x2: lineRX + xInterval,
              y2: DEFAULT.height / 2 + (DEFAULT.height + positionObj.R) * i
            },
            style: {
              fill: DEFAULT.lineColor,
              stroke: DEFAULT.lineColor
            }
          });
          g.add(rectEl);
          g.add(lineEl);
          group.add(g);
        });
      }

      return group;
    },
    cteateRectM(data, positionObj) {
      let group = new zrender.Group();
      group.attr({
        shape: {
          width: DEFAULT.width,
          height: DEFAULT.verH
        },
        position: [
          (DEFAULT.groupWidth - DEFAULT.width) / 2,
          (positionObj.H - DEFAULT.verH) / 2
        ]
      });
      let ellipseEl = ellipse({
        shape: {
          cx: DEFAULT.width / 2,
          cy: DEFAULT.verH / 2,
          rx: DEFAULT.width / 2,
          ry: DEFAULT.verH / 2
        },
        style: {
          fill: tlData[1].bgColor,
          text: `${textFormat(data.suitName, 12, 24)}${
            data.suitDate ? "\n" + data.suitDate : ""
          }`,
          // text:'{a1|haha}\n{a2|sdfdf}',
          textFill: tlData[1].color,
          fontSize: DEFAULT.fontSize,
          rich:{
            a1:{
              textFill: 'rgb(199,86,83)',
              textLineHeight:10,
              textBorderColor:'#000'
            },
            a2:{
              textFill: 'yellow',
              textPadding:3
            }
          }
        },
        name: "PM"
      });
      let circleElL = circle({
        shape: {
          cx: DEFAULT.width / 5 / 2,
          cy: DEFAULT.verH / 2,
          r: DEFAULT.width / 5 / 2
        },
        style: {
          fill: DEFAULT.mCircleFillColor,
          text: "项目",
          fontSize: DEFAULT.mCirclefontSize
        },
        name: "PL"
      });
      let circleElR = circle({
        shape: {
          cx: DEFAULT.width - DEFAULT.width / 5 / 2,
          cy: DEFAULT.verH / 2,
          r: DEFAULT.width / 5 / 2
        },
        style: {
          fill: DEFAULT.mCircleFillColor,
          text: "版本",
          fontSize: DEFAULT.mCirclefontSize
        },
        name: "PR"
      });
      group.add(ellipseEl);
      group.add(circleElL);
      group.add(circleElR);
      return group;
    },
    /**
     * 每组元素的占用的高度
     * 左右间隔
     * return {
     * h ：元素盒的高度
     * L:左边间隔
     * R:右边间隔
     * }
     */
    getBaseposition(data) {
      let project = data.projectList;
      let product = data.productList;
      let lenPjt = project ? project.length : 0; // 左边
      let lenPdt = product ? product.length : 0; // 右边
      let base = {};
      //左右元素都小于2时 以中间的元素高度为盒子高度
      if (lenPjt < 2 && lenPdt < 2) {
        base.H = DEFAULT.verH; // 包围盒高度
        base.L = 0; // 左元素 高间距
        base.R = 0; // 右元素 高间距
      } else {
        //
        if (lenPjt === lenPdt) {
          base.H = DEFAULT.height * lenPjt + (lenPjt - 1) * DEFAULT.hInterval;
          base.L = base.R = DEFAULT.hInterval;
        } else if (lenPjt > lenPdt) {
          base.H = DEFAULT.height * lenPjt + (lenPjt - 1) * DEFAULT.hInterval;
          base.L = DEFAULT.hInterval;
          if (lenPdt < 2) {
            base.R = 0; //没有元素
          } else {
            base.R = (base.H - DEFAULT.height * lenPdt) / (lenPdt - 1);
          }
        } else if (lenPjt < lenPdt) {
          base.H = DEFAULT.height * lenPdt + (lenPdt - 1) * DEFAULT.hInterval;
          base.R = DEFAULT.hInterval;
          if (lenPjt < 2) {
            base.L = 0; //没有元素
          } else {
            base.L = (base.H - DEFAULT.height * lenPjt) / (lenPjt - 1);
          }
        }
      }
      return base;
    },
    //包围盒定位
    groupPosition(data) {
      let that = this;
      // 组得初始高度
      // let groupArr = [];
      let groupH = this.groupH;
      data.forEach((t, i) => {
        let project = t.projectList;
        let product = t.productList;
        let base = this.getBaseposition(t);
        let group = new zrender.Group();
        group.attr({
          shape: {
            width: DEFAULT.groupWidth,
            height: base.H
          },
          position: [(that.w - DEFAULT.groupWidth) / 2, groupH]
        });
        groupH += DEFAULT.hInterval + base.H;
        let shapeL = {
          data: project
        };
        let groupL = that.cteateRectL(project, base);
        let groupR = that.cteateRectR(product, base);
        let groupM = that.cteateRectM(t, base);
        // 遍历 各子节点元素 做业务处理
        groupM.eachChild((k, i) => {
          let flag = true;
          k.on("click", e =>{
            if (k.name == "PL") {
              if(groupL){
                   flag ? groupL.hide() : groupL.show();
                   flag = !flag;
              }
              // this.showProject=false
            } else if (k.name == "PR") {
              if(groupR){
                flag ? groupR.hide() : groupR.show();
                flag = !flag;
                // this.showProduct=false
              }

            } else if (k.name == "PM") {
              // let position=[e.target.shape.rx,e.target.shape.ry]
              // // 鼠标相对文档偏移
              // let offset = [e.target.transform[4], e.target.transform[5]];
              // //元素相对文档偏移
              // let p = [offset[0], offset[1]];
              // let poffset = [
              //   `${parseInt(p[0] + DEFAULT.width)}px`,
              //   `${parseInt(p[1] + DEFAULT.verH / 2)}px`
              // ];
              // if (!t.suitDescription) {
              //   return;
              // }
              // if (that.showSp) {
              //   if (that.offsetSp[1] === poffset[1]) {
              //     that.showSp = false;
              //   } else {
              //     that.deilSp.suitDescription = t.suitDescription;
              //     that.offsetSp = poffset;
              //   }
              // } else {
              //   that.deilSp.suitDescription = t.suitDescription;
              //   that.showSp = true;
              //   that.offsetSp = poffset;
              // }


              that.spDetil.visible =true
           
             // let spStrType = ['suitName','suitDate','suitAdjustingPerson','suitTestPerson','suitDescription']
             let spData = that.spDetil.data 
              spData.forEach((item)=>{
                  if(t[item.type]){
                     item.val = t[item.type] 
                  }else{
                    item.val=''
                  }
              })
              that.spDetil.data = spData
            }
          });
        });
        // 鼠标 添加 hover 事件
        let addHover = (el, styOpt, type, data) => {
          let rectOpt = {
            style: {
              stroke: styOpt.style.stroke
            }
          };
          let fn = null,
            ID;
          if (type === "L") {
            fn = groupR;
            ID = "productId";
          } else {
            fn = groupL;
            ID = "projectId";
          }
          el.childAt(0).attr(rectOpt);
          el.childAt(1).attr(styOpt);
          groupM.childAt(0).attr(rectOpt);
          if (data) {
            data.forEach(t => {
              fn.eachChild(k => {
                if (t[ID] == k.childAt(0)[ID]) {
                  k.childAt(0).attr(rectOpt);
                  k.childAt(1).attr(styOpt);
                }
              });
            });
          } else {
            fn.eachChild(k => {
              k.childAt(0).attr(rectOpt);
              k.childAt(1).attr(styOpt);
            });
          }
        };
        if (groupL) {
          groupL.eachChild((k, i) => {
            let hoverL = false;
            k.childAt(0)
              .on("mouseover", e => {
                hoverL = true;
                this.getproRelation("L", e.target.projectId, res => {
                  if (res.code == 200) {
                    if (hoverL) {
                      addHover(
                        k,
                        { style: { stroke: DEFAULT.lineHoverColor } },
                        "L",
                        res.data
                      );
                    }
                  }
                });
                k.childAt(2).show()
              })
              .on("mouseout", e => {
                hoverL = false;
                addHover(
                  k,
                  {
                    style: {
                      stroke: DEFAULT.lineColor,
                      fill: DEFAULT.lineColor
                    }
                  },
                  "L"
                );
                 k.childAt(2).hide()
              })
              .on("click", e => {
                // let position = [e.target.shape.x, e.target.shape.y];
                // // 鼠标相对文档偏移
                // let offset = [e.target.transform[4], e.target.transform[5]];
                // //元素相对文档偏移
                // let p = [position[0] + offset[0], position[1] + offset[1]];
                // let poffset = [
                //   `${parseInt(p[0] + DEFAULT.width)}px`,
                //   `${parseInt(p[1] + DEFAULT.height / 2)}px`
                // ];
                // if (this.showProject) {
                //   if (this.offsetProject[1] === poffset[1]) {
                //     this.showProject = false;
                //   } else {
                //     this.deilProject = project[i];
                //     this.offsetProject = poffset;
                //   }
                // } else {
                //   this.deilProject = project[i];
                //   this.showProject = true;
                //   this.offsetProject = poffset;
                // }
                that.projectDetil.visible =true
                let projectData = that.projectDetil.data 
                  projectData.forEach((item)=>{
                      if(project[i][item.type]){
                        item.val = project[i][item.type] 
                      }else{
                        item.val=''
                      }
                  })   
                  that.projectDetil.data = projectData
              });
              k.childAt(2).on('click',e =>{
                //当前项目实例
                that.projectEdit.curtEl = k.childAt(0)  || null
                // 当前项目优先级元素实例
                that.projectEdit.curtPriorityEl = k.childAt(3).childAt(0).childAt(1) ||null 
                that.projectEdit.visible = true 
                that.projectEdit.projectName=project[i].projectName
                that.projectEdit.projectId=project[i].projectId
                that.editProject(project[i].priorityName)  
              })

          });
           group.add(groupL);
        }
        if (groupR) {
          groupR.eachChild((k, i) => {
            let hoverR = false;
            k.childAt(0)
              .on("mouseover", e => {
                hoverR = true;
                // that.$slloading.show()
                this.getproRelation("R", e.target.productId, res => {
                  if (res.code == 200) {
                    if (hoverR) {
                      hoverR = false;
                      // that.$slloading.hide()
                      addHover(
                        k,
                        { style: { stroke: DEFAULT.lineHoverColor } },
                        "R",
                        res.data
                      );
                    }
                  }
                });
              })
              .on("mouseout", () => {
                hoverR = false;
                // that.$slloading.hide()
                addHover(
                  k,
                  {
                    style: {
                      stroke: DEFAULT.lineColor,
                      fill: DEFAULT.lineColor
                    }
                  },
                  "R"
                );
              })
              .on("click", e => {
                that.productDetil.visible =true
                let productData = that.productDetil.data 
                  productData.forEach((item,index)=>{
                      if(product[i][item.type]){
                        item.val = product[i][item.type] 
                      }else{
                        item.val=''
                        if(index ===4){
                          item.val=[]
                        }
                      }
                  })
                  that.productDetil.data = productData
              });
          });
          group.add(groupR);
        }
        group.add(groupM);
        // 保存下次渲染的初始高度
        this.groupH = groupH;
        // groupArr.push(group);
        this.zr.add(group);
        this.zr.resize({
          height: groupH
        });
        // this.zr.refreshImmediately()
      });

      // this.groupArr = groupArr;
    },
    //文字 +圆弧
    createText(opt) {
      opt = {
        a: opt.typeName,
        b: opt.priorityName,
        c: opt.statusName
      };
      // 创建 文字
      let h = DEFAULT.height;
      let textStyle = {
        shape: {
          width: (DEFAULT.width * 2) / 3,
          height: h / 3,
          r: rem(3)
        },
        style: {
          textAlign: "left",
          text: "aaaa",
          textVerticalAlign: "middle",
          fontSize: rem(15),
          fill: "#fff",
          // stroke:'gold',
          textPosition: "left",
          textDistance: -5
        }
      };
      let option = [
        {
          text: `类型: ${opt.a}`,
          position: [0, 0]
        },
        {
          text: `优先级: ${opt.b}`,
          position: [0, h / 3]
        },
        {
          text: `状态: ${opt.c}`,
          position: [0, h - h / 3]
        }
      ];
      let textGroup = new zrender.Group();
      option.forEach((t, i) => {
        let textRect;
        if (i == 1) {
          let color;
          textRect = rect({
            shape: {
              ...textStyle.shape
            },
            style: {
              ...textStyle.style,
              text: t.text
            },
            position: t.position
          });
          textRect
            .on("mouseover", function(e) {
              color = e.target.style.stroke;
              e.target.attr({
                style: {
                  stroke: "gold"
                }
              });
            })
            .on("mouseout", function(e) {
              e.target.attr({
                style: {
                  stroke: color
                }
              });
            });
        } else {
          textRect = rect({
            shape: {
              ...textStyle.shape
            },
            style: {
              ...textStyle.style,
              text: t.text
            },
            position: t.position
          });
        }
        textGroup.add(textRect);
      });
      // let prodjBox=this.createDragBox()
      // prodjBox.attr({zlevel:1})
      // prodjBox.position=[0,DEFAULT.height*2/3+5]
      // textGroup.add(prodjBox)
      // 创建圆弧
      let deg = c => (c * Math.PI) / 180;
      let r = DEFAULT.height / 4;
      let arcOpt = [
        {
          shape: {
            r: r,
            cx: 0,
            cy: r,
            startAngle: 0,
            endAngle: -deg(90),
            clockwise: false
          }
        },
        {
          shape: {
            r: r,
            cx: 0,
            cy: 3 * r,
            startAngle: 0,
            endAngle: deg(90),
            clockwise: true
          }
        },
        {
          shape: {
            r: r,
            cx: 2 * r,
            cy: r,
            startAngle: -deg(180),
            endAngle: -deg(270),
            clockwise: false
          }
        },
        {
          shape: {
            r: r,
            cx: 2 * r,
            cy: 3 * r,
            startAngle: deg(180),
            endAngle: deg(270),
            clockwise: true
          }
        }
      ];
      let arcGroup = new zrender.Group();
      arcOpt.forEach(t => {
        let Arc = arc({ ...t });
        arcGroup.add(Arc);
      });
      let group = new zrender.Group();
      let groupOpt = {
        width: (DEFAULT.width * 2) / 3 + DEFAULT.height / 2,
        height: DEFAULT.height
      };
      textGroup.attr({
        style: {
          width: parseInt((DEFAULT.width * 2) / 3),
          height: DEFAULT.height
        },
        position: [0, 0]
      });

      arcGroup.attr({
        shape: {
          width: DEFAULT.height / 2,
          height: DEFAULT.height
        },
        position: [(DEFAULT.width * 2) / 3, 0]
      });
      group.add(textGroup);
      group.add(arcGroup);
      group.attr({
        shape: {
          width: groupOpt.width,
          height: groupOpt.height
        }
      });
      return group;
    },
    //项目优先级盒子
    createDragBox(opt) {
      opt = [
        {
          type: "高"
        },
        {
          type: "中"
        },
        {
          type: "低"
        }
      ];

      let group = new zrender.Group();
      let boxRect = rect({
        shape: {
          width: (DEFAULT.width * 2) / 3,
          height: DEFAULT.height,
          x: 0,
          y: 0
        },
        style: {
          fill: "#fff",
          stroke: "red"
        }
      });
      group.add(boxRect);
      // opt.forEach((t,i)=>{
      //   let box=rect({
      //     shape:{

      //     },
      //     style:{

      //     }
      //   })
      // })

      return group;
    },
    // 详情弹框
    dragTextBox(opt) {
      let deOpt = {
        style: {
          stroke: "red",
          text: "loading...",
          opacity: 0.7
        },
        shape: {
          width: rem(100),
          height: rem(50),
          r: 10
        },
        z: 0,
        position: [0, 0]
      };
      deOpt = Object.assign({}, deOpt, opt);
      if (this.dragBox) {
        return this.dragBox;
      } else {
        this.dragBox = rect(deOpt);
        this.dragBox.hide();
        this.zr.add(this.dragBox);
        return this.dragBox;
      }
    },
    loadingBox(value) {},
    getproRelation(type, id, callback) {
      let url =
        type === "L"
          ? "/api/suit/findProductListByProjectId"
          : "/api/suit/findProjectListByProductId";

      this.$http.get(
        url,
        {
          issueId: id
        },
        res => {
          if (res.status === 200) {
            if (callback) {
              callback(res.data);
            }
          } else {
            console.log(res);
          }
        }
      );
    },
    fnScroll(){
      let that =this
      let scrollTop = 0
      let fn =function(e){
         
        if(that.lastPage){
          return
        }
        if(!that.bscroll) return 
            // 窗口可视范围的高度
        var height=util.getClientHeight(),
            // 窗口滚动条高度
            theight=util.getScrollTop(),
            // 窗口可视范围的高度
            rheight=util.getScrollHeight(),
            // 滚动条距离底部的高度
            bheight=rheight-theight-height;
            if(theight > scrollTop)
            
            if(bheight<=100){
              if(theight > scrollTop){             
                that.pageNo+=1
                that.getData(that.pageNo)
              }             
            }
             scrollTop = theight
      }
      window.addEventListener('scroll',fn)
      
    },
    editProject(priorityName){
      this.$http.post('/api/project/findAllProjectPriority',res=>{
        if(res.status === 200){
          // this.productEdit.data = res.data
          if(res.data.code === 200){
            this.projectEdit.data = res.data.data
            let data =res.data.data;
            this.projectEdit.priorityID = data.find(t =>{
              return t.priorityName === priorityName.trim()
            }).priorityID
          }
          // console.log(res.data)
        }
      })
    },
    editProjectSave(){
      this.$http.post('/api/project/updateProject',{
        projectName:this.projectEdit.projectName,
        priorityId:this.projectEdit.priorityID,
        projectId:this.projectEdit.projectId
      },res=>{
        if(res.status === 200){
          if(res.data.code === 200){
              this.projectEdit.visible =false
              //修改当前项
              // console.log(this.projectEdit.curtEl)
              // this.projectEdit.curtEl.attr({
              //   style:{
              //     text:textFormat(this.projectEdit.projectName, 18, 38)
              //   }
              // })
              // let priorityName = this.projectEdit.data.find(t =>{
              //     return t.priorityID == this.projectEdit.priorityID 
              // }).priorityName
              // this.projectEdit.curtPriorityEl.attr({
              //   style:{
              //     text:`优先级: ${priorityName}`
              //   }
              // })
              // window.location ='#/vepal'
              this.resetData()
              this.getData()
          }else{

          }
        }
      })
    },
    productClick(row){
      // console.log(row)
      this.productDetil.inner.visible = true
    },
    productDown(row){
        
        let url ='http://58.30.9.142:48086/files/2018/10/24/20181024175638_github.zip'
        let url1 ='http://192.168.112.168:8087/file/download?filePath=http://58.30.9.142:48086/files/2018/10/24/20181024175638_github.zip'
        util.StandardPost(url1)
        // window.open(url)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dialogStyle {
  background: rgba(74, 163, 222, 1);
  line-height: 0.3rem;
  padding: 0.2rem;
  font-family: 微软雅黑;
  width: 4rem;
}
.dinner {
  width: 100%;
  height: 100%;
  /* position: absolute */
}

/***addvepal csy add***/
.addvepal-layer{
    font-family:微软雅黑;
    font-size: 0.16rem;
}

.addvepal-layer ul li{
    line-height: 0.5rem;
    margin-top:0.1rem;
    height: auto;
    width: 9rem;
}
.addvepal-layer ul li label{
    float: left;
    width:1.2rem;
    text-align: right;
}
.elinput{
    width:7rem;
}
 .addvepal-layer ul li textarea{
    height: 0.8rem;
    width:6.8rem;
    resize: none;
    padding:0.1rem;
    border:1px solid #dcdfe6;
 }
 .producttree{
     width:7.2rem;
     height: 4rem;
     border:1px solid #dcdfe6;
     float: left;
     overflow-y:auto;
     overflow-x: hidden;
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
 .suitDate{
     width:7rem;
 }
 .elbutton{
   position: fixed;
   right:0rem;
   top:0;
   background: #409EFF;
   color:#fff;
   padding:0.1rem;
   margin:0.1rem;
   z-index: 30;
 }
 .version{
   position: absolute;
   left:0.1rem;
   top:0.1rem;
   font-size: 0.2rem;
   font-family: Arial, Helvetica, sans-serif;
 }
 .version strong{
    font-size: 12px;
    padding-left: 0.1rem;
 }
 /***addvepal end***/
 /* sp-dialog  start*/
 .sp-item {
   /* height: 0.4rem; */
   /* padding: 0.1rem 0 */
   line-height: 0.3rem;
 } 
 .sp-item .sp-item-label {
   text-align: right ;
   /* font-weight: bold */
 }
 .sp-item .sp-item-val {
   /* line-height: 0.3rem; */
 }
 .sp-footer{
   /* margin-top:0.4rem; */
 }
  /* sp-dialog  end*/

.dialog-item-val{
  max-height: 3rem;
  overflow: auto
}
.edit-text {
  position: fixed;
  transform: translate(50%);
  top: 50%;
  /* width: 50%; */
  z-index: -1000;
  /* border:none */
  outline: none;
  -webkit-appearance: none;
  border-radius: 0;
  /* visibility: hidden; */
  opacity: 0;
}
.edit-item{
  /* height: 0.4rem; */
 line-height: 0.4rem;
 margin-bottom: 0.1rem;
}
.edit-item .edit-item-label{
  text-align: right ;
}
.edit-item .edit-select{
  width: 100%;
}

</style>
