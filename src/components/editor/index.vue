<template>
  <div class='tinymce'>
    <editor :id='myeditorname' v-model='tinymceHtml' :init='init'></editor>
    <!-- <div v-html='tinymceHtml'></div> -->
    <div>{{ hT }}</div>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
// import 'tinymce/plugins/emoticons'

export default {
  props:{
    editValue:{
      required:false
    },
    editorname:{
        required:false,
        default:'tinymce'
    },
    eheight:{
        required:false,
        default:300
    },
    getEditorModel:{
      type:Function,
      required:false,
    }
  },
  props:['initOption'],
  data () {
    return {
      hT:'',
      myeditorname:'myeditor',
      tinymceHtml: '请输入内容',
      init: {
        language_url: './static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: './static/tinymce/skins/ui/oxide',
        height: this.eheight,
        plugins: 'link lists code table colorpicker textcolor wordcount contextmenu',//image
        toolbar:
          'bold italic underline strikethrough  forecolor backcolor link unlink image code removeformat selectall undo redo',
        branding: false,
        statusbar: false,
        charLimit:2000,//字数限制
        menubar: false,//隐藏菜单栏
        elementpath: true,//隐藏底栏的元素路径
        resize: false,//文本框右下角拖动鼠标调整编辑器高度，默认true
        images_upload_url: 'https://webservice.jshcsoft.com/upload/UpLoadFile/UploadHandler.ashx?type=tinymcejson',
        //上传图片回调
        //images_upload_handler:(blobInfo, success, failure) => {
            //  let fd = new FormData()
            //  fd.append('file',blobInfo.blob())
            //  uploadRichImg(fd).then(res => {
            //    let result = res.data[0]
            //    success(result.url)
            //    })
            //    .catch(err => {

            //    })
        //},
        //自定义按钮
        // setup: (editor) => {
        //   editor.ui.registry.addButton('fileUpload', {
        //     tooltip: '插入文件',
        //     icon: 'image',
        //     onAction: () => {
        //           alert('这是自定义插入文件')
        //     }
        //   })
        // }
        // 光标会自动跳转到开始位置，尚未解决
        setup :(ed)=>{
          let eds = ed,that = this;
          ed.on('keyUp',(sd,e)=>{
            let tinymax, tinylen, htmlcount;
            tinymax = eds.settings.charLimit || 2000;// 默认2000字
            tinylen = eds.getContent().replace(/(<([^>]+)>)/ig,"").length;
            that.hT = htmlcount = "富文本字数:" + (tinylen>tinymax?tinymax:tinylen) +"/" + tinymax;
            // 超出字数强制截取前2000个
            if(tinylen>tinymax)
            {
              // 不加不好用，不知道为什么
              setTimeout(function(){
                that.tinymceHtml = eds.getContent().replace(/(<([^>]+)>)/ig,"").substring(0,tinymax)
              },0)
            }
          })
        }
      }
    }
  },
  mounted () {
    tinymce.init({})
  },
  components: {Editor},
  methods:{
    
  },
  created(){
    // 更新init值
    if(this.initOption && this.initOption instanceof Object && !Array.isArray(this.initOption))
    {
      // 过滤空值
      this.COMMON.dropObj(this.initOption)
      Object.assign(this.init,this.initOption)
    }
  },
  watch:{
    editValue:{
      handler(val,oldvalue){
        this.tinymceHtml=val;
      },
      immediate:true
    },
    editorname:{
      handler(newvalue,oldvalue){
        this.myeditorname=newvalue;
      },
      immediate:true
    },
    tinymceHtml:{
        handler(newvalue,oldvalue){
          if(this.getEditorModel)
          {
            this.getEditorModel(newvalue);
          }
          if(newvalue)
          {
            let tinylen, htmlcount;
            tinylen = newvalue.replace(/(<([^>]+)>)/ig,"").length;
            this.hT = htmlcount = "富文本字数:" + (tinylen>2000?2000:tinylen) +"/" + 2000;
          }
        },
        immediate:true
    }
  }
}
</script>
<style>

</style>