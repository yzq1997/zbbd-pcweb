<template>
  <a-layout>
    <a-layout-header>
      <div class="layoutCenter">
        <span class="logoTitle">
          户传科技
          <br />活动管理平台
        </span>
        <a-menu
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' ,display:'inline-block'}"
          :defaultSelectedKeys="[current]"
          @click="menuClick"
        >
          <a-menu-item key="/myProject">
            <router-link to="/myProject">我的项目</router-link>
          </a-menu-item>
          <a-sub-menu key="system">
            <span slot="title" class="submenu-title-wrapper">系统设置</span>
            <a-menu-item key="/system/user">
              <router-link to="/system/user">用户管理</router-link>
            </a-menu-item>
            <a-menu-item key="/system/systemLog">
              <router-link to="/system/systemLog">系统日志</router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
        <span class="userManage">
          <a-dropdown>
            <a class="ant-dropdown-link" href="#">
              {{username}}
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="toSetting()">个人设置</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="logout()">退出登录</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </div>
    </a-layout-header>
    <a-layout-content class="layoutContent">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer class="layoutFooter">技术支持：江苏户传科技有限公司 联系电话：025-52429993</a-layout-footer>
  </a-layout>
</template>

<script>
import pubFun from "./../utils/pub.js";
export default {
  mounted() {
    this.getInfo();
  },
  data() {
    return {
      current: "/myProject",
      username: ""
    };
  },
  methods: {
    toSetting: function() {
      this.current = "";
      sessionStorage.setItem("selectkey", this.current);
      this.$router.push("/setting");
    },
    logout: function() {
      this.username = "";

      pubFun.delCookie("username");
      pubFun.delCookie("password");
      this.$router.push("/login");
      let data = {
        url: "/HomePage/LogOff",
        method: "GET"
      };
      this.$dataApi(data)
        .then(data => {
          if (data.status === 200) {
            sessionStorage.clear();
          }
        })
        .catch(err => {});
    },
    menuClick: function(data) {
      this.current = data.key;
      sessionStorage.setItem("selectkey", data.key);
    },
    getInfo() {
      let data = {
        url: "/HomePage/GetUserInfoDetail",
        method: "GET"
      };
      this.$dataApi(data)
        .then(data => {

          if (data.status === 200) {
            this.username = data.data.User_Name;
            sessionStorage.setItem("User_Code", data.data.User_Code);
          }
        })
        .catch(err => {});
    }
  },
  created: function() {
    if (
      sessionStorage.getItem("selectkey") != "" &&
      sessionStorage.getItem("selectkey") != null
    ) {
      this.current = sessionStorage.getItem("selectkey");
    }
  }
};
</script>

<style>
.layoutContent {
  min-height: calc(100vh - 64px - 69px);
  position: relative;
  z-index: 1;
}
.layoutFooter {
  /* position: absolute; */
  /* bottom: 0; */
  /* left: 0; */
  text-align: center;
  /* width: 100%; */
  color: rgba(0, 0, 0, 0.45);
}
.layoutCenter {
  max-width: 1152px;
  margin: 0 auto;
}

.logoTitle {
  color: #fff;
  float: left;
  font-size: 16px;
  line-height: 18px;
  font-weight: bold;
  margin: 16px 50px 0 0;
}
.userManage {
  float: right;
  padding: 0 8px;
  text-align: right;
}
.userManage .ant-dropdown-link {
  color: rgba(255, 255, 255, 0.65);
}
.userManage .ant-dropdown-link:hover {
  color: rgba(255, 255, 255, 1);
}

.crumbLayout {
  background: #fff;
  height: 98px;
  padding-top: 15px;
}
.crumbLayout h3 {
  font-size: 20px;
  font-weight: bold;
}

.paperContent .ant-tabs-nav-scroll {
  padding-left: 20px !important;
}
.paperContent .prizeDispose .ant-tabs-nav-scroll {
  padding-left: 0 !important;
}
.paperContent .ant-tabs-bar {
  margin-bottom: 0;
}
.paperContent .ant-tabs-nav-container {
  box-shadow: 0 3px 6px 0 rgba(71, 109, 190, 0.1) !important;
}
.prizeImages .ant-upload.ant-upload-select-picture-card {
  width: 70px;
  height: 70px;
}
.prizeDispose .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
  padding: 12px 100px 12px 40px;
}
.prizeDispose .ant-tabs-nav .ant-tabs-tab-active {
  background: #e6f7ff;
}

.antFormInline .ant-form-item {
  display: flex;
}
.antFormInline .ant-form-item-control-wrapper {
  flex: 1;
}

.addBanner .ant-upload {
  width: 100%;
  height: 100%;
  margin: 0;
}

*,
body,
ol,
ul,
h1,
h2,
h3,
h4,
h5,
h6,
p,
th,
td,
dl,
dd,
form,
fieldset,
legend,
input,
textarea,
select,
span,
div {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
}
/* body,
input,
textarea {
  font-family: "微软雅黑" !important;
} */
ul,
ol {
  list-style: none;
}
a {
  text-decoration: none;
}
a:hover {
  text-decoration: none;
}
a:focus {
  outline: none;
}
img {
  border: 0;
  vertical-align: middle;
}
.lf {
  float: left;
}
.rt {
  float: right;
}
.clear:after {
  content: "";
  display: block;
  clear: both;
}
</style>