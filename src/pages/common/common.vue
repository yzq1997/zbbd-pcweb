<script type="text/javascript">
    // 定义一些公共的属性和方法


    // 删除数组的空项
    function dropArray(rr)
    {
        return rr.filter( (s)=>{
            return s && typeof s == 'string' && s.trim(); 
        })
    }

    // 删除object的空项
    function dropObj(obj) {
        for(let item in obj)
        {
            if((typeof obj[item]).toUpperCase() == "STRING")
            {
                obj[item] = obj[item].trim();
            }
            if(!obj[item] && obj[item]!==0)
            {
                delete obj[item]
            }
        }
    }

    // array去重
    function unique(arr){
        let hash=[];
        for (let i = 0; i < arr.length; i++) {
            if(hash.indexOf(arr[i])==-1){
                hash.push(arr[i]);
            }
        }
        return hash;
    }

    // array降维
    function reduceArray(arr){ 
        let ret = []; 
        let toArr = function(arr){ 
            arr.forEach(function(item){ item instanceof Array ? toArr(item) : ret.push(item); }); 
        } 
        toArr(arr); 
        return ret; 
    } 

    // 获取文件名字
    // url文件地址，array过滤的文件格式
    function fileName(url,array){
        url = url || "";
        let fileName = "";
        if(url)
        {
            array.forEach(keys=>{
                if(url.indexOf(keys)>-1)
                {
                    fileName = url.substring(url.split('').map((item,index)=>{if(item == '/'){return index}}).filter(item=>{if(item){return item}})[url.split('').map((item,index)=>{if(item == '/'){return index}}).filter(item=>{if(item){return item}}).length-1]+1,url.indexOf(keys)-1)+'.'+keys
                }
            })
        }
        return fileName;
    }

    function addCookie(objName, objValue, objHours) {
        var str = objName + "=" + escape(objValue); //编码
        if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
            var date = new Date();
            var ms = objHours * 3600 * 1000;
            date.setTime(date.getTime() + ms);
            str += "; expires=" + date.toGMTString();
        }
        document.cookie = str;
    }

    function getCookie(objName) {//获取指定名称的cookie的值
        var arrStr = document.cookie.split("; ");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0] == objName) return unescape(temp[1]);  //解码
        }
        return "";
    }


    // 正则

    export default {
        dropObj,
        unique,
        reduceArray,
        dropArray,
        fileName,
        addCookie,
        getCookie
    }
</script>