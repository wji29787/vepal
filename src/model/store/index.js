import * as types from './storetypes'
const store = {
    state:{
         count :1,
         title:'项目管理列表', // 页面title
         userNameList:[]

    },
    getters: {
        
    },
    mutations: {
        [types.CHANGE_TITLE](state,value){
             state.title = value   
        }
    },
    actions: {
        
    },
    modules: {
        
    }
}

export default store