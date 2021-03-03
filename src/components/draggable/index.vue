<!-- 这是页面布局控件-->
<template>
  <div>
      <a-row>
         <draggable element="ul" v-model="newdata" 
          v-bind="dragOptions"  @update="datadragEnd" 
          >
          <slot name="content"></slot>
         </draggable>
      </a-row>

  </div>
</template>

<!-- 这是行为，控制，方法-->
<script>
import draggable from 'vuedraggable';
export default {
  props:{
      data:{
          type:Array,
          required:true,
      },
      changeData:{
          type:Function,
          required:true
      },
      dragdisabled:{
          required:false,
          default:false,
      }
  },
  data() {
    return {
        newdata:[],
    }
  },
  created(){
 
  },
  methods: {
    datadragEnd (evt) {
        evt.preventDefault();
        // console.log('拖动前的索引 :' + evt.oldIndex)
        // console.log('拖动后的索引 :' + evt.newIndex)
        // console.log('拖动后的data :', this.newdata)
        if(this.changeData)
           this.changeData(this.newdata);
    }
  },
  components: {
     draggable
  },
  computed: {
    dragOptions() {
      return {
        animation: 400,
        group: "description",
        disabled: this.dragdisabled,
        ghostClass: "ghostClass",
        forceFallback:true,
        fallbackClass:'fallback',
        filter: '.dofunction',
        dragClass:'dragClass',
        chosenClass:'chosenClass',
      };
    }
  },
  watch:{
      data:{
          handler:function(newvalue,oldvalue){
              this.newdata=newvalue;
          },
          immediate:true
      }
  }
}
</script>

<!-- 这是页面样式-->
<style>
.ghostClass {
  opacity: 0.5 !important;
}
.dragClass {
  opacity: 1 !important;
}


.fallback{
  opacity: none;
}
</style>
