<template>
    <div class="wrap">
        <div class="left">
            <a-col :span="24" style="margin-bottom:20px;">
                <a-row type="flex" justify="start">
                    <a-form :form="filterForm" style="width:100%;">
                        <a-col :span="7">
                            <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                                <a-input placeholder="请输入用户名查询" style="width: 200px" v-decorator="['UserName']"/>
                            </a-form-item>
                            <!-- <a-form-item  label="来源" :colon="false"  :label-col="{ span:2 }" :wrapper-col="{ span: 12 }">
                                <a-select v-decorator="['Source',{initialValue:''}]" style="width: 300px">
                                    <a-select-option value="">全部</a-select-option>
                                    <a-select-option value="0">省私个协会</a-select-option>
                                    <a-select-option value="1">招标宝典</a-select-option>
                                    <a-select-option value="2">小程序</a-select-option>
                                </a-select>
                            </a-form-item> -->
                        </a-col>
                        
                        <a-col :span="4">
                            <a-form-item label="" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                                <a-button type="primary" @click="filterSelect()">查询</a-button>
                            </a-form-item>
                        </a-col>
                    </a-form>
                </a-row>
                <a-row>
                <a-col :span="4">
                    <a-button type="primary" @click="addUsers">新增</a-button>
                </a-col>
                </a-row>
            </a-col>
            <a-col :span="24">
                <tables :rowKey="rowKey" :columns="columns" :tableData="tableData" size="middle"  :loading="loading" :handleTableChange="handleTableChange" :bordered="bordered" :pagination="paginations" :option="option">
                    <template slot="restPassword" slot-scope="record">
                        <a-popconfirm
                            title="确定将该用户密码重置为初始密码njhcsoft.997吗?"
                            @confirm="confirm(record)"
                            @cancel="cancel"
                            okText="确定"
                            cancelText="取消"
                        >
                            <a href="#">重置密码</a>
                        </a-popconfirm>
                    </template>
                </tables>
            </a-col>
        </div>
      <!--  <div class="right">
            <p style="height:30px;">权限设置</p>
            <a-tree 
                style="height:calc(100% - 80px);"
                checkable
                :defaultExpandAll="true"
                @expand="onExpand"
                @check="onSelect"
                :treeData="treeData"
                v-model="checkedKeys"
            />
            <div style="height:30px;text-align:center">
                <a-button type="primary" style="margin-right:20px;" @click="saveAuth">保存</a-button>
                <a-button type="default" @click="resetTree">恢复</a-button>
            </div>
        </div> -->
        <a-modal :maskClosable="false" v-model="addVisible" @ok="addOk" okText="确定" cancelText="取消">
            <template slot="title">
                <span style="font-size: 14px;color: #666666;font-weight: 700;">新增</span>
                <span style="margin-left:5px;font-size: 12px;color: #797979;">用户管理</span>
            </template>
            <a-form :form="addForm">
                <a-form-item label="登录名" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-input placeholder="请输入，同时包括英文及数字，区分大小写" v-decorator="['LoginName', { rules: [{ required: true, message: '请输入登录名' },{max:20,message:'登录名字数长度在20以内'},{min:6,message:'登录名字数长度在6以上'},{pattern:/^(?=.*[0-9])(?=.*[a-zA-Z])(.{0,})$/,message:'格式有误,同时包括英文及数字,区分大小写'}] }]"/>
                </a-form-item>
                <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-input placeholder="请输入真实姓名" v-decorator="['UserName', { rules: [{ required: true, message: '请输入用户名' },{ max: 100, message: '用户名字数长度在100以内' }] }]"/>
                </a-form-item>
				<!-- <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
				    <a-input placeholder="请输入密码" v-decorator="['PassWord', { rules: [{ required: true, message: '请输入密码' },{ min: 6, message: '密码长度不小于6' }] }]"/>
				</a-form-item> -->
      <!--          <a-form-item label=" " :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <p>Tip:用户初始密码为a123456</p>
                </a-form-item> -->
            </a-form>
        </a-modal>
        <a-modal :maskClosable="false" v-model="editVisible" @ok="editOk" okText="确定" cancelText="取消">
            <template slot="title">
                <span style="font-size: 14px;color: #666666;font-weight: 700;">编辑</span>
                <span style="margin-left:5px;font-size: 12px;color: #797979;">用户管理</span>
            </template>
            <a-form :form="editForm">
                <a-form-item label="" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input hidden v-decorator="['Id']"/>
                </a-form-item>
                <a-form-item label="登录名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input placeholder="请输入，同时包括英文及数字，区分大小写" disabled v-decorator="['LoginName', { rules: [{ required: true, message: '请输入登录名' },{ min: 6, message: '登录名字数长度在6以上' },{ max: 20, message: '登录名字数长度在20以内' }] }]"/>
                </a-form-item>
                <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                    <a-input placeholder="请输入真实姓名" v-decorator="['UserName',{ rules: [{ required: true, message: '请输入用户名' },{ max: 100, message: '用户名字数长度在100以内' }] }]"/>
                </a-form-item>
				<!-- <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
				    <a-input placeholder="请输入密码" v-decorator="['PassWord', { rules: [{ required: true, message: '请输入密码' },{ min: 6, message: '密码长度不小于6' }] }]"/>
				</a-form-item> -->
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import tables from '@/pages/common/table'
	import Bus from '../../utils/vue-bus.js';
