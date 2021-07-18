<template>
    <div class="wrap">
        <a-form class="ant-advanced-search-form" :form="filterForm"> 
            <a-row :gutter="24" style="display:flex;justify-content:space-between;">
                <a-col :span="8">
                    <a-form-item label="招标标题：" :colon="false" >
                        <a-input style="width:100%;"
                            placeholder="请输入招标标题"
                            v-decorator="['title']"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="招标类型：" :colon="false"  >
                        <a-select
                            v-model="typevalue"
                            mode="multiple"
                            placeholder="请选择类型"
                            :default-value="[]"
                            style="width: 100%"
                            @change="handleChangeType"
                            >
                            <a-select-option v-for="(item,index) in filterType" :key="index">
                                {{ item.text }}
                            </a-select-option>
                            </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="省份：" :colon="false"  >
                        <a-select
                            v-model="provalue"
                            mode="multiple"
                            :default-value="[]"
                            style="width: 100%"
                            placeholder="请选择省份"
                            @change="handleChangePro"
                            >
                            <a-select-option v-for="(item,index) in province" :key="index" >
                                {{ item }}
                            </a-select-option>
                            </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="8">
                    <a-form-item label="发布时间：" :colon="false"  >
                        <a-locale-provider :locale="zhCN">
                            <a-range-picker style="width:100%;" @change="clearTime" :placeholder="['开始时间', '结束时间']" v-decorator="['cT_TimeRange']" />
                        </a-locale-provider>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item label="招标来源：" :colon="false" >
                        <a-input style="width:100%;"
                            placeholder="请输入招标来源"
                            v-decorator="['SourceTitle']"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="7" class="button">
                    <a-button type="primary" @click="selecting">查询</a-button>
                    <a-button type="default" style="margin-left:10px;" @click="resetFilter">重置</a-button>
                </a-col>
            </a-row>
        </a-form>
        <a-col :span="24" style="margin-top:20px;">
            <tables style="width:100%;"   size="middle"   :columns="columns" :tableData="tableData" :loading="loading" :handleTableChange="handleTableChange" :bordered="bordered" :pagination="paginations" >
            </tables>
        </a-col>

        <div class="example" v-if="isLoading">
            <a-spin size="large" />
        </div>
    </div>
</template>
<script>

