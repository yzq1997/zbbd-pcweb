<template>
	<div class="index">
		<div class="keyword">
			<div class="selectdate">
				<a-row style="overflow:hidden;margin-top:20px;margin-left: 10px;height:40px;line-height: 40px;" type="flex" justify="space-between">
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
				        <a-form :form="filterForm" style="margin-top: 5px;">
				            <a-form-item label="" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 22 }">
				                <a-locale-provider :locale="zhCN">
				                    <a-range-picker style="width:100%;" @change="onChange" :allowClear="false" :placeholder="['开始时间', '结束时间']" v-decorator="['dateRange',initValue]" />
				                </a-locale-provider>
				            </a-form-item>
				        </a-form>
				    </a-col>
					<a-col :span="12">
						<div class="znum">
							<span style="float: left;">累计关键字总数 : </span>
							<span style="float: left; color: red;"> {{this.keywordsnum}}</span>
							<span style="float: left;">个</span>
						</div>
					</a-col>
				</a-row>
			</div>
			<div class="keyword-rank">
				<div class="left">
					<div class="left-t">
						<span>主动搜索关键字top10  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;   
					    	<a-button type="primary" @click="showModal">
							   查看更多
							</a-button>
						</span>
					    <a-modal v-model="visible" title="主动搜索关键字统计" :footer="null" width="70%">
                            <a-form :form="form" style="overflow:hidden;">
                                <a-col :span="15" style="display:flex;">
                                    <a-form-item label="关键词:" :colon="false" :label-col="{ span: 6}" :wrapper-col="{ span: 6 }">
                                        <a-input placeholder="请输入" v-model="zdsskeyword" style="width: 150px"/>
                                    </a-form-item>
                                    <a-form-item label="时间:" style="margin-top:4px" :colon="false"  :label-col="{ span: 6 }" :wrapper-col="{ span: 6 }">
                                        <a-locale-provider :locale="zhCN" >
                                            <a-range-picker style="width: 250px" @change="zdssKeywordChange" :allowClear="false"  :placeholder="['开始时间', '结束时间']" v-decorator="['setDate',initValue2]" />
                                        </a-locale-provider>
                                    </a-form-item>  
                                </a-col>
                                <a-col :span="2">
                                    <a-button type="primary" @click="handleOk" style="margin-top:4px;margin-left:7px">查询</a-button>
                                </a-col>
                                <a-col :span="7" >
                                    <a-button type="primary"  @click="exportsskeywordstoexcel" style="margin-top:4px;">导出EXCEL</a-button>
                                </a-col>
                                <a-col :span="24">
                                    <div class="znum" style="margin-bottom:50px">
                                        <span style="float: left;"> &nbsp;&nbsp;&nbsp;累计搜索关键字总数: </span>
                                        <span style="float: left; color: red;"> {{this.ljTotalCount}}</span>
                                        <span style="float: left;">个</span>
                                    </div>
                                </a-col>
                            </a-form>	
						<tables  :columns="zdsscolumns" :tableData="zdsstableData" size="middle"  :loading="loading" :handleTableChange="zdsshandleTableChange" :bordered="bordered" :pagination="zdsspaginations" >
						</tables>
						</a-modal>
						 <!-- <div>查看更多</div> -->
					</div>
					<div class="left-info" >
						<ul>
							<li v-for="(item,index) in tkeywords" :key="index">
								<span>{{index+1}}</span>
								<span>{{ item.keyword }}</span>
								<span>{{ item.count }}次</span>
							</li>
						</ul>
					</div>
				</div>

				<div class="left" style="margin-left: 50px;">
					<div class="left-t">
						<span>关键字订阅量top10  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;   
							<a-button type="primary" @click="showModal2">
							   查看更多
							</a-button>
						</span>
						 <a-modal v-model="visible2" title="关键字订阅量统计"  :footer="null" width="70%" @ok="handleOk2">
							  <a-form :form="form2" style="overflow:hidden;">
                                <a-col :span="15" style="display:flex;">
									<a-form-item label="关键词:" :colon="false" :label-col="{ span: 6}" :wrapper-col="{ span: 6 }">
										<a-input placeholder="请输入" v-model="dylkeyword" style="width: 150px"/>
									</a-form-item>
									<a-form-item label="时间:" style="margin-top:4px" :colon="false"  :label-col="{ span: 6 }" :wrapper-col="{ span: 6 }">
											<a-locale-provider :locale="zhCN" >
												<a-range-picker style="width: 250px" @change="dylKeywordChange" :allowClear="false"  :placeholder="['开始时间', '结束时间']" v-decorator="['setDate2',initValue3]" />
											</a-locale-provider>
									</a-form-item>  
								</a-col>
								 <a-col :span="2">
								<a-button type="primary"  @click="handleOk2" style="margin-top:4px;margin-left:7px">查询</a-button>
								</a-col>
								<a-col :span="2" >
									<a-button type="primary"   @click="exportdykeywordstoexcel" style="margin-top:4px;">导出EXCEL</a-button>
								</a-col>
								 <a-col :span="24">
									<div class="znum" style="margin-bottom:50px">
										<span style="float: left;"> &nbsp;&nbsp;&nbsp;累计订阅关键字总数: </span>
										<span style="float: left; color: red;"> {{this.dyTotalCount}}</span>
										<span style="float: left;">个</span>
								  </div>
						
								</a-col>
							  </a-form>
							 <tables  :columns="dylcolumns" :tableData="dyltableData" size="middle"  :loading="loading" :handleTableChange="dylhandleTableChange" :bordered="bordered" :pagination="dylpaginations" >
			                 </tables>
						</a-modal>
					</div>
					<div class="left-info">
						<ul>
							<li v-for="(item,index) in tdkeywords" :key="index">
								<span>{{index+1}}</span>
								<span>{{item.keyword}}</span>
								<span>{{item.count}}次</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="chart" >
			<span>趋势图</span>
			<div class="chartinfo" ref="chartinfokey"></div>
		</div>
		<div class="table" >
			<a-col :span="24" style="margin-bottom:20px;height: auto;">
			    <a-row>
				<a-col :span="4">
				    <a-button type="primary" @click="exportExcel">导出Execl</a-button>
				</a-col>
				<a-col :span="18">
			<!-- 		<div v-if="this.keywordsnum > 0" style="float: left;">累计关键字
					</div><div style="color:#E7564F;float: left;">{{this.keywordsnum}}</div> -->
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
import { debuglog } from 'util';
	export default{
		components:{
		    tables
		},
		data(){
			return {
				ljTotalCount:0,
				dyTotalCount:0,
				visible: false,
			    visible2: false,
				zhCN,
				zdsskeyword:'',
				dylkeyword:'',
				date:[],
				adddata:[],
				deldata:[],
				netdata:[],
				type: ['新增量', '取消量', '净值'],
				// date:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				// adddata:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
				// deldata:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
				// netdata:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
				tableData:[],
				zdsstableData:[],
				dyltableData:[],
				columns:[],
				zdsscolumns:[],
				dylcolumns:[],
				loading:false,
				bordered:true,
			    starttime:'',
				endtime:'',
				begintime:'',
				finishtime:'',
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
				zdsspaginations:{
                   current:1,
					pageSize:10,
					total:0,
					size:'default',
					showQuickJumper:true,
					showTotal:function(total,range){
						return  `共 ${total} 条记录`;
					}
				},
				dylpaginations:{
                    current:1,
					pageSize:10,
					total:0,
					size:'default',
					showQuickJumper:true,
					showTotal:function(total,range){
						return  `共 ${total} 条记录`;
					}
				},
				filterForm:this.$form.createForm(this,{name:'filter'}),
				form:this.$form.createForm(this),
				form2:this.$form.createForm(this),
				params:{},
				keywordsnum:0,
				tkeywords:[{
					            count: 4,
					            num: '2', 
								keyword:"aaa"
					        }],
				tdkeywords:[],
				daynum:7,
				exportdata:[],
			}
		},
		methods:{
			 showModal() {
				 this.starttime = this.params.beginDate;
				 this.endtime = this.params.endDate;
				 this.zdsskeyword = '';
				 this.getzdssKeyWordslist();
				 
				this.visible = true;
				},
			handleOk() {
				let q = this.starttime;
			   let s = this.endtime;
			    // debugger;
				this.getzdssKeyWordslist();
				// this.visible = false;
			},
			 showModal2() {
				 this.begintime = this.params.beginDate;
				 this.finishtime = this.params.endDate;
				 this.dylkeyword = '';
				this.getdylKeyWordslist();
				this.visible2 = true;

				},
			handleOk2(e) {
				this.getdylKeyWordslist();
				// this.visible2 = false;
			},
			// 表格事件
			handleTableChange(pagination,filter,sort){
			    let that = this;
			    const pager = Object.assign(this.paginations);
			    pager.current = pagination.current;
			    this.paginations = pager;
			    this.params['pageNo'] = this.paginations['current'];
			    this.checkedKeys = [];
			    this.getKeyWordslist('false');
			},
			dylhandleTableChange(pagination,filter,sort){
				let that = this;
				const pager = Object.assign(this.dylpaginations);
				pager.current = pagination.current;
				this.dylpaginations = pager;
				this.params['pageNo'] = this.dylpaginations['current'];
				// 排序
				// this.params['sortField'] = sorter['columnKey'] || "";
				// this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
			    this.getdylKeyWordslist(this.dylpaginations['current']);
			},
			zdsshandleTableChange(pagination,filter,sort){
				let that = this;
				const pager = Object.assign(this.zdsspaginations);
				pager.current = pagination.current;
				this.zdsspaginations = pager;
				this.params['pageNo'] = this.zdsspaginations['current'];
				// 排序
				// this.params['sortField'] = sorter['columnKey'] || "";
				// this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
                this.getzdssKeyWordslist(this.zdsspaginations['current']);
			},
			exportExcel(){
				this.initPrams();
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetkeywordStat',
				    method:'POST',
				    data:{
					  BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
					  EndTime: formatDate(endDate, 'yyyy-MM-dd'),
					   IsImport: 1,//导出EXCEL，0不导出，1导出
					   pageNo: "1",//当前页面
					   pageSize: "10",//每页数量
					   Source:1
					}
				}).then(res=>{
					// debugger;
					that.exportdata = res;
					that.exportdata.forEach((item,index)=>{
						item.num=index+1;
					})
					require.ensure([], () => {
					    const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
					    const tHeader = ['序号','日期','新增量', '取消量','净值量'];   // 上面设置Excel的表格第一行的标题
					    const filterVal = ['num','Tasktime', 'TaskAdd','TaskDelete','TaskDiff']; // 上面的index、nickName、name是tableData里对象的属性key值
					    const list = this.exportdata;  //把要导出的数据tableData存到list
					    const data = this.formatJson(filterVal, list);
					    export_json_to_excel(tHeader, data, '关键字数据统计');//最后一个是表名字
					  })
				})	
			},
			
			formatJson(filterVal, jsonData) {
			  return jsonData.map(v => filterVal.map(j => v[j]))
			},
			exportsskeywordstoexcel(){
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetAllKeywordSearchStat',
				    method:'POST',
				    data:{
					  BeginTime: '',
					  EndTime: '',
					  IsImport : 1,
					  Source:1
					}
				}).then(res=>{
					// debugger;
					that.exportdata = res.Rows;
					that.exportdata.forEach((item,index)=>{
						item.num=index+1;
					})
					require.ensure([], () => {
					    const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
					    const tHeader = ['序号','关键词','搜索次数'];   // 上面设置Excel的表格第一行的标题
					    const filterVal = ['num','keyword', 'count']; // 上面的index、nickName、name是tableData里对象的属性key值
					    const list = this.exportdata;  //把要导出的数据tableData存到list
					    const data = this.formatJson(filterVal, list);
					    export_json_to_excel(tHeader, data, '主动搜索关键字数据统计');//最后一个是表名字
					  })
				})	
			},
			exportdykeywordstoexcel(){
				this.$dataApi({
				    url:'api/Stat/GetAllkeywordStat',
				    method:'POST',
				    data:{
					  IsImport : 1,
					  Source:1
					}
				}).then(res=>{
					this.exportdata = res.Rows;
					this.exportdata.forEach((item,index)=>{
						item.num=index+1;
					})
					require.ensure([], () => {
					    const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
					    const tHeader = ['序号','关键词','订阅量'];   // 上面设置Excel的表格第一行的标题
					    const filterVal = ['num','keyword', 'count']; // 上面的index、nickName、name是tableData里对象的属性key值
					    const list = this.exportdata;  //把要导出的数据tableData存到list
					    const data = this.formatJson(filterVal, list);
					    export_json_to_excel(tHeader, data, '订阅量关键字数据统计');//最后一个是表名字
					  })
				})	
			},
			onChange(date, dateString) {
					this.params.beginDate=dateString[0];
					this.params.endDate=dateString[1];
					this.getKeyWordslist(0);
					this.getallKeywords();
					this.gettkeywords();
					this.gettdkeywords();
				},
			zdssKeywordChange(date, dateString){
                this.starttime = dateString[0];
		    	this.endtime = dateString[1];
			},
			dylKeywordChange(date, dateString){
                this.begintime = dateString[0];
		    	this.finishtime = dateString[1];
			},
			
			handleChange(value){
				// debugger;
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
				 this.getKeyWordslist(0);
				 this.getallKeywords(); //2222
				 this.gettkeywords(); //2222
				 this.gettdkeywords();
			},
			handleChange1(value){
				console.log(value);
				this.getKeyWordslist(value);
			},
			
			//初始化时间
			initPrams(){
				// debugger;
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
			
			datesort:function(x,y){
				return x.Tasktime > y.Tasktime ? 1 : -1;
			},
			
			tabledatesort:function(x,y){
			   return x.Tasktime < y.Tasktime ? 1 : -1;
			},
			
			getKeyWordslist(value){
				this.date=[];
				this.adddata=[];
				this.deldata=[];
				this.netdata=[];
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetkeywordStat',
				    method:'POST',
				    data:{
					  BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
					  EndTime: formatDate(endDate, 'yyyy-MM-dd'),
					   IsImport: 1,//导出EXCEL，0不导出，1导出
					   pageNo: "1",//当前页面
					   pageSize: "10",//每页数量
					   Source:1
					}
				}).then(res=>{
					res.sort(this.datesort)
					that.paginations.total  = res.length;
					that.tableData = res;
					res.forEach((item,index)=>{
						that.date.push(item.Tasktime)
						that.adddata.push(item.TaskAdd)
						that.deldata.push(item.TaskDelete)
						that.netdata.push(item.TaskDiff)
					})
					that.tableData.sort(this.tabledatesort)
					that.tableData.forEach((item,index)=>{
						item.num=index+1;
					})
					that.tableData.sort(this.tabledatesort)
					this.getchartinfo()
				})
			},
			getchartinfo(){
				let myChart = this.$echarts.init(this.$refs.chartinfokey);
				myChart.setOption({
					tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'cross',
					            crossStyle: {
					                color: '#999'
					            }
					        }
					    },
					    legend: {
					        data: ['新增量', '取消量', '净值']
					    },
					    xAxis: [
					        {
								name:'日期',
					            type: 'category',
					            data: this.date,
					        }
					    ],
					    yAxis: [
					        {
					            type: 'value',
					            name: '数量', 
					        },
					        {
					            type: 'value',
					            name: '数量',
					        }
					    ],
					    series: [
					        {
					            name: '新增量',
					            type: 'bar',
					            data: this.adddata
					        },
					        {
					            name: '取消量',
					            type: 'bar',
					            data: this.deldata
					        },
					        {
					            name: '净值',
					            type: 'line',
					            yAxisIndex: 1,
					            data: this.netdata
					        }
					    ]
				})
			},
			getzdssKeyWordslist(e){
			   let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
               this.$dataApi({
				    url:'api/Stat/GetAllKeywordSearchStat',
				    method:'POST',
				    data:{
					  keyword:this.zdsskeyword,
					  BeginTime:this.starttime,
					  EndTime: this.endtime,
					  pageNo:  e == undefined ?1:e,//当前页面
					  pageSize: "10"//每页数量
					}
				}).then(res=>{
					// debugger;
					// res.sort(this.datesort)
					that.ljTotalCount = res.TotalCount;
					that.zdsspaginations.total  = res.TotalCount;
					that.zdsstableData = res.Rows;
		            that.zdsstableData.forEach((item,index)=>{
						item.num=index+1;
					})
				})
			},
			getdylKeyWordslist(e){
			    let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
               this.$dataApi({
				    url:'api/Stat/GetAllkeywordStat',
				    method:'POST',
				    data:{
					  keyword:this.dylkeyword,
					  BeginTime:this.begintime,
					  EndTime: this.finishtime,
					  pageNo:  e == undefined ?1:e,//当前页面
					  pageSize: "10"//每页数量
					}
				}).then(res=>{
					// debugger;
					// res.sort(this.datesort)
				    that.dyTotalCount = res.TotalCount;
					that.dylpaginations.total  = res.TotalCount;
					that.dyltableData = res.Rows;
		            that.dyltableData.forEach((item,index)=>{
						item.num=index+1;
					})
				})
			},
			getallKeywords:function(){
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetkeywordTotal',
				    method:'POST',
				}).then(res=>{
					this.keywordsnum=res
				})
			},
			
			gettkeywords:function(){
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetTopKeywordSearchStat',
				    method:'POST',
					data: {
					   BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
					   EndTime: formatDate(endDate, 'yyyy-MM-dd'),
					   // pageNo: "1",//当前页面
					   // pageSize: "10"//每页数量
				   },
				}).then(res=>{
					that.tkeywords=res
				})
			},
			
			gettdkeywords:function(){
				let beginDate=new Date(Date.parse(this.params.beginDate.replace(/-/g,   "/")))
				let endDate=new Date(Date.parse(this.params.endDate.replace(/-/g,   "/")))	
				let that = this;
				this.$dataApi({
				    url:'api/Stat/GetTopkeywordStat',
				    method:'POST',
					data: {
					   BeginTime:formatDate(beginDate, 'yyyy-MM-dd'),
					   EndTime: formatDate(endDate, 'yyyy-MM-dd'),
					   // pageNo: "1",//当前页面
					   // pageSize: "10"//每页数量
					},
				}).then(res=>{
					that.tdkeywords=res
				})
			},
		},
		created() {
			this.columns = [
			    {
			        title: '序号',
			        dataIndex: 'num',
			    },
			    {
			        title: '日期',
			        dataIndex: 'Tasktime',
			    },
			    {
			        title: '新增关键字量',
			        dataIndex: 'TaskAdd',
			    },
				{
				    title: '取消关键字量',
				    dataIndex: 'TaskDelete',
				},
				{
				    title: '净增关键字量',
				    dataIndex: 'TaskDiff',
				},
			    
			];
			this.dylcolumns = [
				 {
			        title: '序号',
			        dataIndex: 'num',
			    },
			    {
			        title: '关键词',
			        dataIndex: 'keyword',
			    },
			    {
			        title: '订阅量',
			        dataIndex: 'count',
			    }
			],
			this.zdsscolumns = [
				 {
			        title: '序号',
			        dataIndex: 'num',
			    },
			    {
			        title: '关键词',
			        dataIndex: 'keyword',
			    },
			    {
			        title: '搜索次数',
			        dataIndex: 'count',
			    }
			]
			this.initPrams();
			this.getKeyWordslist(0);
			this.getallKeywords();
			this.gettkeywords();
			this.gettdkeywords();
		},
		mounted(){
			this.getchartinfo()
		
		},
		computed:{
		    initValue(){
				// debugger;
		        let obj = {};
				obj.initialValue = [moment(new Date(new Date().getTime() - 24*this.daynum*60*60*1000).toLocaleDateString(), 'YYYY/MM/DD'),moment(new Date().toLocaleDateString(), 'YYYY/MM/DD')];
				
		        return obj;
			},
			initValue2(){
                    // debugger;
					let obj = {};
					obj.initialValue = [moment(new Date(this.starttime).toLocaleDateString(), 'YYYY/MM/DD'),moment(new Date(this.endtime).toLocaleDateString(), 'YYYY/MM/DD')];
					
					return obj;
				},
			initValue3(){
                    // debugger;
					let obj = {};
					obj.initialValue = [moment(new Date(this.begintime).toLocaleDateString(), 'YYYY/MM/DD'),moment(new Date(this.finishtime).toLocaleDateString(), 'YYYY/MM/DD')];
					
					return obj;
				},
		},
		updated() {
			Bus.$emit("collapse",{Height:document.getElementsByClassName('content')[0].clientHeight});
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
		line-height: 38px;
		height: 38px;
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
		margin: 0 auto;
		.keyword{
			height: auto;
			width: auto;
			overflow: hidden;
			background-color: rgb(255,255,255);
			.selectdate{
				height: 40px;
				background-color: rgb(255,255,255);
			}
			.keyword-rank{
				height: auto;
				overflow: hidden;
				margin: 0 auto;
			}
			.keyword-rank .left{
				float: left;
				width: 45%;
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
				height: 38px;
				line-height: 38px;
				text-align: center;
				float: left;
				margin-right: 40px;
			}
			.left-info ul li span:nth-child(3){
				width: 137px;
				height: 38px;
				line-height: 38px;
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
			overflow: hidden;
			height: auto;
			width: auto;
			background-color: rgb(255,255,255);
			.chartinfo{
				height: 500px;
			}
		}
		.chart span{
			font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le Regular', 'Microsoft Tai Le';
			font-weight: 700;
			font-style: normal;
			font-size: 16px;
			text-align: left;
			line-height: 50px;
			padding-left: 20px;
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
		.znum{
			font-family: 'Microsoft Tai Le Bold', 'Microsoft Tai Le Regular', 'Microsoft Tai Le';
			font-weight: 700;
			font-style: normal;
			font-size: 16px
		}
		}
</style>
