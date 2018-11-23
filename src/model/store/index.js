import * as types from './storetypes'
import  API from '../api'
const store = {
    state:{
         count :1,
         title:'项目管理列表', // 页面title
         userNameList:[],  // 用户列表
         projectTypes:[],  // 所属类型
         priorityTypes:[],  // 优先级列表
          

    },
    getters: {
        
    },
    mutations: {
        [types.CHANGE_TITLE](state,value){
             state.title = value   
        },
        [types.GETPROJECT_TYPE](state,list){
            state.projectTypes = list
            console.log(list)
        },         
        [types.GETPRIORITY](state,list){
            state.priorityTypes = list
        },
        [types.GETUSERS](state,list){
            state.userNameList = list
        } 
    },
    actions: {
       [types.GETPROJECT_TYPE]({commit},url){
            API[types.GETPROJECT_TYPE](url)
            .then(res =>{
                if(res.data.code ===types.RESPONSE_SUCCESS){
                    if(Array.isArray(res.data.data)&& res.data.data.length >0){
                        commit(types.GETPROJECT_TYPE,res.data.data)
                    }  
                }else{

                }
            })
            .catch(err => {

            })
       },         
       [types.GETPRIORITY]({commit},url){

       },
       [types.GETUSERS]({commit},url){

       } 
    },
    modules: {
        
    }
}

export default store