import tables from "../common/table.vue";
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { spawn } from 'child_process';
import moment from 'moment';
import Bus from '../../utils/vue-bus';
import { log } from 'util';
export default {
    components:{
        tables,
    },
    data(){
        return {
            operateForm:this.$form.createForm(this,{name:'operateForm'}),
            zhCN,
            sortedInfo:null,
            filterForm:this.$form.createForm(this, { name: 'filter' }),
            addVisible:false,
            editVisible:false,
            selectedRows:[],
            tableData: [],
            // rowSelection.selectedRowKeys
            rowSelection:{
                selectedRowKeys:[],
            },
            paginations: {
                current:1,
                pageSize:10,
                total:0,
                showQuickJumper:true,
                showSizeChanger:false,
                size:'normal',
                onShowSizeChange:function(){},
                showTotal:function(total,range){
                    return  `共 ${total} 条记录`;
                }
            },
            loading: false,
            columns:[],
            bordered:true,
            typevalue:[],
			provalue:[],
            params:{
                pageSize:10
            },
            sourceData:[],
            userList:[],
			province:['安徽','澳门','北京','重庆',
                '福建','广州','广西','贵州',
                '甘肃','湖北','河北','黑龙江',
                '海南','河南','湖南','吉林',
                '江苏','江西','辽宁','内蒙古',
                '宁夏','青海','山西','陕西',
                '上海','山东','四川','天津',
                '台湾','西藏','新疆','香港',
                '云南','浙江'
            ],
			filterType:[
                { text: '全部', value: 0},
                { text: '招标公告', value: 1 },
                { text: '变更公告', value: 2 },
                { text: '结果公告', value: 3 }
            ],
            isLoading:false
        }
    },
    methods:{
		// 重置时间
		clearTime(e){
		    if(Array.isArray(e) && e.length == 0)
		    {
		        if(this.params['cT_TimeRange'])
		        {
		            delete this.params['cT_TimeRange']
		        }
		    }
		},
		
		handleChangePro(value) {
			this.params['Provinces']=`${value}`;
        },
        
		handleChangeType(value) {
			if(`${value}`.indexOf("0") != -1){
				this.params['GGType']='';
			}else {
				this.params['GGType']=`${value}`;
			}
        },	
        
        // 清除维护人
        clearUser(e){
            if(!e)
            {
                this.params['updateMan'] = "";
            }
        },
        // 查询来源
        sourceSearch(e){
            let that = this;
            if(e)
            {
                this.$dataApi({
                    url:'/api/CompareTest/GetOrign',
                    method:'GET',
                    data:{
                        OrignName:e
                    }
                }).then(res=>{
                    if(res.status == 200)
                    {
                        this.sourceData = res.data.map((item)=>{
                            return {
                                text:item.Origin,
                                value:item.Origin,
                            }
                        });
                    }
                })
            }
        },

        // 清除搜索
        clearSearch(e){
            if(!e)
            {
                this.params['cT_Source'] = "";
                this.params['cT_Orign'] = "";
            }
        },

        // 初始化查询条件
        initParams(e){
            Object.assign(this.params,this.filterForm.getFieldsValue())
            this.COMMON.dropObj(this.params);
            if(Array.isArray(this.params['cT_TimeRange']) && this.params['cT_TimeRange'].length > 0)
            {
                this.params['TimeBegin'] = moment(this.params['cT_TimeRange'][0]).format('YYYY-MM-DD');
                this.params['TimeEnd'] = moment(this.params['cT_TimeRange'][1]).format('YYYY-MM-DD');
                delete this.params['cT_TimeRange']
            }
            if(!e)
            {
                this.params.pageNo = 1;
                this.paginations.current = 1;
            }
        },

        // 查询
        selecting(){
            this.isLoading = true;
            this.getList();
        },

        // 重置
        resetFilter(){
            this.params['TimeBegin'] = "";
            this.params['TimeEnd'] = "";
			this.provalue=[];
			this.typevalue=[];
			this.params['GGType']="";
			this.params['Provinces']="";
            this.filterForm.resetFields();
        },

        // 新增
        addNew(){
            this.$route.params.comparative = "add";
            this.$parent.pages = 'compareNew';
        },

        // table翻页，排序，筛选
        handleTableChange(pagination, filters, sorter) {
            let that = this;
            const pager = Object.assign(this.paginations);
            pager.current = pagination.current;
            this.paginations = pager;
            // 排序
            this.params['sortField'] = sorter['columnKey'] || "";
            this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? 0 : 1 : "";
            // 分页
            this.params['pageNo'] = this.paginations['current'];
            that.getList('false');
        },


        // 获取招标信息列表
        getList(e){
            let that = this;
            console.log(this.params);
            // return;
            this.initParams(e);
            that.$dataApi({
                url:"api/baseData/GetDataAfterEnd",
                method:"POST",
                data:this.params
            }).then(res=>{
                console.log(JSON.parse(res.Data));
                that.rowSelection.selectedRowKeys = [];
                that.paginations.total = JSON.parse(res.Data).TotalCount;;
                that.tableData = JSON.parse(res.Data).Rows;;
				that.tableData.forEach(item=>{
					for(let i=0;i<that.filterType.length;i++){
					  if(item.GGType == that.filterType[i].value){
						item.GGType=that.filterType[i].text;
					  }
					}
					var dateee = new Date(item.PubTime).toJSON();
					item.PubTime = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')  
                });
                this.isLoading = false;
            })
        }
    },
    created(){
        Bus.$emit('menuSelect',{})
        let { sortedInfo } = this;
        let that = this;
        sortedInfo = sortedInfo || {};
        this.columns = [
            {
                title: '招标标题',
                dataIndex: 'title',
                width:"25%",
                align:"left",
                scopedSlots: { customRender: 'titleShow' },
            },
            {
                title: '公告类型',
                dataIndex: 'FormatGGType',
                width:"8%",
                align:"left",
                scopedSlots: { customRender: 'titleShow' },
            },
			{
			    title: '省份',
			    dataIndex: 'Province',
			    width:"8%",
			    align:"left",
			    scopedSlots: { customRender: 'titleShow' },
			},
            {
                title: '行业分类',
                dataIndex: 'HYType',
                width:"7%",
                align:"left",
                scopedSlots: { customRender: 'titleShow' },
            },
            {
                title: '城市',
                dataIndex: 'City',
                width:"7%",
                align:"left",
                scopedSlots: { customRender: 'titleShow' },
            },
			{
			    title: '发布时间',
			    dataIndex: 'PubTime',
			    width:"12%",
			    align:"left",
			   sorter: true,
			},
			{
			    title: '来源',
			    dataIndex: 'Source',
			    width:"20%",
			    align:"left",
			    scopedSlots: { customRender: 'titleShow' },
            },
            // {
            //     title: '程序来源',
			// 	dataIndex: 'Origin',
			// 	width:'5%',
			// 	customRender: text => {
			// 		// console.log(text);
			// 		// return text == "1" ? "已回复" : "待回复";
			// 		if(text == 0){
			// 			return "省私个协会"
			// 		}else if(text == 1){
			// 			return "招标宝典"
			// 		}else if(text == 2){
			// 			return "小程序"
			// 		}				
			// 	}
			// },
			{
			    title: '公告地址',
			    dataIndex: 'address',
			    width:"15%",
			    align:"left",
			    scopedSlots: { customRender: 'titleShow' },
			},
			
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
        padding: 20px;
        position: relative;
        label{
            width:80px;
            display: inline-block;
            text-align:left;
        }
    }
    .example {
        position: absolute;
        // text-align: center;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        z-index: 9999
        // border-radius: 4px;
        // margin-bottom: 20px;
        // padding: 30px 50px;
        // margin: 20px 0;
    }
   .ant-advanced-search-form .ant-form-item {
		display: flex;
	}
</style>