<template>
    <div class="wrap">
		<a-form class="ant-advanced-search-form" :form="filterForm" style="overflow:hidden;" >
			<a-row :gutter="24">
				<a-col :span="4">
					<a-form-item label="数据源:" class="ad">
						<a-input placeholder="请输入"  v-model="dataSource" v-decorator="['DataSource']"/>
					</a-form-item>
				</a-col>
                <a-col :span="4">
                    <a-form-item label="数据源类型:">
                        <a-select default-value="all" @change="dataSouTypeFun">
                            <a-select-option value="all">
                                全部
                            </a-select-option>
                            <a-select-option value="isTrue">
                                正式
                            </a-select-option>
                            <a-select-option value="isFalse">
                                测试
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
				<!-- <a-col :span="8">
					<a-form-item label="时间:">
						<a-range-picker @change="onChange" />
					</a-form-item>
				</a-col>
                <a-col :span="6">
					<a-form-item label="采集条数:">
						<a-input placeholder="" class="input" v-model="SmallDataCount" /> —  <a-input placeholder="" v-model="BigDataCount" class="input"/>
                        
					</a-form-item>
				</a-col> -->
				<a-col :span="12" style="margin-top:4px">
					<a-button type="primary" @click="filterSearch" html-type="submit">
						查询
					</a-button>
                    <a-button type="primary" @click="modify('1')" :style="{ marginLeft: '8px' }" html-type="submit">
						新增
					</a-button>
                    <a-button type="primary" @click="ImportData" :style="{ marginLeft: '8px' }" html-type="submit">
						立即执行导入数据任务
					</a-button>
					<a-button type="primary" :style="{ marginLeft: '8px' }" @click="exportExcel">
						导出Execl
					</a-button>
 				</a-col>
			</a-row>	
		</a-form>

        <!-- 表格 -->
        <tables class="table" size="small"  :rowSelection="rowSelection" :columns="columns" :tableData="tableData" :option="option" :checkd="checkd" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" ></tables>

        <!-- 编辑框 -->
        <a-modal width="500px" title="编辑" :maskClosable="false" v-model="editVisible"  footer="" cancelText="关闭">
            <a-input placeholder="请输入标准间隔" v-model="standardTime" />            

            <div class="btnbox">
                <a-button @click="cancelBtn">取消</a-button>
                <a-button @click="confirmBtn" type="primary" >确定</a-button>
            </div>
		</a-modal>

        <!-- 新增-修改框 -->
        <a-modal width="500px" :title="modifyTitle" :maskClosable="false" v-model="modifyBox"  footer="" cancelText="关闭">
            <a-input placeholder="请输入数据源名称" v-model="modifySou" />            
            <a-input placeholder="请输入数据源地址" v-model="modifyAdd" class="dataSouInp"/>            
            <div class="inputBoxTop">
                <!-- <p class="isShow">是否展示:</p> -->
                <a-radio-group v-model="value" @change="onChangeTop">
                    <a-radio :value="0">
                        测试
                    </a-radio>
                    <a-radio :value="1">
                        正式
                    </a-radio>
                </a-radio-group>
            </div>
            <div class="btnbox">
                <a-button @click="cancelModify">取消</a-button>
                <a-button @click="confirmModify" type="primary" >确定</a-button>
            </div>
		</a-modal>

        <!-- 测试框 -->
        <a-modal width="500px" title="测试报告" :maskClosable="false" v-model="testBox"  footer="" cancelText="关闭">
            <p>已检测到<span class="souNum">520条</span>数据</p>
            <div class="btnbox">
                <a-button @click="testBtn" type="primary" >测试</a-button>
            </div>
		</a-modal>

        <!-- 测试框 -->
        <a-modal width="500px" title="测试报告" :maskClosable="false" v-model="testBoxT"  footer="" cancelText="关闭">
            <div>
                <p class="dataError" v-html="dataError"></p>
                <div class="btnbox">
                    <a-button @click="closeTestBoxT" type="primary" >关闭</a-button>
                    <a-button @click="closeData" type="primary" >清空数据</a-button>
                </div>
            </div>
		</a-modal>

        <!-- 预览框 -->
        <a-modal width="500px"  title="测试报告" :maskClosable="false" v-model="previewBox"  footer="" cancelText="关闭">
            <p class="p_dataNum">已检测到<span class="souNum">{{dataTypeNum}}条</span>数据</p>
            <!-- <p>删除<span class="souNum">20条</span>数据</p> -->

            <a-form-item>
                <a-range-picker @change="onChange" />
                <a-button @click="queryData" type="primary">查询</a-button>
            </a-form-item>
            
            <div class="btnTop">
                <span @click="dataFormalFun(1)">正式数据</span>
                <span @click="dataFormalFun(2)">删除数据</span>
            </div>

            <div class="outer-container">
                <div class="inner-containe" v-if="dataFormal">
                    <div v-for="(item,index) in formalData" :key="index" class="listBox" @click="openNewPage(item)">
                        <p class="list_title">{{item.title}}</p>
                        <div class="labelBox">
                            <span>{{item.Province}}</span>
                            <span>{{item.FormatGGType}}</span>
                            <span>{{item.HYType}}</span>
                            <span>{{item.JoinDate.substring(0,10)}}</span>
                        </div>
                    </div>
                </div>
                <div class="inner-containe" v-if="!dataFormal">
                    <div v-for="(item,index) in testData" :key="index" class="listBox">
                        <p class="p_false">标题 ：<span style="color:#000">{{item.title}}</span></p>
                        <p class="p_false">删除原因 ：<span style="color:red">{{item.DelReason}}</span></p>
                    </div>
                </div>
            </div>

            <a-pagination v-if="isPageData" class="pageData" v-model="pageData" @change="pageDataFun" :total="dataTypeNum" show-less-items />
            
            <div class="btnbox">
                <a-button @click="previewBtn" type="primary">确定</a-button>
            </div>
		</a-modal>

        <!-- 导入框 -->
        <a-modal width="500px" title="立即执行导入数据任务" :maskClosable="false" v-model="ImportDataTrue"  footer="" cancelText="关闭">
            <div class="btnbox">
                <a-button @click="ImportDataTrue = false">取消</a-button>
                <a-button @click="ImportDataFun" type="primary" >确定</a-button>
            </div>
		</a-modal>

    </div>
