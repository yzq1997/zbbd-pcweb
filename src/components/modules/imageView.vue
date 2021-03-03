<!-- 这是页面布局控件-->
<template>
   <div  class="cssimg" v-lazy:background-image="src"  :style="{width:width,height:height }"></div>
</template>

<!-- 这是行为，控制，方法-->
<script>
export default {
  props:{
      src:{
          required:false
      },
      width:{
          default:'200px'
      },
      height:{
          default:'200px'
      },
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

<!-- 这是页面样式-->
<style >
  .cssimg[lazy=loading] {
    /*your style here*/
    background: #ffffff;
        background-position: center center;
        background-repeat:  no-repeat;
  }
  .cssimg[lazy=error] {
    /*your style here*/
        background-position: center center;
        background-repeat:  no-repeat;
  }
  .cssimg[lazy=loaded] {
    /*your style here*/
     background: #ffffff;
        background-position: center center;
        background-repeat:  no-repeat;
        background-size: cover;
  }

</style>
