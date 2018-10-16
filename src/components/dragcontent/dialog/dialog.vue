<template>
    <div class="sl-dialog-container" :style="style">
        <div class ="sl-dialog-header">
            <slot name="header"></slot>
        </div>
        <div class ="sl-dialog-body">
            <slot name="body"></slot>
        </div>
        <div class ="sl-dialog-foot">
            <slot name="foot"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name :'sl-dialog',
    data(){
        return{
            offset:[],
            msg:'',
            style:{
                width:'3rem',
                height:'2rem'
            }
        }
    },
    props:{

    },
    mounted(){
       if(this.success){
           this.success(this)
       }  
    },
    methods:{
       close(){
           document.body.removeChild(this.$el)
           if(this.destroy){
               this.destroy(this)
           }       
       }
    }
}
</script>

<style scoped>
  .sl-dialog-container{
      position: fixed;
      top:50%;
      left: 50%;
  }
</style>


