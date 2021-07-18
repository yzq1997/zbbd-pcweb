<template>
	<div class="index">
		<!-- 第一层：不同招标类型数据的占总的招标数量的百分比 -->
		<div class="first-info">
			<!-- 地图省份数据占比 -->
			<div class="map" >
				<span>{{year}}年全国招投标总量分布图</span>
				<div class="map-info" ref="typeofinfo"></div>
			</div>
			<div class="statistics">
				<div class="statistics-top">
					<a-col :span="8">
					    <div class="bold-titke">用户总量/访问总量</div>
					    <div class="bold">{{GetIndexStatinof.UserCount}}/{{GetIndexStatinof.VisitCount}}</div>
					</a-col>
					<a-col :span="8">
					    <div class="bold-titke">近30日新用户/访问量</div>
					    <div class="bold">{{GetIndexStatinof.ThirtyUser}}/{{GetIndexStatinof.ThirtyVisit}}</div>
					</a-col>
					<a-col :span="8">
					    <div class="bold-titke">今日新用户/访问量</div>
					    <div class="bold">{{GetIndexStatinof.TodayUser}}/{{GetIndexStatinof.TodayVisit}}</div>
					</a-col> 
				</div>
				
				<div class="statistics-top" style="margin-top: 15px;height: 385px;">
					<div class="left">
						<div class="left-t">
							<span>关键字订阅量top10</span>
						</div>
						<div class="left-info" >
							<ul>
								<li v-for="(item,index) in tkeywords" :key="index">
									<span>{{index+1}}</span>
									<span>{{item.keyword}}</span>
									<span>{{item.count}}次</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="chart">
			<div class="searchinfo">
				<a-row  type="flex" justify="space-between">
				    <a-col :span="4" style="margin-top: 10px;">
						<span>用户访问量</span>
					</a-col>
					<a-col :span="8">
					</a-col>
					<!-- <a-col :span="2" style="margin-top: 2px;">
						<a-select default-value="省私个协会" v-decorator="['source',{initialValue:''}]" style="width: 120px;" @change="handleChange">
						      <a-select-option value="0">
						        省私个协会
						      </a-select-option>
						      <a-select-option value="1">
						        招标宝典
						      </a-select-option>
						      <a-select-option value="2">
						        小程序
						      </a-select-option>
						</a-select>
					</a-col>		 -->

				    <a-col :span="8" style="margin-top: 2px;">
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
			<div class="chartinfo" ref="userchartinfo"></div>
		</div>
	</div>
</template>

<script>
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
	import moment from 'moment';
	import { formatDate } from '../../utils/dateformat.js'
	import Bus from '../../utils/vue-bus.js';
	export default{
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
			}
		},
		methods:{	
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
							return params.name + '：' + params.data['value'] 
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
							// color: ['#FFFD64','#6FCF6A', '#FF8C00', '#FF5000','#FF0000']
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
						// left: 'left',
						// right: 50,
						// left : 50,
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
		
			getchartuserinfo(){
				　let myChart = this.$echarts.init(this.$refs.userchartinfo);
				myChart.setOption({
					tooltip: {              //设置tip提示
							trigger: 'axis'
						 },
					 xAxis: {
							name:"日期",
							type: 'category',
							data:this.xdata,
						},
						yAxis: {
							name:"访问量",
							type: 'value'
						},
						series: [{
							name:"访问量",
							data: this.ydata,
							type: 'line'
						}]
				})
			},
		
			GetBaseDataStat:function(){  //地图
				let that = this;
				let date = new Date();
				this.$dataApi({
					url:'api/Stat/GetBaseDataStat',
					method:'POST',
					data:{
						BeginTime: date.getFullYear()+"-"+'01'+"-"+"01", //开始时间
						EndTime: date.getFullYear()+"-"+'12'+"-"+"31" ,//结束时间
						IsImport: "0",//导出EXCEL，0不导出，1导出
						pageNo: "1",//当前页面
						pageSize: "10"//每页数
					}
				}).then(res=>{
					// console.log(res);
					
					that.province=res;
					that.province.forEach((item,index)=>{
						item.value=item.count;
						item.name=item.AreaName;
					})
					this.gettypeinfo();
				})
			},
			GetIndexStat:function(value){
				this.$dataApi({
					url:'api/Stat/GetIndexStat',
					method:'POST',
					data:{
						Source:1
					}
				}).then(res=>{
					// console.log(res);
					
					this.GetIndexStatinof=res[0];
				})
			},
			gettkeywords:function(){
				let date = new Date();
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetTopkeywordStat',
				    method:'POST',
					data: {
						BeginTime: date.getFullYear()+"-"+'01'+"-"+"01", //开始时间
						EndTime: date.getFullYear()+"-"+'12'+"-"+"31" ,//结束时间
					    // pageNo: "1",//当前页面
					    // pageSize: "10"//每页数量
				   },
				}).then(res=>{
					// console.log(res);
					
					that.tkeywords=res
				})
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
			},
			onChange(date, dateString) {
				this.params.beginDate=dateString[0];
				this.params.endDate=dateString[1];
				this.xdata=[],
				this.ydata= [],
				this.getUserAccesslist();
			},		
			
			datesort:function(x,y){
				return x.time > y.count ? 1 : -1;
			},
			
			getUserAccesslist(value){
				// console.log(value);

				this.filterForm.validateFields((error, value) => {
					if (!error) {
						// console.log(value);
						// source = Number(value.fenlei)
					}
				});
				
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetUserVisitStat',
				    method:'POST',
				    data:{
						BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
						EndTime: formatDate(endDate, 'yyyy-MM-dd'),
					    pageNo: "1",//当前页面
						pageSize: "10",//每页数量
						Source:1
					}
				}).then(res=>{
					// console.log(res);
					that.xdata = []
					that.ydata = []
					res.Rows.sort(this.datesort)

					res.Rows.forEach((item,index)=>{
						that.xdata.push(item.time)
						that.ydata.push(item.count)
					})
					this.getchartuserinfo()
				})
			},
			handleChange(value){
				// console.log(value);
				this.GetIndexStat(value); //访问量接口
				this.getUserAccesslist(value)  //折线图数据接口
			}
		},
		created(){
			let date=new Date();
			this.year=date.getFullYear();
			this.initPrams(); ///no
			this.GetBaseDataStat(); // 绘制地图
			this.GetIndexStat();  //访问量接口
			this.gettkeywords();  //关键字订阅了top10 
			this.getUserAccesslist()  //折线图数据接口  
		},
		mounted(){
			this.gettypeinfo()  //绘制图标
			this.getchartuserinfo()  //no
		},
		computed:{
		    initValue(){
		        let obj = {};
		        obj.initialValue = [moment(new Date(new Date().getTime() - 24*7*60*60*1000).toLocaleDateString(), 'YYYY/MM/DD'),moment(new Date().toLocaleDateString(), 'YYYY/MM/DD')];
		        return obj;
		    }
		},
		updated() {
			Bus.$emit("collapse",{Height:document.getElementsByClassName('content')[0].clientHeight + 70});
		}

	}
