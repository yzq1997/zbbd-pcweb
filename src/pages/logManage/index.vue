<template>
    <div class="wrap">
        <a-form :form="filterForm" style="overflow:hidden;">
            <a-col :span="24" style="display:flex;justify-content:space-between;">
                <a-col :span="7">
                    <a-form-item label="登录名：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-input style="width:100%;"
                            placeholder="请输入"
                            v-decorator="['u_LoginName']"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="用户名：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-input style="width:100%;"
                            placeholder="请输入"
                            v-decorator="['u_UserName']"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-form-item label="操作日期：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-locale-provider :locale="zhCN">
                            <a-range-picker style="width:100%;" @change="clearTime" :placeholder="['开始时间', '结束时间']" v-decorator="['operateDate']" />
                        </a-locale-provider>
                    </a-form-item>
                </a-col>
            </a-col>
            <a-col :span="24" style="display:flex;justify-content:space-between;">
                <a-col :span="7">
                    <a-form-item label="操作项：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-input style="width:100%;"
                            placeholder="请输入"
                            v-decorator="['operateItem']"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="7">
                    <a-button type="primary" @click="selecting">查询</a-button>
                    <a-button type="default" style="margin-left:10px;" @click="resetFilter">重置</a-button>
                </a-col>
                <a-col :span="7"></a-col>
            </a-col>
        </a-form>
        <tables style="width:100%;overflow:hidden;" size="middle" :columns="columns" :tableData="tableData" :loading="loading" :handleTableChange="handleTableChange" :bordered="bordered" :pagination="paginations"></tables>
    </div>
</template>
<script>
import tables from '@/pages/common/table'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
export default {
    components:{
        tables
    },
    data(){
        return {
            zhCN,
            filterForm:this.$form.createForm(this,{name:'filter'}),
            tableData: [],
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
            loading: false,
            columns:[],
            bordered:true,
            params:{},
        }
    },
    methods:{
        // 清除时间
        clearTime(e){
            if(Array.isArray(e) && e.length == 0)
            {
                if(this.params['operateDate'])
                {
                    delete this.params['operateDate']
                }
                if(this.params['operateDateBegin'])
                {
                    delete this.params['operateDateBegin']
                }
                if(this.params['operateDateEnd'])
                {
                    delete this.params['operateDateEnd']
                }
            }
        },
        // 查询
        selecting(){
            this.getList();
        },
        // 重置
        resetFilter(){
            this.params['operateDateBegin'] = '';
            this.params['operateDateEnd'] = '';
            this.filterForm.resetFields();
        },
        // table改变
        handleTableChange(pagination,filter,sorter){
            let that = this;
            const pager = Object.assign(this.paginations);
            pager.current = pagination.current;
            this.paginations = pager;
            this.params['pageNo'] = this.paginations['current'];
            this.getList('false');
        },
        // 初始化参数
        initParams(e){
            Object.assign(this.params,this.filterForm.getFieldsValue())
            if(Array.isArray(this.params['operateDate']) && this.params['operateDate'].length > 0)
            {
                this.params['operateDateBegin'] = moment(this.params['operateDate'][0]).format('YYYY-MM-DD');
                this.params['operateDateEnd'] = moment(this.params['operateDate'][1]).format('YYYY-MM-DD');
                delete this.params['operateDate']
            }
            Object.assign(this.params,{pageSize:10,pageNo:this.paginations.current})
        },
        // 获取列表
        getList(e){
            let that = this;
            this.initParams();
            if(e != 'false')
            {
                this.params.pageNo = "1";
            }
            this.$dataApi({
                url:'/api/Log/GetList',
                method:'GET',
                data:this.params
            }).then(res=>{
                if(res.status == 200)
                {
                    if(e != "false")
                    {
                        that.paginations['pageNo'] = 1;
                        that.paginations['current'] = 1;
                    }
                    that.paginations.total = res.data.totalcount;
                    that.tableData = res.data.rows;
                }
            })
        },
    },
    created(){
        this.columns = [
            {
                title: '登录名',
                dataIndex: 'Login_Name',
            },
            {
                title: '用户名',
                dataIndex: 'User_Name',
            },
            {
                title: '操作时间',
                dataIndex: 'OperateDate',
            },
            {
                title: '操作项',
                dataIndex: 'OperateItem',
            }
        ];
        this.getList();
    },
}
</script>
<style lang="scss" scoped>
    .wrap{
        width:100%;
        height:100%;
        background:#fff;
        border-radius:5px;
        padding:20px;
        /deep/ .ant-form-item-label{
            text-align: left;
        }
    }
</style>