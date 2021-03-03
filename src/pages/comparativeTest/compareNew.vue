<template>
    <div class="wrap addNew">
        <a-form :form="addForm">
            <a-col :span="24">
                <a-col :span="6">
                    <a-form-item label="视频封面" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                        <a-upload
                            action="https://webservice.jshcsoft.com/upload/UpLoadFile/UploadHandler.ashx"
                            listType="picture-card"
                            :fileList="fileList"
                            @preview="handlePreview"
                            @change="handleChange"
                            v-decorator="[
                                'CT_CoverImg',
                                {
                                    rules: [{ required: (fileList.length == 0), message: '' }]
                                },
                            ]"
                        >
                            <div v-if="fileList.length < 1">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传</div>
                            </div>
                        </a-upload>
                        <span :style="{position:'absolute','min-width': '200px',color: '#c3c3c3',top: '70px','font-size': '12px',left: '120px'}">* 建议尺寸325*268px，限300K</span>
                        <a-modal :maskClosable="false" :visible="previewVisible" :footer="null" @cancel="handleCancel" :bodyStyle="{'height':'520px','width':'520px'}">
                            <div class="backImg" :style="`background-image:url(' ${ ( previewImage || require('../../assets/images/defaultPicture.png') ) } ')`"></div>
                        </a-modal>
                        <div v-if="fileList.length>0 && fileList[0].response" class="backWrap" @mouseover="()=>{this.picShows = true}" @mouseout="()=>{this.picShows = false}">
                            <div class="backImg" :style="{'background-image':('url('+ ((fileList[0].response && fileList[0].response.indexOf('http')>-1)?fileList[0].response:(require('../../assets/images/defaultPicture.png'))) +')')}"></div>
                            <div class="zz" v-show="picShows">
                                <a-icon type="eye" @click="preview(fileList[0].response)" style="color:#fff;font-size:18px;" />
                                <a-icon type="delete" @click="()=>{this.fileList = []}" style="color:#fff;font-size:18px;margin-left:10px;" />
                            </div>
                        </div>
                    </a-form-item>
                </a-col>
            </a-col>
            <a-col :span="24">
                <a-col :span="6">
                    <a-form-item label="视频标题" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                        <a-input placeholder="请输入" v-decorator="['CT_Title',{rules: [{ required: true, message: '请输入视频标题' },{ max: 20, message: '视频标题长度在20以内' }]}]"/>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="来源" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                        <a-auto-complete
                            :dataSource="sourceData"
                            style="width: 100%"
                            @change="sourceSearch"
                            placeholder="请输入，如江苏省消保委"
                            allowClear
                            v-decorator="['CT_Orign',{rules:[{ required: true, message: '请输入试验来源' },{ max: 20, message: '来源长度在20以内' }]}]"
                        />
                        <!-- <a-select
                            showSearch
                            allowClear
                            placeholder="请输入，如江苏省消保委"
                            style="width: 100%"
                            :defaultActiveFirstOption="false"
                            :showArrow="false"
                            :filterOption="false"
                            @search="sourceSearch"
                            @change="clearSearch"
                            @blur="reportBlur('blur')"
                            :notFoundContent="null"
                            v-decorator="['CT_Orign',{rules:[{ required: true, message: '请输入试验来源' },{ max: 20, message: '来源长度在20以内' }]}]"
                        >
                            <a-select-option v-for="d in sourceData" :key="d.value">{{d.text}}</a-select-option>
                        </a-select> -->
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                        <a-select placeholder="请选择状态" :options="selectData" v-decorator="['CT_State',{rules: [{ required: true, message: '请选择状态' }],initialValue:'发布'}]"></a-select>
                    </a-form-item>
                </a-col>
            </a-col>
            <a-col :span="24">
                <a-col :span="6">
                    <a-form-item label="视频上传" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                        <a-upload
                            v-decorator="[
                                'CT_VideoUrl',
                                {
                                    rules: [{ required: true, message: ' ' }]
                                },
                            ]"
                            :fileList="videoList"
                            action="https://webservice.jshcsoft.com/upload/UpLoadFile/UploadHandler.ashx"
                            list-type="text"
                            name="file"
                            accept=".mp4"
                            @change="videoHandleChange"
                        >
                            <a-button> 
                                <a-icon type="upload" /> 
                                <span>点击上传</span>
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-col>
            <a-col :span="24">
                <a-col :span="9">
                    <a-form-item label="视频简介" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                        <a-textarea
                            style="margin-left:1%;"
                            placeholder="请输入视频简介"
                            v-decorator="[
                                'CT_Content',
                                {
                                    rules: [{ required: true, message: '请输入视频简介' },{ max: 300, message: '视频简介长度在300以内' }]
                                },
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-col>
        </a-form>
        <div class="floatBottom">
            <a-button style="margin-right:10px;" type="default" @click="cancel">取消</a-button>
            <a-button type="primary" @click="release">提交</a-button>
        </div>
        <!-- 图片预览 -->
        <a-modal v-model="picShow" :maskClosable="false" :bodyStyle="{'height':'520px','width':'520px'}" :footer="null">
            <div class="backImg" :style="`background-image:url(' ${ ( imgs || require('../../assets/images/defaultPicture.png') ) } ')`"></div>
        </a-modal>
    </div>
