<template>
  <div>
    <a-modal
      :title="mtitle"
      v-model="mvisible"
      :width='mwidth'
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确认"
      cancelText="取消"
      :maskClosable="false"
    >
    <template v-if="$slots.title" slot="title">
       <slot name="title"></slot> 
     </template>
     <template v-if="$slots.footer" slot="footer">
       <slot name="footer"></slot> 
     </template>
      <slot name="content"></slot>
   </a-modal>
  </div>
</template>
<script>
export default {
  props:{
    title:{
      required:false,
    },
    visible:{
      required:true
    },
    type:{
      required:false,
    }
  },
  data() {
    return {
      mvisible:false,
      mtitle:'',
      mwidth:'520px'
    }
  },
  methods: {
    handleOk(e) {
      console.log(e);
      this.$emit('handelok','handleOk');
    },
    handleCancel(e) {
      this.$emit('handelcandel','handelcandel');
    },
  },
  watch:{
      visible:{
        handler (newVal) {
         console.log(newVal);
         this.mvisible=newVal;
        },
	      immediate: true,
      },
      title:{
        handler (newVal) {
         console.log(newVal);
         this.mtitle=newVal;
        },
	      immediate: true,
      },
      type:{
        handler (newVal) {
         console.log(newVal);
         this.mwidth=(newVal=='default'?'858px':(newVal=='small'?'416px':'520px'));
        },
	      immediate: true,
      }
  }
}
</script>
<style>
@media screen and (max-width: 860px){
.ant-modal {
    width: auto !important;
    margin: 10px;
 }
}

</style>
