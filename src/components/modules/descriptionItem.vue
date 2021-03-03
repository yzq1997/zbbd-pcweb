<!-- 这是页面布局控件-->
<template>
  <div class='lablename'>
      <span class='title'>
          {{title||''}}
           <slot name="title"></slot>
      </span>
      <span class='content'>
          {{content||''}}
          <slot name="content"></slot>
       </span>  
  </div>
</template>

<!-- 这是是行为，控制，方法-->
<script>
export default {
  props:{
      title:{
          required:true
      },
      content:{
          required:false
      }
  },
  data() {
    return {

    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<!-- 这是是页面样式-->
<style scoped>
.lablename{
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 7px;
    color: rgba(0, 0, 0, 0.65);
}
.title{
    font-size: 13px;
     margin-right: 8px;
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
}
.content{
font-size: 13px;
color: rgba(54, 54, 54, 0.85);
}
</style>
