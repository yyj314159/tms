<template>
    <el-container style="height: 100%;">
        <el-header height="" style="padding-left: 0">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                    <el-breadcrumb-item>组织管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <el-container>
            <el-aside style="border:1px solid #aaa;" width="200px">
                <el-input style="width: 160px; margin: 10px 19px 21px"
                          placeholder="输入关键字进行过滤"
                          v-model="treeFilterText" size="small">
                </el-input>
                <el-tree
                    class="filter-tree"
                    :data="orgTreeData"
                    :props="treeNodeProps"
                    v-model="orgTreeModel"
                    default-expand-all
                    node-key="id"
                    show-checkbox
                    highlight-current
                    :expand-on-click-node=false
                    check-strictly
                    :filter-node-method="filterOrgTreeNode"
                    @node-click="clickOrgNode"
                    ref="orgTree">
                </el-tree>
            </el-aside>
            <el-main style="margin-left: 10px; border:1px solid #aaa;">
                <el-button size="mini" type="success" icon="el-icon-plus" @click="showAddOrgDialog(0)">新增</el-button>
                <el-button size="mini" type="success" icon="el-icon-plus" @click="showAddOrgDialog(1)">新增同级</el-button>
                <el-button size="mini" type="success" icon="el-icon-plus" @click="showAddOrgDialog(2)">新增下级</el-button>
                <el-button size="mini" type="warning" icon="el-icon-edit" @click="showModifyOrgDialog()">修改</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteOrg()">删除</el-button>
                <el-card class="box-card" style="margin-top: 50px; width: 100%">
                    <div slot="header" class="clearfix">
                        <span>组织详情</span>
                    </div>
                    <el-form ref="detailForm" :model="detailForm" v-show="dialogDetailOrgVisible" label-width="100px"
                             style="margin-top: 10px; width: 100%">
                        <el-form-item label="组织编号:" style="float: left">
                            {{detailForm.code}}
                        </el-form-item>
                        <el-form-item label="组织名称:" style="margin-left: 50%">
                            {{detailForm.name}}
                        </el-form-item>
                        <el-form-item label="上级名称:" style="float: left">
                            {{detailForm.parentName}}
                        </el-form-item>
                        <el-form-item label="组织性质:" style="margin-left: 50%">
                            {{detailForm.nature}}
                        </el-form-item>
                        <el-form-item label="合作车平台:" style="float: left">
                            {{detailForm.partnerSupplier.name}}
                        </el-form-item>
                        <el-form-item label="外请车平台:" style="margin-left: 50%">
                            {{detailForm.outsideSupplier.name}}
                        </el-form-item>
                        <el-form-item label="G7组织编码:" style="margin-left: 50%">
                            {{detailForm.g7OrgCode}}
                        </el-form-item>
                        <el-form-item label="所属城市:">
                            <region-picker multiple :max-level="3" :auto="true" v-model="detailForm.cityList" disabled
                                           :data="regionPickerData" style="width: 80%;"/>
                        </el-form-item>
                        <el-form-item label="营运负责人:" style="float: left">
                            {{detailForm.users.operationUser}}
                        </el-form-item>

                        <el-form-item label="请车负责人:" style="margin-left: 50%">
                            {{detailForm.users.pleaseCarUser}}
                        </el-form-item>
                        <el-form-item label="客服负责人:" style="float: left">
                            {{detailForm.users.customerUser}}
                        </el-form-item>
                        <el-form-item label="财务负责人:" style="margin-left: 50%">
                            {{detailForm.users.financeUser}}
                        </el-form-item>
                        <el-form-item label="自营车负责人:" style="float: left">
                            {{detailForm.users.selfSupportUser}}
                        </el-form-item>
                        <el-form-item label="合作车负责人:" style="margin-left: 50%">
                            {{detailForm.users.cooperativeUser}}
                        </el-form-item>
                        <el-form-item label="负责人:" style="float: left">
                            {{detailForm.users.personInCharge}}
                        </el-form-item>
                        <el-form-item label="零散业务负责人:" label-width="120px" style="margin-left: 48.5%">
                            {{detailForm.users.scatteredBusinessUser}}
                        </el-form-item>
                        <el-form-item label="回单收件人:" style="float: left;">
                            {{detailForm.receiptRecipient}}
                        </el-form-item>
                        <el-form-item label="收件人手机:" style="margin-left: 50%;">
                            {{detailForm.receiptRecipientPhoneNo}}
                        </el-form-item>
                        <el-form-item label="收件人地址:" style="display: block">
                            {{detailForm.receiptAddress}}
                        </el-form-item>
                        <el-form-item label="创建人:" style="float: left;">
                            {{detailForm.createUser}}
                        </el-form-item>
                        <el-form-item label="创建时间:" style="margin-left: 50%;">
                            {{detailForm.createTime}}
                        </el-form-item>
                        <el-form-item label="修改人:" style="float: left;">
                            {{detailForm.modifyUser}}
                        </el-form-item>
                        <el-form-item label="修改时间:" style="margin-left: 50%">
                            {{detailForm.modifyTime}}
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-main>
        </el-container>
        <el-dialog title="新增组织" :visible.sync="dialogAddOrgVisible" width="700px">
            <el-form size="small" :model="addOrgForm" :rules="addOrgRules" ref="addOrgForm" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称:" prop="name">
                            <el-input v-model="addOrgForm.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上级编码:" prop="parentCode">
                            <org-select style="display: block; width:100%;" v-model="addOrgForm.parentCode"
                                        mounted="true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="组织性质:" prop="nature">
                            <dictionary-select style="display: block; width:100%;" v-model="addOrgForm.nature"
                                               size="small" option-name="ORGANIZATION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人:" prop="personInCharge">
                            <user-select v-model="addOrgForm.personInCharge"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合作车平台:" prop="partnerPlatform">
                            <supplier-select style="display: block; width:100%;" type="PLANTFORM_COMPANY"
                                             v-model="addOrgForm.partnerPlatform"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外请车平台:" prop="outsidePlatform">
                            <supplier-select style="display: block; width:100%;" type="PLANTFORM_COMPANY"
                                             v-model="addOrgForm.outsidePlatform"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="所属城市:" prop="city">
                            <region-picker multiple :max-level="3" :auto="true" v-model="addOrgForm.cityList"
                                           :data="regionPickerData" style="width: 530px;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="G7组织编码:" prop="g7OrgCode">
                            <el-input v-model="addOrgForm.g7OrgCode"/>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="营运负责人:" prop="operationUser">
                            <user-select v-model="addOrgForm.operationUser"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请车负责人:" prop="pleaseCarUser">
                            <user-select v-model="addOrgForm.pleaseCarUser"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客服负责人:" prop="customerUser">
                            <user-select v-model="addOrgForm.customerUser"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="财务负责人:" prop="financeUser">
                            <user-select v-model="addOrgForm.financeUser"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="自营车负责人:" prop="selfSupportUser">
                            <user-select v-model="addOrgForm.selfSupportUser"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合作车负责人:" prop="cooperativeUser">
                            <user-select v-model="addOrgForm.cooperativeUser"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="零散业务负责人:" prop="scatteredBusinessUser">
                            <user-select v-model="addOrgForm.scatteredBusinessUser"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="回单收件人:" prop="receiptRecipient">
                            <el-input v-model="addOrgForm.receiptRecipient"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收件人手机:" prop="receiptRecipientPhoneNo">
                            <el-input v-model="addOrgForm.receiptRecipientPhoneNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="回单收件地址:" prop="receiptAddress">
                            <el-input v-model="addOrgForm.receiptAddress"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddOrgVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addOrg('addOrgForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改组织" :visible.sync="dialogModifyOrgVisible" width="720px">
            <el-form size="small" :model="modifyOrgForm" :rules="modifyOrgRules" ref="modifyOrgForm"
                     label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称:" prop="name">
                            <el-input v-model="modifyOrgForm.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上级编码:" prop="parentCode">
                            <org-select style="display: block; width:100%;" v-model="modifyOrgForm.parentCode"
                                        mounted="true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="组织性质:" prop="nature">
                            <dictionary-select style="display: block; width:100%;" v-model="modifyOrgForm.nature"
                                               size="small" option-name="ORGANIZATION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人:" prop="personInCharge">
                            <user-select v-model="modifyOrgForm.personInCharge" ref="modifyOrgFormPersonInCharge"/>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="合作车平台:" prop="partnerPlatform">
                            <supplier-select style="display: block; width:100%;" type="PLANTFORM_COMPANY"
                                             v-model="modifyOrgForm.partnerPlatform"
                                             ref="modifyOrgFormPartnerPlatform"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外请车平台:" prop="outsidePlatform">
                            <supplier-select style="display: block; width:100%;" type="PLANTFORM_COMPANY"
                                             v-model="modifyOrgForm.outsidePlatform"
                                             ref="modifyOrgFormOutsidePlatform"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="所属城市:" prop="city">
                            <region-picker multiple :max-level="3" :auto="true" v-model="modifyOrgForm.cityList"
                                           :data="regionPickerData" style="width: 530px;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="G7组织编码:" prop="g7OrgCode">
                            <el-input v-model="modifyOrgForm.g7OrgCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="营运负责人:" prop="operationUser">
                            <user-select v-model="modifyOrgForm.operationUser" ref="modifyOrgFormPersonInCharge"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请车负责人:" prop="pleaseCarUser">
                            <user-select v-model="modifyOrgForm.pleaseCarUser" ref="modifyOrgFormPersonInCharge"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客服负责人:" prop="customerUser">
                            <user-select v-model="modifyOrgForm.customerUser" ref="modifyOrgFormPersonInCharge"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="财务负责人:" prop="financeUser">
                            <user-select v-model="modifyOrgForm.financeUser" ref="modifyOrgFormPersonInCharge"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="自营车负责人:" prop="selfSupportUser">
                            <user-select v-model="modifyOrgForm.selfSupportUser" ref="modifyOrgFormPersonInCharge"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合作车负责人:" prop="cooperativeUser">
                            <user-select placeholder="false" v-model="modifyOrgForm.cooperativeUser"
                                         ref="modifyOrgFormPersonInCharge"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="零散业务负责人:" prop="personInCharge">
                            <user-select v-model="modifyOrgForm.scatteredBusinessUser"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="回单收件人:" prop="receiptRecipient">
                            <el-input v-model="modifyOrgForm.receiptRecipient"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收件人手机:" prop="receiptRecipientPhoneNo">
                            <el-input v-model="modifyOrgForm.receiptRecipientPhoneNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="回单收件地址:" prop="receiptAddress">
                            <el-input v-model="modifyOrgForm.receiptAddress"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyOrgVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyOrg('modifyOrgForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    import {Constant, Http, Api} from 'src/global'
    import DataDictionary from 'src/components/common/data/data.js'

    export default {
        data() {
            return {
                initializeModel: {},
                regionPickerData: null,
                treeFilterText: '',
                orgTreeData: [],
                treeNodeProps: {
                    children: 'children',
                    label: 'label',
                    isLeaf: 'isLeaf'
                },
                treeCheckedOrg: [],
                dialogAddOrgVisible: false,
                dialogModifyOrgVisible: false,
                dialogDetailOrgVisible: false,
                orgTreeModel: {},
                natureOption: DataDictionary.ORGANIZATION,
                detailForm: {
                    code: '',
                    name: '',
                    parentCode: '',
                    parentName: '',
                    g7OrgCode:'',
                    receiptRecipient: '',
                    receiptRecipientPhoneNo: '',
                    receiptAddress: '',
                    nature: '',
                    cityList: [],
                    createUser: '',
                    createTime: '',
                    modifyUser: '',
                    modifyTime: '',
                    user: {
                        name: ''
                    },
                    users: {
                        personInCharge: '',
                        operationUser: '',
                        pleaseCarUser: '',
                        customerUser: '',
                        financeUser: '',
                        selfSupportUser: '',
                        cooperativeUser: '',
                        scatteredBusinessUser: ''
                    },
                    partnerSupplier: {
                        name: ''
                    },
                    outsideSupplier: {
                        name: ''
                    }
                },
                addOrgForm: {
                    code: '',
                    name: '',
                    parentCode: '',
                    nature: '',
                    personInCharge: '',
                    manager: '',
                    g7OrgCode:'',
                    partnerPlatform: '',
                    outsidePlatform: '',
                    operationUser: '',
                    pleaseCarUser: '',
                    scatteredBusinessUser: '',
                    customerUser: '',
                    financeUser: '',
                    selfSupportUser: '',
                    cooperativeUser: '',
                    receiptRecipient: '',
                    receiptRecipientPhoneNo: '',
                    receiptAddress: '',
                    supplierShow: false,
                    cityList: []
                },
                addOrgRules: {
                    name: [
                        {required: true, message: '请输入组织名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '编号最长20个字符', trigger: 'blur'}
                    ],
                    nature: [
                        {required: true, message: '请选择组织性质', trigger: 'blur'}
                    ],
                    operationUser: [
                        {required: false, message: '请选择营运负责人', trigger: 'blur'}
                    ],
                    pleaseCarUser: [
                        {required: false, message: '请选择请车负责人', trigger: 'blur'}
                    ],
                    customerUser: [
                        {required: false, message: '请选择客服负责人', trigger: 'blur'}
                    ],
                    financeUser: [
                        {required: false, message: '请选择财务负责人', trigger: 'blur'}
                    ],
                    selfSupportUser: [
                        {required: false, message: '请选择自营车负责人', trigger: 'blur'}
                    ],
                    cooperativeUser: [
                        {required: false, message: '请选择合作车负责人', trigger: 'blur'}
                    ],
                    receiptRecipient: [
                        {required: false, message: '请输入回单收件人', trigger: 'blur'},
                        {min: 1, max: 50, message: '收件人名称最长50个字符', trigger: 'blur'}
                    ],
                    receiptRecipientPhoneNo: [
                        {required: false, message: '请输入回单收件人手机号', trigger: 'blur'}
                    ],
                    receiptAddress: [
                        {required: false, message: '请输入回单收件地址', trigger: 'blur'},
                        {min: 1, max: 100, message: '地址最长100个字符', trigger: 'blur'}
                    ],
                    partnerPlatform: [
                        {required: false, message: '请选择合作车平台', trigger: 'blur'}
                    ],
                    outsidePlatform: [
                        {required: false, message: '请选择外请车平台', trigger: 'blur'}
                    ],
                },
                modifyOrgRules: {
                    name: [
                        {required: true, message: '请输入组织名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '编号最长20个字符', trigger: 'blur'}
                    ],
                    nature: [
                        {required: true, message: '请选择组织性质', trigger: 'blur'}
                    ], operationUser: [
                        {required: false, message: '请选择营运负责人', trigger: 'blur'}
                    ],
                    pleaseCarUser: [
                        {required: false, message: '请选择请车负责人', trigger: 'blur'}
                    ],
                    customerUser: [
                        {required: false, message: '请选择客服负责人', trigger: 'blur'}
                    ],
                    financeUser: [
                        {required: false, message: '请选择财务负责人', trigger: 'blur'}
                    ],
                    selfSupportUser: [
                        {required: false, message: '请选择自营车负责人', trigger: 'blur'}
                    ],
                    cooperativeUser: [
                        {required: false, message: '请选择合作车负责人', trigger: 'blur'}
                    ],
                    receiptRecipient: [
                        {required: true, message: '请输入回单收件人', trigger: 'blur'},
                        {min: 1, max: 50, message: '收件人名称最长50个字符', trigger: 'blur'}
                    ],
                    receiptRecipientPhoneNo: [
                        {required: true, message: '请输入回单收件人手机号', trigger: 'blur'}
                    ],
                    receiptAddress: [
                        {required: true, message: '请输入回单收件地址', trigger: 'blur'},
                        {min: 1, max: 100, message: '地址最长100个字符', trigger: 'blur'}
                    ],
                    partnerPlatform: [
                        {required: false, message: '请选择合作车平台', trigger: 'blur'}
                    ],
                    outsidePlatform: [
                        {required: false, message: '请选择外请车平台', trigger: 'blur'}
                    ],
                },
                modifyOrgForm: {
                    code: '',
                    name: '',
                    parentCode: '',
                    nature: '',
                    manager: '',
                    personInCharge: '',
                    partnerPlatform: '',
                    outsidePlatform: '',
                    operationUser: '',
                    pleaseCarUser: '',
                    scatteredBusinessUser: '',
                    g7OrgCode:'',
                    customerUser: '',
                    financeUser: '',
                    selfSupportUser: '',
                    cooperativeUser: '',
                    receiptRecipient: '',
                    receiptRecipientPhoneNo: '',
                    receiptAddress: '',
                    supplierShow: false,
                    cityList: []
                },
                orgList: []
            };
        },
        mounted() {
            //初始化树节点
            this.getOrgTree();
            this.initRegionPickerData();
            this.showRootDetail();
            //拷贝一个 model 用于重置
            this.initializeModel = _.cloneDeep(this._data);
        },
        watch: {
            treeFilterText(val) {
                this.$refs.orgTree.filter(val);
            },
            'addOrgForm.nature'(val) {
                let _this = this;
                if (val === Constant.ORGANIZATION.AREA) {
                    _this.addOrgForm.supplierShow = true;
                    _this.addOrgRules.partnerPlatform[0].required = true;
                    _this.addOrgRules.outsidePlatform[0].required = true;
                } else {
                    _this.addOrgForm.supplierShow = false;
                    _this.addOrgRules.partnerPlatform[0].required = false;
                    _this.addOrgRules.outsidePlatform[0].required = false;
                }
            },
            'modifyOrgForm.nature'(val) {
                this.modifyOrgPlatformShow(val);
            },
            dialogModifyOrgVisible(val) {
                let _this = this;
                _this.modifyOrgPlatformShow(_this.modifyOrgForm.nature);
            }
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            getOrgTree() {
                let vm = this;
                Http.get(Api.org.tree, null, result => {
                    vm.orgTreeData = result.result;
                })
            },
            initRegionPickerData() {
                let vm = this;
                Http.get(Api.district.getDistrictTreeDto, {params: {'type': "4"}}, result => {
                    vm.regionPickerData = result.result;
                })
            },
            orgNatureFormatter(code) {
                let vm = this;
                for (let i = 0; i < vm.natureOption.length; i++) {
                    if (vm.natureOption[i].code == code) {
                        return vm.natureOption[i].name;
                    }
                }
            },
            queryOrg(query) {
                let vm = this;
                this.orgList = [];
                Http.get(Api.org.commonSelect, {params: {'query': query}}, result => {
                    vm.orgList = result.result;
                })
            },
            filterOrgTreeNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            showRootDetail() {
                let vm = this;
                vm.dialogDetailOrgVisible = true;
                Http.get(Api.org.queryByCode, {params: {'code': '99999999'}}, result => {
                    let detailForm = result.result;
                    if (result.result.user) {
                        setTimeout(() => {
                            vm.$refs.modifyOrgFormPersonInCharge.setCurrentUser(result.result.user)
                        }, 0)
                    }

                    detailForm.nature = vm.orgNatureFormatter(result.result.nature);
                    if (!result.result.partnerSupplier) {
                        detailForm.partnerSupplier = {
                            name: ''
                        }
                    }
                    if (!result.result.outsideSupplier) {
                        detailForm.outsideSupplier = {
                            name: ''
                        }
                    }

                    if (!result.result.user) {
                        detailForm.user = {
                            name: ''
                        }
                    }
                    if (result.result.parent) {
                        detailForm.parentName = result.result.parent.name;
                    }
                    if (result.result) {
                        detailForm.cityList = result.result.cityList;
                    } else {
                        detailForm.cityList = [];
                    }
                    vm.detailForm = detailForm
                })
            },
            clickOrgNode(data) {
                let vm = this;
                vm.dialogDetailOrgVisible = true;
                Http.get(Api.org.queryByCode, {params: {'code': data.id}}, result => {
                    let detailForm = result.result;
                    if (result.result.parent) {
                        vm.orgList.push(result.result.parent);
                    }

                    if (result.result) {
                        if (result.result.parent) {
                            detailForm.parentName = result.result.parent.name;
                        }
                        if (result.result.user) {
                            setTimeout(() => {
                                vm.$refs.modifyOrgFormPersonInCharge.setCurrentUser(result.result.user)
                            }, 0)
                        }
                        detailForm.nature = vm.orgNatureFormatter(result.result.nature);
                        if (detailForm.cityList) {
                            detailForm.cityList = result.result.cityList;
                        } else {
                            detailForm.cityList = [];
                        }
                        if (!result.result.partnerSupplier) {
                            detailForm.partnerSupplier = {
                                name: ''
                            }
                        }
                        if (!result.result.outsideSupplier) {
                            detailForm.outsideSupplier = {
                                name: ''
                            }
                        }
                        if (!result.result.user) {
                            detailForm.user = {
                                name: ''
                            }
                        }
                    } else {
                        detailForm.cityList = [];
                    }

                    vm.detailForm = detailForm
                })
            },
            showAddOrgDialog(type) {
                let vm = this;
                let checkKeys = this.$refs.orgTree.getCheckedKeys();
                let checkFlag = true;
                if (checkKeys == [] || checkKeys.length != 1) {
                    checkFlag = false;
                }
                if (type == 1) {
                    if (!checkFlag) {
                        vm.$alert('请选择一个组织', '提示', {
                            confirmButtonText: '确定',
                        });
                    } else {
                        Http.get(Api.org.queryByCode, {params: {'code': checkKeys[0]}}, result => {
                            vm.orgList = [];
                            vm.addOrgForm.parentCode = result.result.parentCode;
                            if (result.result.parent) {
                                vm.orgList.push(result.result.parent);
                            }
                        })
                    }
                }
                if (type == 2) {
                    if (!checkFlag) {
                        vm.$alert('请选择一个组织', '提示', {
                            confirmButtonText: '确定',
                        });
                    } else {
                        Http.get(Api.org.queryByCode, {params: {'code': checkKeys[0]}}, result => {
                            vm.orgList = [];
                            vm.addOrgForm.parentCode = result.result.code;
                            vm.orgList.push(result.result);
                        })
                    }
                }
                if (type == 0 || checkFlag) {
                    vm.dialogAddOrgVisible = true;
                }
            },
            showModifyOrgDialog() {
                let vm = this;
                let checkKeys = this.$refs.orgTree.getCheckedKeys();
                if (checkKeys == []) {
                    this.$alert('请选择一个组织', '提示', {
                        confirmButtonText: '确定',
                    });
                    return false;
                } else if (checkKeys.length != 1) {
                    this.$alert('请选择一个组织', '提示', {
                        confirmButtonText: '确定',
                    });
                    return false;
                } else {
                    Http.get(Api.org.queryByCode, {params: {'code': checkKeys[0]}}, result => {
                        vm.modifyOrgForm = result.result;
                        vm.orgList = [];
                        if (result.result.parent) {
                            vm.orgList.push(result.result.parent);
                        }
                        if (result.result.cityList) {
                            vm.modifyOrgForm.cityList = result.result.cityList;
                        } else {
                            vm.modifyOrgForm.cityList = [];
                        }
                        if (result.result.user) {
                            setTimeout(() => {
                                vm.$refs.modifyOrgFormPersonInCharge.setCurrentUser(result.result.user)
                            }, 0)
                        }
                        if (result.result.outsidePlatform) {
                            setTimeout(() => {
                                vm.$refs.modifyOrgFormOutsidePlatform.setCurrentSupplier(result.result.outsidePlatform)
                            }, 0)
                        }
                        if (result.result.partnerPlatform) {
                            setTimeout(() => {
                                vm.$refs.modifyOrgFormPartnerPlatform.setCurrentSupplier(result.result.partnerPlatform)
                            }, 0)
                        }
                        vm.dialogModifyOrgVisible = true;
                    })
                }
            },
            addOrg(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.org.add, vm.addOrgForm, response => {
                            vm.resetAddOrgForm();
                            vm.dialogAddOrgVisible = false;
                            vm.getOrgTree();
                        })
                    } else {
                        return false;
                    }
                });
            },
            modifyOrg(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.org.modify, vm.modifyOrgForm, response => {
                            vm.dialogModifyOrgVisible = false;
                            vm.getOrgTree();
                            vm.resetModifyOrgForm();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除客户
            deleteOrg() {
                let vm = this;
                let checkNodes = this.$refs.orgTree.getCheckedNodes();
                if (checkNodes == null || checkNodes.length < 1) {
                    this.$alert('请选择一个组织', '提示', {
                        confirmButtonText: '确定',
                    });
                    return false;
                } else {
                    let ids = [];
                    for (let i = 0; i < checkNodes.length; i++) {
                        ids.push(checkNodes[i].data.id);
                    }
                    this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Http.post(Api.org.delete, ids, result => {
                            vm.getOrgTree();
                        })
                    })
                }
            },
            resetAddOrgForm() {
                let vm = this;
                vm.addOrgForm = vm.cloneMode().addOrgForm
            },
            resetModifyOrgForm() {
                let vm = this;
                vm.ModifyOrgForm = vm.cloneMode().ModifyOrgForm
            },


            modifyOrgPlatformShow(val) {
                let _this = this;
                if (val === Constant.ORGANIZATION.AREA) {
                    _this.modifyOrgForm.supplierShow = true;
                    _this.modifyOrgRules.partnerPlatform[0].required = true;
                    _this.modifyOrgRules.outsidePlatform[0].required = true;
                } else {
                    _this.modifyOrgForm.supplierShow = false;
                    _this.modifyOrgRules.partnerPlatform[0].required = false;
                    _this.modifyOrgRules.outsidePlatform[0].required = false;
                }
            }
        }
    };
</script>
<style scoped>

    .el-form-item__label {
        text-align: left !important;
    }
</style>
