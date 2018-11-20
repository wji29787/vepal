<template>
  <el-container class="report">
    <el-header class="report__header">
      <div style="float:right;">
        <el-radio-group v-model="tabPosition" size="small">
          <el-radio-button label="suitProduct">列表</el-radio-button>
          <el-radio-button label="Vepal">视图1</el-radio-button>
          <el-radio-button label="pptView">视图2</el-radio-button>
        </el-radio-group>
      </div>
    </el-header>
    <el-main class="report__main">
      <suit-product v-if="tabPosition === VIEW_TYPE.SUIT_PRODUCT"></suit-product>
      <vepal v-if="tabPosition === VIEW_TYPE.VEPAL"></vepal>
      <ppt-view v-if="tabPosition === VIEW_TYPE.PPT_VIEW"></ppt-view>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import SuitProduct from './suitProduct';
import Vepal from '@/vepal/vepal';
import PptView from './pptview';
const VIEW_TYPE = {
  SUIT_PRODUCT: 'suitProduct',
  VEPAL: 'Vepal',
  PPT_VIEW: 'pptView'
};
export default {
  name: 'reportView',
  components: {
    SuitProduct,
    Vepal,
    PptView
  },
  data () {
    return {
      VIEW_TYPE,
      tabPosition: VIEW_TYPE.SUIT_PRODUCT
    };
  },
  methods: {}
};
</script>
<style>
.report {
  height: 100%;
}
.report__main {
  padding: 0px;
}
</style>
