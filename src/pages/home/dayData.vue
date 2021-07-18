<template>
    <div class="wrap">
        <a-form :form="filterForm" style="overflow:hidden;">
            
			<a-col :span="7">
                <a-form-item label="时间:" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-range-picker :disabled-date="disabledDate" @change="onChange" :allowClear="false" :placeholder="['开始时间', '结束时间']" v-decorator="['dateRange',initValue]" />
                </a-form-item>
            </a-col>
            
            <a-col :span="1">
                <a-button type="primary" @click="filterSearch" style="margin-top:4px;">查询</a-button>
            </a-col>
			
        </a-form>
        <tables class="col-24" size="small"  :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" style="margin-top:20px" ></tables>
	</div>
</template>
<script>
import tables from '@/pages/common/table';
import Bus from '../../utils/vue-bus.js';
import moment from 'moment';
import { formatDate } from '../../utils/dateformat.js'
export default {
    components:{
        tables
    },
    data(){
        return {
			userName:'',
			SignInNature:'',
			userPhone:'',
			editVisible:false,
            filterForm:this.$form.createForm(this,{name:'filter'}),
            columns:[],
            widthFlag:{x:2500},
            tableData: [],
            paginations: {
                current:1,
                pageSize:10,
                total:0,
                size:'middle',
                showQuickJumper:true,
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
            daynum:7,
            pageNoo:1,
        }
    },
    methods:{
        moment,
        disabledDate(current) {
            return current && current > moment().endOf('day');
        },

        handleChange(value){
            // console.log(value);
            
            this.daynum=value;
            let date1 = new Date();
            let date2 = new Date(date1);
            let emouth=date1.getMonth() + 1;
            let eday=date1.getDate();
            if(emouth < 10){
                emouth="0"+emouth;
            }
            if(eday <10){
                eday="0"+eday;
            }
            this.endDay=date1.getFullYear() + "-" + emouth + "-" + eday;
            date2.setDate(date1.getDate() - value);
            let smouth=date2.getMonth() + 1;
            let sday=date2.getDate();
            if(smouth < 10){
                smouth="0"+smouth;
            }
            if(sday <10){
                sday="0"+sday;
            }
            this.startDay=date2.getFullYear() + "-" + smouth + "-" + sday;
            
            this.params.beginDate=this.startDay;
            this.params.endDate=this.endDay;
            this.filterForm.validateFields((error, value) => {
                if (!error) {
                    // console.log(value);
                    source = value
                    
                }
            });
            
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
			// this.zcData = dateString,
			// this.BeginRegisterTime = dateString[0];
            // this.EndRegisterTime = dateString[1];
            this.params.beginDate=dateString[0];
            this.params.endDate=dateString[1];
		},
 
        // table改变
        handleTableChange(pagination,filter,sorter){
            console.log(pagination);
            this.pageNoo =  pagination.current;
            let that = this;
            const pager = Object.assign(this.paginations);
            pager.current = pagination.current;
            this.paginations = pager;
            this.params['PageNum'] = this.paginations['current'];
            that.getList()
        },

        // 获取列表
        getList(e){
            let that = this;
            // console.log(this.params);
            let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
            let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
			this.filterForm.validateFields((error, value) => {
				if (!error) {
				}
			});
			
            this.$dataApi({
                url:'api/UserDataStatistics/UserDailyStatistics',
                method:'POST',
                data:{
                    BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
                    EndTime: formatDate(endDate, 'yyyy-MM-dd'),
                    IsImport: 0,
                    PageNo: this.pageNoo,//当前页面
                    PageSize: 10,//每页数量
                    UserRole:'免费用户'
                }
            }).then(res=>{
                // console.log(res);
                res.OutUserDailyStatisticsList.sort(this.datesort)
                that.paginations.total  = res.TotalCount;
                that.tableData = res.OutUserDailyStatisticsList;
                that.tableData.sort(this.tabledatesort)
            })
        },
        
		//点击查询按钮
        filterSearch(){
            this.getList();
        },
        
        //初始化时间
        initPrams(){
            Object.assign(this.params,this.filterForm.getFieldsValue())
            if(Array.isArray(this.params['dateRange']) && this.params['dateRange'].length > 0)
            {
                this.params['beginDate'] = moment(this.params['dateRange'][0]).format('YYYY-MM-DD');
                this.params['endDate'] = moment(this.params['dateRange'][1]).format('YYYY-MM-DD');
                delete this.params['dateRange']
            }
            else
            {
                this.params['beginDate'] = new Date(new Date().getTime() - 24*7*60*60*1000).toLocaleDateString().replace('/','-').replace('/','-');
                this.params['endDate'] = new Date().toLocaleDateString().replace('/','-').replace('/','-');
            }	
        }
    },
    created(){
        this.columns = [
            {
                title: "时间",
                dataIndex: "JoinDate"
            },
            {
                title: "关键词设置数量",
                dataIndex: "KeyWordSetCount"
            },
            {
                title: "未设置关键词用户量",
                dataIndex: "NotSetCount"
            },
            {
                title: "访问量",
                dataIndex: "VisitTotalCount"
            },
            {
                title: "推送量 ",
                dataIndex: "PushCount"
            },
            {
                title: "推送点击量 ",
                dataIndex: "PushClickCount"
            },
            {
                title: "用户量 ",
                dataIndex: "MemberTotalCount"
            },
            {
                title: "取关数量",
                dataIndex: "MemberClearCount"
            },
            // {
            //     title: '会员新增数量',
            //     dataIndex: 'MemberAddCount',
            // },
			// {
			//     title: '会员取关数量',
			//     dataIndex: 'MemberClearCount',
            // },
            // {
			//     title: '会员关键词设置数量',
			//     dataIndex: 'MemberKeyWordSetCount',
            // },
            // {
			//     title: '非会员访问量',
			//     dataIndex: 'NonMemberVisitCount',
			// },
            // {
			//     title: '会员访问量',
			//     dataIndex: 'MemberVisitCount',
            // },
            // {
			//     title: '访问总量',
			//     dataIndex: 'VisitTotalCount',
            // },
            // {
			//     title: '未设置关键词会员用户量',
			//     dataIndex: 'NotSetMemberCount',
            // },
            // {
			//     title: '未设置关键词非会员用户量',
			//     dataIndex: 'NotSetNonMemberCount',
            // },
            // {
			//     title: '已设置取关用户',
			//     dataIndex: 'SetClearCount',
            // },
            // {
			//     title: '未设置取关用户',
			//     dataIndex: 'NotSetClearCount',
            // },
            // {
			//     title: '主动设置关键词会员用户量',
			//     dataIndex: 'ActiveSetMemberCount',
            // },
            // {
			//     title: '主动设置关键词非会员用户量',
			//     dataIndex: 'ActiveSetNonMemberCount',
            // },
            // {
			//     title: '被动设置关键词会员用户量',
			//     dataIndex: 'PassiveSetMemberCount',
            // },
            // {
			//     title: '会员推送点击量',
			//     dataIndex: 'MemberPushClickCount',
            // },
            // {
			//     title: '会员总量',
			//     dataIndex: 'MemberTotalCount',
            // },
        ];
        this.initPrams();  //初始化时间
		this.getList()
    },
    computed:{
        initValue(){
            let obj = {};
            obj.initialValue = [moment(new Date(new Date().getTime() - 24*this.daynum*60*60*1000).toLocaleDateString(), 'YYYY/MM/DD'),moment(new Date().toLocaleDateString(), 'YYYY/MM/DD')];
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