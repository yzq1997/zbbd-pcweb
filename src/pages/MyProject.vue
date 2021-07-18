<template>
    <div class="contentWrap" style="overflow:hidden;">
        <!-- <div> -->
			<div  :style="{width:+collapsed?'80px':'260px',float:'left',transition:'all 0.4 linear'}">
				<div class="headerOprtionLeft" style="height: 70px;">
				    <div class="logo" :style="{width:+collapsed?'80px':'260px'}">
				        <div class="logo_pic"></div>
				        <span v-if="collapsed==false" style="line-height: 70px; padding-left: 24px;">招标宝典管理后台</span>
				    </div>
				</div>
				<a-menu
				    :defaultSelectedKeys="[defaultSelectedKeys]"
				    mode="inline"
				    theme="dark"
				    :inlineCollapsed="collapsed"
				    class="menu"
				    ref="menu"
				    :selectedKeys="selectedKeyList"
				    :style="{height:Height}"
				    @click="clickItems"
				>
				    <template v-for="item in list">
				        <a-menu-item v-if="!item.children" :key="item.key">
				            <a-icon :type="item.icon" />
				            <span>{{item.title}}</span>
				        </a-menu-item>
				        <sub-menu v-else :menu-info="item" :key="item.key" />
				    </template>
				</a-menu>
			</div>
		 
			<div :style="{width:+collapsed?'calc(100% - 80px)':'calc(100% - 260px)',float:'left',transition:'all 0.4 linear'}">
				<div style="height: 70px;line-height: 70px;background-color: white;">
					<a-breadcrumb>
					    <a-icon @click="toggleCollapsed" style="color:#5F5F5F;font-size:20px;font-weight:bold;margin-right:10px;" :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
					    <a-breadcrumb-item v-for="(item,index) in menuSelect" :key="index" :style="index == 0?{color:'#5A5A5A','font-size':'16px','font-weight':'bold'}:{color:'#5A5A5A','font-size':'16px'}" @click="selectItems(item)">
					        {{ item.title }}
					    </a-breadcrumb-item>
					</a-breadcrumb>
					<div class="headerOptionRight" style="float: right;padding-right: 20px;">
					    <a-dropdown :trigger="['click']" v-if="userName">
					        <span class="ant-dropdown-link" style="cursor:pointer;"> {{ userName }}<a-icon type="down" /></span>
					        <a-menu slot="overlay">
					            <a-menu-item key="0" style="padding:5px 50px 5px 20px;" @click="editPassword">
					                <span><a-icon type="form" style="margin-right:10px;" />修改密码</span>
					            </a-menu-item>
					            <a-menu-item key="1" style="padding:5px 50px 5px 20px;" @click="loginOut">
					                <span><a-icon type="logout" style="margin-right:10px;"/>注销</span>
					            </a-menu-item>
					        </a-menu>
					    </a-dropdown>
					</div>
				</div>
				<div class="content">
				    <div :is="pages"></div>
				</div>
			</div>
		<!-- </div> -->
        <a-modal
            :maskClosable="false"
            title="修改密码"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            okText="确定" cancelText="取消"
            >
            <div>
                <a-form :form="editPform">
                    <a-form-item label="当前密码：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
                        <a-input style="width:200px;"
                            placeholder="请输入"
                            v-decorator="['OldPassword',{rules: [{ required: true, message: '请输入当前密码' },{ min: 6, message: '密码长度在6以上' },{ max: 20, message: '密码长度在20以内' }]}]"
                        />
                    </a-form-item>
                    <a-form-item label="新密码：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
                        <a-input style="width:200px;" type="password"
                            placeholder="6~20位;英文及数字"
                            v-decorator="['NewPassword',{rules: [{ required: true, message: '请输入新密码' },{pattern:/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,20})$/,message:'密码格式有误！'}]}]"
                        />
                    </a-form-item>
                    <a-form-item label="新密码确认：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 } ">
                        <a-input style="width:200px;" type="password"
                            placeholder="两次密码保持一致"
                            v-decorator="['RePassword',{rules: [{ required: true, message: '请再进行密码确认',validator:(rule,value,callback)=>{
                                if(!value)
                                {
                                    callback('请进行密码确认！');
                                    this.errorMessage = '请进行密码确认！';
                                }else if (value !== this.editPform.getFieldValue('NewPassword')) {
                                    callback('两次新密码输入不一致');
                                    this.errorMessage = '两次新密码输入不一致';
                                }
                                callback();
                            },message:errorMessage}]}]"
                        />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>
