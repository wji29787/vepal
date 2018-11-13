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
        @leave-cancelled = "leaveCancelled" 
        :css ="false"
        >
            <div class="sl-dialog-container" v-show="insideValue" :style="style">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
 import  Velocity from 'velocity-animate'
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
      hasSlot: false,
      showEl:'' //元素获取
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
        // console.log(11)
      },
      offset(val){
        //  console.log(11)
         let that =this
        if(this.insideValue){
           
            //  Velocity(shis.showEl, 'stop');
           if(this.showEl){
                console.log(22)
                Velocity(this.showEl, {
                     opacity: 0,
                }, {
                    duration: 150,
                    easing: [ 0.4, 0.01, 0.165, 0.99 ],
                    complete(e){
                                
                        that.style.top=that.offset[1]
                        that.style.left=that.offset[0]
                        // Velocity(that.showEl, 'stop');
                        Velocity(e, {
                            opacity: 1,
                        }, {
                            duration: 150,
                            easing: [ 0.4, 0.01, 0.165, 0.99 ]
                        })
                    }
                })
           }else{
                this.style.top=this.offset[1]
                this.style.left=this.offset[0]
           }
        }
        else{
             this.style.top=this.offset[1]
             this.style.left=this.offset[0]
        }
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
        el.style.opacity=0
        console.log('方块显示动画即将执行');
    },
    enter(el,done){
        Velocity(el, 'stop');
        this.style.top=this.offset[1]
        this.style.left=this.offset[0]
        Velocity(el, {
            // backgroundColor: '#0085eb',
            opacity: 1,
            // translateX: 260,
            // rotateZ: ['360deg', 0]
        }, {
            duration: 300,
            easing: [ 0.4, 0.01, 0.165, 0.99 ],
            complete: done
        });
            console.log('方块显示动画执行中...');
        
        
    },
    afterEnter(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
        // el.style.top=`${this.offset[1]}px`
        // el.style.transition="opacity 0.3s"
        // console.log('方块显示动画结束');
        this.showEl =el
    },
    enterCancelled(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
        // console.log(22)
    },
    beforeLeave(el){
        // el.style.transition="top 2s"
        // el.style.opacity=1
        // el.style.top=`${this.offset[1]}px`
        //  el.style.transition="opacity 0.3s"
        // console.log('方块显示动画结束');
    },
    leave(el,done){
        // el.style.transition="top 2s"
        // el.style.transition="opacity 0.3s"
        // el.style.opacity=0
        // done()
         Velocity(el, 'stop');
            Velocity(el, {
                // backgroundColor: '#4dd0e1',
                opacity: 0,
                // translateX: 0,
                // rotateZ: [0, '360deg']
            }, {
                duration: 300,
                easing: [ 0.4, 0.01, 0.165, 0.99 ],
                complete: done
            });
            // console.log('方块隐藏动画执行中...');
    },
    afterLeave(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
        // console.log(11)
    },
    leaveCancelled(el){
        // el.style.transition="top 2s"
        // el.style.opacity=0
        //  console.log('方块隐藏动画结束');
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


