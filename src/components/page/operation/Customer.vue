<template>
    <el-container style="height: 100%;">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="简称:">
                            <customer-select style="display: block"  v-model="searchParam.code"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="审核状态:">
                        <dictionary-select v-model="searchParam.auditStatus" style="display: block" size="small"
                                           option-name="AUDIT_STATUS"/>
                    </el-form-item>
                </el-col>
                    <el-col :span="6">
                        <el-form-item label="新业务客户:">
                            <dictionary-select v-model="searchParam.newBusinessCustomer" style="display: block" size="small"
                                               option-name="IS_NEW_CUSTOMER"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="项目客户:">
                            <dictionary-select v-model="searchParam.projectCustomer" style="display: block" size="small"
                                               option-name="IS_PROJECT_CUSTOMER"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="0px" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-container>
            <el-aside style="border:1px solid #aaa;margin-top: 10px;" width="200px">
                <el-input style="width: 160px; margin: 10px 19px 21px"
                          size="small"
                          placeholder="输入关键字进行过滤"
                          v-model="treeFilterText">
                </el-input>
                <el-tree
                    class="filter-tree"
                    :data="customerTreeData"
                    :props="treeNodeProps"
                    accordion
                    highlight-current
                    expand-on-click-node
                    check-strictly
                    @node-click="clickCustomerNode"
                    :filter-node-method="filterCustomerTreeNode"
                    ref="customerTree">
                </el-tree>
            </el-aside>
            <el-main class="content-main" style="margin-left: 10px;">
                <el-button size="mini" type="primary" v-permission="'/customer/add'" icon="el-icon-plus" @click="showAddCustomerDialog()">新增</el-button>
                <el-button v-if="btnLoading" v-permission="'/customer/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                          @selection-change="handleSelectionChange"
                          border fit
                          highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                    <el-table-column type="selection"  header-align="center"  width="40"></el-table-column>
                    <el-table-column label="客户编码" header-align="center" prop="code" width="90"></el-table-column>
                    <el-table-column label="客户简称" header-align="center" prop="name" width="150">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color:#409EFF;" @click="showCustomerDetailDialog(scope.row)">{{scope.row.name}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="上级客户" header-align="center"  prop="parent.name" width="150"></el-table-column>
                    <!--<el-table-column label="客户全称" header-align="center"  prop="wholeName" width="150"></el-table-column>-->
                    <el-table-column label="收入主体" header-align="center"  prop="incomeSubject" width="180">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="LINE_INCOME_SUBJECT" :value="scope.row.incomeSubject"></dictionary-select-name>
                        </template>
                    </el-table-column>

                    <el-table-column label="结算客户" header-align="center"  prop="settlementCustomerCode" width="180"></el-table-column>
                    <el-table-column label="新业务客户" header-align="center"  prop="newBusinessCustomer" width="90">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="NEW_BUSINESS_CUSTOMER_TYPE" :value="scope.row.newBusinessCustomer"></dictionary-select-name>
                        </template>
                    </el-table-column>

                    <!--<el-table-column label="是否需要回单" header-align="center"  prop="needReceipt" :formatter="tableColumnBooleanFormatter" width="100"></el-table-column>-->
                    <el-table-column label="项目客户" header-align="center"  prop="projectCustomer" width="90">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="IS_PROJECT_CUSTOMER" :value="scope.row.projectCustomer"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属区域" header-align="center"  prop="belongAreaName" width="90"></el-table-column>
                    <el-table-column label="行业类型" header-align="center"  prop="industryType" width="90">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="INDUSTRY_TYPE" :value="scope.row.industryType"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态" header-align="center"  prop="auditStatus" width="90">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="AUDIT_STATUS" :value="scope.row.auditStatus"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作状态" header-align="center"  prop="operationStatus" width="90">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="OPERATION_STATUS" :value="scope.row.operationStatus" style="color:red;"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建机构" header-align="center"  prop="createOrg.name" width="150"></el-table-column>
                    <el-table-column label="创建人" header-align="center"  prop="createUser" width="150"></el-table-column>
                    <el-table-column label="创建时间" header-align="center"  prop="createTime" width="180"></el-table-column>
                    <el-table-column label="修改人" header-align="center"  prop="modifyUser" width="150"></el-table-column>
                    <el-table-column label="修改时间" header-align="center"  prop="modifyTime" width="180"></el-table-column>
                    <el-table-column label="操作" header-align="center" align="center"  fixed="right" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" v-permission="'/customer/modify'" size="mini"  @click="showModifyCustomerDialog(scope.row)"></el-button>
                            <el-button type="text" icon="el-icon-delete" v-permission="'/customer/delete'" size="mini" @click="deleteCustomer(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchResult.totalCount">
                    </el-pagination>
                </div>
            </el-main>
            <!-- 新增客户弹出框 -->
            <el-dialog title="新增客户" :visible.sync="dialogAddCustomerVisible" width="400px">
                <el-form size="small" :model="addCustomerForm" :rules="addCustomerRules" ref="addCustomerForm" label-width="100px">
                    <el-form-item label="客户简称:" prop="name">
                        <el-input v-model="addCustomerForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="上级客户:" prop="parentCode">
                        <customer-select style="display: block;" ref="addCustomerSelect" @change="addCustomerParentChange" v-model="addCustomerForm.parentCode">
                        </customer-select>
                    </el-form-item>
                    <!--<el-form-item label="客户全称:" prop="wholeName">
                        <el-input v-model="addCustomerForm.wholeName"></el-input>
                    </el-form-item>-->
                    <el-form-item label="收入主体:" prop="incomeSubject">
                        <dictionary-select style="display: block" option-name="LINE_INCOME_SUBJECT" v-model="addCustomerForm.incomeSubject"></dictionary-select>
                    </el-form-item>
                    <el-form-item label="结算客户:" prop="settlementCustomerCode">
                    <settlement-customer-select style="display: block;" v-model="addCustomerForm.settlementCustomerCode"></settlement-customer-select>
                </el-form-item>
                    <el-form-item label="行业类型:" prop="industryType">
                        <dictionary-select style="display: block" option-name="INDUSTRY_TYPE" v-model="addCustomerForm.industryType"></dictionary-select>
                    </el-form-item>
                    <el-row v-if="newCustomerShow">
                        <el-col :span="24" >
                            <el-form-item label=" 新业务客户："prop="newBusinessCustomer">
                                <el-switch v-model="addCustomerForm.newBusinessCustomer" active-color="#13ce66"
                                           inactive-color="#ff4949"
                                           :active-value="Constant.IS_NEW_CUSTOMER.YES"
                                           :inactive-value="Constant.IS_NEW_CUSTOMER.NO"
                                active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row>
                        <el-col :span="24" >
                            <el-form-item label=" 项目客户："prop="projectCustomer" v-permission="'/customer/addTopCustomer'">
                                <el-switch v-model="addCustomerForm.projectCustomer" active-color="#13ce66"
                                           inactive-color="#ff4949"
                                           :active-value="Constant.IS_PROJECT_CUSTOMER.YES"
                                           :inactive-value="Constant.IS_PROJECT_CUSTOMER.NO"
                                           active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row v-if="addCustomerForm.projectCustomer ===true">
                        <el-form-item label="所属区域:" prop="belongArea" >
                            <current-org-select v-model="addCustomerForm.belongArea" nature="PARTITION" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-row>
                    <el-form-item label="是否需要回单:" v-show="false" prop="needReceipt">
                        <el-switch
                            v-model="addCustomerForm.needReceipt"
                            active-text="需要"
                            inactive-text="不需要">
                        </el-switch>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogAddCustomerVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="addCustomer('addCustomerForm')">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 修改客户弹出框 -->
            <el-dialog title="修改客户" :visible.sync="dialogModifyCustomerVisible" width="400px">
                <el-form size="small" :model="modifyCustomerForm" :rules="addCustomerRules" ref="modifyCustomerForm" label-width="100px">
                    <el-form-item label="客户简称:" prop="name">
                        <el-input v-model="modifyCustomerForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="上级客户:" prop="parentCode">
                        <customer-select style="display: block" ref="modifyCustomerSelect" @change="modifyCustomerParentChange" v-model="modifyCustomerForm.parentCode">
                        </customer-select>
                    </el-form-item>
                    <!--<el-form-item label="客户全称:" prop="wholeName">
                        <el-input v-model="modifyCustomerForm.wholeName"></el-input>
                    </el-form-item>-->
                    <el-form-item label="收入主体:" prop="incomeSubject">
                        <dictionary-select style="display: block" option-name="LINE_INCOME_SUBJECT" v-model="modifyCustomerForm.incomeSubject"></dictionary-select>
                    </el-form-item>
                    <el-form-item label="结算客户:" prop="settlementCustomerCode">
                        <settlement-customer-select ref="modifySettlementCustomer" style="display: block;" v-model="modifyCustomerForm.settlementCustomerCode"></settlement-customer-select>
                    </el-form-item>
                    <el-form-item label="行业类型:" prop="industryType">
                        <dictionary-select style="display: block" option-name="INDUSTRY_TYPE" v-model="modifyCustomerForm.industryType"></dictionary-select>
                    </el-form-item>
                    <el-row v-if="newCustomerShow">
                        <el-col :span="24" >
                            <el-form-item label=" 新业务客户：">
                                <el-switch v-model="modifyCustomerForm.newBusinessCustomer" active-color="#13ce66"
                                           inactive-color="#ff4949"
                                           active-value="1"
                                           inactive-value="0"
                                           active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!--<el-row>
                        <el-col :span="24" >
                            <el-form-item label=" 项目客户："prop="projectCustomer" v-permission="'/customer/addTopCustomer'">
                                <el-switch v-model="modifyCustomerForm.projectCustomer" active-color="#13ce66"
                                           inactive-color="#ff4949"
                                           :active-value="Constant.IS_PROJECT_CUSTOMER.YES"
                                           :inactive-value="Constant.IS_PROJECT_CUSTOMER.NO"
                                           active-text="是" inactive-text="否"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row v-if="modifyCustomerForm.projectCustomer ===true">
                        <el-form-item label="所属区域:" prop="belongArea" >
                            <current-org-select v-model="modifyCustomerForm.belongArea" nature="PARTITION" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-row>

                    <el-form-item label="是否需要回单:" v-show="false" prop="needReceipt">
                        <el-switch
                            v-model="modifyCustomerForm.needReceipt"
                            active-text="需要"
                            inactive-text="不需要">
                        </el-switch>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogModifyCustomerVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="modifyCustomer('modifyCustomerForm')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="审核客户" :visible.sync="dialogAuditCustomerVisible" width="400px">
                <el-form inline size="small" :model="auditCustomerForm" ref="auditCustomerForm" label-width="100px">
                    <el-switch
                        style="display: block"
                        v-model="auditCustomerForm.auditStatus"
                        active-value="PASS"
                        inactive-value="NO_PASS"
                        active-text="通过"
                        inactive-text="不通过">
                    </el-switch>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogAuditCustomerVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="auditCustomer()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="客户详情" :visible.sync="dialogCustomerDetailVisible" width="750px">
                <el-form inline size="small" :model="customerDetailForm" ref="customerDetailForm" label-width="100px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="客户编号:" prop="code">
                                {{customerDetailForm.code}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户简称:" prop="name">
                                {{customerDetailForm.name}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上级客户:" prop="parentCode">
                                {{customerDetailForm.parentName}}
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">
                            <el-form-item label="客户全称:" prop="wholeName">
                                {{customerDetailForm.wholeName}}
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="12">
                            <el-form-item label="收入主体:" prop="incomeSubject">
                                {{customerDetailForm.incomeSubject}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="结算客户:" prop="settlementCustomerCode">
                                {{customerDetailForm.settlementCustomerCode}}
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">
                            <el-form-item label="是否需要回单:" prop="needReceipt">
                                {{customerDetailForm.needReceipt}}
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="12">
                            <el-form-item label="审核状态:" prop="auditStatus">
                                <dictionary-select-name option-name="AUDIT_STATUS" :value="customerDetailForm.auditStatus" ></dictionary-select-name>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="创建人:" prop="createUser">
                                {{customerDetailForm.createUser}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="创建时间:" prop="createTime">
                                {{customerDetailForm.createTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="修改人:" prop="modifyUser">
                                {{customerDetailForm.modifyUser}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="修改时间:" prop="modifyTime">
                                {{customerDetailForm.modifyTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="新业务客户:" prop="newBusinessCustomer">
                                <!--{{customerDetailForm.newBusinessCustomer}}-->
                                {{customerDetailForm.newBusinessCustomer ? (customerDetailForm.newBusinessCustomer === '1' ? '是' : '否') : ''}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目客户:" prop="projectCustomer">
                                {{ customerDetailForm.projectCustomer === true ? '是' : '否'}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                                <el-form-item label="行业类型:">
                                    <dictionary-select-name option-name="INDUSTRY_TYPE" :value="customerDetailForm.industryType" ></dictionary-select-name>
                                </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </el-dialog>
        </el-container>
    </el-container>

</template>

<script>
    import {Http,Api,Common,Constant} from 'src/global'
    export default {
        data() {
            return {
                Constant: Constant,
                Constant: Constant,
                belongArea:'',
                tableHeight: window.innerHeight>800?500:null,
                btnLoading: true,
                treeFilterText: '',
                customerTreeData: [],
                newCustomerShow: true,
                treeNodeProps: {
                    children: 'children',
                    label: 'label',
                    isLeaf: 'isLeaf'
                },
                multipleSelection: [],
                //查询参数
                searchParam: {
                    projectCustomer:'',
                    currentPage: 1,
                    pageSize: 10,
                    code: '',
                    name: '',
                    newBusinessCustomer:'',
                    auditStatus: '',
                    parentCode: '',
                    createOrgCode: '',
                    shortCode: '',
                    treeRootCode:''
                },

                //新业务客户
                auditOpinionForm: {
                    ids: [],
                    auditType: Constant.IS_NEW_CUSTOMER.NO,
                    auditView: ''
                },


                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                orgList: [],
                customerList: [],
                dialogAddCustomerVisible: false,
                dialogAuditCustomerVisible: false,
                dialogCustomerDetailVisible: false,
                addCustomerForm: {
                    projectCustomer:false,
                    belongArea:'',
                    name: '',
                    parentCode: '',
                    incomeSubject: '',
                    settlementCustomerCode: '',
                    wholeName: '',
                    newBusinessCustomer:'',
                    needReceipt: true,
                    industryType:''
                },
                customerDetailForm: {
                    projectCustomer:'',
                    code: '',
                    name: '',
                    parentCode: '',
                    parentName: '',
                    wholeName: '',
                    auditStatus: '',
                    incomeSubject: '',
                    settlementCustomerCode: '',
                    needReceipt: false,
                    createOrgCode: '',
                    createUser: '',
                    createTime: '',
                    modifyUser: '',
                    modifyTime: '',
                    industryType: ''

                },
                addCustomerRules: {
                    belongArea:[
                        {required: true, message: '请选择所属区域', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入客户简称', trigger: 'blur'},
                        {min: 1, max: 12, message: '编号最长12个字符', trigger: 'blur'}
                    ],
                    wholeName: [
                        {required: true, message: '请输入客户全称', trigger: 'blur'},
                        {min: 2, max: 50, message: '全称最小2位,最大50位'}
                    ]
                },
                dialogModifyCustomerVisible: false,
                modifyCustomerForm:{
                    projectCustomer:'',
                    belongArea:'',
                    wholeName: '',
                    name: '',
                    incomeSubject: '',
                    settlementCustomerCode: '',
                    newBusinessCustomer:'',
                    parentCode: '',
                    needReceipt: true,
                    industryType:''
                },
                auditCustomerForm: {
                    auditStatus: 'PASS',
                    ids: []
                },
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            this.initCustomerTree();
        },
        watch: {
            treeFilterText(val) {
                this.$refs.customerTree.filter(val);
            }
        },
        methods: {
            addCustomerParentChange(obj) {
                this.newCustomerShow = !!obj ? false : true;
            },
            modifyCustomerParentChange(obj) {
                this.newCustomerShow = !!obj ? false : true;
            },
            tableColumnBooleanFormatter(row, column, cellValue) {
                if (cellValue) {
                    return '是';
                }
                return '否';
            },
            filterCustomerTreeNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            initCustomerTree() {
                let vm = this;
                this.customerTreeData = [];
                Http.get(Api.customer.getCustomerTree, {params: ''}, result => {
                    vm.customerTreeData = result.result;
                })
            },
            clickCustomerNode(data) {
                let vm = this;
                vm.searchParam.currentPage = 1;
                vm.searchParam.pageSize = 10;
                vm.searchParam.treeRootCode = data.id;
                this.searchList();
            },
            queryCustomer(query) {
                let vm = this;
                this.customerList = [];
                Http.get(Api.customer.commonSelect, {params: {'query': query}}, result => {
                    vm.customerList = result.result;
                })
            },
            queryOrg(query) {
                let vm = this;
                this.orgList = [];
                Http.get(Api.org.commonSelect, {params: {'query': query}}, result => {
                    vm.orgList = result.result;
                })
            },
            addSubLevel(row) {
                let vm = this;
                this.customerList = [];
                Http.get(Api.customer.getCustomerByCode,{params:{'code':row.code}},result =>{
                    vm.addCustomerForm.parentCode = result.result.code;
                    setTimeout(function () {
                        vm.$refs.addCustomerSelect.setCurrentCustomer(result.result);
                    }, 0);
                    vm.dialogAddCustomerVisible = true;
                })
            },
            addSameLevel(row) {
                let vm = this;
                Http.get(Api.customer.getCustomerByCode,{params:{'code':row.code}},result =>{
                    vm.addCustomerForm.parentCode = result.result.parentCode;
                    if(result.result.parent) {
                        setTimeout(function () {
                            vm.$refs.addCustomerSelect.setCurrentCustomer(result.result.parent);
                        }, 0);
                    }
                    vm.dialogAddCustomerVisible = true;
                })
            },
            addCustomer(formName) {
                let vm = this;
                /*if (vm.addCustomerForm.projectCustomer===true&&vm.addCustomerForm.parentCode!=""&&vm.addCustomerForm.belongArea!=null){
                  throw vm.$message.warning("项目客户只能是顶级客户！");
                }*/
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.customer.add,vm.addCustomerForm,response =>{
                            vm.resetAddCustomerForm();
                            vm.dialogAddCustomerVisible = false;
                            vm.initCustomerTree();
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            checkCustomer() {
                let vm = this;
                if(vm.multipleSelection && vm.multipleSelection.length > 0){
                    vm.dialogAuditCustomerVisible = true;
                } else {
                    this.$alert('请至少选择一个客户', '提示', {
                        confirmButtonText: '确定',
                    });
                    return false;
                }
            },
            auditCustomer() {
                let vm = this;
                vm.auditCustomerForm.ids=[];
                if(vm.multipleSelection && vm.multipleSelection.length > 0){
                    for (let i = 0; i < vm.multipleSelection.length; i++) {
                        vm.auditCustomerForm.ids.push(vm.multipleSelection[i].id);
                    }
                    Http.post(Api.customer.audit, vm.auditCustomerForm, result => {
                        vm.searchList();
                        vm.initCustomerTree();
                        vm.dialogAuditCustomerVisible = false;
                    })
                } else {
                    this.$alert('请至少选择一个客户', '提示', {
                        confirmButtonText: '确定',
                    });
                    return false;
                }
            },
            resetAddCustomerForm(){
                let vm = this;
                vm.addCustomerForm = {
                    // code: '',
                    // name: '',
                    // parentCode: '',
                    // wholeName: '',
                    // needReceipt: false,
                    // tomerDisabled: false,

                    projectCustomer:false,
                    belongArea:'',
                    name: '',
                    parentCode: '',
                    incomeSubject: '',
                    settlementCustomerCode: '',
                    wholeName: '',
                    newBusinessCustomer:'',
                    needReceipt: true,
                    industryType:''
                }
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    code: '',
                    name: '',
                    auditStatus: '',
                    parentCode: '',
                    createOrgCode: '',
                    wholeName: '',
                    treeRootCode:''
                }
            },
            searchList() {
                let vm = this;
                Http.get(Api.customer.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            showAddCustomerDialog() {
                let vm = this;
                let checkedNode = vm.$refs.customerTree.getCurrentNode();
                if(checkedNode) {
                        let customer = {};
                        customer.code = checkedNode.id;
                        customer.name = checkedNode.label;
                        setTimeout(function () {
                            vm.$refs.addCustomerSelect.setCurrentCustomer(customer);
                        },0);
                        vm.addCustomerForm.parentCode = checkedNode.id;
                        vm.dialogAddCustomerVisible=true;
                }
                vm.dialogAddCustomerVisible=true;
            },
            //修改客户相关
            showModifyCustomerDialog(row){
                let vm = this;
                Http.get(Api.customer.getCustomerByCode,{params:{'code':row.code}},result =>{
                    vm.modifyCustomerForm = result.result;
                    vm.newCustomerShow = !!result.result.parent ? false : true;
                    setTimeout(function () {
                        vm.$refs.modifyCustomerSelect.setCurrentCustomer(result.result.parent);
                        vm.$refs.modifySettlementCustomer.setCurrentSettlementCustomer({name: result.result.settlementCustomerCode});
                    }, 0);
                    vm.dialogModifyCustomerVisible = true;
                })
            },
            showCustomerDetailDialog(row){
                let vm = this;
                Http.get(Api.customer.getCustomerByCode,{params:{'code':row.code}},result =>{
                    vm.customerDetailForm = result.result;
                    if(result.result.parent) {
                        vm.customerDetailForm.parentName = result.result.parent.name;
                    }
                    vm.customerDetailForm.needReceipt = vm.tableColumnBooleanFormatter(null, null, result.result.needReceipt);
                    vm.dialogCustomerDetailVisible = true;
                })
            },
            modifyCustomer(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.customer.modify,vm.modifyCustomerForm,response =>{
                            vm.dialogModifyCustomerVisible = false;
                            vm.searchList();
                            vm.initCustomerTree();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除客户
            deleteCustomer(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.customer.delete, ids, result => {
                        vm.searchList();
                        vm.initCustomerTree();
                    })
                })
            },
            exportData() {//导出
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.customer.page, {params: searchExportParam}, response => {
                    let header = ['客户编码', '客户简称', '上级客户', '收入主体', '结算客户', '审核状态','创建时间', '创建人', '修改时间', '修改人','新业务客户','项目客户','所属区域'];
                    let filterVal = ['code','name', 'parent.name',{
                        type: 'dictionary',
                        code: 'LINE_INCOME_SUBJECT',
                        name: 'incomeSubject'
                    }, 'settlementCustomerCode',{
                        type: 'dictionary',
                        code: 'AUDIT_STATUS',
                        name: 'auditStatus'

                    },'createTime', 'createUser', 'modifyTime', 'modifyUser','newBusinessCustomer',{
                        type: 'dictionary',
                        code: 'IS_PROJECT_CUSTOMER',
                        name: 'projectCustomer'
                    },'belongArea'];
                    let newResult = response.result.map((val,index) => {
                        if (val && val.newBusinessCustomer) {
                            if (val.newBusinessCustomer === '0') {
                                val.newBusinessCustomer = '否'
                                return val
                            }else if (val.newBusinessCustomer === '1') {
                                val.newBusinessCustomer = '是'
                                return val
                            }else {
                                return val
                            }
                        }else {
                            return val
                        }
                    })

                    Common.excel.downloadExl(newResult, header, filterVal, "客户");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
        }
    }
</script>
