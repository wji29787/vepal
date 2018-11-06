<template>
    <div>
        <el-container direction ="vertical">
            <el-row class = "sl-item">
                <h1>
                    <slot name = "title">
                                导航
                            </slot>
                </h1>
            </el-row>
            <el-row class = "sl-item">
                <slot name = 'items'></slot>
            </el-row>

        </el-container>
    </div>

</template>
<script>
export default {
    name:'sl-menu',
    data(){
        return {

        }
    }
}
</script>
<style>
.sl-item{
    margin: 0.1rem 0;
}
.sl-item h1 {
    font-size: 0.2rem; 
}
</style>
