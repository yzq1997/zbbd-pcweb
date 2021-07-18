<template>
  <div class="LoginBox">
    <div class="LoginWrap">
      <h2>招标宝典管理后台</h2>
      <a-form :form="form" :style="{width:'360px',margin:'0 auto'}">
        <a-alert
          v-if="errorShow"
          type="error"
          :message="errorMsg"
          :showIcon="true"
          :style="{marginBottom:'24px'}"
        />
        <a-form-item>
          <a-input
            size="large"
            placeholder="请输入登陆名"
            v-decorator="[
            'username',
              {rules: [{ required: true, message: '请输入登陆名！' },{ max: 12, message: '登陆名长度在12以内' },{ min: 6, message: '登陆名长度在6以上' }]}
            ]"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            placeholder="请输入密码"
            type="password"
            v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码！' },{ max: 20, message: '密码长度在20以内' },{ min: 6, message: '密码长度在6以上' }]}
          ]"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <!-- <a-form-item>
          <a-checkbox v-decorator="['remember', {valuePropName: 'checked'}]">记住密码</a-checkbox>
          <a-tooltip>
            <template slot="title">请联系管理员进行密码重置！</template>
            <span :style="{float:'right',paddingRight:0,color:'#1890ff'}">忘记密码？</span>
          </a-tooltip>
        </a-form-item> -->
        <a-button type="primary" html-type="submit" size="large" block @click="handleSubmit">登录</a-button>
      </a-form>
    </div>
    <p class="LoginFooter">技术支持：江苏户传科技有限公司 联系电话：025-52429993</p>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import pubFun from "./../utils/pub.js";

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      errorMsg: "",
      errorShow: false,
      stopClick:true,
    };
  },
  components: {},
  beforeCreate: function() {},
  methods: {
    handleSubmit() {
      if(this.stopClick)
      {
       let that = this;
       this.stopClick = false;
       this.form.validateFields((err, values) => {
         if (!err) {
           let data = {
              url: "/api/Login/GetLogin",
              method: "POST",
              data: {
                LoginName: values.username,
                PassWord: values.password
              },
            };
           that.$dataApi(data).then(res => {
              // this.$router.push({name:"myProject"});
               if (res.Status === 200) {
				   console.log(res);
                 sessionStorage.setItem('userName',values.username);
                 sessionStorage.setItem('auth',res.Msg);
				  sessionStorage.setItem('id',res.Data[0].Id);
                 that.COMMON.addCookie('userLogin',values.username,24);
                 that.COMMON.addCookie('userPassword',values.password,24);
                 that.$router.push({name:"myProject"});
               } else {
                 that.errorMsg = res.Msg;
                 that.errorShow = true;
               }
               that.stopClick = true;
             })
              .catch(err => {"dsadsa"});
          }
        });
      }
    }
  },
  mounted: function() {
    // if(this.COMMON.getCookie('userLogin'))
    // {
    //   let data = {
    //       url: "/api/Login/Login",
    //       method: "POST",
    //       data: {
    //           U_LoginName: this.COMMON.getCookie('userLogin'),
    //           U_Password: this.COMMON.getCookie('userPassword')
    //       }
    //   };
    //   this.$dataApi(data).then(res => {
    //       if (res.status === 200) {
    //           sessionStorage.setItem('userName',this.COMMON.getCookie('userLogin'));
    //           sessionStorage.setItem('auth',res.msg);
    //           that.$router.push({name:"myProject"});
    //       } else {
    //           that.errorMsg = res.msg;
    //           that.errorShow = true;
    //           that.$router.push({name:'login'})
    //       }
    //   })
    // }
    
  }
};
</script>

<style scoped>
.LoginBox {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #f0f2f5
    url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg)
    no-repeat center;
  background-size: 100%;
}
.LoginWrap {
  position: absolute;
  width: 100%;
  top: 30%;
  left: 0;
}
.LoginWrap > h2 {
  font-size: 30px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
  text-align: center;
  margin-bottom: 50px;
}

.LoginFooter {
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
  width: 100%;
  color: rgba(0, 0, 0, 0.45);
}
</style>