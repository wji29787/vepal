const storage = {
    getItem(key){
        let val = localStorage.getItem(key)
        return JSON.parse(val)
    },
    removeItem(key){
         localStorage.removeItem(key)
    },
    setItem(key,value){
        let val = JSON.stringify(value)
        localStorage.setItem(key,val)
    }
}

export default storage