<template>
	<div class="index">
		<div class="chart">
			<div class="searchinfo">
				<a-row style="overflow:hidden;margin-bottom:20px;height:40px;" type="flex" justify="space-between">
				    <a-col :span="2" class="bold visiT">
						<span>用户访问量</span>
					</a-col>
					<a-col :span="8" class="bold visiT">
						 
					</a-col>
					<a-col :span="2">
						<a-select default-value="最近7天" style="width: 120px" @change="handleChange">
						      <a-select-option value="7">
						        最近7天
						      </a-select-option>
						      <a-select-option value="15">
						        最近15天
						      </a-select-option>
						      <a-select-option value="30">
						        最近30天
						      </a-select-option>
						</a-select>
					</a-col>
				    <a-col :span="8">
				        <a-form :form="filterForm">
				            <a-form-item label="" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 22 }">
				                <a-locale-provider :locale="zhCN">
				                    <a-range-picker style="width:100%;" @change="onChange" :allowClear="false" :placeholder="['开始时间', '结束时间']" v-decorator="['dateRange',initValue]" />
				                </a-locale-provider>
				            </a-form-item>
				        </a-form>
				    </a-col>
				</a-row>
			</div>
			<div class="chartinfo" ref="chartinfo"></div>
		</div>
		<div class="table" >
			<a-col :span="24" style="margin-bottom:20px;height: auto;">
			    <a-row>
				<a-col :span="4">
				    <a-button type="primary" @click="exportExcel">导出Execl</a-button>
				</a-col>
			    </a-row>
			</a-col>
			<a-col :span="24" style="height: auto;">
			    <tables  :columns="columns" :tableData="tableData" size="middle"  :loading="loading" :handleTableChange="handleTableChange" :bordered="bordered" :pagination="paginations" >
			    </tables>
			</a-col>
		</div>
	</div>
</template>

