<!-- 这是页面布局控件-->
<template>
  <div>
    <div class="crumbLayout">
      <div class="layoutCenter">
        <p>
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>个人设置</a-breadcrumb-item>
          </a-breadcrumb>
        </p>
        <h3>个人设置</h3>
      </div>
    </div>
    <div class>
      <div class="layoutCenter settingPage">
        <a-form class="Form" :form="form" @submit="handleSubmit">
          <a-form-item v-bind="formItemLayout" label="登录名">
            <a-input v-decorator="['loginname']" placeholder="请输入登录名" disabled />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="姓名">
            <a-input
              v-decorator="['name',{rules: [{required: true, message: '请输入您的姓名',}],}]"
              placeholder="请输入姓名"
              maxlength="20"
            />
          </a-form-item>

          <a-form-item v-bind="formItemLayout" label="性别">
            <a-select v-decorator="['sex',{rules: [{required: true, message: '请输入您的性别',}],}]">
              <a-select-option value="1">男</a-select-option>
              <a-select-option value="2">女</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="联系电话">
            <a-input
              placeholder="请输入联系电话"
              v-decorator="['phone',{rules: [{ message: '请输入您的联系电话'}, { pattern: /^\d{6,30}$/, message: '请输入有效的联系电话' }]}]"
              maxlength="30"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="角色">
            <a-input v-decorator="['role']" placeholder disabled />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="密码">
            <a-row :gutter="10">
              <a-col :span="20">
                <a-input disabled type="password" v-model="userPossword" />
              </a-col>
              <a-col :span="4" :style="{textAlign:'right'}">
                <a-button @click="showModal">修改</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-bind="tailFormItemLayout">
            <a-button type="primary" html-type="submit">提交</a-button>
            <a-button class="return" @click="returnPro()">返回</a-button>
          </a-form-item>
        </a-form>
        <AntModal
          :title="mtitle"
          :visible="mvisible"
          type="small"
          :maskClosable="false"
           @handelok='handelmodalok' 
           @handelcandel='handelmodalcandel' 
        >
         <template slot="content">
           <a-form :form="form">
            <a-form-item v-bind="alertItemLayout" label="原密码">
              <a-input
                v-decorator="['oldpwd',{rules: [{required: true, message: '请输入原密码',}],}]"
                maxlength="20"
                type="password"
              />
            </a-form-item>
            <a-form-item v-bind="alertItemLayout" label="新密码">
              <a-input
                v-decorator="['newpwd',{rules: [{required: true, message: '请输入新密码',}],}]"
                placeholder="新密码，6~20位，区分大小写"
                maxlength="20"
                type="password"
              />
            </a-form-item>
            <a-form-item v-bind="alertItemLayout" label="确认密码">
              <a-input
                v-decorator="['comfirmpwd',{rules: [{required: true, message: '请确认密码',}],}]"
                placeholder="重新输入一遍新密码"
                type="password"
                maxlength="20"
              />
            </a-form-item>
          </a-form>
          </template>
        </AntModal>
      </div>
    </div>
  </div>
</template>

<!-- 这是行为，控制，方法-->
<script>
import pubFun from "./../utils/pub.js";
import AntModal from "./../components/modules/antModal";
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      loginname: "",
      name: "",
      sex: "",
      phone: "",
      role: "",
      userPossword: "",
      mtitle:"密码修改",
      mvisible:false,
      loginName: sessionStorage.getItem("username"),
      userPossword: sessionStorage.getItem("password"),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 9 },
          xxl: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 8 },
          xxl: { span: 10 }
        }
      },
      alertItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
          xxl: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
          xxl: { span: 16 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 15,
            offset: 9
          },
          xxl: { span: 17, offset: 7 }
        }
      }
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
   
    showModal() {
      this.mvisible = true;
    },
    getInfo() {
      let data = {
        url: "/HomePage/GetUserInfoDetail",
        method: "GET"
      };
      this.$dataApi(data)
        .then(data => {
          var sexS = "";
          var roles = "";
          if (data.status === 200) {
            if (data.data.User_Sex == "1") {
              sexS = "男";
            } else {
              sexS = "女";
            }
            if (data.data.User_Role == "1") {
              roles = "普通用户";
            } else {
              roles = "管理员";
            }

            this.form.setFieldsValue({
              loginname: data.data.User_LoginName,
              name: data.data.User_Name,
              sex: sexS,
              phone: data.data.User_LinkPhone,
              role: roles
            });
            this.userPossword = data.data.User_Password;
          }
        })
        .catch(err => {});
    },
    
    returnPro() {
      this.$router.push("/MyProject");
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {

        if (!err) {
          let data = {
            url: "/HomePage/UpdateUserInfo",
            method: "POST",
            data: {
              U_UserName: values.name,
              U_Sex: values.sex,
              U_LinkPhone: values.phone
            }
          };
          this.$dataApi(data)
            .then(data => {
              if (data.status === 200) {
                this.$message.success(data.msg);
              } else {
                this.$message.error(data.msg);
              }
            })
            .catch(err => {});
        }
      });
    },
     handelmodalcandel() {
      this.form.resetFields(["oldpwd", "newpwd", "comfirmpwd"]);
      this.mvisible = false;
    },
    handelmodalok() {
    
      this.form.validateFields((err, values) => {
        if (values.oldpwd != "" && values.oldpwd != null) {
          if (values.newpwd.length > 5 && values.newpwd.length < 21) {
            if (values.newpwd == values.comfirmpwd) {
              if (!err) {
                let data = {
                  url: "/HomePage/UpdatePassword",
                  method: "POST",
                  data: {
                    OldPassword: values.oldpwd,
                    NewPassword: values.newpwd
                  }
                };
                this.$dataApi(data)
                  .then(data => {
                    if (data.status === 200) {
                      this.$message.success(data.msg);
                      this.mvisible = false;
                      this.form.resetFields(["oldpwd", "newpwd", "comfirmpwd"]);
                    } else {
                      this.$message.error("原密码错误，请重新输入！");
                    }
                  })
                  .catch(err => {});
              }
            } else {
              this.$message.error("请重新确认新密码");
            }
          } else {
            this.$message.error("请输入符合规则的新密码");
          }
        }else{
          this.$message.error("请输入原密码");
        }
      });
    }
  },
  components: {
    AntModal
  }
};
</script>

<!-- 这是页面样式-->
<style scoped>
.layoutContent {
    min-height: calc(100vh - 64px) !important;
    position: relative;
    z-index: 1;
}
.layoutCenter {
  background: #fff;
}
.settingPage {
  margin-top: 24px;
}
.Form {
  padding-top: 30px;
  padding-bottom: 40px;
}
.return {
  margin-left: 15px;
}
</style>
