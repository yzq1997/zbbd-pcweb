<template>
  <div class="index">
    <div class="chart">
      <div class="searchinfo">
        <a-row
          style="overflow:hidden;margin-bottom:20px;height:40px;"
          type="flex"
          justify="space-between"
        >
          <a-col :span="10" class="bold visiT">
            <span>数据推送量</span>
          </a-col>
          
          <a-col :span="2">
            <a-select default-value="最近7天" style="width: 120px" @change="handleChange">
              <a-select-option value="7">最近7天</a-select-option>
              <a-select-option value="15">最近15天</a-select-option>
              <a-select-option value="30">最近30天</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="8">
            <a-form :form="filterForm">
              <a-form-item
                label
                :colon="false"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 22 }"
              >
                <a-locale-provider :locale="zhCN">
                  <a-range-picker
                    style="width:100%;"
                    @change="onChange"
                    :allowClear="false"
                    :placeholder="['开始时间', '结束时间']"
                    v-decorator="['dateRange',initValue]"
                  />
                </a-locale-provider>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </div>
      <div class="chartinfo" ref="chartinfo"></div>
    </div>
    <div class="table">
      <a-col :span="24" style="margin-bottom:20px;height: auto;">
        <a-row>
          <a-col :span="4">
            <a-button type="primary" @click="exportExcel">导出Execl</a-button>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24" style="height: auto;">
        <tables
          :columns="columns"
          :tableData="tableData"
          size="middle"
          :loading="loading"
          :handleTableChange="handleTableChange"
          :bordered="bordered"
          :pagination="paginations"
        ></tables>
      </a-col>
    </div>
  </div>
</template>

