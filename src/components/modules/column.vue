<!-- 这是页面布局控件-->
<template>
  <a-col :key='colkey' :xl="xl" :md="md">
     <slot name="formItem"></slot>
  </a-col>
</template>

<!-- 这是是行为，控制，方法-->
<script>
export default {
  props: {
    colkey:{
    },
    xl: {
      required: false,
      default: 8
    },
    md: {
      required: false,
      default: 12
    }
  },
  data() {
    return {};
  },
  methods: {},
  components: {}
};
</script>

<!-- 这是是页面样式-->
<style scoped>
</style>
