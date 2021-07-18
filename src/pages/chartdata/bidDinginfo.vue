<template>
	<div class="index">
		<div class="chart">
			<div class="searchinfo">
				<a-row style="overflow:hidden;margin-bottom:20px;height:40px;" type="flex" justify="space-between">
				    <a-col :span="4" class="bold visiT">
						<span>全国招标信息数据统计</span>
					</a-col>
					<a-col :span="6">
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
				    <a-col :span="7">
				        <a-form :form="filterForm">
				            <a-form-item label="" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 22 }">
				                <a-locale-provider :locale="zhCN">
				                    <a-range-picker style="width:100%;" @change="onChange" :allowClear="false" :placeholder="['开始时间', '结束时间']" v-decorator="['dateRange',initValue]" />
				                </a-locale-provider>
				            </a-form-item>
				        </a-form>
				    </a-col>
					<a-col :span="6">
						
					</a-col>
				</a-row>
			</div>
			<div class="map" >
				<div class="map-info" ref="typeofinfo"></div>
			</div>
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
				barData:[],
				province:[],
				maxnum:0,
				year:2020,
				GetIndexStatinof:[],
				tkeywords:[],
				params:{},
				filterForm:this.$form.createForm(this,{name:'filter'}),
				xdata:[],
				ydata: [],
				tableData:[],
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
				loading:false,
				bordered:true,
				exportdata:[],
				daynum:7,
			}
		},
		methods:{
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
			},
			// 表格事件
			handleTableChange(pagination,filter,sort){
			    let that = this;
			    const pager = Object.assign(this.paginations);
			    pager.current = pagination.current;
			    this.paginations = pager;
			    this.params['pageNo'] = this.paginations['current'];
			    this.checkedKeys = [];
				 this.GetBaseDataStat('false');
			},
			
			exportExcel(){
				this.initPrams();
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetBaseDataStatByTime',
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
					that.exportdata = res;
					if(that.exportdata.length > 0){
						require.ensure([], () => {
						    const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
						    const tHeader = ['序号','日期', '总条数','招标公告','变更公告','结果公告'];   // 上面设置Excel的表格第一行的标题
						    const filterVal = ['id','Tasktime', 'AreaCount','ZBCount','BGCount','JGCount']; // 上面的index、nickName、name是tableData里对象的属性key值
						    const list = this.exportdata;  //把要导出的数据tableData存到list
						    const data = this.formatJson(filterVal, list);
						    export_json_to_excel(tHeader, data, '全国招标信息数据统计');//最后一个是表名字
						  }) 
					}
				})
			},
			
			formatJson(filterVal, jsonData) {
			  return jsonData.map(v => filterVal.map(j => v[j]))
			},
			
			onChange(date, dateString) {
				this.params.beginDate=dateString[0];
				this.params.endDate=dateString[1];
				this.GetBaseDataStat(0);
				this.GetBaseDataStatByTime();
			 },
				
			
			handleChange(value){
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
                this.GetBaseDataStat();
                this.GetBaseDataStatByTime();
            },
            
			gettypeinfo () {
					if(this.province.length > 0){
						var list = new Array();
						for(var i in this.province){
								list.push(this.province[i].value);
							}
							list.sort(function(num1,num2){
								return num1-num2;
						})
						this.maxnum= eval(list[list.length-1]) + 200;
					} else{
						this.maxnum =0
					}
			
				　　let myChart = this.$echarts.init(this.$refs.typeofinfo);
				　　// 绘制图表
				　　myChart.setOption({
					　  tooltip: {
							show: true,
							formatter: function(params) {
								if(params.data !=  undefined){
									return params.name + '：' + params.data['value'] 
								}
							},
						},
					    visualMap: {
							type: 'continuous',
							orient: 'horizontal',
							itemWidth: 10,
							itemHeight: 80,
							text: ['高', '低'],
							showLabel: true,
							seriesIndex: [0],
							min: 0,
							max: this.maxnum,
							inRange: {
								color: ['#228B22', '#FFD700', '#FF0000']
							},
							textStyle: {
								color: '#7B93A7'
							},
							bottom: 30,
							left: 'cneter',
						},
						grid: {
							left:100,
							right: 50,
							top: 135,
							bottom: 100,
							width: '30%'
						},
						xAxis: {
							show: false
						},
						yAxis: {
							type: 'category',
							inverse: true,
							nameGap: 16,
							axisLine: {
								show: false,
								lineStyle: {
									color: '#ddd'
								}
							},
							axisTick: {
								show: false,
								lineStyle: {
									color: '#ddd'
								}
							},
						},
						geo: {
							// roam: true,
							map: 'china',
							left: 'center',
							// right: 50,
							// left : 200,
							zoom:1.25,
							// layoutSize: '70%',
							label: {
								emphasis: {
									show: false
								}
							},
							itemStyle: {
								emphasis: {
									areaColor: '#fff464'
								}
							}
						},
						series: [{
							name: 'mapSer',
							type: 'map',
							roam: false,
							geoIndex: 0,
							label: {
								show: false,
							},
							data: this.province
						}, {
							name: 'barSer',
							type: 'bar',
							roam: false,
							visualMap: false,
							zlevel: 2,
							barMaxWidth: 8,
							barGap: 0,
							itemStyle: {
								normal: {
									color: function(params) {
										// build a color map as your need.
										var colorList = [{
												colorStops: [{
													offset: 0,
													color: '#FFD119' // 0% 处的颜色
												}, {
													offset: 1,
													color: '#FFAC4C' // 100% 处的颜色
												}]
											},
											{
												colorStops: [{
													offset: 0,
													color: '#00C0FA' // 0% 处的颜色
												}, {
													offset: 1,
													color: '#2F95FA' // 100% 处的颜色
												}]
											}
										];
										if (params.dataIndex < 3) {
											return colorList[0]
										} else {
											return colorList[1]
										}
									},
									barBorderRadius: 15
								}
							},
							data: this.barData
						}]
				　　});
			},
			
			
			GetBaseDataStat:function(){
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
					url:'api/Stat/GetBaseDataStat',
					method:'POST',
					data:{
						BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
						EndTime: formatDate(endDate, 'yyyy-MM-dd'),
						pageNo: "1",//当前页面
						pageSize: "10"//每页数
					}
				}).then(res=>{
                    console.log(res);
					that.province=res;
					that.province.forEach((item,index)=>{
						item.value=item.count;
						item.name=item.AreaName;
					})
					this.gettypeinfo();
				})
			},
			
			GetBaseDataStatByTime:function(){
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetBaseDataStatByTime',
				    method:'POST',
				    data:{
						BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
						EndTime: formatDate(endDate, 'yyyy-MM-dd'),
						IsImport: "1",//导出EXCEL，0不导出，1导出
						pageNo: "1",//当前页面
						pageSize: "10"//每页数
					}
				}).then(res=>{
                    // console.log(res);
					that.paginations.total  = res.length;
					that.tableData = res;
				})
			},
		},

		created() {
			this.columns = [
			    {
			        title: '序号',
			        dataIndex: 'id',
			    },
			    {
			        title: '日期',
			        dataIndex: 'Tasktime',
			    },
			    {
			        title: '总条数',
			        dataIndex: 'AreaCount',
			    },
				{
				    title: '招标公告',
				    dataIndex: 'ZBCount',
				},
				{
				    title: '变更公告',
				    dataIndex: 'BGCount',
				},
				{
				    title: '结果公告',
				    dataIndex: 'JGCount',
				},
			    
			];
			this.initPrams();
			this.GetBaseDataStat();
			this.GetBaseDataStatByTime();
		},
		mounted(){
			this.gettypeinfo()
		},
		
		computed:{
		    initValue(){
		        let obj = {};
		        obj.initialValue = [moment(new Date(new Date().getTime() - 24*this.daynum*60*60*1000).toLocaleDateString(), 'YYYY/MM/DD'),moment(new Date().toLocaleDateString(), 'YYYY/MM/DD')];
		        return obj;
		    }
		},
		updated() {
			Bus.$emit("collapse",{Height:document.getElementsByClassName('content')[0].clientHeight+70});
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
			overflow: hidden;
			background-color: white;
			.searchinfo{
				height: 40px;
				// background-color: rgb(255,255,255);
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
				// background-color: rgb(255,255,255);
			}
			.map{
				width: 75%;
				height: 700px;
				float: left;
				// background-color: rgb(255,255,255);
			}
			.map span{
				font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le Regular', 'Microsoft Tai Le';
				font-weight: 700;
				font-style: normal;
				font-size: 16px;
				text-align: center;
				line-height: 22px;
				display: block;
				margin-top: 15px;
			}
			.map-info{
				width: 100%;
				height: 700px;
				float: left;
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
