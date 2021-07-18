<template>
    <div class="wrap">
        <a-button class="addNewBtn" type="primary" @click="addNew" >新增</a-button>
       
        <tables class="tab" size="small" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option" style="margin-top:40px" ></tables>
        
        <!-- 编辑框 -->
        <a-modal width="500px" title="编辑" :maskClosable="false" v-model="editVisible"  footer="" cancelText="关闭">
            <div class="inputBox">
                <p>角色名称：</p>
                <a-input placeholder="请输入角色名称" v-model="userName" />
            </div>
            <p class="subscribe">首页</p>
            <div class="inputBox">
                <p>首页数据列表：</p>
                <a-input placeholder="请输入条数" type="Number" v-model="homeList" :min="0" />
            </div>
            <div class="inputBox">
                <p>搜索数据列表：</p>
                <a-input placeholder="请输入条数" type="Number" v-model="searchList" :min="0" />
            </div>
            <div class="inputBox">
                <p>公告类型数据列表：</p>
                <a-input placeholder="请输入条数" type="Number" v-model="NoticeList" :min="0" />
            </div>
            <div class="inputBox">
                <p>数据详情查看：</p>
                <a-input placeholder="请输入条数" type="Number" v-model="detailList" :min="0" />
            </div>
            <div style="width:100%">
                <a-checkbox @change="onChange" v-model="checked" class="sjdc">
                    数据导出
                </a-checkbox>
            </div>
            <p class="subscribe">订阅</p>
            <div class="inputBox">
                <p>订阅招标数据列表：</p>
                <a-input placeholder="请输入条数" type="Number" v-model="subDataList" :min="0" />
            </div>
            <div class="inputBox">
                <p>订阅关键字：</p>
                <a-input placeholder="请输入个数" type="Number" v-model="subKeyWords" :min="0" />
            </div>
            <div class="inputBox">
                <p>排除关键字：</p>
                <a-input placeholder="请输入个数" type="Number" v-model="SubscriptionExcludeKeyword" :min="0" />
            </div>
            <p class="subscribe">我的</p>
            <div class="inputBox">
                <p style="width:28%">数据推送：</p>
                <a-select :defaultValue='dataPush' style="width: 120px" @change="handleChange">
                    <a-select-option value="0">
                        推送一次
                    </a-select-option>
                    <a-select-option value="1"> 
                        实时推送
                    </a-select-option>
                </a-select>
            </div>
            <div class="inputBox special">
                <a-checkbox @change="onChangeTwo" v-model="checkedTwo" class="xmgz">
                    项目关注
                </a-checkbox>
                <a-input :disabled="disabled" placeholder="请输入条数" type="Number" v-model="objFollow" :min="1" />
            </div>
            <div class="inputBox special">
                <a-checkbox @change="onChangeThe" v-model="checkedThe" class="xmgz">
                    智能推荐
                </a-checkbox>
                <a-input :disabled="disabledT" placeholder="请输入条数" type="Number" v-model="objPush" :min="1" />
            </div>
            <!-- <div class="inputBox">
                <p>查看关注：</p>
                <a-input :disabled="disabled" placeholder="请输入条数" type="Number" v-model="seeObj" :min="1" />
            </div> -->

            <div class="btnbox">
                <a-button @click="cancelBtn">取消</a-button>
                <a-button @click="confirmBtn" type="primary" >确定</a-button>
            </div>
		</a-modal>

        <a-modal v-model="dialogBox" title="删除" @ok="handleOk">
            <p>您确定删除此套餐么？</p>
        </a-modal>
	</div>
