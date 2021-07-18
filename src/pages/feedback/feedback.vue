<template>
    <div class="wrap">
        <a-form :form="filterForm" style="overflow:hidden;">
            <a-col :span="24" style="display:flex;">
                <a-form-item label="微信昵称:" :colon="false" :label-col="{ span: 6}" :wrapper-col="{ span: 6 }">
                    <a-input placeholder="请输入" v-model="name" style="width: 300px"/>
                </a-form-item>
                <a-form-item label="联系人:" :label-col="{ span: 6 }" :wrapper-col="{ span: 6 }">
                    <a-input placeholder="请输入" v-model="lxr" style="width: 300px" />
                </a-form-item>
                <a-form-item label="联系方式:" :label-col="{ span: 6 }" :wrapper-col="{ span: 6 }">
                    <a-input placeholder="请输入" v-model="lxfs" style="width: 300px" />
                </a-form-item>
				
				
            </a-col>
            <a-col :span="20" style="display:flex;">
			   <a-form-item label="提交时间:" :colon="false"  :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
					<a-locale-provider :locale="zhCN" >
						<a-range-picker style="width: 300px" @change="onChange" :allowClear="false"  :placeholder="['开始时间', '结束时间']" v-decorator="['setDate']" />
					</a-locale-provider>
		      </a-form-item>  
			   <a-form-item  label="状态" :colon="false"  :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-select v-decorator="['nature',{initialValue:''}]" style="width: 300px" >
						<a-select-option value>全部</a-select-option>
						<a-select-option value="0">待回复</a-select-option>
						<a-select-option value="1">已回复</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item  label="来源" :colon="false"  :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
					<a-select v-decorator="['source',{initialValue:'0'}]" style="width: 150px" @change="handleChange1">
						<!-- <a-select-option value>全部</a-select-option> -->
						<a-select-option value="0">省私个协会</a-select-option>
						<a-select-option value="1">招标宝典</a-select-option>
						<a-select-option value="2">小程序</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
			 <a-col :span="8" style="margin-left:-17%">
                <a-button type="primary" @click="filterSearch" style="margin-top:4px;">查询</a-button>
            </a-col>
			 <a-col :span="2" style="margin-left:-27%">
                <a-button type="primary" @click="exportExcel" style="margin-top:4px;">导出EXCEL</a-button>
            </a-col>
        </a-form>
        <tables style="margin-top:20px;"  class="col-24" size="small" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option"></tables>
		
		<a-modal width="900px" title="反馈信息" :maskClosable="false" v-model="editVisible"  :afterClose ="closeWindow" footer="" cancelText="关闭">
		   <div class="header">
		       <a-col :span="24" class="headerWrap">
		           <a-col :span="5">
		               <div class="headerImg" :style="{'background-image':'url('+ ((typeof details.WechatHead).toUpperCase() == 'OBJECT' ? defaultImg : details.WechatHead) +')'}"></div>
		           		<img src='' alt="">
				   </a-col>
		           <a-col :span="19" class="rightData">
					    <a-col :span="21">
							<div style="float: left;">昵称 ：{{ details && details.NickName || '' }}</div>
						</a-col>
					    <a-col :span="21">
							<div style="float: left;">联系人 ：{{ details && details.ContactPerson || ''}}</div>
						</a-col>
						<a-col :span="21">
							<div style="float: left;">提交时间 ：{{ details && details.CreateDate || '' }}</div>
						</a-col>
						<a-col :span="21">
							<div style="float: left;">联系方式 ：{{ details && details.ContactInformation || '' }}</div>
						</a-col>
		           </a-col>
		       </a-col>
		   </div>
		   <div class="tableWrap">
				<a-tabs type="card" default-active-key="1">
					  <a-tab-pane key="1" tab="留言内容">
						  <div style="height:200px;width:95%;border: 1px solid #E3DDDD;">{{details && details.Content || ''}}</div>
						 <!-- <tables style="width:98%;" size="middle" :columns="tjcolumns" :tableData="tjtableData" :loading="false" :handleTableChange="handleTableChangetj" :bordered="true" :pagination="paginationstj"></tables> -->
					  </a-tab-pane>
					   <a-tab-pane key="2" tab="回复内容">
						<a-comment>
						<div slot="content" style="margin:-15px 0 0 -10px">
						<a-form-item>
						<a-textarea :rows="8" :value="details.ReplyContent" @change="handleChange" />
						</a-form-item>
						<a-form-item>
						<a-button html-type="submit" style="text-align: center;"  :loading="submitting" type="primary" @click="handleSubmit">
							提交
						</a-button>
						</a-form-item>
						</div>
					</a-comment>
					  </a-tab-pane>
					
				</a-tabs>
		   </div>
		</a-modal>
		
	</div>
