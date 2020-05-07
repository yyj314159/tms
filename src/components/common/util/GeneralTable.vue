<!--
@author Dy
@createDate 2017/9/11 15:40
@description  单行数据通用表格
使用:
- 引入组件,初始化表格实例对象.gridInstance,声明ref引用属性对象
- showPagingTool属性用于显示分页工具栏,默认true,
- 选择事件 selectChange
- 参数获取
- 分页组件的页数和条数 this.$refs.generalGrid.currentPage ,this.$refs.generalGrid.pageSize
- 分页组件的选中数据 this.$refs.generalGrid.selections
-->
<template>
    <div class="generalGrid">
        <div>
            <el-table
                class="content-table"
                size="small"
                v-loading.body="loading"
                element-loading-text="加载中"
                ref="currentGrid"
                :height="height"
                width="100%"
                :data="list"
                border
                fit
                highlight-current-row
                :show-summary="isSummary"
                :summary-method="summaryMethod"
                empty-text=" "
                @selection-change="handleSelectionChange"
                @select="selectCheckbox"
                @row-click="rowChecked"
                @cell-click="handleCellClick"
                :row-class-name="tableRowClassName"
                @row-dblclick="handleRowHandle">

                <el-table-column type="selection" v-if="showCheckBox" min-width="35" width="35" fixed/>
                <el-table-column type="index" label="索引" v-if="showIndex" min-width="65" width="65" fixed>
                    <template slot-scope="scope">
                        {{ scope.$index + addIndex }}
                    </template>
                </el-table-column>
                <template v-for="(column) in columnInit">
                    <el-table-column v-if="column.hide === false  && (!column.permission  || permissionInit(column.permission)===true) && (column.type ==='html5'|| column.type ==='img')"
                                     show-overflow-tooltip
                                     resizable
                                     :prop="column.key"
                                     :label="column.title"
                                     :width="column.width"
                                     :min-width="column.minWidth"
                                     :align="column.align"
                                     :sortable="column.sortable"
                                     :formatter="column.render"
                                     :fixed="column.fixed"
                                     :key="column.key"
                                     :header-align="column.headerAlign">
                        <template slot-scope="scope">
                            <div v-if="column.type ==='html5'">
                                <span v-if="column.render"
                                      v-html="scope.column.formatter(scope.row,scope.column)"></span>
                                <span v-else v-html="scope.row[column.key]"/>
                            </div>
                            <div v-else-if="column.type ==='img'">
                                <img :src="scope.row[column.key]" style="width: 60px;height: 60px;"/>
                            </div>-->
                        </template>
                    </el-table-column>
                    <el-table-column  v-else-if = "column.hide === false  && (!column.permission  || permissionInit(column.permission)===true) && column.type === 'btn-opr' && column.groups"
                                      show-overflow-tooltip
                                      resizable
                                      :prop="column.key"
                                      :label="column.title"
                                      :width="column.width"
                                      :min-width="column.minWidth"
                                      align="center"
                                      :sortable="column.sortable"
                                      :formatter="column.render"
                                      :fixed="column.fixed"
                                      :key="column.key"
                                      :header-align="column.headerAlign">
                        <template slot-scope="scope">
                            <el-button  v-for="btn in column.groups" :key="btn.id" type="text"
                                        :icon="btn.icon"
                                        size="mini"
                                        v-permission="btn.permission"
                                        :disabled="detailDisabled"
                                        @click="rowButtonClick(btn.id, scope.row,scope.$index)">{{ btn.text }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else-if="column.hide === false  && (!column.permission  || permissionInit(column.permission)===true) && column.type == 'under-line'"
                        show-overflow-tooltip
                        resizable
                        :prop="column.key"
                        :label="column.title"
                        :width="column.width"
                        :min-width="column.minWidth"
                        :align="column.align"
                        :sortable="column.sortable"
                        :formatter="column.render"
                        :fixed="column.fixed"
                        :key="column.key"
                        :header-align="column.headerAlign">
                        <template slot-scope="scope" >
                            <a href="javascript:void(0)" style="color: blue;" @click="handleRowHandle(scope.row)">{{scope.row[column.key]}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else-if="column.hide === false  && (!column.permission  || permissionInit(column.permission)===true) && column.type  == 'data-dictionary'"
                        show-overflow-tooltip
                        resizable
                        :prop="column.key"
                        :label="column.title"
                        :width="column.width"
                        :min-width="column.minWidth"
                        :align="column.align"
                        :sortable="column.sortable"
                        :formatter="column.render"
                        :fixed="column.fixed"
                        :key="column.key"
                        :header-align="column.headerAlign">
                        <template slot-scope="scope" >
                            <dictionary-select-name :option-name="column.option_name" :value="scope.row[column.key]"/>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else-if="column.hide === false  && (!column.permission  || permissionInit(column.permission)===true) && column.type !== 'hide'"
                        show-overflow-tooltip
                        resizable
                        :prop="column.key"
                        :label="column.title"
                        :width="column.width"
                        :min-width="column.minWidth"
                        :align="column.align"
                        :sortable="column.sortable"
                        :formatter="column.render"
                        :fixed="column.fixed"
                        :key="column.key"
                        :header-align="column.headerAlign">
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <div class="pagination-tool" align="right" v-if="showPaging">
            <div class="row">
                <div class="col-lg-8">
                    <el-pagination
                        @size-change="handlerPageSize"
                        @current-change="handlerCurrentPage"
                        :current-currentPage="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Http} from 'src/global/http'

    export default {
        name: 'GeneralTable',
        props: {
            gridInstance: {
                type: Object
            },
            showPagingTool: {
                type: Boolean,
                default: true
            },
            isShowIndex: {
                type: Boolean,
                default: false
            },
            isShowCheckBox: {
                type: Boolean,
                default: true
            },
            height: {
                type: String,
                default:'330px'
            },
            isSummary: {//是否显示 合计行
                type: Boolean,
                default: false
            },
            summaryFun: {
                type: Function
            },
            isEdit: {
                type: Boolean,
                default: false
            },
            iRef:{
                type: String
            },
            detailDisabled:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                loading: false,
                fetchUrl: '',
                listQuery: {},
                selections: [],
                checkRow: false,
                addIndex: 1,
                list: [],
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10,20, 50, 100]
            }
        },
        computed: {
            showIndex() {
                return this.isShowIndex
            },
            showCheckBox() {
                return this.isShowCheckBox
            },
            showPaging() {
                return this.showPagingTool
            },
            columnInit() {  //列初始化
                const _this =  this;
                if(_this.gridInstance){
                    Object.is(_this.gridInstance.default,undefined)?_this.gridInstance.default = {}:true;
                    if (_this.gridInstance.columns) {
                        return _this.gridInstance.columns.map((item) => {
                            let column = {};
                            column.title = item.title; //列名
                            column.key = item.key; //表格对于字段
                            if (item.render) { //是否有重写函数
                                column.render = item.render
                            }
                            if(item.hide){
                                column.hide = item.hide
                            }else{
                                column.hide = false
                            }
                            if (item.width) {  //设置宽度
                                column.width = item.width
                            }
                            if (item.fixed) { //设置固定属性
                                column.fixed = item.fixed
                            }
                            if(item.permission){//设置权限
                                column.permission = item.permission
                            }
                            if (item.type) { //自定义类型
                                column.type = item.type
                            }
                            if (item.groups) { //操作列是否有 按钮
                                column.groups = item.groups
                            }
                            if (! item.sortable || !_this.gridInstance.default.sortable) { //表格可排序
                                column.sortable = Object.is(item.sortable, undefined)?_this.gridInstance.default.sortable:item.sortable
                            }else{
                                column.sortable = false//默认不排序
                            }
                            if (!item.minWidth || !_this.gridInstance.default.minWidth) {  //最小宽度
                                column.minWidth = Object.is(item.minWidth, undefined)?_this.gridInstance.default.minWidth:item.minWidth
                            }
                            if(item.headerAlign && _this.gridInstance.default.headerAlign){
                                column.align = Object.is(item.align, undefined)?_this.gridInstance.default.align:Object.is(item.align, undefined)?item.align:"center";//表格列位置 默认居中
                            }else{
                                column.headerAlign = Object.is(item.headerAlign, undefined)?_this.gridInstance.default.headerAlign:Object.is(item.headerAlign, undefined)?item.headerAlign:"center";//表格列位置 默认居中
                            }
                            if(item.option_name){
                                column.option_name = item.option_name
                            }
                            return column
                        })
                    }
                }
            }
        },
        mounted(){
            /*this.$emit('update:tableModel', this.tableModel)*/
        },
        methods: {
            gridDataInit(url, query) {   //查询初始化事件
                this.fetchUrl = url;
                this.listQuery = query;
                //没有分页的就不需要
                if (this.showPaging) {
                    this.currentPage = 1;
                    this.listQuery.currentPage = this.currentPage;
                    this.listQuery.pageSize = this.pageSize
                }
                return this.loadData()
            },
            loadData() {   //数据加载方法
                const _this = this;
                if (this.fetchUrl && this.listQuery) {
                    //this.loading = true;
                    return  Http.get(this.fetchUrl, {params: this.listQuery}, result => {
                        if (_this.showPaging) {
                            _this.total = result.totalCount;
                            _this.list = result.result
                        } else {
                            _this.list = result.result
                        }
                        if (_this.currentPage === 1) {
                            _this.addIndex = 1
                        }
                        _this.loading = false;
                        _this.selections = [];
                        return _this.list
                    },err =>{
                        _this.loading = false;
                    })
                }
            },
            handlerCurrentPage(currentPage) {  //下一页,跳转页查询
                this.currentPage = currentPage;
                this.listQuery.currentPage = this.currentPage;
                this.listQuery.pageSize = this.pageSize;
                this.addIndex = (this.currentPage - 1) * this.pageSize + 1;
                this.loadData()
            },
            handlerPageSize(pageSize) { //切换每页大小
                this.pageSize = pageSize;
                this.listQuery.pageSize = this.pageSize;
                this.listQuery.currentPage = this.currentPage;
                this.loadData()
            },
            handleSelectionChange(rows) {  //数据选中事件
                if (!this.checkRow) {
                    this.selections = rows;
                } else {
                    if(!Object.is(rows.length,0)){
                        if (rows.length === this.list.length) {
                            this.selections = rows;
                        } else {
                            rows.forEach((row, index) => {
                                if (index === rows.length - 1) return;
                                // callback self
                                this.$refs.currentGrid.toggleRowSelection(row, false);
                            });
                            this.selections = [rows[0]]
                        }
                    }else{
                        this.selections = []
                    }
                }
                this.$emit('selectChange', this.selections);
            },
            selectCheckbox(selection, row){
                this.$emit('select-checkbox', selection,row);
            },
            handleRowHandle(row) {
                this.$emit('on-dbclick', row);
            },
            handleCellClick(row) {
                this.$emit('cellClick', row)
            },
            tableRowClassName(row){
                this.$emit('tableRowClass', row)
            },
            rowChecked(row, event) {
                //阻止耦合触发
                if (event.target.lastChild && event.target.lastChild.getAttribute &&
                    event.target.lastChild.getAttribute('role') === 'checkbox') {
                    this.checkRow = false;
                    this.$refs.currentGrid.toggleRowSelection(row)
                } else if (event.target.nodeName !== 'SPAN' && event.target.nodeName !== 'INPUT') {
                    this.$refs.currentGrid.clearSelection();
                    this.checkRow = true;
                    this.$refs.currentGrid.toggleRowSelection(row)
                }
                this.$emit('row-click', row);
            },
            summaryMethod(param) {
                //异步加载 先判断表格的值是否有了
                if (this.list) {
                    const {columns, data} = param;
                    if (this.summaryFun) {
                        return this.summaryFun(columns, data)
                    } else {
                        const sums = [];
                        columns.forEach((column, index) => {
                            if (index === 0) {
                                sums[index] = '合计';
                                return
                            }
                            const values = data.map(item => Number(item[column.property]));
                            if (!values.every(value => isNaN(value))) {
                                sums[index] = values.reduce((prev, curr) => {
                                    const value = Number(curr);
                                    if (!isNaN(value)) {
                                        return prev + curr
                                    } else {
                                        return prev
                                    }
                                }, 0);
                                sums[index] += ''
                            } else {
                                sums[index] = ''
                            }
                        });
                        return sums
                    }
                }
            },
            //自动勾选指定的行
            autoCheckSpecifiedRow(row) {
                this.$refs.currentGrid.toggleRowSelection(row, true)
            },
            rowButtonClick(id,row,index){//列工具栏 对应点击事件
                //子控件根据id 判断执行哪个方法
                this.$emit('feature-click',id,row,index);
            },
            permissionInit(path){
                console.log(this.$_permission(path));
                return this.$_permission(path)
            }
        },
    }
</script>

<style>
    .el-table .warning-row {
        background: #fd6862;
    }

    .el-table .success-row {
        background: #f97413;
    }
</style>