<script>
import tables from "@/pages/common/table";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import { formatDate } from "../../utils/dateformat.js";
import Bus from "../../utils/vue-bus.js";
export default {
  components: {
    tables
  },
    data() {
        return {
        zhCN,
        xdata: [],
        ydata: [],
        // rowKey:record => {record.Id},
        columns: [],
        tableData: [],
        loading: false,
        bordered: true,
        paginations: {
            current: 1,
            pageSize: 10,
            total: 0,
            size: "default",
            showQuickJumper: true,
            showTotal: function(total, range) {
            return `共 ${total} 条记录`;
            }
        },
        endDay: "",
        startDay: "",
        filterForm: this.$form.createForm(this, { name: "filter" }),
        params: {},
        daynum: 7,
        exportdata: [],
        source:0,
        TotalPushCount: [], //(推送总量)
        FreePushCount: [], //（免费推送总量）
        VIPPushCount: [], //（会员推送总量）
        SetmealAPushCount:[],  //套餐A推送量
        SetmealBPushCount:[],  //套餐B推送量
        SetmealCPushCount:[],  //套餐C推送量

        TotalClickCount: [], //（点击总量）
        FreeClickCount: [], //（免费用户点击量）
        VIPClickCount: [], //（会员用户点击量）
        SetmealAClickCount:[],  //套餐A点击量
        SetmealBClickCount:[],  //套餐B点击量
        SetmealCClickCount:[],  //套餐C点击量
        Time: [], //(日期)
        };
    },
    methods: {
        // 表格事件
        handleTableChange(pagination, filter, sort) {
            let that = this;
            const pager = Object.assign(this.paginations);
            pager.current = pagination.current;
            this.paginations = pager;
            this.params["pageNo"] = this.paginations["current"];
            this.checkedKeys = [];
            this.GetSendStat("false");
        },

        getchartinfo() {
            let myChart = this.$echarts.init(this.$refs.chartinfo);
            myChart.setOption({
                tooltip: {
                    //设置tip提示
                    trigger: "axis"
                },
                legend: {
                    data: ['推送总量', '点击总量']
                },
                xAxis: {
                    name: "日期",
                    type: "category",
                    data: this.xdata
                },
                yAxis: {
                    name: "数量",
                    type: "value"
                },
                series: [
                    {
                        data: this.TotalPushCount,
                        type: "line",
                        name: '推送总量',
                    },
                    {
                        name: '免费推送总量',
                        type: 'line',
                        data: this.FreePushCount,
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
                        name: '会员推送总量',
                        type: 'line',
                        data: this.VIPPushCount,
                        showSymbol:0,
                        symbol: "none",
                        color:"#6F6F6F",
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    },
                    {
                        name: '套餐A用户推送总量',
                        type: 'line',
                        data: this.SetmealAPushCount,
                        showSymbol:0,
                        symbol: "none",
                        color:"#6F6F6F",
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    },
                    {
                        name: '套餐B用户推送总量',
                        type: 'line',
                        data: this.SetmealBPushCount,
                        showSymbol:0,
                        symbol: "none",
                        color:"#6F6F6F",
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    },
                    {
                        name: '套餐C用户推送总量',
                        type: 'line',
                        data: this.SetmealCPushCount,
                        showSymbol:0,
                        symbol: "none",
                        color:"#6F6F6F",
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    },
                    {
                        name: '点击总量',
                        type: 'line',
                        data: this.TotalClickCount,
                        color:'#00FF00'
                    },
                    {
                        name: '免费用户点击量',
                        type: 'line',
                        color:"#6F6F6F",
                        data: this.FreeClickCount,
                        showSymbol:0,
                        symbol: "none",
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    },
                    {
                        name: '会员用户点击量',
                        type: 'line',
                        color:"#6F6F6F",
                        data: this.VIPClickCount,
                        symbol: "none",
                        showSymbol:0,
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    },
                    {
                        name: '套餐A用户用户点击量',
                        type: 'line',
                        color:"#6F6F6F",
                        data: this.SetmealAClickCount,
                        symbol: "none",
                        showSymbol:0,
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    },
                    {
                        name: '套餐B用户用户点击量',
                        type: 'line',
                        color:"#6F6F6F",
                        data: this.SetmealBClickCount,
                        symbol: "none",
                        showSymbol:0,
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    },
                    {
                        name: '套餐C用户用户点击量',
                        type: 'line',
                        color:"#6F6F6F",
                        data: this.SetmealCClickCount,
                        symbol: "none",
                        showSymbol:0,
                        showSymbol:false,
                        lineStyle: {
                            width: 0, // 线宽是0
                            color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                        },
                    }
                ]
            });
        },

        onChange(date, dateString) {
            this.params.beginDate = dateString[0];
            this.params.endDate = dateString[1];
            this.GetSendStat(0);
        },

        handleChange(value) {
            // console.log(value);
        
            this.daynum = value;
            let date1 = new Date();
            let date2 = new Date(date1);
            let emouth = date1.getMonth() + 1;
            let eday = date1.getDate();
            if (emouth < 10) {
                emouth = "0" + emouth;
            }
            if (eday < 10) {
                eday = "0" + eday;
            }
            this.endDay = date1.getFullYear() + "-" + emouth + "-" + eday;
            date2.setDate(date1.getDate() - value);
            let smouth = date2.getMonth() + 1;
            let sday = date2.getDate();
            if (smouth < 10) {
                smouth = "0" + smouth;
            }
            if (sday < 10) {
                sday = "0" + sday;
            }
            this.startDay = date2.getFullYear() + "-" + smouth + "-" + sday;

            this.params.beginDate = this.startDay;
            this.params.endDate = this.endDay;
            // console.log(this.params.beginDate);
            // console.log(this.params.endDate);
            
            this.GetSendStat(0);
        },

        handleChange1(value){
            // console.log(value);
            this.source = value;
            this.GetSendStat()
        },
        datesort: function(x, y) {
            return x.Tasktime > y.Tasktime ? 1 : -1;
        },

        tabledatesort: function(x, y) {
            return x.Tasktime < y.Tasktime ? 1 : -1;
        },

        cleardata:function(){
            this.TotalPushCount= [];//(推送总量)
            this.FreePushCount= []; //（免费推送总量）
            this.VIPPushCount= []; //（会员推送总量）
            this.SetmealAPushCount= []; //（会员推送总量）
            this.SetmealBPushCount= []; //（会员推送总量）
            this.SetmealCPushCount= []; //（会员推送总量）

            this.TotalClickCount= []; //（点击总量）
            this.FreeClickCount= []; //（免费用户点击量）
            this.VIPClickCount= []; //（会员用户点击量）
            this.SetmealAClickCount= []; //（会员用户点击量）
            this.SetmealBClickCount= []; //（会员用户点击量）
            this.SetmealCClickCount= []; //（会员用户点击量）
            this.Time= []; //(日期)
        },

        GetSendStat(e) {
            this.xdata = [];
            this.ydata = [];
            let beginDate = new Date(
                Date.parse(this.params.beginDate.replace(/-/g, "/"))
            );
            let endDate = new Date(
                Date.parse(this.params.endDate.replace(/-/g, "/"))
            );
            // console.log(beginDate);
            // console.log(endDate);
            
            let that = this;
            //   this.$axios
            //     .post("http://192.168.1.50:8024/api/Stat/GetSendStat", {
            //       OpenId: OId
            //     })
            //     .then(res => {
            //       this.arr = JSON.parse(res.data).data;
            //     });
            this.source = 1
            this.$dataApi({
                url: "api/Stat/GetSendStat",
                method: "POST",
                data: {
                BeginTime: formatDate(beginDate, "yyyy-MM-dd"),
                EndTime: formatDate(endDate, "yyyy-MM-dd"),
                IsImport: 1,
                pageNo: 0, //当前页面
                pageSize: 0, //每页数量
                Source:1
                }
            }).then(res => {
                console.log(res);
                this.cleardata();
                res.sort(this.datesort);
                that.paginations.total = res.length;
                that.tableData = res;
                res.forEach((item, index) => {
                    that.xdata.push(item.Time);
                    that.TotalPushCount.push(item.TotalPushCount);
                    that.FreePushCount.push(item.FreePushCount);
                    that.VIPPushCount.push(item.VIPPushCount);
                    that.SetmealAPushCount.push(item.SetmealAPushCount);
                    that.SetmealBPushCount.push(item.SetmealBPushCount);
                    that.SetmealCPushCount.push(item.SetmealCPushCount);

                    that.TotalClickCount.push(item.TotalClickCount);
                    that.FreeClickCount.push(item.FreeClickCount);
                    that.VIPClickCount.push(item.VIPClickCount);
                    that.SetmealAClickCount.push(item.SetmealAClickCount);
                    that.SetmealBClickCount.push(item.SetmealBClickCount);
                    that.SetmealCClickCount.push(item.SetmealCClickCount);
                });
                that.tableData.sort(this.tabledatesort);
                that.tableData.forEach((item, index) => {
                    item.num = index + 1;
                });
                // that.tableData.sort(this.tabledatesort);
                this.getchartinfo();
            });
        },

        exportExcel() {
            let beginDate = new Date(
                Date.parse(this.params.beginDate.replace(/-/g, "/"))
            );
            let endDate = new Date(
                Date.parse(this.params.endDate.replace(/-/g, "/"))
            );
            let that = this;
            this.$dataApi({
                url: "api/Stat/GetSendStat",
                method: "POST",
                data: {
                BeginTime: formatDate(beginDate, "yyyy-MM-dd"),
                EndTime: formatDate(endDate, "yyyy-MM-dd"),
                IsImport: 1,
                pageNo: "1", //当前页面
                pageSize: "10", //每页数量
                Source:1
                }
            }).then(res => {
                that.exportdata = res;
                that.exportdata.forEach((item, index) => {
                item.num = index + 1;
                });
                require.ensure([], () => {
                const {
                    export_json_to_excel
                } = require("../../utils/Export2Excel.js"); //注意这个Export2Excel路径
                const tHeader = ["序号", "时间", "推送用户总量", "推送免费用户量","推送会员用户量",'推送套餐A用户量','推送套餐B用户量','推送套餐C用户量',"总点击量", "免费用户点击量","会员用户点击量",'套餐A用户点击量','套餐B用户点击量','套餐C用户点击量']; // 上面设置Excel的表格第一行的标题
                const filterVal = ["num", "Time","TotalPushCount", "FreePushCount", "VIPPushCount",'SetmealAPushCount','SetmealBPushCount','SetmealCPushCount',,"TotalClickCount","FreeClickCount","VIPClickCount",'SetmealAClickCount','SetmealBClickCount','SetmealCClickCount']; // 上面的index、nickName、name是tableData里对象的属性key值
                const list = this.exportdata; //把要导出的数据tableData存到list
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, "信息推送数据统计"); //最后一个是表名字
                });
            });
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
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
    created() {
        this.handleChange(7);
        this.columns = [
        {
            title: "序号",
            dataIndex: "num"
        },
        {
            title: "时间",
            dataIndex: "Time"
        },
        {
            title: "推送用户总量",
            dataIndex: "TotalPushCount"
        },
        {
            title: "推送免费用户量",
            dataIndex: "FreePushCount"
        },
        {
            title: "推送会员用户量",
            dataIndex: "VIPPushCount"
        },
        {
            title: "推送套餐A用户量",
            dataIndex: "SetmealAPushCount"
        },
        {
            title: "推送套餐B用户量",
            dataIndex: "SetmealBPushCount"
        },
        {
            title: "推送套餐C用户量",
            dataIndex: "SetmealCPushCount"
        },
        {
            title: "总点击量",
            dataIndex: "TotalClickCount"
        },
        {
            title: "免费用户点击量",
            dataIndex: "FreeClickCount"
        },
        {
            title: "会员用户点击量",
            dataIndex: "VIPClickCount"
        },
        {
            title: "套餐A用户点击量",
            dataIndex: "SetmealAClickCount"
        },
        {
            title: "套餐B用户点击量",
            dataIndex: "SetmealBClickCount"
        },
        {
            title: "套餐C用户点击量",
            dataIndex: "SetmealCClickCount"
        },
        ];
        this.initPrams();
        // this.GetSendStat();
    },
    mounted() {
        this.getchartinfo();
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
        Bus.$emit("collapse", {
        Height: document.getElementsByClassName("content")[0].clientHeight
        });
    }
};
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .chart {
    width: 100%;
    margin-top: 10px;
    height: auto;
    .searchinfo {
      height: 40px;
      background-color: rgb(255, 255, 255);
    }
    .searchinfo span {
      font-family: "Microsoft Tai Le Bold", "Microsoft Tai Le Regular",
        "Microsoft Tai Le";
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
      text-align: center;
      line-height: 40px;
      margin-left: 20px;
    }
    .searchinfo .ant-calendar-picker {
      float: right;
      line-height: 40px;
      margin-right: 10px;
    }
    .searchinfo .ant-select {
      float: right;
      margin-top: 5px;
    }
    .chartinfo {
      height: 400px;
      background-color: rgb(255, 255, 255);
    }
  }
  .table {
    // width:calc(70% - 30px);
    height: 100%;
    margin-top: 20px;
    border-radius: 4px;
    padding: 20px;
    background-color: rgb(255, 255, 255);
    overflow: hidden;
  }
}
</style>
