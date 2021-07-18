<!-- 这是页面布局控件-->
<template>
  <div class="exceptionpage">
   <svg-icon icon-class="403" class="icon"/>
   <p class="msg"> 抱歉，你无权访问该页面。</p>
    <p class="backhome">   <a-button type="primary" @click="backhome()">返回登录</a-button></p>
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
      this.$router.push({name:'login'})
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
  width: 300px;
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