</template>
<script>
import Bus from '../../utils/vue-bus';
export default {
    data(){
        return {
            addForm:this.$form.createForm(this,{name:'add'}),
            selectData:[
                {
                    label:'下线',
                    value:"0"
                },
                {
                    label:'发布',
                    value:"1"
                },
            ],
            picShow:false,
            imgs:'',
            picShows:false,
            detail:"",
            ID:"",
            code:"",
            fileList:[],
            videoList:[],
            previewVisible: false,
            previewImage: '',
            params:{},
            sourceData:[],
            reportSearchValue:'',
            unit:['B',"K","M","G","T"]
        }
    },
    methods:{
        preview(e){
            if(e){
                this.imgs = e;
                this.picShow = true;
            }
        },
        reportBlur(e,btn){
            if(!e && !btn && !this.reportSearchValue){
                this.addForm.setFieldsValue({'CT_Orign':undefined})
            }
            else
            {
                if(e)
                {
                    if(btn !== 'false')
                    {
                        if(this.reportSearchValue)
                        {
                            this.addForm.setFieldsValue({'CT_Orign':this.reportSearchValue})
                        }
                    }
                }
                else if(!this.addForm.getFieldValue('CT_Orign'))
                {
                    if(this.reportSearchValue)
                    {
                        this.addForm.setFieldsValue({'CT_Orign':this.reportSearchValue})
                    }
                }
            }
        },
        videoHandleChange(info){
            if(info.fileList.length == 0)
            {
                sessionStorage.setItem('videoStatus','loading')
                this.videoList = info.fileList;
            }
            else
            {
                if(info.fileList.length != 1)
                {
                    // 上传多个文件
                    this.videoList = info.fileList.slice(1,2);
                    info.fileList = info.fileList.slice(1,2);
                }
                else
                {
                    this.videoList = info.fileList;
                }
                if(info.fileList[0].name.toUpperCase().indexOf('MP4') == -1 && info.fileList[0].name.toUpperCase().indexOf('RMVB') == -1 && info.fileList[0].name.toUpperCase().indexOf('AVI') == -1 && info.fileList[0].name.indexOf('MPEG') == -1)
                {
                    this.$message.error('文件格式有误,请重新上传')
                    this.videoList = [];
                    return false;
                }
                if(info.file.status == 'done')
                {
                    sessionStorage.setItem('videoStatus','done')
                }
            }
        },
        init(){
            this.ID = this.detail.ID;
            this.code = this.detail.CT_Code;
            this.fileList = [];
            this.videoList = [];
            this.videoLength = this.detail.CT_VideoLength;
            this.addForm.setFieldsValue({"CT_Title":this.detail.CT_Title,"CT_Orign":this.detail.CT_Orign,"CT_Content":this.detail.CT_Content,"CT_JoinMan":this.detail.CT_JoinMan,"CT_JoinDate":this.detail.CT_JoinDate,"CT_CoverImg":this.detail.CT_CoverImg,"CT_VideoUrl":this.detail.CT_VideoUrl,"CT_UpdateMan":this.detail.CT_UpdateMan,"CT_DataState":this.detail.CT_DataState,"CT_UpdateDate":this.detail.CT_UpdateDate,"CT_State":this.selectData[this.detail.CT_State].label});
            this.fileList.push({uid:'-1',status:'done',name:this.COMMON.fileName(this.detail.CT_CoverImg,['png','jpg','jpeg','gif']),url:this.detail.CT_CoverImg});
            this.videoList.push({uid:'-1',status:'done',name:this.detail.CT_VideoName,url:this.detail.CT_VideoUrl});
        },
        // 查询来源
        sourceSearch(e){
            let that = this;
            if(e)
            {
                this.reportSearchValue = e;
                this.$dataApi({
                    url:'/api/CompareTest/GetOrign',
                    method:'GET',
                    data:{
                        OrignName:e
                    }
                }).then(res=>{
                    if(res.status == 200)
                    {
                        this.sourceData = res.data.map((item)=>{
                            return {
                                text:item.Origin,
                                value:item.Origin,
                            }
                        });
                    }
                })
            }
        },
        // 清除搜索
        clearSearch(e){
            if(!e)
            {
                this.params['CT_Source'] = "";
                this.params['cT_Orign'] = "";
                this.reportSearchValue = "";
            }
        },
        handleCancel() {
            this.previewVisible = false;
        },
        handlePreview(file) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true;
        },
        handleChange({ fileList }) {
            if(fileList.length>0)
            {
                if(fileList[0].type.indexOf('image') == -1)
                {
                    this.$message.error('文件格式有误')
                }
                else
                {
                    if(fileList[0].size/1024>300)
                    {
                        this.$message.error('文件过大，请重新上传！')
                    }
                    else
                    {
                        this.fileList = fileList;
                    }
                }
            }
            else
            {
                // 置空图片
                this.addForm.setFields({'CT_CoverImg':"",errors:[{message: "请选择封面",field: "CT_CoverImg"}]});
                this.fileList = fileList;
            }
        },
        normFile(e) {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        },
        cancel(){
            this.$parent.pages = "comparativeTest";
        },
        // 处理参数
        initParams(){
            this.params = {};
            Object.assign(this.params,this.addForm.getFieldsValue());
            Object.assign(this.params,{ID:this.ID,CT_Code:this.code});
            if(this.params.CT_State == '发布')
            {
                this.params.CT_State = 1;
            }
            else if(this.params.CT_State == '下线')
            {
                this.params.CT_State = 0;
            }
            if(this.params.CT_CoverImg && this.params.CT_CoverImg['file'])
            {
                this.params.CT_CoverImg = this.params.CT_CoverImg['file']['response'];
            }
            if(this.params.CT_VideoUrl && this.params.CT_VideoUrl['file'])
            {
                this.params.CT_VideoUrl = this.params.CT_VideoUrl['file']['response'];
            }
            this.params.CT_VideoName = this.videoList[0].name;
            let len;
            for(let i=0;i<5;i++)
            {
                len = this.changeSize(this.changeSize({value:this.videoList[0].size,unit:'B'}))
            }
            this.params.CT_VideoLength = this.videoList[0].size?(len.value+''+len.unit):this.videoLength;
            this.COMMON.dropObj(this.params);
        },
        changeSize:function(sizeObj){
            if(sizeObj.value>1024)
            {
                sizeObj.value = Number((sizeObj.value/1024).toFixed(2));
                sizeObj.unit = this.unit[(this.unit.indexOf(sizeObj.unit)+1)]
            }
            return sizeObj;
        },
        release(){
            // 提交
            let that = this;
            this.reportBlur(this.addForm.getFieldValue('CT_Orign'),'false');
            if(this.$data.fileList.length == 0)
            {
                that.$message.error('请上传封面图片!');
                return false;
            }
            if(that.videoList.length == 0)
            {
                that.$message.error('请上传视频！')
            }
            else
            {
                // 检验
                this.addForm.validateFields(err=>{
                    if (!err) {
                        if(sessionStorage.getItem('videoStatus') == 'done')
                        {
                            this.initParams();
                            this.$dataApi({
                                url:'/api/CompareTest/Save',
                                method:"POST",
                                data:this.params
                            }).then(res=>{
                                if(res.status == 200 && res.msg == "提交成功！")
                                {
                                    if(this.$route.params.comparative == "add")
                                    {
                                        that.$message.success('添加成功');
                                    }
                                    else if(this.$route.params.comparative == "edit")
                                    {
                                        that.$message.success('修改成功');
                                    }
                                    this.$parent.pages = "comparativeTest";
                                }
                                else
                                {
                                    if(this.$route.params.comparative == "add")
                                    {
                                        that.$message.error('添加失败');
                                    }
                                    else if(this.$route.params.comparative == "edit")
                                    {
                                        that.$message.error('修改失败');
                                    }
                                }
                            })  
                        }
                        else
                        {
                            that.$message.error('视频上传中,请稍后...')
                        }   
                    }
                })
            }
           
        }
    },
    mounted(){
        sessionStorage.setItem('videoStatus','loading')
        // 判断是新增还是编辑
        if(this.$route.params.comparative == "add")
        {
            // 新增
            Bus.$emit('menuSelect',{title:'新增',key:'601'})
        }
        else if(this.$route.params.comparative == "edit")
        {
            // 编辑
            Bus.$emit('menuSelect',{title:'编辑',key:'602'})
            this.detail = this.$route.params.comparativeData;
            this.init();
            sessionStorage.setItem('videoStatus','done')
        }
    }
}
</script>
<style lang="scss" scoped>
    .wrap{
        width:100%;
        height:100%;
        background:#fff;
        border-radius:5px;
        padding: 20px;
        &.addNew {
            .ant-form-item-label{
                width:80px;
            }
            label{
                display: inline-block;
                text-align:left;
                width: 100%;
            }
            .floatBottom{
                width: calc(100% - 265px);
                height: 50px;
                box-shadow: 1px 2px 9px 2px rgba(125,125,125,1);
                background: #fff;
                position: fixed;
                left: 260px;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 0 20px;
            }
            /deep/ .ant-form-item-children{
                position:initial;
            }
        }
    }
    .backWrap{
        width: 115px;
        height: 115px;
        padding: 5px;
        border: 1px solid #D9D9D9;
        border-radius: 3px;
        float: left;
        margin-right: 10px;
        position: relative;
        left: -115px;
        z-index: 99;
        background:#fff;
        .zz{
            position: absolute;
            top: 0;
            bottom: 0;
            left:0;
            right: 0;
            margin:auto;
            background:rgba(0,0,0,0.4);
            display: flex;
            justify-content: center;
            transition:all 400ms linear;
            align-items: center;
        }
    }
    .backImg{
        display: block;
        background-repeat:no-repeat;
        background-size: cover;
        width:100%;
        height:100%;
        border-radius:2px;
        background-position: center;
    }
</style>