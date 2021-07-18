<template>
    <div class="box">
        <!-- 选项卡 -->
        <div class="tab">
            <span>公告类型</span>
        </div>

        <a-button @click="add" class="addBtn" type="primary" >新增</a-button>

        <!-- 主体  -->
        <div class="main">
            <div class="biddingBox ">
                <p class="p_title">招标公告</p>
                <div class="outer-container">
                    <!-- <div class="inner-containe">
                        <div class="listBox" v-for="(item,index) in biddingData" :key="index">
                            <span>{{index}}</span>
                            <span>{{item.Title}}</span>
                            <span @click="delItem(item)">删除</span>
                        </div>
                    </div> -->
                    <div
                        v-infinite-scroll="handleInfiniteOnLoad"
                        class="demo-infinite-container"
                        :infinite-scroll-disabled="busy"
                        :infinite-scroll-distance="10"
                    >
                        <a-list :data-source="biddingData">
                            
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-list-item-meta >
                                    <a slot="title" class="numIndex">{{index+1 &nbsp&nbsp&nbsp&nbsp&nbsp}}. </a> 
                                    <a slot="title">{{ item.Title }}</a>
                                </a-list-item-meta>
                                <div class="delItem" @click="delItem(item)">删除</div>
                            </a-list-item>
                            <!-- <div v-if="loading && !busy" class="demo-loading-container">
                                <a-spin />
                            </div> -->
                        </a-list>
                    </div> 
                </div>
            </div>

            <div class="changeBox">
                <p class="p_title">变更公告</p>
                <div class="outer-container">
                    <!-- <div class="inner-containe"></div> -->
                    <div
                        v-infinite-scroll="handleInfiniteOnLoadT"
                        class="demo-infinite-container"
                        :infinite-scroll-disabled="busy"
                        :infinite-scroll-distance="10"
                    >
                        <a-list :data-source="changeData">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-list-item-meta >
                                    <a slot="title" class="numIndex">{{index+1 &nbsp&nbsp&nbsp&nbsp&nbsp}}. </a> 
                                    <a slot="title">{{ item.Title }}</a>
                                </a-list-item-meta>
                                <div class="delItem" @click="delItem(item)">删除</div>
                            </a-list-item>
                        </a-list>
                    </div> 
                </div>
            </div>

            <div class="resultBox">
                <p class="p_title">结果公告</p>
                <div class="outer-container">
                    <!-- <div class="inner-containe"></div> -->
                    <div
                        v-infinite-scroll="handleInfiniteOnLoadO"
                        class="demo-infinite-container"
                        :infinite-scroll-disabled="busy"
                        :infinite-scroll-distance="10"
                    >
                        <a-list :data-source="resultData">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-list-item-meta >
                                    <a slot="title" class="numIndex">{{index+1 &nbsp&nbsp&nbsp&nbsp&nbsp}}. </a> 
                                    <a slot="title">{{ item.Title }}</a>
                                </a-list-item-meta>
                                <div class="delItem" @click="delItem(item)">删除</div>
                            </a-list-item>
                        </a-list>
                    </div> 
                </div>
            </div>
        </div>

        <!-- 新增弹框 -->
        <a-modal width="500px" title="新增" :maskClosable="false" v-model="addBox"  footer="" cancelText="关闭">
            <a-input @keyup="noticeName=noticeName.replace(/\s+/g,'')" placeholder="请输入公告名称" v-model="noticeName" />            
            <a-form-item label="">
                <a-select default-value="all" @change="dataSouTypeFun">
                    <a-select-option value="all">
                        招标公告
                    </a-select-option>
                    <a-select-option value="isTrue">
                        变更公告
                    </a-select-option>
                    <a-select-option value="isFalse">
                        结果公告
                    </a-select-option>
                </a-select>
            </a-form-item>     
            <div class="btnbox">
                <a-button @click="cancelModify">取消</a-button>
                <a-button @click="confirmModify" type="primary">确定</a-button>
            </div>
		</a-modal>
    </div>
</template>

<script>
import reqwest from 'reqwest';
import infiniteScroll from 'vue-infinite-scroll';