<script>
import SubMenu from './SubMenu';
import home from './home/newhome';
import dayData from './home/dayData';
import dayDataHY from './home/dayDataHY';
import dayDataA from './home/dayDataA';
import dayDataB from './home/dayDataB';
import dayDataC from './home/dayDataC';
import role from './home/Role';
import cshome from './home/home';
import comparativeTest from './comparativeTest/index';
import compareNew from './comparativeTest/compareNew';
import userManage from './systemSetting/userManage';
import userAccess from './chartdata/userAccess'
import userType from './chartdata/userType'
import userKeyWords from './chartdata/userKeyWords'
import userIndustry from './chartdata/userIndustry'
import userRegion from './chartdata/userRegion'
import menuAnalysis from './chartdata/menuAnalysis'


import Informationpush from './chartdata/Informationpush'
import keyWords from  './chartdata/keyWords'
import bidDinginfo from  './chartdata/bidDinginfo'
import feedback from './feedback/feedback'
import userData from './userData/index';
import userDataDetail from './userData/detail';
import userDrawinfo from './lottery/userdraw';
import userSignin from  './lottery/userSignin';
import userRedemption from  './lottery/userRedemption';
import zbError from './zbdata/zbError'
import zbSource from './zbdata/zbSource'
import dataConfig from './zbdata/dataConfig'
import registered from './registered/registered'
import Bus from '../utils/vue-bus';

