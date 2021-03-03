<!-- 这是页面布局控件-->
<template>
  <div class="loading">
   <a-spin size="large"/>
  </div>
</template>

<!-- 这是行为，控制，方法-->
<script>
export default {
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
<style scoped>
.loading{
    width: 100%;
    position: fixed;
    top: 10%;
    left: 0;
    text-align: -webkit-center;
    z-index: 9999;
}
</style>
