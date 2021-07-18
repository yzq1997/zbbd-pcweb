<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  beforeCreate:function(){
  
  }
}
</script>

<style>
body{
    height: 100% !important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height:100%;
}
.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
/* .ant-table-body{
    overflow-x: scroll !important;
}
table{
    width: 2000px !important;
} */
</style>