</template>
<script>
import tables from '@/pages/common/table';
import Bus from '../../utils/vue-bus.js';
export default {
    components:{
        tables
    },
    data(){
        return {
            filterForm:this.$form.createForm(this,{name:'filter'}),
            columns:[],
            tableData: [],
            paginations: {
                current:1,
                pageSize:10,
                total:0,
                size:'middle',
                showQuickJumper:true,
                showSizeChanger:false,
                onShowSizeChange:function(){},
                showTotal:function(total,range){
                    return  `共 ${total} 条记录`;
                }
            },
            params:{},
            flag:true,
            editVisible:false, //操作弹框
            userName:'', //角色名称
            homeList:'', //首页数据列表
            searchList:'', //搜索数据列表
            NoticeList:'', //公告类型数据列表
            detailList:'', //数据详情查看
            checked:false, //数据导出
            subDataList:'',//订阅招标数据列表
            subKeyWords:'',//订阅关键字
            SubscriptionExcludeKeyword:'',//排除关键字
            dataPush:'0', //数据推送
            checkedTwo:false,  //项目关注
            checkedThe:false,  //智能关注
            objFollow:'', //项目关注条数
            objPush:'', //智能推荐条数
            // seeObj:'', //查看关注
            disabled:true,
            disabledT:true,
            option:[
                {
                    type:"detail",
                    name:"编辑",
                    fn:(e)=>{
                        this.detail(e);
                    }
                },
                {
                    type:"detail",
                    name:"删除",
                    fn:(e)=>{
                        this.delete(e);
                    }
                },
            ],
            isAddNew:true,  //新增或者编辑，true||false
            ID:'', //编辑ID
            delID:'', //删除ID
            dialogBox:false,  //删除对话框
        }
    },
    methods:{
        // table改变
        handleTableChange(pagination,filter,sorter){
            let that = this;
            const pager = Object.assign(this.paginations);
            pager.current = pagination.current;
            this.paginations = pager;
            this.params['PageNum'] = this.paginations['current'];
            // 排序
            this.params['sortField'] = sorter['columnKey'] || "";
            this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
            this.getList('false');
        },

        // 初始化参数
        initParams(e){
			
            Object.assign(this.params,this.filterForm.getFieldsValue())
            Object.assign(this.params,{PageNum:this.paginations.current,pageSize:this.paginations.pageSize})
            if(!e)
            {
                this.paginations.current = 1;
                this.paginations.PageNum = 1;
                this.params.PageNum = 1;
            }
            this.COMMON.dropObj(this.params)
        },
 
        // 获取列表
        getList(e){
			this.params.IsImport =0;
            this.params.NickName = '';
            this.params.PageNum = 1;
            this.params.PageSize = 10;
            
			let that = this;

			this.filterForm.validateFields((error, value) => {
				if (!error) {
				}
			});
			this.initParams(e);
			
            this.$dataApi({
                url:'api/RoleManage/SearchAllUserRole',
                method:'GET',
                data:''
            }).then(res=>{
                console.log(res)
                if(res.Status == 200){   
                    that.paginations.total  = res.TotalCount;
                    that.tableData =res.UserRoleList;
					that.tableData.forEach((item,index)=>{
						item.num=index+1;
					})
                }
            })
        },

        //开启活动
        // open(e){
        //     console.log(e);
        // },

        //关闭活动
        // close(e){
        //     console.log(e);
        // },
        
        //编辑
        detail(e){
            // console.log(e);
            let that = this;
            
            this.isAddNew = false;
            this.ID = e.ID;
            // console.log(e);
            this.$dataApi({
                url:'/api/RoleManage/SearchUserRoleByID',
                method:'GET',
                data:{
                    ID:e.ID
                }
            }).then(res=>{
                console.log(res.RoleManagement);
                let flag = res.RoleManagement;
                that.userName = flag.RoleName;
                that.homeList = flag.HomePageDataList;
                that.searchList = flag.SearchDataList;
                that.NoticeList = flag.AnnounceTypeDataList;
                that.detailList = flag.DataDetailsView;
                that.checked = flag.DataExport == 0 ? true : false;
                that.subDataList = flag.SubscriptionBiddingDataList;
                that.subKeyWords = flag.SubscriptionKeywords;
                that.SubscriptionExcludeKeyword = flag.SubscriptionExcludeKeyword;
                that.dataPush = res.RoleManagement.DataPush.toString();
                if(flag.ProjectAttention == -1){
                    that.checkedTwo = false;
                    that.disabled = true;
                }else{
                    that.checkedTwo = true;
                    that.disabled = false;
                    that.objFollow = flag.ProjectAttention
                };
                if(flag.SubscriptionRecommendSetting == -1){
                    that.checkedThe = false;
                    that.disabledT = true;
                }else{
                    that.checkedThe = true;
                    that.disabledT = false;
                    that.objPush = flag.SubscriptionRecommendSetting
                };
                that.editVisible = true;
            });
            // that.dataPush = '1';
            // console.log(that.dataPush);

        },
        //删除套餐按钮
        delete(e){
            // console.log(e);
            if(e.RoleStatus == 0){
                this.$message.warning('该套餐正在使用，不可删除');
                return false;
            }
            this.dialogBox = true;
            this.delID = e.ID;

        },

        //确定删除套餐按钮
        handleOk(){
            let that = this;
            this.$dataApi({
                url:'api/RoleManage/DeleteUserRole',
                method:'POST',
                data:{
                    ID:that.delID
                }
            }).then(res=>{

            });
            setTimeout(function(){
                that.$message.success('删除成功');
                that.dialogBox = false;
                that.$dataApi({
                    url:'api/RoleManage/SearchAllUserRole',
                    method:'GET',
                    data:''
                }).then(res=>{
                    // console.log(res)
                    if(res.Status == 200){   
                        that.paginations.total  = res.TotalCount;
                        that.tableData =res.UserRoleList;
                    }
                })
            },500);

        },

        //数据导出
        onChange(e) {
            this.checkede = e.target.checked
            // console.log(this.checkede);
        },

        //数据推送
        handleChange(e){
            console.log(e);
            this.dataPush = e;
            // this.dataPush = e == '推送一次' ? 0 : 1;
        },

        //项目关注单选
        onChangeTwo(e){
            // console.log(e.target.checked);
            this.objFollow = '';
            this.checkedTwo = e.target.checked;
            if(e.target.checked){
                this.disabled = false;
            }else{
                this.disabled = true;
            };
        },

        //智能推荐单选
        onChangeThe(e){
            // console.log(e.target.checked);
            this.objPush = '';
            this.checkedThe = e.target.checked;
            if(e.target.checked){
                this.disabledT = false;
            }else{
                this.disabledT = true;
            };
        },

        //新增角色管理
        addNew(){
            this.editVisible = true;
            this.isAddNew = true;
            this.userName = ''; //角色名称
            this.homeList = ''; //首页数据列表
            this.searchList = ''; //搜索数据列表
            this.NoticeList = ''; //公告类型数据列表
            this.detailList = ''; //数据详情查看
            this.checked=false; //数据导出
            this.subDataList = '';//订阅招标数据列表
            this.subKeyWords = '';//订阅关键字
            this.SubscriptionExcludeKeyword = '';//订阅关键字
            this.dataPush= '0'; //数据推送
            this.checkedTwo = false;  //项目关注
            this.checkedThe = false;  //项目关注
            this.objFollow = ''; //项目关注条数
            this.objPush = ''; //项目关注条数
        },

        //取消按钮
        cancelBtn(){
            if(this.isAddNew){
                this.$message.warning('您已取消新增！');
            }else{
                this.$message.warning('您已取消编辑！');
            }
            this.editVisible = false;
        },

        //确认按钮
        confirmBtn(){
            let that = this;
            if(that.isAddNew){
                if(that.userName === "" || that.homeList === '' || that.searchList === "" || that.NoticeList === "" || that.detailList === '' || that.subDataList === "" || that.subKeyWords === "" || that.SubscriptionExcludeKeyword === "" || (that.objFollow === "" && that.checkedTwo)  ){
                    this.$message.error('请将内容填写完整');
                    return false;
                };
                if(that.homeList <0 || that.searchList <0 || that.NoticeList <0 || that.detailList <0 || that.subDataList <0 || that.subKeyWords <0 || that.SubscriptionExcludeKeyword <0 || that.objFollow <0 ){
                    this.$message.error('请填写真确的内容');
                    return false
                }

                that.$dataApi({
                    url:'api/RoleManage/CreateNewUserRole',
                    method:'POST',
                    data:{
                        RoleName:that.userName,
                        HomePageDataList:that.homeList,
                        SearchDataList:that.searchList,
                        AnnounceTypeDataList:that.NoticeList,
                        DataDetailsView:that.detailList,
                        DataExport:that.checked ? 0 : 1,
                        SubscriptionBiddingDataList:that.subDataList,
                        SubscriptionKeywords:that.subKeyWords,
                        SubscriptionExcludeKeyword:that.SubscriptionExcludeKeyword,
                        DataPush:that.dataPush,
                        ProjectAttention:that.checkedTwo ? that.objFollow : -1,
                        SubscriptionRecommendSetting:that.checkedThe ? that.objPush : -1,
                        // ViewAttention:that.checkedTwo ? that.seeObj : -1,
                    }
                }).then(res=>{
                    if(res.Status == 200){
                        this.$message.success('新增成功');
                        this.editVisible = false;
                        that.userName = '';
                        that.homeList = '';
                        that.searchList = '';
                        that.NoticeList = '';
                        that.detailList = '';
                        that.checked = false;
                        that.subDataList = '';
                        that.subKeyWords = '';
                        that.SubscriptionExcludeKeyword = '';
                        that.dataPush = '0';
                        that.checkedTwo = false;
                        that.checkedThe = false;
                        that.objFollow = '';
                        that.objPush = '';
                        // that.seeObj = '';
                    }
                });
                setTimeout(()=>{
                    that.$dataApi({
                        url:'api/RoleManage/SearchAllUserRole',
                        method:'GET',
                        data:''
                    }).then(res=>{
                        // console.log(res)
                        if(res.Status == 200){   
                            that.paginations.total  = res.TotalCount;
                            that.tableData =res.UserRoleList;
                        }
                    })
                },1000)
                
            }else{
                // console.log(that.userName);
                // console.log(that.homeList);
                // console.log(that.searchList);
                // console.log(that.NoticeList);
                // console.log(that.detailList);
                // console.log(that.subDataList);
                // console.log(that.subKeyWords);
                // console.log(that.objFollow);
                // console.log(that.dataPush);

                // console.log(that.subDataList.toString() == '');
                // console.log(that.subKeyWords.toString() == '');
                if(that.userName === "" || that.homeList === '' || that.searchList === "" || that.NoticeList === "" || that.detailList === '' || that.subDataList === "" || that.subKeyWords === "" || that.SubscriptionExcludeKeyword === "" || (that.objFollow === "" && that.checkedTwo)  ){
                    this.$message.error('请将内容填写完整');
                    return false;
                };
                if(that.homeList <0 || that.searchList <0 || that.NoticeList <0 || that.detailList <0 || that.subDataList <0 || that.subKeyWords <0 || that.SubscriptionExcludeKeyword <0 || that.objFollow <0 ){
                    this.$message.error('请填写真确的内容');
                    return false
                }
                this.$dataApi({
                    url:'api/RoleManage/CreateNewUserRole',
                    method:'POST',
                    data:{
                        ID:that.ID,
                        RoleName:that.userName,
                        HomePageDataList:that.homeList,
                        SearchDataList:that.searchList,
                        AnnounceTypeDataList:that.NoticeList,
                        DataDetailsView:that.detailList,
                        DataExport:that.checked ? 0 : 1,
                        SubscriptionBiddingDataList:that.subDataList,
                        SubscriptionKeywords:that.subKeyWords,
                        SubscriptionExcludeKeyword:that.SubscriptionExcludeKeyword,
                        DataPush:that.dataPush,
                        ProjectAttention:that.checkedTwo ? that.objFollow : -1,
                        SubscriptionRecommendSetting:that.checkedThe ? that.objPush : -1,
                        // ViewAttention:that.checkedTwo ? that.seeObj : -1,
                    }
                }).then(res=>{
                    if(res.Status == 200){
                        this.$message.success('编辑成功');
                        this.editVisible = false;
                    }
                });
                that.$dataApi({
                    url:'api/RoleManage/SearchAllUserRole',
                    method:'GET',
                    data:''
                }).then(res=>{
                    // console.log(res)
                    if(res.Status == 200){   
                        that.paginations.total  = res.TotalCount;
                        that.tableData =res.UserRoleList;
                    }
                })
            }
        },




    },
    computed:{
        // option(){
        //     return [
        //         {
        //             type:"detail",
        //             name:this.flag?"开启":"关闭",
        //             fn:(e)=>{
        //                 this.open(e);
        //             }
        //         },
        //         {
        //             type:"detail",
        //             name:"编辑",
        //             fn:(e)=>{
        //                 this.detail(e);
        //             }
        //         },
        //         {
        //             type:"detail",
        //             name:"删除",
        //             fn:(e)=>{
        //                 this.delete(e);
        //             }
        //         },
        //     ]
        // }
    },
    created(){
        this.columns = [
            {
                title: "角色",
                dataIndex: "RoleName"
            },
            {
                title: '创建时间',
                dataIndex: 'CreateDate',
            },
            {
			    title: '状态',
                dataIndex: 'RoleStatus',
                customRender: text => {
					if(text == 0){
						return '使用';
					}else if(text == 1){
						return "未使用"
					}			
				}
            },
            {
                title: '操作',
                dataIndex: 'option',
                scopedSlots: { customRender: 'option' },
                width:'20%',
            }
		 
        ];
		this.getList();


    },
	updated() {
		Bus.$emit("collapse",{Height:document.getElementsByClassName('content')[0].clientHeight < 1000 ? 970:document.getElementsByClassName('content')[0].clientHeight});
	}
}
</script>
<style lang="scss" scoped>
    .wrap{
        width:100%;
        height:100%;
        background:#fff;
        border-radius:5px;
        padding:20px;
    }
    .inputBox{
        display: flex;
    }
    .inputBox>p{
        width: 40%;
    }
    .subscribe{
        margin-top: 20px;
    }
    .special{
        margin-bottom: 3px;
    }
    .btnbox{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-top: 20px;
    }
    .btnbox>button:nth-of-type(1){
        margin-right: 20px;
    }
    .addNewBtn{
        float: right;
    }
    .sjdc{
        width: 100% !important;
        text-align: left !important;
    }
    .xmgz{
        width: 40% !important;
    }

    .content .ant-advanced-search-form .ant-form-item {
		display: flex;
	}
</style>