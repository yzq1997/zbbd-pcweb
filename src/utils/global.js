global.timer = null;
// 进入页面开始调用
global.loginOut = function(){
	this.timer = setInterval(()=>{
		// get不到cookie 跳转login
		if(!getCookie(userLogin)){
			clearInterval(global.timer)
			global.timer = null;
			// 跳转login
			
		}
	},1000)
}

function getCookie(key){
        var cookies=document.cookie;
        if(cookies.length>0){
            var start=cookies.indexOf(key+"=");
            if(start<0){
                return "";
            }
            var end =cookies.indexOf(";",start);
            if(end<0){
                end=cookies.length;
            }
            return cookies.substring(start+key.length+1,end);
        }
    }