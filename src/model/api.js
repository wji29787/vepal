import http from '../assets/js/axioshttp'
import * as types from './store/storetypes'
let ajax = http.instance
const API ={
    [types.GETPROJECT_TYPE](url){
        // console.log(ajax)
        return ajax.get(url)
    },
    [types.GETPRIORITY](url){
        return ajax.get(url)
    },
    [types.GETUSERS](url){
        return ajax.get(url)
    },
    GET_All(){

    }
}
export default API