export default {
    data(){
        return {
            rowKey:record => {record.Id},
            addVisible:false,
            editVisible:false,
            addForm:this.$form.createForm(this,{name:'add'}),
            editForm:this.$form.createForm(this,{name:'edit'}),
            filterForm:this.$form.createForm(this,{name:'filter'}),
            columns:[],
            tableData:[],
            loading:false,
            bordered:true,
            // rowSelection.selectedRowKeys
            rowSelection:{
                type:'radio',
                onChange:this.changeRow,
                selectedRowKeys:[0]
            },
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
            params:{
                pageSize:10,
            },
            option:[
                {
                    type:"edit",
                    name:"编辑",
                    fn:(e)=>{
                        this.edit(e);
                    }
                },
                {
                    type:"delete",
                    name:"删除",
                    fn:(e)=>{
                        this.delete(e);
                    }
                },
				{
				    type:"resetPass",
				    name:"重置密码",
				    fn:(e)=>{
				        this.resetPass(e);
				    }
				},
              
            ],
            treeData:[],
            selectList:'[]',
            checkedKeys:[],
            code:'',
            selectRow:[],
        }
    },
    components:{
        tables
    },    
    methods:{
        // 表格事件
        handleTableChange(pagination,filter,sort){
            let that = this;
            const pager = Object.assign(this.paginations);
            pager.current = pagination.current;
            this.paginations = pager;
            this.params['pageNo'] = this.paginations['current'];
            this.checkedKeys = [];
            this.getUserList('false');
        },
        // 重置密码
        resetPass(){
             console.log("重置密码")
        },
        // 编辑
        edit(e){
            let that = this;
            this.editVisible = true;
            // 等待模态框加载出来再设置
            setTimeout(function(){
                that.editForm.setFieldsValue({'Id':e.Id})
                that.editForm.setFieldsValue({'LoginName':e.LoginName})
                that.editForm.setFieldsValue({'UserName':e.UserName})
            },0)
        },
        // 删除
        delete(e){
            let that = this;
            this.$confirm({
                title: '删除确认',
                content: '删除后，此用户将无法进行相关权限内容操作，您确定要删除吗？',
                okText:"确定",
                cancelText:"取消",
                onOk() {
                    that.$dataApi({
                        url:'api/Employee/DeleteEmployee',
                        method:'POST',
                        data:{
                            Id:e.Id
                        }
                    }).then(res=>{
                        if(res.Status == 200)
                        {
                            that.$message.success('删除成功')
                            that.getUserList()
                        }
                        else
                        {
                            that.$message.error(res.msg)
                        }
                    })
                },
                onCancel() {
                    
                },
            });
        },
        // 改变行选中
        changeRow(selectedRowKeys, selectedRows){
            let that = this;
            this.code = selectedRows[0].Id;
            this.rowSelection.selectedRowKeys = selectedRowKeys;
            this.selectRow = selectedRowKeys;
            this.$dataApi({
                url:'/api/Sys_Users/GetUserMenuList',
                method:'GET',
                data:{
                    Id:selectedRows[0].Id
                }
            }).then(res=>{
                let arr = res.data.rows.map((itemOne)=>{
                    if(itemOne['Children'] && Array.isArray(itemOne['Children']))
                    {
                        if(itemOne['Children'].length != 0)
                        {
                            return itemOne['Children'].map((itemTwo)=>{
                                return itemTwo;
                            })
                        }
                        else
                        {
                            return itemOne;
                        }
                    }
                })
                that.checkedKeys = this.COMMON.reduceArray(arr).map((item)=>{return item.SM_Code});
                that.selectList = JSON.stringify(that.checkedKeys.map((item)=>{return Number(item)}));
            })
        },
        // 新增
        addUsers(){
            this.addVisible = true;
            let that = this;
            setTimeout(function(){
                that.addForm.resetFields()
            },0)
        },
        // 查询
        filterSelect(){
            this.getUserList();
        },
        // 树形展开
        onExpand(){
            // 暂时不用
        },
        // 树形选中
        onSelect(selectedKeys, e){
            this.selectList = JSON.stringify(selectedKeys.map((item)=>{return Number(item)}));
        },
        // 树形结构迭代
        reduce(arr){
            return arr.map((item)=>{
                return {
                    title:item['SM_Name'],
                    key:item['SM_Code'],
                    keys:item['SM_PCode'],
                    children:this.reduce(item['Children'])
                }
            })
        },
        // 保存权限
        saveAuth(){
            let that = this;
            this.$dataApi({
                url:'/api/Sys_Users/SavaMenu',
                method:'POST',
                data:{
                    Id:this.code,
                    MenuCodeList:this.selectList
                }
            }).then(res=>{
                if(res.status == 200)
                {
                    that.$message.success('修改成功')
                    that.$dataApi({
                        url:"/api/Sys_Users/GetUserMenuList",
                        method:"GET",
                        data:{
                            Id:that.code
                        }
                    }).then(res=>{
                        let arr = res.data.rows.map((itemOne)=>{
                            if(itemOne['Children'] && Array.isArray(itemOne['Children']))
                            {
                                if(itemOne['Children'].length != 0)
                                {
                                    return itemOne['Children'].map((itemTwo)=>{
                                        return itemTwo;
                                    })
                                }
                                else
                                {
                                    return itemOne;
                                }
                            }
                        })
                        that.checkedKeys = this.COMMON.reduceArray(arr).map((item)=>{return item.SM_Code});
                        that.selectList = JSON.stringify(that.checkedKeys.map((item)=>{return Number(item)}));
                    })
                }
                else
                {
                    that.$message.error(res.msg)
                }
            })
        },
        // 新增确定
        addOk(){
            let that = this;
            this.addForm.validateFields(err => {
                if (!err) {
                    this.$dataApi({
                        url:'api/Employee/SaveEmployee',
                        method:'POST',
                        data:this.addForm.getFieldsValue()
                    }).then(res=>{
                        if(res.Status == 200)
                        {
                            that.$message.success('添加成功')
                            that.addForm.setFieldsValue({'LoginName':""})
                            that.addForm.setFieldsValue({'UserName':""})
                            that.addVisible = false;
                            that.getUserList();
                        }
                        else
                        {
                            that.$message.error(res.Msg)
                        }
                    })
                }
            })
        },
        // 修改确定
        editOk(){
            let that = this;
            this.editForm.validateFields(err => {
                if (!err) {
                    this.$dataApi({
                        url:'api/Employee/UpdateEmployee',
                        method:'POST',
                        data:this.editForm.getFieldsValue()
                    }).then(res=>{
                        if(res.Status == 200)
                        {
                            that.$message.success('修改成功')
                            that.editForm.setFieldsValue({'LoginName':""})
                            that.editForm.setFieldsValue({'UserName':""})
                            that.editVisible = false;
                            that.getUserList();
                        }
                        else
                        {
                            that.$message.error(res.Msg)
                        }
                    })
                }
            })
        },
        // 恢复树形修改
        resetTree(){
            let that = this;
            this.$dataApi({
                url:"/api/Sys_Users/GetUserMenuList",
                method:"GET",
                data:{
                    Id:this.code
                }
            }).then(res=>{
                let arr = res.data.rows.map((itemOne)=>{
                    if(itemOne['Children'] && Array.isArray(itemOne['Children']))
                    {
                        if(itemOne['Children'].length != 0)
                        {
                            return itemOne['Children'].map((itemTwo)=>{
                                return itemTwo;
                            })
                        }
                        else
                        {
                            return itemOne;
                        }
                    }
                })
                that.checkedKeys = this.COMMON.reduceArray(arr).map((item)=>{return item.SM_Code});
                that.selectList = JSON.stringify(that.checkedKeys.map((item)=>{return Number(item)}));
            })
        },
		
		datesort:function(x,y){
			return x.JoinDate < y.JoinDate ? 1 : -1;
		},
		
        // 请求用户列表
        getUserList(e){
            // console.log(e);
            // let source = null;
            // this.filterForm.validateFields((error, value) => {
			// 	if (!error) {
			// 		// console.log(value);
			// 		source = value.Source === "" ? "" : Number(value.fenlei)
			// 	}
			// });
            Object.assign(this.params,this.filterForm.getFieldsValue());
            // console.log(source);
            if(!e){
                this.params.pageNo = 1;
                // this.params.Source = source;
                this.paginations.current = 1;
            }
            this.COMMON.dropObj(this.params)
            let that = this;
            this.$dataApi({
                url:'api/Employee/GetEmployeeData',
                method:"GET",
                data:this.params,
            }).then(res=>{
            if(res.Status == 200)
                {
					JSON.parse(res.Data).Rows.sort(this.datesort)
					// console.log(JSON.parse(res.Data).Rows)
                    that.tableData = JSON.parse(res.Data).Rows;
                    that.paginations.total =JSON.parse(res.Data).TotalCount;
                    // // 重新赋予选中
                    // setTimeout(function(){
                    //     that.$dataApi({
                    //         url:'/api/Sys_Users/GetUserMenuList',
                    //         method:'GET',
                    //         data:{
                    //             Id:res.data.rows[0].Id
                    //         }
                    //     }).then(resCode=>{
                    //         let arr = resCode.data.rows.map((itemOne)=>{
                    //             if(itemOne['Children'] && Array.isArray(itemOne['Children']))
                    //             {
                    //                 if(itemOne['Children'].length != 0)
                    //                 {
                    //                     return itemOne['Children'].map((itemTwo)=>{
                    //                         return itemTwo;
                    //                     })
                    //                 }
                    //                 else
                    //                 {
                    //                     return itemOne;
                    //                 }
                    //             }
                    //         })
                    //         that.checkedKeys = that.COMMON.reduceArray(arr).map((item)=>{return item.SM_Code});
                    //         that.selectList = JSON.stringify(that.checkedKeys.map((item)=>{return Number(item)}));
                    //     })
                    // },100)
                } 
            })
        },
        // 重置确定
        confirm(record){
            let that = this;
            this.$dataApi({
                url:'/api/Employee/ResetPassword',
                method:'POST',
                data:{
                    id:record.record.Id
                }
            }).then(res=>{
                if(res.Status == 200)
                {
                    that.$message.success('重置成功');
                    that.getUserList();
                }
                else
                {
                    that.$message.error(res.msg);
                }
            })
        },
        // 重置取消
        cancel(){},
    },
    created(){
        let that = this;
        this.columns = [
            {
                title: '登录名',
                dataIndex: 'LoginName',
            },
            {
                title: '用户名',
                dataIndex: 'UserName',
            },
            {
                title: '创建时间',
                dataIndex: 'JoinDate',
            },
            {
                title: '操作',
                dataIndex: 'option',
                scopedSlots: { customRender: 'option' },
            },
        ];
        this.getUserList();

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
        padding:30px;
        .left{
            float:left;
            // width:calc(70% - 30px);
			width: 100%;
            height:100%;
            border:1px solid #E4E4E4;
            border-radius:4px;
            padding:20px;
        }
        .right{
            float:right;
            width:30%;
            height:100%;
            border:1px  solid #E4E4E4;
            border-radius:4px;
            padding:20px;
        }
    }
</style>