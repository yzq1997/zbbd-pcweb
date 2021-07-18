<!-- 这是页面布局控件-->
<template>
  <div class="exceptionpage">
    <!-- <svg class="icon" aria-hidden="true">
         <use xlink:href="#icon500"></use>
    </svg> -->
    <svg-icon icon-class="500" class="icon"/>
   <p class="msg"> 抱歉，服务器出错了。</p>
    <p class="backhome">   <a-button type="primary" @click="backhome()">返回首页</a-button></p>
  </div>
</template>

<!-- 这是行为，控制，方法-->
<script>
import '@/assets/iconfont/iconfont.js';
export default {
  data() {
    return {

    }
  },
  methods: {
    backhome:function(){
      this.$router.push({name:'myProject'})
    }
  },
  components: {

  }
}
</script>

<!-- 这是页面样式-->
<style scoped>
.exceptionpage{
  text-align: center;
   margin-top: 20px;
}
.icon {
  width: 350px;
  height: 350px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block
}
.msg{
  font-size: 16px;
  margin-top: 20px;
}
.backhome{
   text-align: center
}
</style>
