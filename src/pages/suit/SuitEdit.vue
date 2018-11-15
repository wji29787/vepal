<template>
    <div class="extend-h-w">
        <el-form ref="form" :model="form" label-width="160px">
            <el-form-item label="套装名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
             <el-form-item label="套装时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="测试负责人">
                <el-select v-model="form.region" placeholder="请选择测试负责人">
                <el-option label="谭明泽" value="shanghai"></el-option>
                <el-option label="刘哲" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联调负责人">
                <el-select v-model="form.region" placeholder="请选择测试负责人">
                <el-option label="谭明泽" value="shanghai"></el-option>
                <el-option label="刘哲" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联项目及产品" >
               <template>
                <el-transfer
                    class="el-transfer"
                    v-model="form.value5"
                    :props="{
                    key: 'value',
                    label: 'desc'
                    }"
                    :titles="['未关联列表', '已关联列表']"
                    :data="form.data3">
                </el-transfer>
                </template>
            </el-form-item>
            <el-form-item>
                <div>
                    <tree-transfer 
                        :title="title" 
                        :from_data='fromData' 
                        :to_data='toData' 
                        :defaultProps="{label:'label'}" 
                        @addBtn='add' 
                        @removeBtn='remove' 
                        :mode='mode' height='540px' filter openAll>
                    </tree-transfer>
                </div>
            </el-form-item>
            <el-form-item label="详细描述">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
             <el-form-item label="备注">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>取消</el-button>
            </el-form-item>
            </el-form>
    </div>
</template>

<script>
import treeTransfer from 'el-tree-transfer'
    export default {
        data() {
              const generateData3 = _ => {
                    const data = [];
                    for (let i = 1; i <= 15; i++) {
                    data.push({
                        value: i,
                        desc: `产品 ${ i }`,
                        disabled: i % 4 === 0
                    });
                    }
                    return data;
                };
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    data3: generateData3(),
                    value5: []
                },
                mode: "transfer", // transfer addressList

        fromData:[

          {

            id: "1",

            pid: 0,

            label: "一级 1",

            children: [

              {

                id: "1-1",

                pid: "1",

                label: "二级 1-1",

                children: []

              },

              {

                id: "1-2",

                pid: "1",

                label: "二级 1-2",

                children: [

                  {

                    id: "1-2-1",

                    pid: "1-2",

                    children: [],

                    label: "二级 1-2-1"

                  },

                  {

                    id: "1-2-2",

                    pid: "1-2",

                    children: [],

                    label: "二级 1-2-2"

                  }

                ]

              }

            ]

          },

        ],

        toData:[]
            }
        },methods: {
            onSubmit() {
                console.log('submit!');
            },
            // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList

      changeMode() {

        if (this.mode == "transfer") {

          this.mode = "addressList";

        } else {

          this.mode = "transfer";

        }

      },

      // 监听穿梭框组件添加

      add(fromData,toData,obj){

        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象

        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表

        console.log("fromData:", fromData);

        console.log("toData:", toData);

        console.log("obj:", obj);

      },

      // 监听穿梭框组件移除

      remove(fromData,toData,obj){

        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象

        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表

        console.log("fromData:", fromData);

        console.log("toData:", toData);

        console.log("obj:", obj);

      }
         },
           components:{ treeTransfer } // 注册
    }
</script>

<style scoped>
.el-transfer{
    width: 8rem;
}
</style>