<script>
	import tables from '@/pages/common/table'
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
	import moment from 'moment';
	import { formatDate } from '../../utils/dateformat.js'
	import Bus from '../../utils/vue-bus.js';
	export default{
		components:{
		    tables
		},
		data(){
			return {
				zhCN,
				xdata:[],
				ydata: [],
				columns:[],
				tableData:[],
				loading:false,
				bordered:true,
				paginations: {
				    current:1,
				    pageSize:10,
				    total:0,
				    size:'default',
				    showQuickJumper:true,
				    showTotal:function(total,range){
				        return  `共 ${total} 条记录`;
				    }
				},
				endDay:"",
				startDay:"",
				filterForm:this.$form.createForm(this,{name:'filter'}),
				params:{},
				daynum:7,
				exportdata:[],
				filterForm:this.$form.createForm(this),
				source:0,
				Time:[], //(日期)
				FreePV:[], //(免费用户访问量)
				VIPPV:[], //( 会员用户访问量)
				FreeUV:[], //(免费用户独立访客数)
				VIPUV:[], //(会员用户独立访客数)
				PV:[], //(总访问量)
				UV:[], //(总访客数)
			}
		},
		methods:{
			// 表格事件
			handleTableChange(pagination,filter,sort){
				let that = this;
				const pager = Object.assign(this.paginations);
				pager.current = pagination.current;
				this.paginations = pager;
				this.params['pageNo'] = this.paginations['current'];
				this.checkedKeys = [];
					this.getUserAccesslist('false');
			},
			
			getchartinfo(){
				let myChart = this.$echarts.init(this.$refs.chartinfo);
				myChart.setOption({
					tooltip: {              //设置tip提示
						trigger: 'axis'
						},
					legend: {
						data: ['PV(访问量)', 'UV(独立访问量)']
					},
					xAxis: {
						name:"日期",
						type: 'category',
						data:this.xdata,
					},
					yAxis: {
						name:"数量",
						type: 'value'
					},
					series: [
						{
							data: this.PV,
							type: "line",
							name: 'PV(访问量)',
						},
						{
							name: '免费用户访问量',
							type: 'line',
							data: this.FreePV,
							showSymbol:0,
							symbol: "none",
							showSymbol:false,
							color:"#6F6F6F",
							lineStyle: {
							width: 0, // 线宽是0
							color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
							},
						},
						{
							name: '会员用户访问量',
							type: 'line',
							data: this.VIPPV,
							showSymbol:0,
							symbol: "none",
							showSymbol:false,
							color:"#6F6F6F",
							lineStyle: {
							width: 0, // 线宽是0
							color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
							},
						},
						{
							data: this.UV,
							type: "line",
							name: 'UV(独立访问量)',
							color:'#00FF00'
						},
						{
							name: '免费用户独立访客数',
							type: 'line',
							data: this.FreeUV,
							showSymbol:0,
							symbol: "none",
							showSymbol:false,
							color:"#6F6F6F",
							lineStyle: {
							width: 0, // 线宽是0
							color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
							},
						},
						{
							name: '会员用户独立访客数',
							type: 'line',
							data: this.VIPUV,
							showSymbol:0,
							symbol: "none",
							showSymbol:false,
							color:"#6F6F6F",
							lineStyle: {
							width: 0, // 线宽是0
							color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
							},
						}
					]
				})
			},

			onChange(date, dateString) {
				// console.log(date, dateString);
				
				this.params.beginDate=dateString[0];
				this.params.endDate=dateString[1];
				this.getUserAccesslist(0);
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
				let source = 0
				this.filterForm.validateFields((error, value) => {
					if (!error) {
						// console.log(value);
						source = value
						// replyState = value.nature;
						// source = Number(value.fenlei)
						
					}
				});
				// console.log(source);
				
				this.getUserAccesslist();
			},
			handleChange1(value){
				// console.log(value);
				this.source = value;
				this.getUserAccesslist();
			},
			
			datesort:function(x,y){
				return x.time > y.time ? 1 : -1;
			},
			tabledatesort:function(x,y){
				return x.time < y.time ? 1 : -1;
			},
			
			getUserAccesslist(e){  //获取数据
				this.source = 1
				this.xdata=[];
				this.ydata=[];
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
					url:'api/Stat/GetUserVisitStat',
					method:'POST',
					data:{
						BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
						EndTime: formatDate(endDate, 'yyyy-MM-dd'),
						IsImport: 1,
						pageNo: "1",//当前页面
						pageSize: "10",//每页数量
						Source:this.source
					}
				}).then(res=>{
					console.log(res);
					
					res.Rows.sort(this.datesort)
					that.paginations.total  = res.TotalCount;
					that.tableData = res.Rows;
					res.Rows.forEach((item,index)=>{
						that.xdata.push(item.Time)
						that.FreePV.push(item.FreePV)
						that.VIPPV.push(item.VIPPV)
						that.FreeUV.push(item.FreeUV)
						that.VIPUV.push(item.VIPUV)
						that.PV.push(item.FreePV+item.VIPPV)
						that.UV.push(item.FreeUV+item.VIPUV)
					})
					that.tableData.sort(this.tabledatesort)
					that.tableData.forEach((item,index)=>{
						item.num=index+1;
						item.PV=item.FreePV+item.VIPPV;
						item.UV=item.FreeUV+item.VIPUV
					})
					this.getchartinfo()
				})
			},
			
			exportExcel(){
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
					url:'api/Stat/GetUserVisitStat',
					method:'POST',
					data:{
						BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
						EndTime: formatDate(endDate, 'yyyy-MM-dd'),
						IsImport: 1,
						pageNo: "1",//当前页面
						pageSize: "10",//每页数量
						Source:1
					}
				}).then(res=>{
					console.log(res);
					
					res.Rows.sort(this.datesort)
					that.exportdata = res.Rows;
					that.exportdata.sort(this.tabledatesort)
					that.exportdata.forEach((item,index)=>{
						item.num=index+1;
						item.PV=item.FreePV+item.VIPPV;
						item.UV=item.FreeUV+item.VIPUV
					})
					console.log(that.exportdata)
					require.ensure([], () => {
						const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
						const tHeader = ['序号','时间', '总访问量','免费用户访问量','会员用户访问量','总访客数','免费用户独立访客数','会员用户独立访客数'];   // 上面设置Excel的表格第一行的标题
						const filterVal = ['num','Time', 'PV','FreePV', 'VIPPV','UV', 'FreeUV','VIPUV']; // 上面的index、nickName、name是tableData里对象的属性key值
						const list = this.exportdata;  //把要导出的数据tableData存到list
						const data = this.formatJson(filterVal, list);
						export_json_to_excel(tHeader, data, '用户访问数据统计');//最后一个是表名字
					})
				})
			},
			
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => v[j]))
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
			        title: '序号',
			        dataIndex: 'num',
					 
			    },
			    {
			        title: '时间',
			        dataIndex: 'Time',
					 
			    },
			    {
			        title: '总访问量',
			        dataIndex: 'PV',
					 
			    },
			    {
			        title: '免费用户访问量',
			        dataIndex: 'FreePV',
					 
				},
				{
			        title: '会员用户访问量',
			        dataIndex: 'VIPPV',
					 
				},
				{
			        title: '总访客量',
			        dataIndex: 'UV',
					 
			    },
				{
			        title: '免费用户独立访客数',
			        dataIndex: 'FreeUV',
					 
				},
				{
			        title: '会员用户独立访客数',
			        dataIndex: 'VIPUV',
					 
			    },
			];
			this.initPrams();  //初始化时间
			this.getUserAccesslist(0);
		},
		mounted(){
			this.getchartinfo()
		},
		computed:{
		    initValue(){
		        let obj = {};
		        obj.initialValue = [moment(new Date(new Date().getTime() - 24*this.daynum*60*60*1000).toLocaleDateString(), 'YYYY/MM/DD'),moment(new Date().toLocaleDateString(), 'YYYY/MM/DD')];
		        return obj;
		    }
		},
		updated() {
			Bus.$emit("collapse",{Height:document.getElementsByClassName('content')[0].clientHeight});
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		width: 100%;
		height: 100%;
		margin: 0 auto;
		.chart{
			width: 100%;
			margin-top: 10px;
			height: auto;
			.searchinfo{
				height: 40px;
				background-color: rgb(255,255,255);
			}
			.searchinfo span{
					font-family: "Microsoft Tai Le Bold", "Microsoft Tai Le Regular", "Microsoft Tai Le";
					font-weight: 700;
					font-style: normal;
					font-size: 16px;
					text-align: center;
					line-height: 40px;
					margin-left: 20px;
				}
			.searchinfo .ant-calendar-picker{
				float: right;
				line-height: 40px;
				margin-right: 10px;
			}
			.searchinfo .ant-select{
				float: right;
				margin-top: 5px;
			}
			.chartinfo{
				height: 400px;
				background-color: rgb(255,255,255);
			}
		}
		.table{
			// width:calc(70% - 30px);
			height:100%;
			margin-top: 20px;
			border-radius:4px;
			padding:20px;
			background-color: rgb(255,255,255);
			overflow: hidden;
		}
	}
</style>