</template>
<script>
import tables from '@/pages/common/table';
import Bus from '../../utils/vue-bus.js';
import { log } from 'util';
import { aliceblue } from 'color-name';
import { setTimeout } from 'timers';
export default {
    components:{
        tables
    },
    data(){
        return {
			dataSource:'',
			editVisible:false,
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
            SmallDataCount:'',
            BigDataCount:'',
            option:[
                {
                    type:"detail",
                    name:"置顶",
                    text:1,
                    dataIndex: 'OrderIndex',
                    fn:(e)=>{
                        this.topAciton(e);
                    }
                },
                {
                    type:"detail",
                    name:"编辑",
                    text:2,
                    fn:(e)=>{
                        this.edit(e);
                    }
                },
                {
                    type:"detail",
                    name:"修改",
                    text:3,
                    fn:(e)=>{
                        this.modify(e);
                    }
                },
                {
                    type:"detail",
                    name:"测试",
                    text:4,
                    dataIndex: 'SourceType',
                    fn:(e)=>{
                        this.testSource(e);
                    }
                },
                {
                    type:"detail",
                    name:"删除",
                    text:5,
                    dataIndex: 'SourceType',
                    fn:(e)=>{
                        this.delSource(e);
                    }
                },
            ],
            checkd:[
                {
                    type:"detail",
                    name:"",
                    text:99,
                    rds:[],
                    rdst:[],
                    idNew: 'Id', 
                    sd:true,
                    fn:(e)=>{
                        this.onChangeCheck(e);
                    },
                    fn1:(e)=>{
                        this.onChangeCheck1(e);
                    },
                },
            ],
            standardTime:'',
            editId:'',
            modifyBox:false,
            modifyTitle:'',
            modifySou:'',
            modifyAdd:'',
            modifyID:'',
            value: 0,
            testBox:false,
            testBoxT:false,
            previewBox:false,
            dataFormal:true,
            dataSouType:'全部',
            delSourceData:{},
            dataError:'',
            TimeBegin:'',
            TimeEnd:'',
            queryNum:1,
            formalData:[],
            testData:[],
            dataTypeNum:0,
            pageData:1,
            isPageData:true,
            ImportDataTrue:false,
            ImportArr:[],
            importIds:[],
            rowSelection:{
                type:'checkbox',
                onChange:this.changeRow,
                selectedRowKeys:[]
            },
            objChecked:[],
            tempImportArr:[],
            finallyArr:[],
        }
    },
    methods:{

        //复选框
        changeRow(selectedRowKeys, selectedRows){
            // console.log(selectedRowKeys);
            // console.log(selectedRows);
            
            this.objChecked[this.paginations.current-1] = selectedRowKeys;
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            // console.log(this.objChecked);
            this.ImportArr = []
            selectedRows.map((item,index)=>{
                if(this.ImportArr.indexOf(item.Id) == -1){
                    this.ImportArr.push(item.Id)
                }
            });
            
            // console.log(this.ImportArr);
            this.finallyArr[this.paginations.current-1] = this.ImportArr;
            // console.log(this.finallyArr);
            // console.log(this.tempImportArr);
        },
 
        //导出
		exportExcel(){
			let that = this;
			// console.log(this.userName);
			this.$dataApi({
				url:'api/BaseData/StatisticsOfDdataSources',
				method:'POST',
				data:{
					IsImport:1,
					DataSource:this.dataSource,
					BeginTime:this.BeginRegisterTime,
					EndTime:this.EndRegisterTime,
				}
			}).then(res=>{
				// console.log(res);
				that.exportdata = res.BiddingDataList;
				// that.exportdata.sort(this.tabledatesort)
				that.exportdata.forEach((item,index)=>{
					item.num=index+1;
				})
				require.ensure([], () => {
					const { export_json_to_excel } = require('../../utils/Export2Excel.js');//注意这个Export2Excel路径
					const tHeader = ['id','数据源', '招标数据采集条数','最近一次采集时间'];   // 上面设置Excel的表格第一行的标题
					const filterVal = ['Id','Source', 'DataCount','JoinDate']; // 上面的index、nickName、name是tableData里对象的属性key值
					const list = this.exportdata;  //把要导出的数据tableData存到list
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, '招标数据源统计');//最后一个是表名字
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
			this.zcData = dateString;
			this.BeginRegisterTime = dateString[0];
            this.EndRegisterTime = dateString[1];
		},

        // table分页
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
            
            let s = that.objChecked.length;
            let h = pagination.current-1;
            // console.log(s );
            // console.log(h);
            // console.log(this.ImportArr);
            this.tempImportArr = this.tempImportArr.concat(this.ImportArr);
            this.tempImportArr = [...new Set(this.tempImportArr)]; 
            console.log(this.tempImportArr);
            if(s < h || s == h){
                this.rowSelection.selectedRowKeys = [];
            }else{
                // console.log(that.objChecked);
                this.rowSelection.selectedRowKeys = that.objChecked[pagination.current-1]
            }
            console.log(this.objChecked);
            
        },

        // 初始化参数
        initParams(e){
            Object.assign(this.params,this.filterForm.getFieldsValue())
            Object.assign(this.params,{PageNum:this.paginations.current,pageSize:this.paginations.pageSize})
            // Object.assign(this.params,{PageNum:this.paginations.current,pageSize:1000})
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
            let that = this;
            this.params.IsImport = 0
            let SourceTypeTemp  = '';
            if(this.dataSouType == '全部' || this.dataSouType == 'all'){
                SourceTypeTemp = '';
            }else if(this.dataSouType == 'isTrue'){
                SourceTypeTemp = 1;
            }else if(this.dataSouType == 'isFalse'){
                SourceTypeTemp = 0;
            };
            this.params.SourceType = SourceTypeTemp
			
			let source = null
			this.filterForm.validateFields((error, value) => {
				if (!error) {
				}
			});
			this.initParams(e);
			
            this.$dataApi({
                url:'api/BaseData/StatisticsOfDdataSources',
                method:'POST',
                data:this.params
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    that.paginations.total  = res.TotalCount;
                    that.tableData =res.BiddingDataList;
					that.tableData.forEach((item,index)=>{
                        item.num=index+1;
                        that.checkd[0].rdst.push(item.Id)
                        // console.log(item,index);
                        // console.log(that.checkd);
                    });
                }
            })
        },
        
		//点击查询按钮
        filterSearch(){
            this.getList();
        },

        //初始化时间
        getTimes(){
            let curDate = new Date();
            var preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
            // console.log(preDate);
            var date = new Date(preDate);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            let time = y + '-' + m + '-' + d;
            this.BeginRegisterTime = time;
            this.EndRegisterTime = time;
        },

        //置顶
        topAciton(e){
            if(e.OrderIndex==1){
                this.goTopF(e)
            }else {
                this.goTop(e)
            }
        },

        //置顶
        goTop(e){
            let that = this;
            // var b = e.JoinDate.split("-");
            // console.log(b);
            // var date1=new Date(2021,6,10);
            // var date2=new Date(b[0],b[1],b[2]);
            // var date=(date2.getTime()-date1.getTime())/(1000*60*60*24);/*不用考虑闰年否*/
            // alert("相差"+date+"天");
            this.$dataApi({
                url:'api/BaseData/SetSourceTop',
                method:'POST',
                data:{
                    id:e.Id
                }
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    this.$message.success('置顶成功');
                    this.getList('false');
                }
            })
        },

        //取消置顶
        goTopF(e){
           
            let that = this;
            console.log(e);
            this.$dataApi({
                url:'api/BaseData/CancelSourceTop',
                method:'POST',
                data:{
                    id:e.Id
                }
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    this.$message.success('取消成功');
                    this.getList('false');
                }
            })
        },

        //编辑
        edit(e){
            this.editVisible = true;
            // console.log(e);
            this.standardTime = e.ContrastDays;
            this.editId = e.Id;
        },

        //新增框——修改框
        modify(e){
            // console.log(e);
            this.modifyBox = true;
            if(e == '1'){
                this.modifyTitle = '新增'
                this.modifySou = '';
                this.modifyAdd = '';
                this.modifyID = '';
                this.value = 0;
            }else{
                this.modifyTitle = '修改';
                this.modifySou = e.Source;
                this.modifyAdd = e.Address;
                this.modifyID = e.Id;
                this.value = e.SourceType;
            }
        },

        //取消修改
        cancelModify(){
            this.modifyBox = false;
        },

        //确定修改
        confirmModify(){
            let that = this;
            // console.log(this.modifyTitle);
            // console.log(this.modifySou);
            // console.log(this.modifyAdd);
            // console.log(this.modifyID);
            // console.log(this.value);
            // return false
            if(this.modifyTitle == '新增'){
                this.$dataApi({
                    url:'api/BaseData/EditSource',
                    method:'POST',
                    data:{
                        Id:'',
                        source:that.modifySou,
                        Address:that.modifyAdd,
                        SourceType:that.value
                    }
                }).then(res=>{
                    // console.log(res);
                    if(res.Status == 200){
                        this.$message.success('新增成功');
                        that.modifyBox = false;
                        that.getList('false');
                    }
                })
            }else{
                console.log(this.value);
                // if(this.value == 0){
                //     this.$message.warning('正式数据源，禁止修改为测试');
                //     return false
                // }
                // return false
                this.$dataApi({
                    url:'api/BaseData/EditSource',
                    method:'POST',
                    data:{
                        Id:that.modifyID,
                        source:that.modifySou,
                        Address:that.modifyAdd,
                        SourceType:that.value
                    }
                }).then(res=>{
                    // console.log(res);
                    if(res.Status == 200){
                        this.$message.success('修改成功');
                        that.modifyBox = false;
                        that.getList('false');
                    }
                })
            }
            
        },

        //删除测试数据源
        delSource(e){
            // console.log(e);
            let that = this;
            this.$dataApi({
                url:'api/BaseData/DelSource',
                method:'POST',
                data:{
                    Id:e.Id,
                }
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    this.$message.success('删除成功');
                    that.getList('false');
                }
            })
        },

        //取消编辑
        cancelBtn(){
            this.editVisible = false;
        },
 
        //确定编辑
        confirmBtn(){
            // console.log(this.standardTime);
            let that = this;
            this.$dataApi({
                url:'api/BaseData/SetSourceContrastDays',
                method:'POST',
                data:{
                    id:that.editId,
                    ContrastDays:that.standardTime
                }
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    this.$message.success('编辑成功');
                    this.getList('false');
                    this.editVisible = false;
                }
            })
        },

        //是否正式
        onChangeTop(e) {
            // console.log(e.target.value);
            console.log(this.value);
        },

        //测试/预览弹框
        testSource(e){
            // console.log(e);
            let that = this;
            this.isPageData = true;
            this.pageData = 1;
            this.delSourceData = e;
            if(e.SourceType == 1){
                this.previewBox = true;
                this.$dataApi({
                    url:'api/BaseData/GetContrastData',
                    method:'POST',
                    data:{
                        SourceId:e.Id,
                        TimeBegin:that.TimeBegin,
                        TimeEnd:that.TimeEnd,
                        PageNo:1,
                        PageSize:10
                    }
                }).then(res=>{
                    // console.log(JSON.parse(res.Data));
                    that.formalData = JSON.parse(res.Data).Rows
                    that.dataTypeNum = JSON.parse(res.Data).TotalCount
                })
            }else{
                this.testBoxT = true;
                this.$dataApi({
                    url:'api/BaseData/VerifyBaseDataInsert',
                    method:'POST',
                    data:{
                        Source:e.Source,
                    }
                }).then(res=>{
                    // console.log(res);
                    that.dataError = res.Msg;
                })
            }
            
        },

        //分页
        pageDataFun(page, pageSize){
            // console.log(page, pageSize);
            let that = this
            if(this.delSourceData.SourceType == 1){
                this.$dataApi({
                    url:'api/BaseData/GetContrastData',
                    method:'POST',
                    data:{
                        SourceId:that.delSourceData.Id,
                        TimeBegin:that.TimeBegin,
                        TimeEnd:that.TimeEnd,
                        PageNo:page,
                        PageSize:10
                    }
                }).then(res=>{
                    // console.log(JSON.parse(res.Data));
                    that.formalData = JSON.parse(res.Data).Rows
                    that.dataTypeNum = JSON.parse(res.Data).TotalCount
                })
            }else{
                // this.testBoxT = true;
                this.$dataApi({
                    url:'api/BaseData/GetContrastResult',
                    method:'POST',
                    data:{
                        SourceId:that.delSourceData.Id,
                        TimeBegin:that.TimeBegin,
                        TimeEnd:that.TimeEnd,
                        // PageNo:1,
                        // PageSize:10
                    }
                }).then(res=>{
                    // console.log(JSON.parse(res.Data));
                    that.testData = JSON.parse(res.Data).Rows;
                    that.dataTypeNum = JSON.parse(res.Data).TotalCount
                })
            }
        },

        //确定测试
        testBtn(){
            this.testBox = false;
            this.testBoxT = true;
        },

        //关闭数据测试框
        closeTestBoxT(){
            this.testBoxT = false;
        },

        //清空数据
        closeData(){
            // console.log(this.delSourceData);
            let that = this;
            this.$dataApi({
                url:'api/BaseData/DelBaseDataInsert',
                method:'POST',
                data:{
                    source:that.delSourceData.Source,
                }
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    this.$message.success('清空成功');
                    this.testBoxT = false;
                    that.getList('false');
                }
            })
        },

        //转为正式
        becomeWorker(){
            // console.log(this.delSourceData);
            let that = this;
            this.$dataApi({
                url:'api/BaseData/EditSource',
                method:'POST',
                data:{
                    Id:that.delSourceData.Id,
                    source:that.delSourceData.Source,
                    Address:that.delSourceData.Address,
                    SourceType:1
                }
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    this.$message.success('修改成功');
                    that.testBoxT = false;
                    that.getList('false');
                }
            })
        },

        //预览确定
        previewBtn(){
            this.previewBox = false;
        },

        //正式数据/测试数据
        dataFormalFun(e){
            let that = this;
            this.queryNum = e;
            if(e == 1){
                this.isPageData = true;
                this.dataFormal = true;
                this.$dataApi({
                    url:'api/BaseData/GetContrastData',
                    method:'POST',
                    data:{
                        SourceId:that.delSourceData.Id,
                        TimeBegin:that.TimeBegin,
                        TimeEnd:that.TimeEnd,
                        PageNo:1,
                        PageSize:10
                    }
                }).then(res=>{
                    // console.log(JSON.parse(res.Data));
                    that.formalData = JSON.parse(res.Data).Rows
                    that.dataTypeNum = JSON.parse(res.Data).TotalCount
                })
            }else{
                this.dataFormal = false;
                this.isPageData = false;
                this.$dataApi({
                    url:'api/BaseData/GetContrastResult',
                    method:'POST',
                    data:{
                        SourceId:that.delSourceData.Id,
                        TimeBegin:that.TimeBegin,
                        TimeEnd:that.TimeEnd,
                        // PageNo:1,
                        // PageSize:10
                    }
                }).then(res=>{
                    // console.log(JSON.parse(res.Data));
                    that.testData = JSON.parse(res.Data).Rows;
                    that.dataTypeNum = JSON.parse(res.Data).TotalCount;
                })
            }
        },

        //查询数据
        queryData(){
            this.dataFormalFun(this.queryNum);
        },

        //数据源类型
        dataSouTypeFun(e){
            // console.log(e);
            this.dataSouType = e;
        },

        //预览日期
        onChange(date, dateString) {
			// console.log(date, dateString);
			this.TimeBegin = dateString[0];
			this.TimeEnd = dateString[1];
        },

        //跳转详情页
        openNewPage(e){
            window.open(e.ZBUrl,'newwindow','height=600, width=375px,top=200px,left=100px,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=yes,status=no');
        },

        //立即执行导入任务按钮
        ImportData(){
            this.ImportDataTrue = true;
        },

        //确定导入
        ImportDataFun(){
            let that = this;
            
            // console.log(this.finallyArr);
            let finallyArrType = []
            this.finallyArr.map((item,index)=>{
                finallyArrType = finallyArrType.concat(item);
            })
            console.log(finallyArrType);
            // this.rowSelection.selectedRowKeys = [];
            // return false
            this.$dataApi({
                url:'api/BaseData/Trigger',
                method:'POST',
                data:{
                    Ids:finallyArrType
                }
            }).then(res=>{
                console.log(res);
                this.$message.success('已执行');
                that.ImportDataTrue = false;
                that.getList();
            })

        },

        //复选框
        onChangeCheck(e){
            console.log(e);
            if(this.importIds.indexOf(e.Id) == -1){
                this.importIds.push(e.Id);
            }else{
                this.importIds.splice(this.importIds.indexOf(e.Id),1)
            };
            this.checkd.rds = this.importIds;
            console.log(this.checkd.rds);
        },
        onChangeCheck1(e){
            console.log(e);
            return true
        },

        fsf(e){
            console.log(e);
        }

    },
    created(){
        this.getTimes();
        this.getList();
        this.columns = [
            // {
            //     title: "选择",
            //     dataIndex: "checkd",
            //     idNew:'Id',
            //     scopedSlots: { customRender: 'che' },
            // },
            {
                title: "id",
                dataIndex: "Id"
            },
            {
                title: '数据源',
                dataIndex: 'Source',
            },
			{
			    title: '招标数据采集条数',
			    dataIndex: 'DataCount',
			},
            {
			    title: '最近一次采集时间',
			    dataIndex: 'JoinDate',
            },
            {
                title: '标准时间间隔',
                dataIndex: 'ContrastDays',
            },
            {
                title: '当前时间间隔',
                dataIndex: 'NumDays',
            },
            {
                title: '是否置顶',
                dataIndex: 'OrderIndex',
                customRender: text => {
					if(text > 0){
						return "置顶"
					}else {
						return ""
					}			
				}
            },
            {
			    title: '数据源类型',
                dataIndex: 'SourceType',
                customRender: text => {
					if(text == 0){
						return "测试"
					}else if(text == 1){
						return "正式"
					}			
				}
            },
            {
                title: '预警状态',
                dataIndex: 'ContrastState',
                key: 'ContrastState',
                scopedSlots: { customRender: 'ContrastState' },
                // customRender: text => {
				// 	if(text == 0){
				// 		return ""
				// 	}else if(text == 1){
				// 		return "预警"
				// 	}			
				// }
			},
            {
                title: '操作',
                dataIndex: 'option',
                scopedSlots: { customRender: 'optionaction' },
                width:'20%',
            }
        ];
        
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
    .table{
        width: 100%;
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
	.ant-col-12{
		margin-top: 43px
	}
	.content .ant-advanced-search-form .ant-form-item {
		display: flex;
	}
	.ad{
		display: block
	}
	.ad {
		.ant-form-item-control-wrapper {
			flex: 1 !important;
		}
	}
    .input{
        width: 40%;
    }
    .btnbox{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-top: 20px;
    }
    .btnbox>button:nth-of-type(1){
        margin-right: 20px;
    }
    .dataSouInp{
        margin-top: 20px
    }
    .inputBoxTop{
        display: flex;
        margin-top: 20px;
    }
    .isShow{
        margin-right: 30px
    }
    .souNum{
        color: red;
    }
    .btnTop{
        // position: fixed;
        // width: 450px;
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #999;
        height: 50px;
        align-items: center;
        background: #fff;
        z-index: 99;
        border: 2px solid rgb(196, 192, 192);
        border-radius: 10px 10px 0 0;
    }
    .btnTop>span{
        width: 50%;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #333;
        font-size: 16px;
    }
    .btnTop>span:nth-of-type(1){
        border-right: 2px solid rgb(196, 192, 192);
    }
    .outer-container{
        width: 100%;
        height: 500px;
        position: relative;
        overflow: hidden;
        border: 2px solid rgb(196, 192, 192);
        border-radius: 0 0 10px 10px;
        border-top: none;
    }
    .inner-containe{
        position: absolute;
        left: 0;
        top: 0;
        right: -17px;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .listBox{
        height: 95px;
        width: 100%;
        background: #fff;
        padding-left: 5%;
        padding-right: 5%;
        border-bottom: 1px solid #999;
        overflow: hidden;
        padding-bottom: 3px;
    }
    .list_title{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 2行 */
        -webkit-box-orient: vertical;
        margin-top: 10px;
        color: #333;
    }
    .labelBox>span:nth-of-type(1){
        background: #579ce9;
        color: #f1f4fb;
        padding: 3px 15px;
        border-radius: 3px;
    }
    .labelBox>span:nth-of-type(2){
        background: #ecfdf7;
        color: #6da88a;
        padding: 3px 15px;
        border-radius: 3px;
    }
    .labelBox>span:nth-of-type(3){
        background: #ebeeff;
        color: #7886c2;
        padding: 3px 15px;
        border-radius: 3px;
    }
    .labelBox>span:nth-of-type(4){
        // background: yellow;
        background: rgb(235, 232, 232);
        color: rgb(95, 91, 91);
        padding: 0px 15px;
        border-radius: 3px;
        float: right;
    }
    .ant-calendar-picker{
        // width: 100%;
        margin-right: 5px
    }
    .ant-form-item-control-wrapper{
        width: 100%;
    }
    .dataError{
        white-space: pre-wrap
    }
    .p_false{
        margin: 10px 0;
        color: #000;
    }
    .pageData{
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
    .CheckBox{
        display: flex;
        margin-top: 10px;
        margin-left: 10px;
    }
    .isCheck{
        border: none;
    }
    
</style>