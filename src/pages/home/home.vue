<template>
    <div class="wrap">
        <section class="noHeader">
            <div>
                <div>
                    <div class="backImg">

                    </div>
                    <div>
                        <div>产品管理</div>
                        <div class="bold">{{ statisticsData.ProductCount }}</div>
                    </div>
                </div>
                <div>
                    <div class="backImg">

                    </div>
                    <div>
                        <div>比较试验</div>
                        <div class="bold">{{ statisticsData.CompareTestCount }}</div>
                    </div>
                </div>
            </div>
            <div>
                <a-col :span="8">
                    <div>访问总量</div>
                    <div class="bold">{{ statisticsData.VisitCount }}</div>
                </a-col>
                <a-col :span="8">
                    <div>人均访问时长/h</div>
                    <div class="bold">{{ statisticsData.VisitTimeAvg || '--' }}</div>
                </a-col>
                <a-col :span="8">
                    <div>今日新用户/访问量</div>
                    <div class="bold">{{ statisticsData.TodayNewUsers }}/{{ statisticsData.TodayVisitCount }}</div>
                </a-col> 
            </div>
        </section>
        <section class="YHeader">
            <div>
                <p class="YHeaderT">产品类别占比</p>
                <div>
                    <swiper 
                        ref="mySwiper"
                        class="swiper"
                        :options="swiperOption"
                        swiperheight="190px"
                        :indicatorDots="true"
                        imgheight="190px"
                        :isScale="true"
                        indicatorActiveColor="#27C881"
                        indicatorColor="rgba(0,0,0,0.3)"
                        :circular="true"
                    >
                        <div class="swiper-button-prev" slot="button-prev">
                            <div
                                class="custom-slick-arrow"
                                style="left: 10px;zIndex: 1"
                            >
                                <a-icon type="left" />
                            </div>
                        </div>
                        <div class="swiper-button-next" slot="button-next">
                            <div class="custom-slick-arrow" style="right: 10px">
                                <a-icon type="right" />
                            </div>
                        </div>
                        <swiper-slide v-for="(item,index) in typeData" :key="index">
                            <div :class="'typeChart'+index" style="height:200px;" :refs="'typeCharts'+index"></div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
            <div>
                <p class="YHeaderT">检索统计</p>
                <div class="boxWrap">
                    <div style="float:left;">
                        <div class="chartTitle">
                            <div>搜索用户数</div>
                            <div class="bold-small">{{ statisticsData.SearchUserCount }}</div>
                        </div>
                        <div id="searchChart" ref="searchCharts"></div>
                    </div>
                    <div style="float:right;">
                        <div class="chartTitle">
                            <div>人均搜索次数</div>
                            <div class="bold-small">{{ statisticsData.SearchCountAvg }}</div>
                        </div>
                        <div id="rjChart" ref="rjCharts"></div>
                    </div>
                </div>
            </div>
        </section>
        <section class="chartWrap">
            <a-row style="overflow:hidden;margin-bottom:20px;height:40px;" type="flex" justify="space-between">
                <a-col :span="5" class="bold visiT">用户访问量</a-col>
                <a-col :span="6">
                    <a-form :form="filterForm">
                        <a-form-item label="" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 22 }">
                            <a-locale-provider :locale="zhCN">
                                <a-range-picker style="width:100%;" @change="clearTime" :allowClear="false" :placeholder="['开始时间', '结束时间']" v-decorator="['dateRange',initValue]" />
                            </a-locale-provider>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
            <div id="visiteChart" ref="visiteCharts">
                
            </div>
            <div id="slider" ref="visiteChartsSilder"></div>
        </section>
    </div>
