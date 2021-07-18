<template>
    <div class="wrap">
        <a-form class="ant-advanced-search-form" :form="filterForm" style="overflow:hidden;">
			<a-row :gutter="24">
				<a-col :span="5">
					<a-form-item label="微信昵称:">
						<a-input placeholder="请输入"   v-model="userName" v-decorator="['nickname']"/>
					</a-form-item>
				</a-col>
				<a-col :span="7">
					<a-form-item label="注册时间:">
						<a-range-picker @change="onChange" />
					</a-form-item>
				</a-col>
				<a-col :span="5">
					<a-form-item label="是否会员:">
						<a-select default-value="all"  @change="handleChange">
							<a-select-option value="all">
								全部
							</a-select-option>
							<a-select-option value="isTrue">
								是
							</a-select-option>
							<a-select-option value="isFalse">
								否
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<!-- <a-col :span="7" class="button">
					<a-button type="primary" @click="filterSearch" style="margin-top:4px;">查询</a-button>
					<a-button type="primary" @click="exportExcel" style="margin-top:4px;">导出Execl</a-button>
				</a-col> -->
			</a-row>
            <a-row :gutter="24">
                <a-col :span="5">
                    <a-form-item label="是否有关键词:">
                        <a-select default-value="all"  @change="handleChange1">
                            <a-select-option value="all">
                                全部
                            </a-select-option>
                            <a-select-option value="isTrue">
                                是
                            </a-select-option>
                            <a-select-option value="isFalse">
                                否
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="3">
                    <a-form-item label="是否取关:">
                        <a-select default-value="all"  @change="handleChange2">
                            <a-select-option value="all">
                                全部
                            </a-select-option>
                            <a-select-option value="isTrue">
                                是
                            </a-select-option>
                            <a-select-option value="isFalse">
                                否
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="3">
                    <a-form-item label="角色:">
                        <a-select default-value=""  @change="handleChange3">
                            <a-select-option value="">
                                全部
                            </a-select-option>
                            <a-select-option value="免费用户">
                                免费用户
                            </a-select-option>
                            <a-select-option value="注册用户">
                                注册用户
                            </a-select-option>
                            <a-select-option value="运营商套餐A">
                                运营商套餐A
                            </a-select-option>
                            <a-select-option value="运营商套餐B">
                                运营商套餐B
                            </a-select-option>
                            <a-select-option value="运营商套餐C">
                                运营商套餐C
                            </a-select-option>
                            <!-- <a-select-option v-for="(iten,index) in GetRoleName" value="item" :key="index">
                                {{item}}
                            </a-select-option>  -->
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="3">
                    <a-form-item label="来源:">
                        <a-select default-value=""  @change="handleChange4">
                            <a-select-option value="">
                                全部
                            </a-select-option>
                            <a-select-option value="互联网">
                                互联网
                            </a-select-option>
                            <a-select-option value="移动套餐">
                                移动套餐
                            </a-select-option>
                            <a-select-option value="联通套餐">
                                联通套餐
                            </a-select-option>
                            <a-select-option value="电信套餐">
                                电信套餐
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                
				<a-col :span="7" class="button">
					<a-button type="primary" @click="filterSearch" style="margin-top:4px;">查询</a-button>
					<a-button type="primary" @click="exportExcel" style="margin-top:4px;">导出Execl</a-button>
				</a-col>
			</a-row>
        </a-form>
        <tables class="col-24" size="small" :scroll="widthFlag" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option"></tables>
		
		<a-modal width="900px" title="用户详情" :maskClosable="false" v-model="editVisible"  footer="" cancelText="关闭">
		   <div class="header">
		       <a-col :span="24" class="headerWrap">
		           <a-col :span="5">
		               <div class="headerImg" :style="{'background-image':'url('+ ((typeof details.headimgurl).toUpperCase() == 'OBJECT' ? defaultImg : details.headimgurl) +')'}"></div>
		           </a-col>
		           <a-col :span="19" class="rightData">
					    <a-col :span="21">
							<div style="float: left;">昵称 ：{{ details && details.nickname || '' }}</div>
							<div style="float: left;margin-left: 20px;line-height: 35px;color: rgba(0, 0, 0, 0.65);font-size: 14px;font-weight: 100;">关注时间：{{ details && details.subscribe_time || '' }}</div>
						</a-col>
					    <a-col :span="21">
							<div style="float: left;">累计推荐 ：{{ details && details.totalData || 0 }}</div>
							<div style="float: left;margin-left: 40px;">累计访问：{{ details && details.visitCount || 0 }}</div>
						</a-col>
						<a-col :span="21">
							<div style="float: left;">最新推送时间 ：{{ details && details.LastTime || '' }}</div>
							<div style="float: left;margin-left: 40px;">最近使用时间：{{ details && details.visittime || '' }}</div>
						</a-col>
		           </a-col>
		       </a-col>
		   </div>
		   <div class="tableWrap">
				<a-tabs type="card" default-active-key="1">
					  <a-tab-pane key="1" tab="推荐记录">
						 <tables style="width:98%;" size="middle" :columns="tjcolumns" :tableData="tjtableData" :loading="false" :handleTableChange="handleTableChangetj" :bordered="true" :pagination="paginationstj"></tables>
					  </a-tab-pane>
					  <a-tab-pane key="2" tab="访问记录">
						 <tables style="width:98%;" size="middle" :columns="fwcolumns" :tableData="fwtableData" :loading="false" :handleTableChange="handleTableChangefw" :bordered="true" :pagination="paginationsfw"></tables>
					  </a-tab-pane>
					   <a-tab-pane key="3" tab="关键词">
						 <tables style="width:98%;" size="middle" :columns="gjcolumns" :tableData="gjtableData" :loading="false" :handleTableChange="handleTableChangegj" :bordered="true" :pagination="paginationsgj"></tables>
					  </a-tab-pane>
					  <a-tab-pane key="4" tab="关注项目">
						 <tables style="width:98%;" size="middle" :columns="gzcolumns" :tableData="gztableData" :loading="false" :handleTableChange="handleTableChangegz" :bordered="true" :pagination="paginationsgz"></tables>
					  </a-tab-pane>
					 <a-tab-pane key="5" tab="足迹">
						 <tables style="width:98%;" size="middle" :columns="zjcolumns" :tableData="zjtableData" :loading="false" :handleTableChange="handleTableChangezj" :bordered="true" :pagination="paginationszj"></tables>
					  </a-tab-pane>
				</a-tabs>
		      <!-- <div class="wrapContent">
		           <tables style="width:98%;" size="middle" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations"></tables>
		       </div> -->
		   </div>
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
            widthFlag:{x:2200},
			userName:'',
			editVisible:false,
            filterForm:this.$form.createForm(this,{name:'filter'}),
            columns:[],
			tjcolumns:[],
			fwcolumns:[],
			gjcolumns:[],
			gzcolumns:[],
			zjcolumns:[],
            tableData: [],
			tjtableData:[],
			fwtableData:[],
			gjtableData:[],
			gztableData:[],
			zjtableData:[],
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
			paginationstj: {
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
			paginationsfw: {
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
			paginationsgj: {
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
			paginationsgz: {
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
			paginationszj: {
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
            option:[
                {
                    type:"detail",
                    name:"详情",
                    fn:(e)=>{
                        this.detail(e);
                    }
                }
            ],
            params:{},
			sex:[
			  { text: '女', value: 2 },
			  { text: '男', value: 1 }],  
			details:{},
			defaultImg:'../../assets/images/defaultPicture.png',
			zcData:'',
			isVip:'',
			BeginRegisterTime:'',
			EndRegisterTime:'',
			exportdata:[],
            Ress:'',
            isVipNo:'',  //是否取关
            isHaveKey:'', //是否有关键词
            UserRole:'', //用户角色
            UserOrigin:'', //用户来源
            GetRoleName:[], //角色名称
        }
    },
    methods:{
		exportExcel(){
			let that = this;
			// console.log(this.userName);

			this.$dataApi({
				url:'api/Users/GetAdminUsers',
				method:'POST',
				data:{
					Source:1,
					IsPage:1,
					openid:'',
					nickname:this.userName,
					IsMember:this.isVip,
					BeginRegisterTime:this.BeginRegisterTime,
                    EndRegisterTime:this.EndRegisterTime,
                    IsClearAttention:this.isVipNo,
			        IsHaveKeyWord:this.isHaveKey,
				}
			}).then(res=>{
				// console.log(res);
				that.exportdata = res.Rows;
				that.exportdata.sort(this.tabledatesort)
				that.exportdata.forEach((item,index)=>{
					item.num=index+1;
					if(item.IsMember == 1){
						item.IsMember = '会员'
					}else{
						item.IsMember = '非会员'
					}
				})
				require.ensure([], () => {
					const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
					const tHeader = ['序号','微信昵称', '注册时间','是否会员','手机号','角色','来源'];   // 上面设置Excel的表格第一行的标题
					const filterVal = ['num','nickname', 'RegistTime','IsMember','UniqueInvitationCode','UserRole','UserOrigin']; // 上面的index、nickName、name是tableData里对象的属性key值
					const list = this.exportdata;  //把要导出的数据tableData存到list
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, '用户访问数据统计');//最后一个是表名字
				})
			})
        },
        
		formatJson(filterVal, jsonData) {
			return jsonData.map(v => filterVal.map(j => v[j]))
        },
        
		datesort:function(x,y){
			return x.time > y.time ? 1 : -1;
        },
        
		tabledatesort:function(x,y){
			return x.time < y.time ? 1 : -1;
        },
        
		onChange(date, dateString) {
			// console.log(date, dateString);
			this.zcData = dateString,
			this.BeginRegisterTime = dateString[0];
			this.EndRegisterTime = dateString[1];
        },

        //是否会员
		handleChange(value) {
			console.log(value);
			if(value == 'isTrue'){
				this.isVip = 1;
			}else if(value == 'isFalse'){
				this.isVip = 0;
			}else{
				this.isVip = '';
			}
        },

        //是否有关键词
        handleChange1(value) {
            console.log(value);
            if(value == 'isTrue'){
				this.isHaveKey = 0;
			}else if(value == 'isFalse'){
				this.isHaveKey = 1;
			}else{
				this.isHaveKey = '';
			}
        },

        //是否取关
        handleChange2(value) {
            console.log(value);
            if(value == 'isTrue'){
				this.isVipNo = 1;
			}else if(value == 'isFalse'){
				this.isVipNo = 0;
			}else{
				this.isVipNo = '';
			}
        },
        //用户角色
        handleChange3(value) {
            console.log(value);
            this.UserRole = value;
        },
        //用户来源
        handleChange4(value) {
            console.log(value);
            this.UserOrigin = value;
        },

        
        // table改变
        handleTableChange(pagination,filter,sorter){
            let that = this;
            const pager = Object.assign(this.paginations);
            pager.current = pagination.current;
            this.paginations = pager;
            this.params['pageNo'] = this.paginations['current'];
            // 排序
            this.params['sortField'] = sorter['columnKey'] || "";
            this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
            this.getList('false');
        },
		handleTableChangetj(pagination,filter,sorter){
		    let that = this;
		    const pager = Object.assign(this.paginationstj);
		    pager.current = pagination.current;
		    this.paginationstj = pager;
		    this.params['pageNo'] = this.paginationstj['current'];
		    // 排序
		    this.params['sortField'] = sorter['columnKey'] || "";
		    this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
		    this.gettjList(this.paginationstj['current']);
		},
		handleTableChangefw(pagination,filter,sorter){
		    let that = this;
		    const pager = Object.assign(this.paginationsfw);
		    pager.current = pagination.current;
		    this.paginationsfw = pager;
		    this.params['pageNo'] = this.paginationsfw['current'];
		    // 排序
		    this.params['sortField'] = sorter['columnKey'] || "";
		    this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
		    this.getfwList(this.paginationsfw['current']);
		},
		handleTableChangegj(pagination,filter,sorter){
			let that = this;
			const pager = Object.assign(this.paginationsgj);
			pager.current = pagination.current;
			this.paginationsgj = pager;
			this.params['pageNo'] = this.paginationsgj['current'];
			// 排序
			this.params['sortField'] = sorter['columnKey'] || "";
			this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
			this.getgjList(this.paginationsgj['current']);
        },
        handleTableChangegz(pagination,filter,sorter){
            let that = this;
            const pager = Object.assign(this.paginationsgz);
            pager.current = pagination.current;
            this.paginationsgz = pager;
            this.params['pageNo'] = this.paginationsgz['current'];
            // 排序
            this.params['sortField'] = sorter['columnKey'] || "";
            this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
            this.getgjList(this.paginationsgz['current']);
        },
        handleTableChangezj(pagination,filter,sorter){
			let that = this;
			const pager = Object.assign(this.paginationszj);
			pager.current = pagination.current;
			this.paginationszj = pager;
			this.params['pageNo'] = this.paginationszj['current'];
			// 排序
			this.params['sortField'] = sorter['columnKey'] || "";
			this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
			this.getgjList(this.paginationszj['current']);
        },
        
        // 查看详情
        detail(e){
			// console.log(e);
			let source = e.Origin
			this.editVisible=true;
			this.details=e;
			this.gettjList(source);
			this.getfwList(source);
			this.getgjList(source);
			this.getgzList(source);
			this.getzjList(source);
        },

        // 初始化参数
        initParams(e){
			
            Object.assign(this.params,this.filterForm.getFieldsValue())
            Object.assign(this.params,{pageNo:this.paginations.current,pageSize:this.paginations.pageSize})
            if(!e)
            {
                this.paginations.current = 1;
                this.paginations.pageNo = 1;
                this.params.pageNo = 1;
            }
            this.COMMON.dropObj(this.params)
        },
		
		//获取推荐记录
		gettjList(e){
		    let that = this;
		    this.$dataApi({
		        url:'/api/Users/GetVisitRecord',
		        method:'POST',
		        data:{
				  openid: this.details.openid,
				  iRecord: 0,//0推荐记录表，1访问记录表
				  pageNo: e == undefined ?1:e, 
				  pageSize: "10",//每页数量
				  Source:1
				}
		    }).then(res=>{
                console.log(res);
		        that.paginationstj.total =res.TotalCount;
		        that.tjtableData = res.Rows;
		    })
        },
        
		getfwList(e){
		    let that = this;
		    this.$dataApi({
		        url:'/api/Users/GetVisitRecord',
		        method:'POST',
		        data:{
				   openid: this.details.openid,
				   iRecord: 1,//0推荐记录表，1访问记录表
				   pageNo: e == undefined ?1:e, 
				   pageSize: "10",//每页数量
					Source:1
				}
		    }).then(res=>{
		        that.paginationsfw.total = res.TotalCount;
		        that.fwtableData = res.Rows;
		    })
		},

		//获取关键字列表
		getgjList(e){
		    let that = this;
		    this.$dataApi({
		        url:'/api/Users/GetMyKeyWord',
		        method:'POST',
		        data:{
					openid: this.details.openid,
					pageNo: e == undefined ?1:e, 
					pageSize: "10",//每页数量
					Source:e
				}
		    }).then(res=>{
		        that.paginationsgj.total = res.TotalCount;
		        that.gjtableData = res.Rows;
		    })
        },
        
		//获取关注项目列表
		getgzList(e){
		    let that = this;
		    this.$dataApi({
		        url:'/api/Users/GetMyAttentionProject',
		        method:'POST',
		        data:{
					openid: this.details.openid,
					pageNo: e == undefined ?1:e, 
					pageSize: "10",//每页数量
					Source:e
				}
		    }).then(res=>{
		        that.paginationsgz.total = res.TotalCount;
		        that.gztableData = res.Rows;
		    })
        },
        
		//获取足迹列表
		getzjList(e){
		    let that = this;
		    this.$dataApi({
		        url:'/api/Users/GetMyTracks',
		        method:'POST',
		        data:{
					openid:this.details.openid,
					pageNo: e == undefined ?1:e, 
					pageSize: "10",//每页数量
					Source:e
				}
		    }).then(res=>{
		        that.paginationszj.total = res.TotalCount;
		        that.zjtableData = res.Rows;
		    })
        },
        
        // 获取列表
        getList(e){
			// console.log(this.params);
			
			this.params.source = 1
			this.params.IsMember = this.isVip;
			this.params.BeginRegisterTime = this.BeginRegisterTime;
			this.params.EndRegisterTime = this.EndRegisterTime;
			this.params.IsClearAttention = this.isVipNo;
            this.params.IsHaveKeyWord = this.isHaveKey;
            this.params.UserRole = this.UserRole;
            this.params.UserOrigin = this.UserOrigin;

			// console.log(this.params);
			let that = this;
			let source = null
			this.filterForm.validateFields((error, value) => {
				if (!error) {
					// console.log(value);
					// source = Number(value.fenlei)
					
				}
			});
			this.initParams(e);
			
            this.$dataApi({
                url:'api/Users/GetAdminUsers',
                method:'POST',
                data:this.params
            }).then(res=>{
				this.Ress = res;
				console.log(JSON.parse(res.Data));
				
                if(res.Status == 200)
                {
                    that.paginations.total  = JSON.parse(res.Data).TotalCount;
                    that.tableData = JSON.parse(res.Data).Rows;
					that.tableData.forEach(item=>{
						for(let i=0;i<that.sex.length;i++){
							if(item.sex == that.sex[i].value){
								item.sex=that.sex[i].text;
							}
						}
					})
                }
            })
        },

		//点击查询按钮
        filterSearch(){
            this.getList();
        },

        //获取套餐名称
        GetAllRoleName(){
            let that = this;
		    that.$dataApi({
		        url:'/api/RoleManage/GetAllRoleName',
		        method:'GET',
		        data:{
					
				}
		    }).then(res=>{
                console.log(res);
                that.GetRoleName = res;
		    })
        }
    },
    created(){
        this.columns = [
            {
                title: '微信头像',
                dataIndex: 'headimgurl',
                scopedSlots: { customRender: 'WX_HeadImg' },
            },
            {
                title: '微信昵称',
                dataIndex: 'nickname',
            },
            {
                title: 'openid',
                dataIndex: 'openid',
                width:'13%',
            },
            {
                title: '性别',
                dataIndex: 'sex',
            },
            {
                title: '省份',
                dataIndex: 'province',
                width:'4%',
            },
            {
                title: '城市',
                dataIndex: 'city',
            },
			{
			    title: '关注时间',
			    dataIndex: 'subscribe_time',
			},
			{
			    title: '最近使用时间',
			    dataIndex: 'visittime',
			},
			{
			    title: '注册时间',
			    dataIndex: 'RegistTime',
			},
			{
			    title: '最近推送时间',
			    dataIndex: 'LastTime',
            },
            {
			    title: '角色',
                dataIndex: 'UserRole',
                width:'5%',
			},
			{
                title: '手机号',
				dataIndex: 'UniqueInvitationCode',
				width:'6%',
            },
            {
			    title: '关键词',
                dataIndex: 'KeyWord',
                width:'20%',
            },
            {
			    title: '是否取关',
                dataIndex: 'IsClearAttention',
                width:'5%',
                customRender: text => {
					if(text == 0){
						return "关注"
					}else if(text == 1){
						return "取消关注"
					}
					// return "招标宝典"			
				}
            },
            {
			    title: '来源',
                dataIndex: 'UserOrigin',
                width:'5%',
			},
            {
                title: '操作',
                dataIndex: 'option',
                scopedSlots: { customRender: 'option' },
                width:'3%',
            }
        ];
        this.tjcolumns = [
            {
                title: '已推荐(条)',
                dataIndex: 'totalData',
                width:'30%',
            },
            {
                title: '添加时间',
                dataIndex: 'JoinDate',
               width:'30%'
            },
            {
                title: '发送结果',
                dataIndex: 'result',
               width:'30%'
            }
        ];
		this.fwcolumns = [
		    {
		        title: '访问时间',
		        dataIndex: 'visittime',
		        width:'30%',
		    },
		];
		this.gjcolumns = [
			{
				title: '关键词',
		        dataIndex: 'keyword',
		        width:'30%',
			},
			{
				title: '添加时间',
		        dataIndex: 'JoinDate',
		        width:'30%',
			}
		];
		this.gzcolumns = [
			{
				title: '招标标题',
		        dataIndex: 'title',
		        width:'40%',
			},
			{
				title: '公告类型',
		        dataIndex: 'FormatGGType',
		        width:'10%',
			},
			{
				title: '省份',
		        dataIndex: 'Province',
		        width:'10%',
			},
			{
				title: '行业分类',
		        dataIndex: 'HYType',
		        width:'20%',
			},
            {
				title: '关注时间',
		        dataIndex: 'JoinDate',
		        width:'20%',
			}
		];
		this.zjcolumns = [
			{
				title: '招标标题',
		        dataIndex: 'title',
		        width:'40%',
			},
			{
				title: '公告类型',
		        dataIndex: 'FormatGGType',
		        width:'10%',
			},
			{
				title: '省份',
		        dataIndex: 'Province',
		        width:'10%',
			},
			{
				title: '行业分类',
		        dataIndex: 'HYType',
		        width:'20%',
			},
            {
				title: '关注时间',
		        dataIndex: 'JoinDate',
		        width:'20%',
			}
		];
        this.getList();
        this.GetAllRoleName();
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
	.header{
	    overflow: hidden;
	    // width: calc(100% + 40px);
	    background: #fff;
	    // border-top: 1px solid #E9E9E9;
	    padding:20px;
	    height:156px;
	.headerWrap{
	    padding: 0 20px;
	    width:100%;
	    overflow: hidden;
	    display: flex;
	    align-items: center;
	    .rightData{
	        &>div{
	            height:20px;
	            line-height: 20px;
	            margin-bottom:15px;
	            &:nth-child(1){
	                font-size: 20px;
	                font-weight: bold;
	                height:30px;
	                line-height:30px;
	            }
	        }
	    }
	    .userS{
	        width:100%;
	        overflow:hidden;
	        div{
	            float:left;
	            margin-right:25px;
	        }
	    }
	    .headerImg{
	        background-repeat:no-repeat;
	        background-size: cover;
	        width:100px;
	        height:100px;
	        border-radius:2px;
	    }
	}
	}
	.tableWrap{
	    width:100%;
	    height:calc(100% - 156px);
	    background:#fff;
	    margin:20px 0 0 20px;
	    border-radius:3px;
	    .wrapTitle{
	        border-bottom:1px solid #ccc;
	        padding:0 20px;
	        width:100%;
	        height:70px;
	        line-height:70px;
	        font-size: 18px;
	        font-weight: bold;
	    }
	    .wrapContent{
	        height:calc(100% - 70px);
	        padding: 20px;
	    }
	}
	.content .ant-advanced-search-form .ant-form-item {
		display: flex;
	}
 
</style>