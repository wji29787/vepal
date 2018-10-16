<template>
    <div> 
        <transition name = "fade">
            <div class="sl-dialog-container" v-show="insideValue" :style="style">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
  name: "sl-dialog",
  data() {
    return {
      msg: "",
      style: {
        // width: "3rem",
        // height: "2rem",
        position:this.position,
        top:this.offset[0],
        left:this.offset[1],
      },
      insideValue: this.value,
      hasSlot: false
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    position:{
        type:String,
        default:'fixed'
    },
    offset:{
        type: Array,
        default() {
        return ['50%', '50%'];
      }
    }
  },
  watch:{
      value(val){
        if(this.insideValue !== this.value){
            this.insideValue=val
        }  
      },
      offset(val){
          this.style.top=this.offset[1]
          this.style.left=this.offset[0]
      },
  },
  mounted() {
   
  },
  methods: {
    close() {
      document.body.removeChild(this.$el);
      if (this.destroy) {
        this.destroy(this);
      }
    }
  }
};
</script>

<style>
.sl-dialog-container {
  background-color: #5f6161;
  z-index: 999999999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
  /* transition: all 0.5s; */

}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>


