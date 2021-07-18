import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    showloading: false, //显示加载
    editModelID:'', //正在编辑的题目
    editorvisible:false,//编辑器显示
    addStrategy:false,//显示添加策略
    baseUrl:'http://211.149.250.2:20001/qualityGuard-api',
}
const mutations={
    showloading(state)
    {
        state.showloading=true;
    },
    hideloading(state){
        state.showloading=false;
    },
    setModelID(state,code)
    {
        state.editModelID=code;
    },
    showEditorModal(state)
    {
        state.editorvisible=true;
    },
    hideEditorModal(state)
    {
        state.editorvisible=false;
    },
    showAddStrategy(state)
    {
        state.addStrategy=true;
    },
    hideAddStrategy(state)
    {
        state.addStrategy=false;
    },
}
export default new Vuex.Store({
    state,
    mutations,
    strict:true//开启严格模式后，只能通过mutation来改变状态（不支持异步）否则会报错
})