</template>
<script>
import G2 from '@antv/g2';
import lodash from 'lodash';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
const DataSet = require("@antv/data-set");
export default {
    data(){
        return {
            swiperOption:{
                spaceBetween: 10,
                loop:false,
                navigation:{
                    prevEl:'.swiper-button-prev',
                    nextEl:'.swiper-button-next',
                }
            },
            zhCN,
            statisticsData:{},
            typeTotalCount:0,
            typeData:[],
            filterForm:this.$form.createForm(this,{name:'filter'}),
            params:{},
            visitedData:[],
            visitchart:{},
        }
    },
    methods:{
        // 清除时间
        clearTime(e){
            let that = this;
            if(Array.isArray(e) && e.length == 0)
            {
                if(this.params['dateRange'])
                {
                    delete this.params['dateRange']
                }
                if(this.params['beginDate'])
                {
                    delete this.params['beginDate']
                }
                if(this.params['endDate'])
                {
                    delete this.params['endDate']
                }
            }
            else
            {
                setTimeout(function(){
                    that.getUserVisited();
                },0)
            }
        },
        // 人均搜索次数图表
        rjChart(data){
            let chart = new G2.Chart({
                container: 'rjChart',
                height: this.$refs.rjCharts && this.$refs.rjCharts.offsetHeight || 0,
                width: this.$refs.rjCharts && this.$refs.rjCharts.offsetWidth || 0,
                padding:0
            });
            chart.source(data);
            chart.scale({
                DateStr: {
                    range: [ 0, 1 ]
                }
            });
            chart.scale('Cnt',{
                alias:'人/次'
            })
            chart.axis(false);
            chart.tooltip({
                crosshairs: false
            });
            chart.area().position('DateStr*Cnt').shape('smooth') .color('rgba(123,218,227,0.5)');
            chart.line().position('DateStr*Cnt').size(2).shape('smooth').color('rgba(123,218,227,1)').tooltip({showTitle:false});
            chart.render();
        },
        // 搜索用户数
        searchChart(data){
            // DateStr UserCnt
            let chart = new G2.Chart({
                container: 'searchChart',
                height: this.$refs.searchCharts.offsetHeight,
                width: this.$refs.searchCharts.offsetWidth,
                padding:0
            });
            chart.source(data);
            chart.scale({
                UserCnt: {
                    min: 0
                },
                DateStr: {
                    range: [ 0, 1 ]
                }
            });
            chart.scale('UserCnt',{
                alias:'人数'
            })
            chart.axis(false);
            chart.tooltip({
                crosshairs: false
            });
            chart.line().position('DateStr*UserCnt').size(2).shape('smooth').color('rgba(53,172,251,1)');
            chart.area().position('DateStr*UserCnt').shape('smooth') .color('rgba(53,172,251,0.5)').tooltip({showTitle:false});
            chart.render();
        },
        // 用户访问量
        visitedChart(visitedData){
            // const chart = new G2.Chart({
            //     container: 'visiteChart',
            //     forceFit: true,
            //     width: this.$refs.visiteCharts.width,
            //     height: this.$refs.visiteCharts.offsetHeight,
            //     padding:[10,30,20,30]
            // });
            // let data = '[{"time":"2015-11-12","start":7.76,"max":8.18,"min":7.61,"end":8.15,"volumn":4742.6,"money":37565.36},{"time":"2015-11-11","start":7.55,"max":7.81,"min":7.49,"end":7.8,"volumn":3133.82,"money":24065.42},{"time":"2015-11-10","start":7.5,"max":7.68,"min":7.44,"end":7.57,"volumn":2670.35,"money":20210.58},{"time":"2015-11-09","start":7.65,"max":7.66,"min":7.3,"end":7.58,"volumn":2841.79,"money":21344.36},{"time":"2015-11-06","start":7.52,"max":7.71,"min":7.48,"end":7.64,"volumn":2725.44,"money":20721.51}]';
            // data = JSON.parse(data);
            let that = this;
            const ds = new DataSet({
                state: {
                    start: visitedData.length>0 && visitedData[0].TimeHelp || '',
                    end: visitedData.length>0 && visitedData[visitedData.length-1].TimeHelp || ''
                }
            });
            const dv = ds.createView();
            dv.source(visitedData)
            .transform({
                type: 'filter',
                callback: obj => {
                const date = obj.TimeHelp;
                return date <= ds.state.end && date >= ds.state.start;
                }
            })
            this.visitchart = new G2.Chart({
                container: 'visiteChart',
                forceFit: true,
                width: this.$refs.visiteCharts.width,
                height: this.$refs.visiteCharts.offsetHeight,
                padding:[10,30,20,30]
            });
            this.visitchart.source(dv, {
            time: {
                type: 'timeCat',
                nice: false,
                range: [ 0, 1 ]
            }
            });
            const barView = this.visitchart.view();
            barView.source(dv, {
                Cnt: {
                    tickCount: 2
                }
            });
            barView.axis('TimeHelp', {
                tickLine: null,
                label: null
            });
            barView.axis('Cnt');
            barView.scale('Cnt',{
                alias:'访问量'
            })
            barView.line().position('TimeHelp*Cnt').color('rgba(90,207,125,1)').opacity(1);
		    barView.point().position('TimeHelp*Cnt').color('rgba(90,207,125,1)')
            this.visitchart.render();
            this.visitchart.interact('slider', {
                container: 'slider', // DOM id
                start: ds.state.start, // 和状态量对应
                end: ds.state.end,
                visitedData, // 源数据
                xAxis: 'TimeHelp', // 背景图的横轴对应字段，同时为数据筛选的字段
                yAxis: 'Cnt', // 背景图的纵轴对应字段，同时为数据筛选的字段
                scales: {
                    time: {
                    type: 'timeCat',
                    nice: false
                    }
                },
                padding:[0,100,0,100],
                onChange: ({ startText, endText }) => {
                    ds.setState('start', startText);
                    ds.setState('end', endText);
                    setTimeout(() => {
                        that.visitchart.render();
                    }, 32);
                }
            });
        },
        // 获取数量统计
        getStatistics(){
            let that = this;
            this.$dataApi({
                url:'http://saas.jshcsoft.com/qualityGuard/api/api/HomePage/GetStatisticsCount',
                method:'GET',
                data:{
                    searchType:1
                }
            }).then(res=>{
                if(res.status == 200)
                {
                    that.statisticsData = res.data[0];
                }
            })
        },
        // 产品类别占比图表
        typePercent(data,container){
            let that = this;
            let colorArr = ['#3AA1FE','#6AD288','#FCDB56'];
            for(let i=0;i<document.getElementsByClassName('typeChart'+container).length;i++)
            {
                const chart = new G2.Chart({
                    container: document.getElementsByClassName('typeChart'+container)[i],
                    forceFit: true,
                    height: 175,
                    padding: 'auto'
                });
                chart.source(data);
                chart.legend(false);
                chart.tooltip({
                    showTitle:false,
                    itemTpl:'<li>{name}: {value} 个</li>'
                })
                chart.facet('rect', {
                    fields: [ 'PT_Name' ],
                    padding: 20,
                    showTitle: false,
                    eachView: function eachView(view, facet) {
                        const data = facet.data;
                        let color = colorArr[facet.colIndex];
                        data.push({ PT_Name: '其他', value: that.typeTotalCount - data[0].value });
                        view.source(data);
                        view.coord('theta', {
                            radius: 0.99,
                            innerRadius: 0.80
                        });
                        view.intervalStack()
                        .position('value')
                        .color('PT_Name', [ color, '#eceef1' ])
                        .opacity(1);
                        view.guide().html({
                        position: [ '50%', '50%' ],
                        html: `
                            <div class="g2-guide-html">
                            <p class="title ellipsis" title="${data[0].PT_Name}">${data[0].PT_Name}</p>
                            <p class="value" style="text-align:center;">${((data[0].value/that.typeTotalCount)*100).toFixed(0)}%</p>
                            </div>
                        `
                        });
                    }
                });
                chart.render();
            }
        },
        // 获取产品类别占比
        getProductType(){
            let that = this;
            this.$dataApi({
                url:'http://saas.jshcsoft.com/qualityGuard/api/api/HomePage/GetStatisticsCount',
                method:'GET',
                data:{
                    searchType:2
                }
            }).then(res=>{
                if(res.status == 200)
                {
                    that.typeTotalCount = 0;
                    res.data.forEach(item=>{that.typeTotalCount+=item.Cnt;item.value = item.Cnt})
                    that.typeData = _.chunk(res.data,3);
                    setTimeout(function(){
                        that.typeData.forEach((item,index)=>{
                            that.typePercent(item || [],index);
                        })
                    },0)
                }
            })
        },
        // 初始化用户访问量的参数
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
        // 获取用户访问量
        getUserVisited(){
            let that = this;
            this.initPrams();
            this.$dataApi({
                url:'http://saas.jshcsoft.com/qualityGuard/api/api/HomePage/GetStatisticsCount',
                method:'GET',
                data:Object.assign(this.params,{searchType:3})
            }).then(res=>{
                if(res.status == 200)
                {
                    if(that.visitchart && Object.keys(that.visitchart).length>0)
                    {
                        that.$refs.visiteCharts.innerHTML = "";
                        that.$refs.visiteChartsSilder.innerHTML = "";
                    }
                    that.visitedChart(res.data);
                }
            })
        }
    },
    // mounted(){
    //     let that = this;

    //     // 搜索的用户数
    //     this.$dataApi({
    //         url:'http://saas.jshcsoft.com/qualityGuard/api/api/HomePage/GetStatisticsCount',
    //         method:'GET',
    //         data:{
    //             searchType:5
    //         }
    //     }).then(res=>{
    //         if(res.status == 200) 
    //         {
    //             that.searchChart(res.data);
    //             that.$dataApi({
    //                 url:'http://saas.jshcsoft.com/qualityGuard/api/api/HomePage/GetStatisticsCount',
    //                 method:'GET',
    //                 data:{
    //                     searchType:4
    //                 }
    //             }).then(resCode=>{
    //                 if(resCode.status == 200)
    //                 {
    //                     let arrays = [];
    //                     arrays.length = resCode.data.length;
    //                     resCode.data.forEach((item,index)=>{
    //                         res.data.forEach(si=>{
    //                             arrays[index] = {
    //                                 DateStr:item.DateStr,
    //                                 Cnt:Math.ceil(item.Cnt/si.UserCnt),
    //                             };
    //                         })
    //                     })
    //                     that.rjChart(arrays)
    //                 }
    //             })
    //         }
    //     })
        
    // },
    created(){
        // this.getStatistics();
        // this.getProductType();
        // this.getUserVisited();
    },
    computed:{
        initValue(){
            let obj = {};
            obj.initialValue = [moment(new Date(new Date().getTime() - 24*7*60*60*1000).toLocaleDateString(), 'YYYY/MM/DD'),moment(new Date().toLocaleDateString(), 'YYYY/MM/DD')];
            return obj;
        }
    }
}
</script>
<style lang="scss" scoped>
    .swiper-button-prev{
        background-image: initial;
    }
    .swiper-button-next{
        background-image: initial;
    }
    .ant-carousel{
        height:100%;
    }
    .ant-carousel {
        /deep/ .slick-slider{
            text-align: center;
            height: 100%;
            overflow: hidden;
        }
        /deep/ .slick-list {
            height: 100%;
            overflow: hidden;
        }
        & div{
            height:100%;
        }
    }
    .ant-carousel >>> .custom-slick-arrow {
        width: 25px;
        height: 25px;
        font-size: 25px;
        color: #555555;
    }
    .ant-carousel >>> .custom-slick-arrow:before {
        display: none;
    }
    .ant-carousel >>> .slick-next:hover{
        color: #555!important;
    }
    .ant-carousel >>> .custom-slick-arrow:hover {
        // opacity: 0.5;
        color: #555!important;
    }

    .ant-carousel >>> .slick-slide h3 {
        color: #fff;
    }
    .wrap{
        width:100%;
        height:100%;
        /deep/ .ellipsis{
            text-overflow:ellipsis;
            overflow:hidden;
            white-space: nowrap;
            width: 100%;
            margin: 0 auto;
        }
        section{
            margin-bottom:20px;
            color:#929292;
            &.noHeader{
                overflow:hidden;
                &>div{
                    width:calc(50% - 10px);
                    height:100px;
                    &:nth-child(1){
                        float:left;
                        &>div{
                            width:calc(50% - 10px);
                            height:100%;
                            background:#fff;
                            border-radius:3px;
                            border:1px solid #E9E9E9;
                            padding:20px;
                            display: flex;
                            align-items: center;
                            &:nth-child(1){
                                float:left;
                            }
                            &:nth-child(2){
                                float:right;
                            }
                        }
                    }
                    &:nth-child(2){
                        float:right;
                        background:#fff;
                        border-radius:3px;
                        border:1px solid #E9E9E9;
                        padding:20px;
                    }
                }
            }
            &.YHeader{
                overflow:hidden;
                &>div{
                    width:calc(50% - 10px);
                    height:260px;
                    background:#fff;
                    border-radius:3px;
                    border:1px solid #E9E9E9;
                    &:nth-child(1){
                        float:left;
                    }
                    &:nth-child(2){
                        float:right;
                    }
                }
                .YHeaderT{
                    height: 60px;
                    line-height: 60px;
                    padding: 0 20px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                    border-bottom: 1px solid #EBEBEB;
                    margin-bottom:0;
                    &+div{
                        height:calc(100% - 60px);
                        overflow: hidden;
                        padding: 20px;
                        &.boxWrap>div{
                            height:100%;
                            width:calc(50% - 5px);
                            .chartTitle{
                                height:50px;
                                overflow:hidden;
                                &+div{
                                    height:calc(100% - 50px);
                                }
                            }
                        }
                    }
                }
            }
            &.chartWrap{
                width:100%;
                height:425px;
                background:#fff;
                border-radius:3px;
                border:1px solid #E9E9E9;
                padding:20px;
                #visiteChart{
                    width:100%;
                    height:calc(100% - 100px);
                }
                #slider{
                    width:100%;
                    height:40px;
                    margin-top:10px;
                }
                .visiT{
                    font-size: 16px;
                    font-weight: bold;
                    line-height: 40px;
                }
            }
            .backImg{
                background-image:url("../../assets/images/statistics.png");
                background-repeat : no-repeat;
                background-size:cover;
                width:60px;
                height:60px;
                margin-right:40px;
            }
            .bold{
                font-size:36px;
                color:#272727;
            }
            .bold-small{
                font-size:26px;
                color:#272727;
            }
        }
    }
</style>