</script>


<style lang="scss" scoped>
	ul{
		margin: 0;
		padding: 0;
		margin-left: 20px;
	}
	ul li{
		list-style-type:none;
		line-height: 33px;
		height: 33px;
		font-family: 'Microsoft YaHei Regular', 'Microsoft YaHei';
		font-weight: 400;
		font-style: normal;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.647058823529412);
	}
	span{
		display: block;
	}
	.index{
		width: 100%;
		height: 100%;
		.first-info{
			height: 500px;
			margin: 0 auto;
            display: flex;
			.map{
				width: 60%;
				height: 500px;
				float: left;
				background-color: rgb(255,255,255);
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
				height: 450px;
				float: left;
			}
			.statistics{
				width: 38%;
				height: auto;
				overflow: hidden;
				margin-left: 20px;
				float: left;
				.statistics-top{
					width: 100%;
					height: 100px;
					background-color: rgb(255,255,255);
				}
				.bold-titke{
					color:rgba(0, 0, 0, 0.427450980392157);
					text-align: center;
					margin-top: 15px;
				}
				.bold{
					font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
					font-weight: 700;
					font-style: normal;
					font-size: 16px;
					color: rgba(0, 0, 0, 0.847058823529412);
					text-align: center;
					line-height: 24px;
					margin-top: 15px;
				}	
			}
			.left .left-t{
				font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le Regular', 'Microsoft Tai Le';
				font-weight: 700;
				font-style: normal;
				font-size: 16px;
				color: rgba(0, 0, 0, 0.847058823529412);
				text-align: left;
				line-height: 18px;
				line-height: 53px;
				padding-left: 10px;
				text-align: left;
				border-bottom: 1px solid rgba(235, 235, 235, 1);;
			}
			.left-t span{
				padding-left: 10px;
			}
			.left-info ul li span:nth-child(1){
				width: 20px;
				height: 23px;
				line-height: 23px;
				text-align: center;
				float: left;
				vertical-align:middle;
				margin: 5px 0;
				margin-right: 50px;
				
			}
			.left-info ul li span:nth-child(2){
				width: 137px;
				height: 33px;
				line-height: 33px;
				text-align: center;
				float: left;
				margin-right: 40px;
			}
			.left-info ul li span:nth-child(3){
				// width: 130px;
				height: 33px;
				line-height: 33px;
				text-align: center;
				float: left;
			}
			
			.left-info ul li:nth-child(-n+3) span:nth-child(1){
				border-radius: 12px;
				background-color: #5D478B;
				color: white;
			}
		}
		.chart{
			margin-top: 20px;
			background-color: rgb(255,255,255);
			height: auto;
			width: 100%;
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
		
	}
</style>
