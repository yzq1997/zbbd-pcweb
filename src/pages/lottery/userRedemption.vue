<template>
    <div class="wrap">
        <a-form :form="filterForm" style="overflow:hidden;">
            <a-col :span="5">
                <a-form-item label="微信昵称:" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input placeholder="请输入" style="width: 200px" v-model="userName" v-decorator="['NickName']"/>
                </a-form-item>
            </a-col>
			<a-col :span="4">
                <a-form-item label="联系方式:" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input placeholder="请输入" style="width: 200px" v-model="userPhone" v-decorator="['LinkPhone']"/>
                </a-form-item>
            </a-col>
			<a-col :span="7">
                <a-form-item label="时间:" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-range-picker @change="onChange" />
                </a-form-item>
            </a-col>
            <a-col :span="5">
                <a-form-item label="兑换类型:" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                    <a-select default-value="0" style="width: 160px" @change="handleChange">
						<a-select-option value="0">
							全部
						</a-select-option>
						<a-select-option value="1">
							补签卡
						</a-select-option>
						<a-select-option value="2">
							七天会员体验卡
						</a-select-option>
                        <a-select-option value="3">
							现金抽奖一次
						</a-select-option>
					</a-select>
                </a-form-item>
            </a-col>
            <a-col :span="1">
                <a-button type="primary" @click="filterSearch" style="margin-top:4px;">查询</a-button>
            </a-col>
			<a-col :span="1">
                <a-button type="primary" @click="exportExcel" style="margin-top:4px;">导出Execl</a-button>
            </a-col>
        </a-form>
        <tables class="col-24" size="small" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" style="margin-top:20px" ></tables>
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
			userName:'',
			userPhone:'',
			editVisible:false,
			ExchageType:'',
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
			details:{},
			defaultImg:'../../assets/images/defaultPicture.png',
			zcData:'',
			isVip:'',
			BeginRegisterTime:'',
			EndRegisterTime:'',
            exportdata:[],
 
        }
    },
    methods:{
 
		exportExcel(){
			let that = this;
			// console.log(this.userName);

			this.$dataApi({
				url:'api/SignInPoints/GetUserExchangeData',
				method:'POST',
				data:{
					IsImport:1,
					NickName:this.userName,
					LinkPhone:this.userPhone,
					BeginTime:this.BeginRegisterTime,
					EndTime:this.EndRegisterTime,
					ExchageType:this.ExchageType
				}
			}).then(res=>{
				that.exportdata = res.ExchangeDataList;
				// that.exportdata.sort(this.tabledatesort)
				that.exportdata.forEach((item,index)=>{
					item.num=index+1;
				})
				require.ensure([], () => {
					const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
					const tHeader = ['序号','微信昵称', '兑换时间','手机号码','可用积分','兑换类型'];   // 上面设置Excel的表格第一行的标题
					const filterVal = ['num','NickName', 'ExchangeDate','LinkPhone','AvailablePoints','ExchageType']; // 上面的index、nickName、name是tableData里对象的属性key值
					const list = this.exportdata;  //把要导出的数据tableData存到list
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, '用户兑换数据统计');//最后一个是表名字
				})
			})
		},

		handleChange:function(e){
			if(e==1){
				this.ExchageType="补签卡"
			}else if(e==2){
				this.ExchageType="七天会员体验卡"
			}else if(e==3){
				this.ExchageType="现金抽奖一次"
			}else {
				this.ExchageType=""
			}
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
			console.log(date, dateString);
			this.zcData = dateString,
			this.BeginRegisterTime = dateString[0];
			this.EndRegisterTime = dateString[1];
		},
 
        
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
			this.params.IsImport = 0
			this.params.BeginTime = this.BeginRegisterTime;
			this.params.EndTime = this.EndRegisterTime;
			this.params.ExchageType=this.ExchageType;
			let that = this;
			let source = null
			this.filterForm.validateFields((error, value) => {
				if (!error) {
				}
			});
			this.initParams(e);
			
            this.$dataApi({
                url:'api/SignInPoints/GetUserExchangeData',
                method:'POST',
                data:this.params
            }).then(res=>{
                if(res.Status == 200)
                {
                    that.paginations.total  = res.TotalCount;
                    that.tableData = res.ExchangeDataList;
					that.tableData.forEach((item,index)=>{
						item.num=index+1
					})
                }
            })
		},
		//点击查询按钮
        filterSearch(){
            this.getList();
        },
    },
    created(){
        this.columns = [
            {
                title: "序号",
                dataIndex: "num"
            },
            {
                title: '微信昵称',
                dataIndex: 'NickName',
			},
			{
                title: '微信头像',
                dataIndex: 'HeadingUrl',
                scopedSlots: { customRender: 'WX_HeadImg' },
            },
			{
			    title: '手机号码',
			    dataIndex: 'LinkPhone',
			},
			
            {
			    title: '时间',
			    dataIndex: 'ExchangeDate',
			},
			{
			    title: '可用积分',
			    dataIndex: 'AvailablePoints',
            },
            {
			    title: '兑换类型',
			    dataIndex: 'ExchageType',
			},
		 
        ];
		this.getList()
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
    .nr span{
        font-size: 20px;
        font-weight: bold;
    }
    .nr span:nth-of-type(1){
        margin-right: 10px
    }
    .nr span:nth-of-type(2){
        margin-right: 30px
    }
    .nr span:nth-of-type(3){
        margin-right: 10px
    }
    .nr span:nth-of-type(4){
        margin-right: 50px
    }
</style>