export default {
    components:{
       SubMenu,
       home,
       dayData,
	   cshome,
       comparativeTest,
       compareNew,
       userManage,
       userData,
       role,
       userDataDetail,
       userAccess,
       userIndustry,
       userKeyWords,
	   userType,
	   userRegion,
	   menuAnalysis,
	   Informationpush,
	   keyWords,
	   bidDinginfo,
	   registered,
       feedback,
       userDrawinfo,
       userSignin,
       userRedemption,
       zbSource,
       zbError,
       dayDataHY,
       dayDataA,
       dayDataB,
       dayDataC,
       dataConfig
        
    },
    data(){
        return {
            errorMessage:'',
            selectedKeyList:['home'],
            Height:'1000px',
			// Height:1000,
            // offWidth:'',
            collapsed: false,
            RegStatus:"",
            help:'',
            editPform:this.$form.createForm(this, { name: 'editPassword' }),
            visible:false,
            pages:'',
            userName:sessionStorage.getItem('userName'),
            // collapsed: false,
            defaultSelectedKeys:"home",
            menuList:[],
            list: [
                {
                    key: 'home',
                    title: '首页',
                    icon:'dashboard'
                },
                {
                    key: 'userData',
                    title: '用户数据',
                    icon:'form',
                },
                {
                    title: '用户数据统计',
                    icon:'line-chart',
                    children: [
                        {
                            key: 'userType',
                            title: '用户类型统计',
                        },
                        {
                            key: 'userKeyWords',
                            title: '用户关键词统计',
                        },
                        {
                            key: 'userIndustry',
                            title: '用户行业统计',
                        },
                        {
                            key: 'userRegion',
                            title: '用户地区统计',
                        },
                        {
                            key: 'menuAnalysis',
                            title: '菜单分析',
                        },
                        
                        {
                            key: 'userAccess',
                            title: '用户访问数据统计',
                        },
                        {
                            key: 'keyWords',
                            title: '关键字数据统计',
                        },
                        {
                            key: 'Informationpush',
                            title: '信息推送数据统计',
                        },
                    ],
                },
				{
				    key: 'comparativeTest',
				    title: '招标信息',
				    icon:'form',
				},
				{
				    title: '招标数据统计',
				    icon:'line-chart',
                    children:[
                        {
                            key: 'bidDinginfo',
                            title: '全国招投标数据统计',
                        },
                        {
                            key: 'zbSource',
                            title: '招标数据源统计',
                        },
                        {
                            key: 'dataConfig',
                            title: '数据配置',
                        },
                    ]
				},
                {
				    title: '抽奖统计',
				    icon:'line-chart',
                    children:[
                        {
                            key: 'userDrawinfo',
                            title: '用户抽奖数据统计',
                            icon:'line-chart'
                        },
                        {
                            key: 'userSignin',
                            title: '用户签到数据统计',
                            icon:'line-chart'
                        },
                    ]
				},
				{
                    key: 'zbError',
                    title: '信息纠错统计',
                    icon:'line-chart'
				},
				{
                    key: 'userManage',
                    title: '人员管理',
                    icon:'profile'
                },	
                {
                    title: '每日数据统计',
                    icon:'profile',
                    children:[
                        {
                            key: 'dayData',
                            title: '免费用户统计',
                            icon:'line-chart'
                        },
                        {
                            key: 'dayDataHY',
                            title: '会员用户统计',
                            icon:'line-chart'
                        },
                        {
                            key: 'dayDataA',
                            title: '套餐A用户统计',
                            icon:'line-chart'
                        },
                        {
                            key: 'dayDataB',
                            title: '套餐B用户统计',
                            icon:'line-chart'
                        },
                        {
                            key: 'dayDataC',
                            title: '套餐C用户统计',
                            icon:'line-chart'
                        },
                    ]
                },
                // {
                //     key: 'dayData',
                //     title: '每日数据统计',
                //     icon:'profile'
                // },
                {
                    key: 'role',
                    title: '角色管理',
                    icon:'profile'
                },	
                	 
            ],
            menuSelect:[{
                key:'home',
                title:'首页'
            }]
        }
    },
    mounted(){
        // this.offWidth = document.getElementsByClassName('menu')[0].offsetWidth+'px'
    },
    methods: {
        toggleCollapsed() {
            let that = this;
            this.collapsed = !this.collapsed;
        },
        selectItems(item, key, selectedKeys){
            this.pages = item.key;
            // console.log(item, key, selectedKeys);
            // console.log(this.pages);
            
            
        },
        clickItems(item, key, keyPath){
            let arr = [];
            // let arr = this.COMMON.reduceArray(item.keyPath);
            this.list.forEach((item)=>{
                if(item['children'])
                {
                    arr.push(item['children'])
                }
                arr.push(item)
            })
            if(isNaN(Number(item.key)))
            {
                this.menuSelect = this.COMMON.reduceArray(arr).filter((items)=>{return item.keyPath.indexOf(items.key)>-1}).reverse();
                this.selectedKeyList = [item.key];
                this.pages = item.key;
            }
        },
        editPassword(){
            this.visible = true;
            let that = this;
            this.RegStatus = "error";
            this.help = "";
            setTimeout(function(){
                that.editPform.resetFields()
            },0)
        },
        handleOk(){
            let that = this;
            this.editPform.validateFields(err=>{
                if(!err)
                {
                    that.$dataApi({
                        url:'/api/Employee/UpdatePassWord',
                        method:"POST",
                        data:{
                            PassWord: this.editPform.getFieldValue('OldPassword'),
                            UpdatePassWord: this.editPform.getFieldValue('NewPassword'),
							id:sessionStorage.getItem("id"),
                        }
                    }).then(res=>{
						console.log(res);
                        if(res.Status == 200)
                        {
                            that.$message.success('密码修改成功');
                            // this.$router.push({name:'login'})
                            that.visible = false;
                            setTimeout(function(){
                                sessionStorage.removeItem('userName')
                                sessionStorage.removeItem('auth')
                                that.$router.push({name:'login'})
                            },2000)
                        }
                        else
                        {
                            that.$message.error(res.Msg);
                        }
                    })
                }
            })
        },
        handleCancel(){
            this.editPform.setF
            this.visible = false;
        },
        loginOut(){
			this.$message.success('注销成功,请重新登录');
			sessionStorage.removeItem('userName')
			sessionStorage.removeItem('auth')
			this.$router.push({name:'login'})
        },
		// getrefsh(){
		// 	console.log(this.$refs.menu);
		// }
    },
    created(){
        let that = this;
        if(!sessionStorage.getItem('userName') || !sessionStorage.getItem('auth'))
        {
            if(this.COMMON.getCookie('userLogin'))
            {
                let data = {
                    url: "/api/Login/GetLogin",
                    method: "POST",
                    data: {
                        LoginName: this.COMMON.getCookie('userLogin'),
                        PassWord: this.COMMON.getCookie('userPassword')
                    }
                };
                this.$dataApi(data).then(res => {
                    if (res.status === 200) {
                        sessionStorage.setItem('userName',this.COMMON.getCookie('userLogin'));
                        sessionStorage.setItem('auth',res.msg);
                        that.pages = "home";
                    } else {
                        that.errorMsg = res.msg;
                        that.errorShow = true;
                        that.$router.push({name:'login'})
                    }
                })
            }
            else
            {
                this.$router.push({name:'login'})
            }
        }
        else
        {
            this.pages = "home";  
        }
        Bus.$on('overflow',function(overflow){
            document.body.style.overflowY = overflow;
        })
        Bus.$on('menuSelect',function(data){
            let Len = that.menuSelect.filter(item=>{return item['children']}).length+1;
            if(Object.keys(data).length == 0)
            {
                that.menuSelect = JSON.parse(JSON.stringify(that.menuSelect.slice(0,Len)))
            }
            else
            {
                
                that.menuSelect = JSON.parse(JSON.stringify(that.menuSelect.slice(0,Len).concat([data])))
            }
        })
		Bus.$on('collapse',function(Height){
			if(document.getElementsByClassName('menu') && document.getElementsByClassName('menu').length)
			{
				var Menu = document.getElementsByClassName('menu')[0]
				Menu.style.height = Height.Height+350 + 'px'
			}
		})
    }
}
</script>

