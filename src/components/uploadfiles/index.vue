<!-- 这是页面布局控件-->
<template>
  <div class="cssupload">
    <div class="step1">
      <p class="title">准备数据</p>
      <p>请直接下载模板，相关规范要求可以查看模板的首行“导入规则说明”</p>
      <p>
        <a :style="{color:'#169bd5'}" @click="dowmLoadtemplete">
          <img src="@/assets/images/downLoad.png" style="verticalAlign: 'sub'" />下载导入模板
        </a>
      </p>
    </div>
    <div class="step2" :style="{marginTop: '20px'}">
      <p class="title">上传数据</p>
      <a-row>
        <a-upload
          :class="fileList.length >= 1?'':'cssuploadfile'"
          name="file"
          accept=".xls, .xlsx"
          :action="uploadUrl"
          @change="handleChange"
          :beforeUpload="beforeUpload"
          :fileList="fileList"
          :disabled="fileList.length >= 1"
          :directory="false"
        >
          <a-button>
            <a-icon type="upload" />点击上传附件
          </a-button>
        </a-upload>
        <span class="uploadtips">{{uploadTips}}</span>
      </a-row>

      <div class="editDiv" :style="{ width: '100%', margin: '30px auto 0' }">
        <div class="registration">
          <span v-show="fileList.length==0" id="spn">{{resultTips}}</span>
          <slot name="uploadresult"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- 这是行为，控制，方法-->
<script>
// import { uploadUrl } from "./../../utils/config";
export default {
  props: {
    uploadTips: {
      required: false,
      default: "目前支持的文件类型为*.xls，*.xlsx，大小在2M内。"
    },
    resultTips: {
      required: false,
      default:
        "上传完毕后，此处可以查看数据校验后的结果，校验成功后方可完成此次批量登记操作。"
    },
    handleChangefp: {
      required: false,
      type: Function,
      default: null
    },
    beforeUploadfp: {
      required: false,
      type: Function,
      default: null
    },
    fileListfp: {
      required: true
    },
    uploadDown: {
      type: Function
    },
    uploadUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // uploadUrl: uploadUrl,
      fileList: [],
      header: {
        Authorization: "Basic " + sessionStorage.getItem("auth")
      }
    };
  },
  methods: {
    dowmLoadtemplete: function() {
      this.uploadDown();
    },
    beforeUpload: function(file) {
      if (this.beforeUploadfp) {
        this.beforeUploadfp(file);
      } else {
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (!isLt2M) {
          message.error("单个附件大小最多20M");
        } else {
        }
        return true;
      }
    },
    handleChange: function(info) {
      //文件上传方法
      console.log(info);
      if (this.handleChangefp) {
        this.handleChangefp(info);
      } else {
        let fileList = info.fileList;

        if (info.file.status === "done") {
          // message.success(`${info.file.name} 文件上传成功`,1);
          // $('.registration').html('<span style=\'padding:0 6px 0 6px\'>正在校验数据，请稍等...</span>');
          // let fileUrl = info.file.response;
          // var data = http.ajax({
          //     url: '/SelfConciliate/GetBatchImportValidate',
          //     data: { filePath: fileUrl },
          // })
          // if (data.Status == 200) {
          //     var suc = '<p class="ietmps">数据无误，请点击“确定”进行导入！</p>';
          //     $('.registration').html(suc);
          //     _AllEdit.setState({
          //         disabledModalbtn: false
          //     })
          // } else {
          //     if (data.Status == 400) {
          //         if (data.Msg == '导入数据格式错误，请查看各列列头名称是否符合模版要求') {
          //             $('.registration').html('<span style=\"color:#FF0000;padding:0 10px 10px;\">导入数据格式错误，请查看各列列头名称是否符合模版要求</span>');
          //         } else if (data.Msg == '内容超过800行请整理法规后重新上传') {
          //             $('.registration').html('<span style=\"color:#FF0000;padding:0 10px 10px;\">excel文件最多800行。</span>');
          //         } else if (data.Msg == '文件损坏') {
          //             $('.registration').html('<span style=\"color:#FF0000;padding:0 10px 10px;\">导入数据格式错误，请查看各列列头名称是否符合模版要求</span>');
          //         } else if (data.Msg == '内容为空请重新上传') {
          //             $('.registration').html('<span style=\"color:#FF0000;padding:0 10px 10px;\">导入数据内容为空，请检查后重新导入</span>');
          //         }
          //         else {
          //             var str = '';
          //             var num = 0;
          //             var more = '<p class="ietmp">检测到有大量数据不符合数据规范要求，请仔细检查后重新导入</p>';
          //             var firstInfo = '<span style=\"color:#FF0000;padding:0 10px 10px;\">以下数据不符合数据规范：</span>'
          //             data.Data.some(function (value,idx) {
          //                 str += '<p class="ietmp">' + value + '</p>';
          //                 num = num + 1;
          //                 if (num > 19)
          //                     return true;
          //             })
          //             if (num>19)
          //                 $('.registration').html(firstInfo + str + more)
          //             else
          //                 $('.registration').html(firstInfo + str)
          //         }
          //     }
          // }
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} 文件上传失败`);
        }
        fileList = fileList.map(file => {
          if (file.response) {
            file.url = file.response;
          }
          return file;
        });
        fileList = fileList.filter(file => {
          if (file.size < 20971520) {
            return true;
          } else return false;
        });
        this.fileList = fileList;
      }
    }
  },
  components: {},
  watch: {
    fileListfp: {
      handler(newvalue) {
        this.fileList = newvalue;
      },
      immediate: true
    }
  }
};
</script>

<!-- 这是页面样式-->
<style scoped>
.cssupload {
  width: "100%";
  height: 400;
  overflow: "auto";
  padding: 0px;
}
.cssupload p {
  margin-bottom: 10px !important;
}
.editDiv {
  border: 1px solid rgba(217, 217, 217, 1);
  height: 180px;
  overflow-x: auto;
  border-radius: 4px;
}
.editDiv #spn {
  display: inline-block;
  height: 60px;
  color: #ccc;
  font-size: 14px;
  padding: 6px 6px 6px 6px;
}
.errorList {
  border-bottom: 1px solid #ccc;
  padding: 8px 16px;
  transition: all 0.3s;
  cursor: pointer;
}
.ant-popover-inner-content {
  overflow: auto;
}
.ietmp {
  color: #ff0000;
  padding: 0 10px 10px;
  margin-bottom: 0;
}
.ietmps {
  color: #009900;
  padding: 6px 0 0 6px;
}

.closeEdit {
  position: absolute;
  right: 30px;
  top: 10px;
}
.cssuploadfile {
  display: -webkit-inline-box;
}
.uploadtips {
  display: -webkit-inline-box;
  vertical-align: bottom;
  color: #999;
  padding-top: 10px;
}
.title {
  font-size: 14px;
  color: rgb(34, 33, 33);
}
</style>
