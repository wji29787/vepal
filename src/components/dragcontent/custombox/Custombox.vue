<template>
    <div class="custom-contanier" :style="style">
        <button @click="close()">clode</button>
        <div :style="{'cursor':'pointer','color':'red'}" @click="aa()">{{msg}}</div>

    </div>
</template>

<script>
export default {
    name :'custombox',
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
  .custom-contanier{
      position: fixed;
      top:50%;
      left: 50%;
  }
</style>


