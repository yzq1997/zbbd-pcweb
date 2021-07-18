<template>
    <div>
		<!-- :rowKey="rowKey" -->
        <a-locale-provider :locale="zhCN">
            <a-table
                :scroll="scroll || { x: '100%',}"
                :columns="columns"
                :dataSource="tableData"
                :loading="loading"
                :bordered="bordered"
                :pagination="pagination"
                :size="size || 'default'"
                :rowSelection="row"
                style="word-break: break-all;"
                @change="handleTableChange"
                :rowClassName="(record)=>{
                    return record.DataState == 1?'dis':'ble'
                }"
            >   
                <span :style="text==1?{'color':'#FF0000'}:{}" slot="ContrastState" slot-scope="text">
                    {{text=='1'?"预警":""}}
                </span>
                <span slot="RE_State" slot-scope="text">
                    {{text=='1'?"受理成功":"受理失败"}}
                </span>
                <span slot="F_ISRead" slot-scope="text">
                    <span :style="text=='1'?{'color':'#7EC856'}:{'color':'#ccc'}">● </span>
                    {{text=='0'?"未查看":"已查看"}}
                </span>
                <span slot="C_Title_DataStatue" slot-scope="text,record">
                    {{ record.DataState == '1'?'已删除':text }}
                </span>
                <span slot="order" slot-scope="text,record,index">
                    <span>{{ index+1 }}</span>
                </span>
                <span slot="PT_State" slot-scope="text">
                    <span :style="text==0?{'color':'#ccc'}:{'color':'#7EC856'}">● </span>
                    {{text==0?"已下线":"已发布"}}
                </span>
                <span slot="C_ShieldingWords" slot-scope="text">
                    {{ text.split(';').filter(item=>{return item}).join(';') || '-' }}
                </span>
                <span slot="SP_State" slot-scope="text">
                    {{text==0?"隐藏":"显示"}}
                </span>
                <span slot="PC_State" slot-scope="text">
                    {{text==0?"隐藏":"显示"}}
                </span>
                <!-- 1：使用中，0：待上线，-1：已下线 -->
                <span slot="HS_State" slot-scope="text">
                    <span :style="text=='1'?{'color':'#7EC856'}:text=='0'?{'color':'#1890FF'}:{'color':'#ccc'}">● </span>
                    {{ text == '1'?'使用中':text == '0'?"待上线":"已下线"}}
                </span>
                <!-- 1：使用中，0：待上线，-1：已下线 -->
                <span slot="R_State" slot-scope="text">
                    <span :style="text=='1'?{'color':'#7EC856'}:text=='0'?{'color':'#1890FF'}:{'color':'#ccc'}">● </span>
                    {{ text == '1'?'使用中':text == '0'?"待上线":"已下线"}}
                </span>
                <!-- 1：搜索框，0：正常 -->
                <span slot="HS_Type" slot-scope="text">
                    {{text==1?"搜索框":"正常"}}
                </span>
                <!--  -->
                <span slot="C_State" slot-scope="text">
                    <span :style="text=='0'?{'color':'#1890FF'}:text=='1'?{'color':'#7EC856'}:{'color':'#FF0000'}">● </span>
                    {{text==0?"待审核":text==1?"通过":"拒绝"}}
                </span>
                <!-- 复选框 -->
                <span slot="che" slot-scope="text,record">
                    <!-- <a-checkbox v-for="(item,index) in Array.isArray(checkd) && checkd.length && checkd.filter(item=>{return item['type'] && item['type']!='comment'})" :key="index" @click="item.fn(record,index)" :checked="item.rds.indexOf(item.ddd) == -1 ?false:true"></a-checkbox> -->
                    <a-checkbox v-for="(item,index) in Array.isArray(checkd) && checkd.length && checkd.filter(item=>{return item['type'] && item['type']!='comment'})" :key="index" @change="item.fn(record,index)" :checked="item.rdst.map((item1,index)=>{return !(item.rds.indexOf(item1) == -1)})"></a-checkbox>
                    <!-- <a-checkbox v-for="(item,index) in Array.isArray(checkd) && checkd.length && checkd.filter(item=>{return item['type'] && item['type']!='comment'})" :key="index" @click="item.fn(record,index)"></a-checkbox> -->
                </span>
                <span :title="text" slot="titleShow" slot-scope="text" style="overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">
                    {{text}}
                </span>
                <span slot="option" slot-scope="text,record">
                    <slot name="options" :record="record"></slot>
                    <slot name="comment" :record="record"></slot>
                    <slot name="status" :record="record"></slot>
                    <a href="javascript:;" v-for="(item,index) in Array.isArray(option) && option.length && option.filter(item=>{return item['type'] && item['type']!='comment'})" :key="index" @click="item.fn(record,index)">
                        {{ item.name != "下线"?item.name == "重置密码"?"":item.name:""}}
                        {{index+1 == option.length?"":" | "}}
                    </a>
                    <slot name="restPassword" :record="record"></slot>
                    <slot name="more" :record="record"></slot>
                </span>
                <span slot="optionaction" slot-scope="text,record">
                    <slot name="options" :record="record"></slot>
                    <slot name="comment" :record="record"></slot>
                    <slot name="status" :record="record"></slot>
                    <a href="javascript:;" class="btn" v-for="(item,index) in Array.isArray(option) && option.length && option.filter(item=>{return item['type'] && item['type']!='comment'})" :key="index" @click="item.fn(record,index)">
                        <!-- {{item.text == 3 ? '修改' : (item.text == 2?"编辑":(record.OrderIndex==1?"取消置顶":"置顶"))}} -->
                        <!-- {{item.text == 4? (record.SourceType==1?"预览":"测试") : (item.text == 3 ? '修改' : (item.text == 2?"编辑":(record.OrderIndex==1?"取消置顶":"置顶"))) }} -->
                        {{item.text ==5? (record.SourceType==1?"":"删除") : (item.text == 4? (record.SourceType==1?"预览":"测试") : (item.text == 3 ? '修改' : (item.text == 2?"编辑":(record.OrderIndex==1?"取消置顶":"置顶"))) )}}
                        <!-- {{index+1 == option.length?"":" | "}} -->
                    </a>
                    <slot name="restPassword" :record="record"></slot>
                    <slot name="more" :record="record"></slot>
                </span>
                <template slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }" style="padding:10px">
                    <a-input
                        v-ant-ref="c => {
                            diy.searchInput = c
                        }"
                        :placeholder="`搜索产品名称`"
                        :value="selectedKeys[0]"
                        @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                        @pressEnter="() => diy.handleSearch(selectedKeys, confirm)"
                        style="width: 188px; margin-bottom: 8px; display: block;"
                    />
                    <a-button
                        type="primary"
                        @click="() => diy.handleSearch(selectedKeys, confirm)"
                        icon="search"
                        size="small"
                        style="width: 90px; margin-right: 8px">查询</a-button>
                    <a-button @click="() => diy.handleReset(clearFilters)" size="small" style="width: 90px">取消</a-button>
                </template>
                <template slot="C_Type" slot-scope="text">{{ text==0?'视频':'产品' }}</template>
                <a-icon
                    slot="filterIcon"
                    slot-scope="filtered"
                    type="search"
                    :style="{ color: filtered ? '#108ee9' : undefined }"
                />
                <div slot="WX_HeadImg" slot-scope="text" class="backgroundImg" :style="{'background-image':'url('+ text || 'http://img5.imgtn.bdimg.com/it/u=588982906,1292165941&fm=26&gp=0.jpg' +')','background-repeat':'no-repeat','background-size':'cover'}"></div>
                <span slot="Dateing" slot-scope="text,record">
                    {{ record.HS_DateBegin }} ~ {{ record.HS_DateEnd }}
                </span>
                <span slot="R_Dateing" slot-scope="text,record">
                    {{ record.R_DateBegin }} ~ {{ record.R_DateEnd }}
                </span>
                <template slot="customRender" slot-scope="text">
                    <span v-if="diy.searchText">
                        <template v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${diy.searchText})|(?=${diy.searchText})`, 'i'))">
                            <mark
                                v-if="fragment.toLowerCase() === diy.searchText.toLowerCase()"
                                :key="i"
                                class="highlight"
                                >
                                {{fragment}}
                            </mark>
                            <template v-else>{{fragment}}</template>
                        </template>
                    </span>
                    <template v-else>{{text}}</template>
                </template>
            </a-table>
        </a-locale-provider>
    </div>
</template>
<script>
import moment from 'moment';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
    props:['columns','tableData','loading','handleTableChange','bordered','scroll','pagination','option','checkd','rowSelection','onSelectChange','size','rowKey','expandAble','diy'],
    created(){
        Object.assign(this.pagination,{showQuickJumper:true,showTotal:total => `共 ${total} 条记录 第${this.pagination.current}/${Math.ceil(total/this.pagination.pageSize)}页`})
        // console.log(this.checkd);
        // console.log(this.option);
    },
    mounted(){
        for(let i=0;i<document.getElementsByClassName('ant-checkbox-wrapper').length;i++)
        {
            document.getElementsByClassName('ant-checkbox-wrapper')[i].style.width = "30px";
            document.getElementsByClassName('ant-checkbox-wrapper')[i].style.textAlign = "center";
        }
    },
    beforeUpdate(){
        for(let i=0;i<document.getElementsByClassName('ant-checkbox-wrapper').length;i++)
        {
            document.getElementsByClassName('ant-checkbox-wrapper')[i].style.width = "30px";
            document.getElementsByClassName('ant-checkbox-wrapper')[i].style.textAlign = "center";
        }
    },
    updated(){
        for(let i=0;i<document.getElementsByClassName('ant-checkbox-wrapper').length;i++)
        {
            document.getElementsByClassName('ant-checkbox-wrapper')[i].style.width = "30px";
            document.getElementsByClassName('ant-checkbox-wrapper')[i].style.textAlign = "center";
        }
    },
    methods:{
        customExpandIcon(record){
            console.log(record)
        }, 
    },
    data(){
        return {
            zhCN
        }
    },
    computed: {
        row(){
            let option = new Object;
            Object.assign(option,this.rowSelection? this.rowSelection:{})
            Object.assign(option,this.onSelectChange? this.onSelectChange:{})
            if(Object.keys(option).length == 0)
            {
                option = null;
            }
            return option;
        }
    },
}
</script>
<style lang="">
    .backgroundImg{
        width:35px;
        height:35px;
        margin: 0 auto;
    }
    .dis{
        color:#ccc;
    }
    .btn{
        margin-right: 5px;
    }
</style>