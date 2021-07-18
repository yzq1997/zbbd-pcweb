<template>
    <div class="wrap">
        <a-form :form="filterForm" style="overflow:hidden;">
			<a-row type="flex" justify="start">
				<a-col :span="4">
					<a-form-item label="企业名称:" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
						<a-input placeholder="请输入" style="width: 200px" v-decorator="['EnterpriseName']"/>
					</a-form-item>
					
				</a-col>
				<a-col :span="4">
					<a-form-item  label="来源" :colon="false"  :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
						<a-select v-decorator="['source',{initialValue:''}]" style="width: 150px">
							<a-select-option value="">全部</a-select-option>
							<a-select-option value="0">省私个协会</a-select-option>
							<a-select-option value="1">招标宝典</a-select-option>
							<a-select-option value="2">小程序</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				
				
				<a-col :span="4">
					<a-button type="primary" @click="filterSearch" style="margin-top:4px;">查询</a-button>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="3">
					<a-button type="primary"  @click="exportExcel" style="margin-top:4px;">导出Execl</a-button>
				</a-col>
			</a-row>
        </a-form>
        <tables style="margin-top: 20px;" class="col-24" size="small" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option"></tables>	
		<a-modal width="800px" title="营业执照" :maskClosable="false" v-model="editVisible"  footer="" cancelText="关闭">
			<img v-if="details.licenseUrl!= ''" width="700px" height="750px" :src="details.licenseUrl" />
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
			editVisible:false,
            filterForm:this.$form.createForm(this,{name:'filter'}),
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
                    name:"查看大图",
                    fn:(e)=>{
                        this.detail(e);
                    }
                }
            ],
            params:{}, 
			details:{},
			defaultImg:'../../assets/images/defaultPicture.png',
			exportdata:[],
        }
    },
    methods:{
		exportExcel(){
			let that = this;
			this.params.IsImport=1;//是否导出EXCEL,默认0，导出1
			this.$dataApi({
			    url:'api/Users/GetMember',
			    method:'POST',
			    data:this.params
			}).then(res=>{
				if(res.Status == 200)
				{
				    that.exportdata  = JSON.parse(res.Data).Rows;
					that.exportdata.forEach((item,index)=>{
						item.num=index+1;
						// console.log(item);
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
					    const tHeader = ['序号','企业名称', '联系人','联系人电话','注册时间',"程序来源"];   // 上面设置Excel的表格第一行的标题
					    const filterVal = ['num','EnterpriseName', 'LinkMan','LinkPhone','RegistTime','Origin']; // 上面的index、nickName、name是tableData里对象的属性key值
					    const list = this.exportdata;  //把要导出的数据tableData存到list
					    const data = this.formatJson(filterVal, list);
					    export_json_to_excel(tHeader, data, '会员管理数据统计');//最后一个是表名字
					  })
				}
			})
		},
		
		formatJson(filterVal, jsonData) {
		  return jsonData.map(v => filterVal.map(j => v[j]))
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
		
        // 查看详情
        detail(e){
			this.details={};
			this.editVisible=true;
			this.details=e;
        },
        // 初始化参数
        initParams(e){
			// console.log(e);
			
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
		
        // 获取列表
        getList(e){
            let that = this;
			this.initParams(e);
			this.$dataApi({
                url:'api/Users/GetMember',
                method:'POST',
                data:this.params
            }).then(res=>{
                    that.paginations.total  = JSON.parse(res.Data).TotalCount;
					that.tableData = JSON.parse(res.Data).Rows;
					that.tableData.forEach((item,index)=>{
						if(item.SourceJudgment==1){
							item.SourceJudgment="招标宝典"
						} else if(item.SourceJudgment==2){
							item.SourceJudgment="法律援助"
						}else if(item.SourceJudgment==3){
							item.SourceJudgment="申请入会"
						}
					})
            })
            
        },
        filterSearch(){
            this.getList();
        },
    },
    created(){
        this.columns = [
           {
               title: '营业执照',
			   dataIndex: 'licenseUrl',
               scopedSlots: { customRender: 'WX_HeadImg' },
           },
            {
				title: '企业名称',
                dataIndex: 'EnterpriseName',
            },
            {
				title: '联系人',
                dataIndex: 'LinkMan',
            },
            {
				title: '联系人电话',
                dataIndex: 'LinkPhone',
            },
            {
				title: '注册时间',
				dataIndex: 'RegistTime',
				sorter: true,
            },
            {
				title: '来源',
                dataIndex: 'SourceJudgment',
            },
			{
                title: '程序来源',
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
                title: '操作',
                dataIndex: 'option',
                scopedSlots: { customRender: 'option' },
            }
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
</style>