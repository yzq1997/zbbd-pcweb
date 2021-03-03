<template>
    <div class="wrap">
        <div class="header">
            <a-col :span="24" class="headerWrap">
                <a-col :span="2">
                    <div class="headerImg" :style="{'background-image':'url('+ ((typeof details.headimgurl).toUpperCase() == 'OBJECT' ? defaultImg : details.headimgurl) +')'}"></div>
                </a-col>
                <a-col :span="22" class="rightData">
                    <div>昵称 ：{{ details && details.nickname || '' }}</div>
                    <!-- <div>TA的收藏：{{ details && details.CollectCount || 0 }}</div> -->
                    <div class="userS">
                        <div>首次使用：{{ details && details.IsUpdate }}</div>
                       <!-- <div>最近使用：{{ details && details.WX_LatelyDate }}</div>
                        <div>访问统计：{{ details && details.VisitCount }}</div> -->
                    </div>
                </a-col>
            </a-col>
        </div>
        <div class="tableWrap">
            <div class="wrapTitle">TA的收藏</div>
            <div class="wrapContent">
                <tables style="width:98%;" size="middle" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations"></tables>
            </div>
        </div>
    </div>
</template>
<script>
import tables from '@/pages/common/table.vue';
import moment from 'moment';
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import Bus from '../../utils/vue-bus';

moment.locale('zh-cn');

export default {
    components:{
        tables
    },
    data(){
        return {
            // details && details.WX_HeadImg || 
            defaultImg:'../../assets/images/defaultPicture.png',
            // defaultImg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578747014228&di=711cedfb5433f8dc1bdb938a98f24cbc&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3Dd2f91a5aeedde711e7d243fe97eecef4%2F87a536d12f2eb9389ccbd0adde628535e4dd6f89.jpg',
            tableData:[],
            columns:[],
            paginations:{
                size:'normal',
                total:0,
                pageSize:10,
                pageNo:1,
                current:1,
            },
            params:{},
            code:'',
            detail:{},
            details:{},
        }
    },
    methods:{
        // table改变
        handleTableChange(pagination,filter,sorter){
            let that = this;
            const pager = Object.assign(this.paginations);
            pager.current = pagination.current;
            this.paginations = pager;
            this.params['pageNo'] = this.paginations['current'];
            if(filter && filter['C_Type'])
            {
                // 筛选
                if(filter['C_Type'].length>0)
                {
                    if(filter['C_Type'].length == 1)
                    {
                        // 单选
                        this.params['typeStr'] = filter.C_Type[0] == "产品"?"1":"0";
                    }
                    else
                    {
                        // 多选
                        delete this.params['typeStr'];
                    }
                }
                // 重置
                else
                {
                    delete this.params['typeStr'];
                }
            }
            this.getList();
        },
        // 初始化参数
        initParams(){
            Object.assign(this.params,{pageNo:this.paginations.current,pageSize:this.paginations.pageSize})
            this.COMMON.dropObj(this.params)
        },
        // 获取收藏列表
        getList(){
            let that = this;
            this.initParams();
            Object.assign(this.params,{openid:this.detail.openid})
            this.$dataApi({
                url:'/api/Users/GetUserkeywordRecord',
                method:'GET',
                data:this.params
            }).then(resCode=>{
                that.paginations.total = JSON.parse(resCode.Data).TotalCount;
                that.tableData = JSON.parse(resCode.Data).Rows;
            })
        },
    },
    created(){
        this.detail = this.$route.params.userDataDetail;
        let that = this;
		that.details = this.detail
		// that.code = res.data.WX_Code;
		that.getList();
        this.columns = [
            {
                title: '关键字',
                dataIndex: 'keyword',
                width:'60%',
                scopedSlots: { customRender: 'C_Title_DataStatue' },
            },
            
            {
                title: '收藏时间',
                dataIndex: 'JoinDate',
                width:'20%'
            }
        ];
        Bus.$emit('menuSelect',{title:'详情',key:''})
    }
}
</script>
<style lang="scss" scoped>
    .wrap{
        width:100%;
        height:100%;
        border-radius:5px;
        padding:0;
        margin:-20px;
        .header{
            overflow: hidden;
            width: calc(100% + 40px);
            background: #fff;
            border-top: 1px solid #E9E9E9;
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
    }
</style>