export default {
    directives: { infiniteScroll },
    
    data(){
        return {
            addBox:false,  //新增弹框是否展示
            noticeName:'', //新增公告名称
            noticeType:1, //新增公告类型
            biddingData:[], //招标公告数据
            biddingPageSize:1,  //招标公告页码
            biddingLength:-1, //招标公告总长度
            biddingAdd:true,  //新增

            changeData:[], //变更公告数据
            biddingPageSizeT:1,  //招标公告页码
            biddingLengthT:-1, //招标公告总长度
            biddingAddT:true,  //新增

            resultData:[], //结果公告数据
            biddingPageSizeO:1,  //招标公告页码
            biddingLengthO:-1, //招标公告总长度
            biddingAddO:true,  //新增

            data: [],
            // loading: false,
            busy: false,
        }
    },
    methods:{
        //滚动-招标
        handleInfiniteOnLoad() {
            const data = this.data;
            // this.loading = true;
            if (this.biddingData.length > this.biddingLength) {
                this.busy = true;
                // this.loading = false;
                return;
            }
            this.biddingPageSize = this.biddingPageSize +1;
            this.getData(this.biddingPageSize);
        },

        //滚动-变更
        handleInfiniteOnLoadT() {
            // const data = this.data;
            // this.loading = true;
            if (this.changeData.length > this.biddingLTengthT) {
                this.busy = true;
                // this.loading = false;
                return;
            }
            this.biddingPageSizeT = this.biddingPageSizeT +1;
            this.getDataT(this.biddingPageSizeT);
        },

        //滚动-结果
        handleInfiniteOnLoadO() {
            if (this.resultData.length > this.biddingLengthO) {
                this.busy = true;
                // this.loading = false;
                return;
            }
            this.biddingPageSizeO = this.biddingPageSizeO +1;
            this.getDataO(this.biddingPageSizeO);
        },

        //删除
        delItem(e){
            // console.log(e);
            let that = this;
            this.$dataApi({
                url:'api/BaseData/DelBaseDataConfig',
                method:'POST',
                data:{
                    Id:e.Id,
                }
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    this.$message.success('删除成功');
                    if(e.BaseDataConfigType == 1){
                        that.biddingAdd = false;
                        that.getData(1);
                    }else if(e.BaseDataConfigType == 2){
                        that.biddingAddT = false;
                        that.getDataT(1);
                    }else{
                        that.biddingAddO = false;
                        that.getDataO(1);
                    }
                    
                }
            });
        },

        //类型下拉
        dataSouTypeFun(value){
            // console.log(value);
            if(value == 'all'){
                this.noticeType = 1;
            }else if(value == 'isTrue'){
                this.noticeType = 2;
            }else{
                this.noticeType = 3;
            };
            // console.log(this.noticeType);
            
        },

        //新增
        add(){
            this.noticeName = '';
            // this.noticeType = '';
            this.addBox = true;
        },

        //确定新增
        confirmModify(){
            let that = this;
            // console.log(this.noticeName);
            // console.log(this.noticeName.length);
            // console.log(this.noticeType);
            if(this.noticeName == ''){
                this.$message.warning('请输入公告名称');
                return false;
            };
            this.$dataApi({
                url:'api/BaseData/EditBaseDataConfig',
                method:'POST',
                data:{
                    Id:'',
                    BaseDataConfigType:that.noticeType,
                    TitleNum:that.noticeName.length,
                    Title:that.noticeName
                }
            }).then(res=>{
                // console.log(res);
                if(res.Status == 200){
                    if(res.Msg == 'success'){
                        this.$message.success('新增成功');
                    }else{
                        this.$message.warning(res.Msg);
                    };
                    
                    if(that.noticeType == 1){
                        that.biddingAdd = false;
                        that.getData(1);
                    }else if(that.noticeType == 2){
                        that.biddingAddT = false;
                        this.getDataT(1);
                    }else{
                        that.biddingAddO = false;
                        this.getDataO(1);
                    };
                    this.addBox = false;
                }
            });
        },

        //取消新增
        cancelModify(){
            this.addBox = false;
        },


        //获取招标公告数据
        getData(i){
            let that = this;
            this.$dataApi({
                url:'api/BaseData/GetPageBaseDataConfig',
                method:'POST',
                data:{
                    PageNum:i,
                    PageSize:20,
                    BaseDataConfigType:1
                }
            }).then(res=>{
                // console.log(JSON.parse(res.Data));
                that.biddingLength = JSON.parse(res.Data).TotalCount;
                if(that.biddingAdd){
                    that.biddingData =that.biddingData.concat(JSON.parse(res.Data).Rows);
                }else{
                    that.biddingData =JSON.parse(res.Data).Rows;
                    that.biddingAdd = true;
                }
            });

        },

        //获取变更公告数据
        getDataT(i){
            let that = this;
            this.$dataApi({
                url:'api/BaseData/GetPageBaseDataConfig',
                method:'POST',
                data:{
                    PageNum:i,
                    PageSize:20,
                    BaseDataConfigType:2
                }
            }).then(res=>{
                // console.log(JSON.parse(res.Data));
                that.biddingLengthT = JSON.parse(res.Data).TotalCount;
                if(that.biddingAddT){
                    that.changeData =that.changeData.concat(JSON.parse(res.Data).Rows);
                }else{
                    that.changeData =JSON.parse(res.Data).Rows;
                    that.biddingAddT = true;
                }
            });

        },

        //获取结果公告数据
        getDataO(i){
            let that = this;
            this.$dataApi({
                url:'api/BaseData/GetPageBaseDataConfig',
                method:'POST',
                data:{
                    PageNum:i,
                    PageSize:20,
                    BaseDataConfigType:3
                }
            }).then(res=>{
                // console.log(JSON.parse(res.Data));
                that.biddingLengthO = JSON.parse(res.Data).TotalCount;
                if(that.biddingAddO){
                    that.resultData =that.resultData.concat(JSON.parse(res.Data).Rows);
                }else{
                    that.resultData =JSON.parse(res.Data).Rows;
                    that.biddingAddO = true;
                }
            });
        },


    },
    created(){
        this.getData(1);//获取招标数据
        this.getDataT(1);//获取变更数据
        this.getDataO(1);//获取结果数据
    },
	
}
</script>
<style lang="scss" scoped>
    .box{
        background: #fff;
        padding: 20px;
    }
    .tab{
        width: 100%;
        height: 42px;
        display: flex;
        border: 1px solid rgb(230, 226, 226);
    }
    .tab>span{
        width: 150px;
        height: 40px;
        background: #1890FF;
        text-align: center;
        line-height: 40px;
        color: #fff;
        // border-radius: 10px;
    }
    .addBtn{
        margin-top: 20px;
    }
    .main{
        display: flex;
        width: 100%;
        margin-top: 30px;
    }
    .main>div{
        width: 33%;
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-right: 10px;
        height: 600px;
        overflow-y: auto;
        border-radius: 10px;
    }
    .p_title{
        font-size: 24px;
    }
    .dataSouInp{
        margin-top: 30px;
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
    .outer-container{
        width: 100%;
        height: 600px;
        position: relative;
        overflow: hidden;
        border: 1px solid rgb(231, 225, 225);
        border-radius: 10px;
    }
    .inner-containe{
        position: absolute;
        left: 0;
        top: 0;
        right: -17px;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: scroll;
        // margin-top:50px;
    }
    .listBox{
        display: flex;
        align-items: center;
        // justify-content: space-around;
        padding-left: 20px;
        height: 52px;
        // background: pink;
        position: relative;
    }
    .listBox>span:nth-of-type(1){
        margin-right: 20px;
    }
    .listBox>span:nth-of-type(3){
        position: absolute;
        right: 30px;
        color: #1890FF;
        cursor: pointer;
    }
    .delItem{
        color: #1890FF
    }
    .ant-form-item{
        margin-top: 20px;
        display: flex;
    }
    .demo-infinite-container {
        border: 1px solid #eee8e8;
        border-radius: 4px;
        overflow: auto;
        padding: 8px 24px;
        height: 550px;
    }
    .demo-loading-container {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
    }
    .numIndex{
        color:#000;
    }
</style>