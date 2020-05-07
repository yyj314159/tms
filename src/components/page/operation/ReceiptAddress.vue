<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i>基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>回单地址</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row  :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" style="display: block; width:100%;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="组织:">
                            <org-select style="display: block"  v-model="searchParam.orgCode"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="0px" style="float: right">
                            <el-button type="success" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" v-permission="'/receiptAddress/add'" type="primary" icon="el-icon-plus" @click="dialogAddReceiptAddressVisible=true">新增
            </el-button>
            <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" header-align="center" width="40"></el-table-column>
                <el-table-column label="客户名称" header-align="center" prop="customer.name" min-width="150"></el-table-column>
                <el-table-column label="组织名称" header-align="center" prop="org.name" min-width="100"></el-table-column>
                <el-table-column label="收件人" header-align="center" prop="receiptRecipient"
                                 min-width="100"></el-table-column>
                <el-table-column label="收件人地址" header-align="center" size="small" prop="receiptAddress"
                                 min-width="200"></el-table-column>
                <el-table-column label="收件人手机号" header-align="center" prop="receiptRecipientPhoneNo"
                                 min-width="150"></el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" min-width="180"></el-table-column>
                <el-table-column label="创建人" header-align="center" prop="createUser" min-width="150"></el-table-column>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" min-width="180"></el-table-column>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" min-width="150"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center" fixed="right" min-width="120">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/receiptAddress/modify'" icon="el-icon-edit" size="mini" v-if="scope.row.deleteFlag === false"
                                   @click="showModifyReceiptAddressDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/receiptAddress/delete'" icon="el-icon-delete" size="mini" v-if="scope.row.deleteFlag === false"
                                   @click="deleteReceiptAddress(scope.row)"></el-button>
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
        <!-- 新增回单地址弹出框 -->
        <el-dialog title="新增回单地址" :visible.sync="dialogAddReceiptAddressVisible" width="450px">
            <el-form inline size="small" :model="addReceiptAddressForm" :rules="addReceiptAddressRules"
                     ref="addReceiptAddressForm"
                     label-width="140px">
                <el-form-item label="客户:" prop="customerCode">
                    <customer-select v-model="addReceiptAddressForm.customerCode" style="display: block; width:92%;"/>
                </el-form-item>
                <el-form-item label="组织:" prop="orgCode">
                    <org-select v-model="addReceiptAddressForm.orgCode" style="display: block; width:92%;"/>
                </el-form-item>
                <el-form-item label="收件人:" prop="receiptRecipient">
                    <el-input v-model="addReceiptAddressForm.receiptRecipient"></el-input>
                </el-form-item>
                <el-form-item label="收件人手机号:" prop="receiptRecipientPhoneNo">
                    <el-input v-model="addReceiptAddressForm.receiptRecipientPhoneNo"></el-input>
                </el-form-item>
                <el-form-item label="收件人地址:" prop="receiptAddress" >
                    <el-input v-model="addReceiptAddressForm.receiptAddress"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddReceiptAddressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addReceiptAddress('addReceiptAddressForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改回单地址弹出框 -->
        <el-dialog title="修改回单地址" :visible.sync="dialogModifyReceiptAddressVisible" width="400px">
            <el-form inline size="small" :model="modifyReceiptAddressForm" :rules="addReceiptAddressRules"
                     ref="modifyReceiptAddressForm" label-width="120px">
                <el-form-item label="客户:" prop="customerCode">
                    <customer-select v-model="modifyReceiptAddressForm.customerCode" ref="modifyCustomerSelect"  style="display: block; width:92%;"/>
                </el-form-item>
                <el-form-item label="组织:" prop="orgCode">
                    <org-select v-model="modifyReceiptAddressForm.orgCode" ref="modifyOrgSelect" style="display: block; width:92%;"/>
                </el-form-item>
                <el-form-item label="收件人:" prop="receiptRecipient">
                    <el-input v-model="modifyReceiptAddressForm.receiptRecipient"></el-input>
                </el-form-item>
                <el-form-item label="收件人手机号:" prop="receiptRecipientPhoneNo">
                    <el-input v-model="modifyReceiptAddressForm.receiptRecipientPhoneNo" ></el-input>
                </el-form-item>
                <el-form-item label="收件人地址:" prop="receiptAddress">
                    <el-input v-model="modifyReceiptAddressForm.receiptAddress" style="display: block; width:100%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogModifyReceiptAddressVisible = false" size="small">取 消</el-button>
                <el-button type="primary" size="small" @click="modifyReceiptAddress('modifyReceiptAddressForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>


</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    export default {
        data() {
            return {
                //拷贝 初始化data
                initializeModel: {},
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                orgList: [],
                receiptAddressList: [],
                dialogAddReceiptAddressVisible: false,
                dialogModifyReceiptAddressVisible: false,
                addReceiptAddressForm: {
                    customerCode: '',
                    orgCode: '',
                    receiptRecipient: '',
                    receiptRecipientPhoneNo: '',
                    receiptAddress: '',
                },
                addReceiptAddressRules: {
                    receiptRecipient: [
                        {required: true, message: '请输入收件人名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '名称最长50个字符', trigger: 'blur'}
                    ],
                    receiptAddress: [
                        {required: true, message: '请输入收件人地址', trigger: 'blur'},
                        {min: 1, max: 200, message: '地址最长200个字符', trigger: 'blur'}
                    ],
                    receiptRecipientPhoneNo: [
                        {required: true, message: '请输入收件人手机号', trigger: 'blur'}
                    ],
                    orgCode: [
                        {required: false, message: '请选择组织', trigger: 'blur'}
                    ],
                    customerCode: [
                        {required: false, message: '请选择客户', trigger: 'blur'}
                    ]
                },
                modifyReceiptAddressForm: {
                    customerCode: '',
                    orgCode: '',
                    receiptRecipient: '',
                    receiptRecipientPhoneNo: '',
                    receiptAddress: ''
                },
                tableHeight: window.innerHeight>800?500:null
            }
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            //查询表格
            this.searchList();
        },
        methods: {
            /*拷贝初始化对象*/
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            tableColumnBooleanFormatter(row, column, cellValue) {
                if (cellValue) {
                    return '是';
                }
                return '否';
            },
            addReceiptAddress(formName) {
                let vm = this;
                if(!(vm.addReceiptAddressForm.customerCode)) {
                    this.$message({message: '请选择客户！', type: 'warning'});
                    return;
                }
                if(!( vm.addReceiptAddressForm.orgCode)) {
                    this.$message({message: '请选择组织！', type: 'warning'});
                    return;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.receiptAddress.add, vm.addReceiptAddressForm, response => {
                            vm.resetAddReceiptAddressForm();
                            vm.dialogAddReceiptAddressVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddReceiptAddressForm() {
                let vm = this;
                vm.addReceiptAddressForm = vm.cloneMode().addReceiptAddressForm
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam = vm.cloneMode().searchParam
            },
            searchList() {
                let vm = this;
                Http.get(Api.receiptAddress.page, {params: vm.searchParam}, result => {
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
            //修改回单地址相关
            showModifyReceiptAddressDialog(row) {
                let vm = this;
                Http.get(Api.receiptAddress.queryById, {params: {'id': row.id}}, result => {
                    vm.modifyReceiptAddressForm = result.result;
                    setTimeout(function () {
                        vm.$refs.modifyOrgSelect.setCurrentOrg(result.result.org);
                        vm.$refs.modifyCustomerSelect.setCurrentCustomer(result.result.customer);
                    }, 0);
                    vm.receiptAddressList = [];
                    if (result.result.parent) {
                        vm.receiptAddressList.push(result.result.parent);
                    }
                    vm.dialogModifyReceiptAddressVisible = true;
                })
            },
            modifyReceiptAddress(formName) {
                let vm = this;
                if(!(vm.modifyReceiptAddressForm.customerCode)) {
                    this.$message({message: '请选择客户！', type: 'warning'});
                    return;
                }
                if(!( vm.modifyReceiptAddressForm.orgCode)) {
                    this.$message({message: '请选择组织！', type: 'warning'});
                    return;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.receiptAddress.modify, vm.modifyReceiptAddressForm, response => {
                            vm.dialogModifyReceiptAddressVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除回单地址
            deleteReceiptAddress(row) {
                let vm = this;
                let ids = [];
                ids.push(row.id)
                this.$confirm('删除回单地址后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.receiptAddress.delete, ids, result => {
                        vm.searchList();
                    })
                })
            }
        }
    }
</script>
