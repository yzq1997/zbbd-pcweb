<template>
  <div :style="{position:'relative'}">
    <a-locale-provider :locale="zh_CN">
      <a-table
        :columns="columns"
        :rowKey="record => record.ID"
        :dataSource="data"
        :pagination="paginationShow ? pagination : false"
        :loading="loading"
        @change="handleTableChange"
        :customRow="onCustomRow"
        :rowClassName="setRowClassName"
        :rowSelection="rowSelectionOpen!=null?{selectedRowKeys: selectedRowKeys, onChange: onSelectRowChange}:null"
        bordered
        :size="size"
        :scroll="{ x: scrollx }"
       
      >
       
        <div v-show="showheader">
          <template slot="title" slot-scope="text, record">
            <slot name="header" :record="record"></slot>
          </template>
        </div>
        <div v-show="showfooter">
          <template slot="footer" slot-scope="text, record">
            <slot name="footer" :record="record"></slot>
          </template>
        </div>
        <template slot="Code" slot-scope="text, record">
          <slot name="code" :record="record"></slot>
        </template>
        <template slot="image" slot-scope="text, record">
          <slot name="image" :record="record"></slot>
        </template>
       
        
        <span slot="customTitle">
          优先级
          <a-tooltip>
            <template slot="title">优先级1~99，数值越小越优先。</template>
            <a-icon type="question-circle" />
          </a-tooltip>
        </span>

        <template slot="action" slot-scope="text, record">
          <slot name="action" :record="record"></slot>
        </template>
      </a-table>
    </a-locale-provider>
    <span v-if="paginationShow">
      <span
        v-show="pagination.total>0"
        :style="{position:'relative',bottom:'40px',left:0}"
      >共 {{pagination.total||0}} 条记录 第 {{pagination.current||1}} / {{this.getallpages}} 页</span>
    </span>
  </div>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: false
    },
    pagination: {
      type: Object,
      required: false
    },
    paginationShow: {
      type: Boolean,
      required: false,
      default: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    showheader: {
      type: Boolean,
      required: false,
      default: false
    },
    showfooter: {
      type: Boolean,
      required: false,
      default: false
    },
    func: {
      type: Function,
      required: false
    },
    scrollx: {
      required: false,
      default: 800
    },
    size: {
      required: false,
      default: "middle"
    },
    rowSelectionOpen: {
      required: false,
      default: null
    },
    rowSelectionChange: {
      required: false,
      type: Function,
      default: null
    }
  },
  data() {
    return {
      zh_CN,
      rowId: "",
      rowhoverId: "",
      selectedRowKeys: [] // Check here to configure the default column
    };
  },
  methods: {
    // 选中行
    onCustomRow(record) {
      return {
        on: {
          // 事件
          click: () => {
            this.rowId = record.ID;
          }, // 点击行
          mouseenter: () => {
            this.rowhoverId = record.ID;
          }, // 鼠标移入行
          mouseover: () => {
            this.rowhoverId = record.ID;
          }, // 鼠标浮在行
          mouseout: () => {
            this.rowhoverId = "";
          } // 鼠标移除行
        }
      };
    },
    //设置行的颜色
    setRowClassName(record) {
      return record.ID === this.rowId || record.ID === this.rowhoverId
        ? "clickRowStyl"
        : "";
    },
    //分页方法
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination;
      // console.log("pagination", pagination);
      //   pager.current = pagination.current;
      //   this.pagination = pager;
      let data = [
        {
          pagination: pager
        },
        {
          pageSize: pager.pageSize,
          pageNo: pager.current,
          sortField: sorter == null ? "" : sorter.field,
          sortOrder: sorter == null ? "" : sorter.order == "descend" ? 1 : 0,
          ...filters
        }
      ];
      this.$emit("onTableChange", data);
      // console.log("this.$parent", this.$parent);
    },
    onSelectRowChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      if (this.rowSelectionChange)
        this.rowSelectionChange(selectedRowKeys, selectedRows);
    }
  },
  components: {},
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          if (this.rowSelectionChange)
            this.rowSelectionChange(selectedRowKeys, selectedRows);
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name
          }
        })
      };
    }, //获取总页数
    getallpages() {
      this.selectedRowKeys = [];
      if (this.paginationShow) {
        let allPage = 0;
        let count = this.pagination.total || 0;
        let size = this.pagination.pageSize || 10;
        if (count % size !== 0) {
          let num = count - (count % size);
          allPage = num / size + 1;
        } else {
          allPage = count / size;
        }
        return allPage;
      }
    }
  }
};
</script>

<!--// 被选中的表格行的样式-->
<style >
.clickRowStyl {
  background-color: #e6f7ff;
}
</style>