</template>
<script>
import tables from '@/pages/common/table';
import moment from 'moment';
import Bus from '../../utils/vue-bus.js';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
    components:{
        tables
    },
    data(){
        return {
			source:0,
			comments:'',
			CurrentPage: 1,
            submitting: false,
            value: '',
            moment,
			zhCN ,
			name:'',
			lxr:'',
			lxfs:'',
			starttime:'',
			endtime:'',
			editVisible:false,
            filterForm:this.$form.createForm(this),
            columns:[],
			tjcolumns:[],
			fwcolumns:[],
            tableData: [],
			tjtableData:[],
			fwtableData:[],
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
            option:[
                {
                    type:"detail",
                    name:"详情",
                    fn:(e)=>{
						console.log(e);
						this.detail(e);
                    }
				},
            ],
            params:{},
			sex:[
			  { text: '女', value: 2 },
			  { text: '男', value: 1 }],  
			details:{},
			defaultImg:'../../assets/images/defaultPicture.png',
			exportdata:[],
        }
	},
    methods:{
		handleSubmit() {
			let content = this.value ;
			let aa = this.details.OpenID;
			let id = this.details.ID;
			this.$axios
				.post("https://web.jshcsoft.com/mqy/ZBSystem/api/api/Users/ModifyOpitionByOpenID", {
				OpenId: this.details.OPenID,
				id: this.details.ID,
				ReplyContent: this.details.ReplyContent
				})
				.then(res => {
					this.$message.success(
						'提交成功',
						1,
					);
					// console.log(res);
					// alert(JSON.parse(res).Msg)
			
				});
	  },
	   closeWindow(e){
		//    this.paginations.current = 2
		 this.paginations.current = this.CurrentPage;
		 this.getList();
	   },
		handleChange(e) {
		this.details.ReplyContent = e.target.value;
		},
		onChange(date, dateString) {
			this.starttime = dateString[0];
			this.endtime = dateString[1];
			console.log(this.starttime,this.endtime);
			
			// this.GetSendStat(0);
		},
		getCurrentStyle(current, today) {
			const style = {};
			if (current.date() === 1) {
				style.border = '1px solid #1890ff';
				style.borderRadius = '50%';
			}
			return style;
			},
        // table改变
        handleTableChange(pagination,filter,sorter){
			
            let that = this;
            const pager = Object.assign(this.paginations);
			pager.current = pagination.current;
			this.CurrentPage = pagination.current;
            this.paginations = pager;
            this.params['pageNo'] = this.paginations['current'];
			// 排序
			// debugger;
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
        // 查看详情
        detail(e){
			this.editVisible=true;
			this.details=e;
			// this.gettjList();
			// this.getfwList();
		},
		// //查看回复
		// reply(e){

		// }
        // 初始化参数
        initParams(e){
			// debugger;
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
				  pageSize: "10"//每页数量

				}
		    }).then(res=>{
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
				   pageSize: "10"//每页数量

				}
		    }).then(res=>{
		        that.paginationsfw.total = res.TotalCount;
		        that.fwtableData = res.Rows;
		    })
		},
		handleChange1(value){
			// console.log(value);
			this.source = value;
		},
		// 获取列表
		// okZwfuOUXCKCTtgtAZl1bXCI0ABY
        getList(e){	
			//this.initParams(e);
			// debugger;
			let replyState = "";
			// let source = null
			// this.filterForm.validateFields((error, value) => {
			// 	if (!error) {
			// 		console.log(value);
					
			// 		replyState = value.nature;
			// 		source = Number(value.source)
					
			// 	}
			// });
            this.$axios
                .post("http://192.168.1.110:8099/api/Users/GetOpitionByOpenID", {
				OpenId: '',
				WechatHead:'',
				NickName:this.name,
				ContactInformation:this.lxfs,
				ContactPerson:this.lxr,
				TimeBegin:this.starttime,
				TimeEnd:this.endtime,
				ReplyState:replyState,
				Source:this.source
                })
                .then(res => {
					this.tableData = JSON.parse(res).data
					// console.log(JSON.parse(res).data);
					
                });

            // let that = this;
            // this.initParams(e);
            // this.$dataApi({
            //     url:'api/Users/GetUsers',
            //     // url:'api/Users/GetOpitionByOpenID',
            //     method:'POST',
            //     data:this.params
            // }).then(res=>{
            //     if(res.Status == 200)
            //     // console.log(res);
            //     {
            //         that.paginations.total  = JSON.parse(res.Data).TotalCount;
            //         that.tableData = JSON.parse(res.Data).Rows;
            //         console.log(that.tableData);
                    
			// 		that.tableData.forEach(item=>{
			// 			for(let i=0;i<that.sex.length;i++){
			// 			  if(item.sex == that.sex[i].value){
			// 				item.sex=that.sex[i].text;
			// 			  }
			// 			}
			// 		})
            //     }
            // })
		},
		//点击查询
        filterSearch(){
            this.getList();
		},
		exportExcel(){
			let that = this;
			 this.$axios
                .post("http://192.168.1.110:8099/api/Users/GetOpitionByOpenID", {
				OpenId: '',
				WechatHead:'',
				NickName:'',
				ContactInformation:'',
				ContactPerson:'',
				TimeBegin:'',
				TimeEnd:'',
				Source:null
                })
                .then(res => {
                    console.log((JSON.parse(res)).data);
					that.exportdata = (JSON.parse(res)).data;
					that.exportdata.forEach((item,index)=>{
						item.num=index+1;
						item.ReplyState = item.ReplyState == 0 ? "待回复":"已回复" ;
						item.Source = item
						if(item.Origin === 0){
							item.Origin = "省私个协会"
						}else if(item.Origin === 1){
							item.Origin = "招标宝典"
						}else if(item.Origin === 2){
							item.Origin = "小程序"
						}
						
					})
					require.ensure([], () => {
					    const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
					    const tHeader = ['序号','微信头像','微信昵称', '联系人','联系方式','提交时间','留言内容','状态','来源'];   // 上面设置Excel的表格第一行的标题
					    const filterVal = ['num','WechatHead', 'NickName','ContactPerson','ContactInformation','CreateDate','Content','ReplyState','Origin']; // 上面的index、nickName、name是tableData里对象的属性key值
					    const list = this.exportdata;  //把要导出的数据tableData存到list
					    const data = this.formatJson(filterVal, list);
					    export_json_to_excel(tHeader, data, '意见反馈表');//最后一个是表名字
					  })
                });
		},
		formatJson(filterVal, jsonData) {
			return jsonData.map(v => filterVal.map(j => v[j]))
		},
		    //初始化时间
    initPrams(e) {
      e = 15;
      Object.assign(this.params, this.filterForm.getFieldsValue());
      if (
        Array.isArray(this.params["dateRange"]) &&
        this.params["dateRange"].length > 0
      ) {
        this.params["beginDate"] = moment(this.params["dateRange"][0]).format(
          "YYYY-MM-DD"
        );
        this.params["endDate"] = moment(this.params["dateRange"][1]).format(
          "YYYY-MM-DD"
        );
        delete this.params["dateRange"];
      } else {
        this.params["beginDate"] = new Date(
          new Date().getTime() - 24 * e * 60 * 60 * 1000
        )
          .toLocaleDateString()
          .replace("/", "-")
          .replace("/", "-");
        this.params["endDate"] = new Date()
          .toLocaleDateString()
          .replace("/", "-")
          .replace("/", "-");
      }
    }
    },
    created(){
        this.columns = [
            {
                title: '微信头像',
				dataIndex: 'WechatHead',
				width:'5%',
                scopedSlots: { customRender: 'WX_HeadImg' },
            },
            {
                title: '微信昵称',
				dataIndex: 'NickName',
				width:'10%',
            },
            {
                title: '联系人',
				dataIndex: 'ContactPerson',
				width:'5%',
            },
            {
                title: '联系方式',
				dataIndex: 'ContactInformation',
				width:'10%',
            },
            {
                title: '提交时间',
				dataIndex: 'CreateDate',
				width:'10%',
            },
            {
                title: '留言内容',
				dataIndex: 'Content',
				width:'30%',
			},
			{
                title: '来源',
				dataIndex: 'Origin',
				width:'5%',
				customRender: text => {
					// console.log(text);
					// return text == "1" ? "已回复" : "待回复";
					if(text == 0){
						return "省私个协会"
					}else if(text == 1){
						return "招标宝典"
					}else if(text == 2){
						return "小程序"
					}				
				}
			},
			 {
                title: '状态',
				dataIndex: 'ReplyState',
				width:'5%',
				customRender: text => {
					// console.log(text);
					return text == "1" ? "已回复" : "待回复";
				}
            },
            {
                title: '操作',
				dataIndex: 'option',
				width:'10%',
                scopedSlots: { customRender: 'option' },
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
		this.initPrams();
		this.getList()
	},
	computed: {
    initValue() {
      let obj = {};
      obj.initialValue = [
        moment(
          new Date(
            new Date().getTime() - 24 * this.daynum * 60 * 60 * 1000
          ).toLocaleDateString(),
          "YYYY/MM/DD"
        ),
        moment(new Date().toLocaleDateString(), "YYYY/MM/DD")
      ];
      return obj;
    }
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
    .col{
        display: flex;
		justify-content: space-around;
    }
    .ant-row{
        margin-left: 20px;
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
</style>