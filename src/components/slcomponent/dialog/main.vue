<template>
    <div> 
        <transition name = "fade" 
        @before-enter = "beforeEnter"
        @enter = "enter"
        @after-enter = "afterEnter"    
        @enter-cancelled = "enterCancelled"
        @before-leave = "beforeLeave"
        @leave = "leave"
        @after-leave = "afterLeave" 
        @leave-cancelled = "leaveCancelled" >
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
    },
    beforeEnter(el){
        // console.log(el)
        // el.style.transition="top 2s"
        // el.style.transition="top 0.3s ease"
        // el.style.opacity=1
    },
    enter(el,done){
        // el.style.top=`${this.offset[1]}px`
        // el.style.transition="top 2s"
        // el.style.opacity=1
        // el.style.opacity=1
        el.style.transition="top 0.3s ease,opacity 0.3s,height 0.3s"
        // el.style.opacity=0
        done()
        
        
    },
    afterEnter(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
    },
    enterCancelled(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
    },
    beforeLeave(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
    },
    leave(el,done){
        // el.style.transition="top 2s"
        // el.style.transition="opacity 0.3s"
        // el.style.opacity=0
        // done()
    },
    afterLeave(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
    },
    leaveCancelled(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
    },
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
    /* transition :top 1.5s */
}
/* .fade-enter{
    transition :top 1.5s
}
.fade-enter-active {
  transition :top 1.5s
}
.fade-enter-to{
    transition :top 1.5s
}
.fade-leave-to{
    transition :top 1.5s
}
.fade-leave{
    transition :top 1.5s
} */
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>


