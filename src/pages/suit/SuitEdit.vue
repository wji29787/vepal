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
               
            }
        },methods: {
            onSubmit() {
                console.log('submit!');
            }
         }
    }
</script>

<style scoped>
.el-transfer{
    width: 8rem;
}
</style>