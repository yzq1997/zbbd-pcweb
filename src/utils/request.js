import axios from 'axios'
import qs from 'qs'
// 在config.js文件中统一存放一些公共常量，方便之后维护
import { baseURL } from './config.js'
import store from './store' // 引入store
import route from './router'

// 添加请求拦截器，在发送请求之前做些什么(**具体查看axios文档**)--------------------------------------------
axios.interceptors.request.use(function (config) {
    // 显示loading
    store.commit('showloading');
    return config
}, function (error) {
    // 请求错误时弹框提示，或做些其他事
    return Promise.reject(error)
})

// 添加响应拦截器(**具体查看axios文档**)----------------------------------------------------------------
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么，允许在数据返回客户端前，修改响应的数据
    // 如果只需要返回体中数据，则如下，如果需要全部，则 return response 即可
    store.commit('hideloading');
    return response.data
}, function (error) {
    // 对响应错误做点什么
    switch (error.response.status) {
        case 401:
        // store.dispatch('logout');
        break;
        case 403:
         route.push({name:'403'});
        break;
        case 404:
         route.push({name:'404'});
        break;
        case 500:
         route.push({name:'500'});
    }
    return Promise.reject(error)
})

// 封装数据返回失败提示函数---------------------------------------------------------------------------
function errorState(response) {
    // 隐藏loading
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        // 如果不需要除了data之外的数据，可以直接 return response.data
        return response
    } else {
        //route.push({name:'404'});
    }
}

// 封装数据返回成功提示函数---------------------------------------------------------------------------
function successState(res) {
    // 隐藏loading
    // 统一判断后端返回的错误码(错误码与后台协商而定)
    if (res.status === 200) {
        //alert('success')
        return res
    }
    else if(res.status === 403)
    {
        route.push({name:'403'});
    }
}

// 封装axios--------------------------------------------------------------------------------------
export function apiAxios(opt) {
    if(opt.url.indexOf('Login')==-1)
    {
        if(!sessionStorage.getItem('userName') || !sessionStorage.getItem('auth'))
        {
            this.$router.push({'name':"login"})
        }
    }
    let method = opt.method || 'GET';
    let responseType = opt.responseType || "json";
    let data=opt.data;
    if(opt.contentType=='stringfy')
        data=JSON.stringify(opt.data);
    else
        data=qs.stringify(opt.data);
   
    let httpDefault = {
        method: method,
        baseURL: baseURL,
        url:opt.url,
        // `params` 是即将与请求一起发送的 URL 参数
        // `data` 是作为请求主体被发送的数据
        params: method === 'GET' || method === 'DELETE' ? opt.data : null,
        data: method === 'POST' || method === 'PUT' ? data : null,
        timeout: 20000,
    }
    if(!opt.baseURL)
    {
        httpDefault.baseURL = baseURL;
    }
    if (sessionStorage["auth"] != '' && sessionStorage["auth"] != null && opt.token!='') {
        if(opt.contentType=='stringfy')
        {
            httpDefault.headers = {
                'Authorization': "Basic " + sessionStorage["auth"],
                'Content-Type': 'application/json;charset=utf-8'
            }
        }else
        httpDefault.headers = {
                'Authorization': "Basic " + sessionStorage["auth"]
            }
    }

    // 注意**Promise**使用(Promise首字母大写)
    return new Promise((resolve, reject) => {
        axios(httpDefault)
            // 此处的.then属于axios
            .then((res) => {
              let data = '';
              if (responseType === 'string')
                data = res;
              else 
                data =JSON.parse(res);

                successState(data)
                resolve(data)
            }).catch((response) => {
                errorState(response)
                reject(response)
            })
    }).catch((e) => {})

}

// 输出函数getAxios、postAxios、putAxios、delectAxios，供其他文件调用-----------------------------
// Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
// export default {
//     install: function (Vue) {
//         Vue.prototype.myaxios = (option) => apiAxios(option)
//         // Vue.prototype.getAxios = (url, params) => apiAxios('GET', url, params)
//         // Vue.prototype.postAxios = (url, params) => apiAxios('POST', url, params)
//         // Vue.prototype.putAxios = (url, params) => apiAxios('PUT', url, params)
//         // Vue.prototype.delectAxios = (url, params) => apiAxios('DELECT', url, params)
//     }
// }