<style scoped>
    .ant-table-pagination{
        width:100%;
        text-align: right;
        position:relative;
    }
</style>

<style lang="scss">
    html{
        min-width:100%;
        body{
            background: #F0F2F5!important;
            font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
        }
        .ant-pagination-total-text{
            position: absolute;
            left:0;
            color:#595959;
        }
        .ant-select-focused .ant-select-selection{
            border-color:#d9d9d9;
            box-shadow:initial;
        }
    }
</style>

<style lang="scss" scoped>
    /* body */
    body{
        .contentWrap{
            width:100%;
            // height:100%;
			height: auto;
            /* 头部 */
            >div:nth-of-type(1){
                height: 100%;
            }
            header{
                height:70px;
                width:100%;
                overflow:hidden;
                background:#fff;
                .logo{
                    float:left;
                    max-width:260px;
                    height:100%;
                    background:#00284D;
                    display: flex;
                    align-items: center;
                    justify-content:space-around;
                    color: #fff;
                    font-weight: 700;
                    font-style: normal;
                    font-size: 18px;
					line-height: 70px;
                }
                .headerOption{
                    font-size: 14px;
                    float:right;
                    width:calc(100% - 260px);
                    height:100%;
                    padding:0 20px;
                    display:flex;
                    font-family: '微软雅黑';
                    justify-content:space-between;
                    align-items:center;
                }
            }
            .container{
                width:100%;
                height:calc(100% - 70px);
                // height: 100% !important;
            }
            /* 菜单 */
            .menu{
                /* background:#001529; */
                // height: 100%;
                min-height: 100%;
                max-width: 260px;
                padding: 2px 0 0 0;
                margin:0;
                float:left;
            }
            /* 页面主体 */
            .content{
                float:left;
                // width: calc(100% - 260px);
				width: 100%;
                height: 100%;
                padding: 20px;
                .wrap{
                    overflow-x:hidden;
                    overflow-y: auto;
                    height: initial;
                    min-height:calc(100% - 60px);
                }
            }
        }
    }
	.headerOprtionLeft{
		float: left;
		background: #00284d;
		-ms-flex-pack: distribute;
		justify-content: space-around;
		color: #fff;
		font-weight: 700;
		font-style: normal;
		font-size: 18px;
		height: 70PX;
	}
	.ant-breadcrumb{
		padding-left: 20px;
		line-height: 70px;
		float: left;
	}
</style>