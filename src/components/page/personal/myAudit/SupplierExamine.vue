<template>
    <el-container style="height: 100%;">
        <el-header height="" style="padding-left: 0">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                    <el-breadcrumb-item>供应商审批</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <div class="contentMain">
            <el-row style="color: #66B1FF; font-size: 20px; text-align: center">
                <el-col :span="24">供应商审批</el-col>
            </el-row>
            <el-row style="padding: 20px 0px 50px 0px;">
                <hr/>
            </el-row>
            <el-form id="supplier" size="small" label-position="right" label-width="178px">
                <!--基本信息-->
                <el-row class="card">
                    <el-row>
                        <span class="title">基本信息 </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-row>
                    <el-row class="card-body">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="所属区域:">{{searchResult.belongOrgCode}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="供应商性质:">{{searchResult.nature == "ENTERPRISE" ? "公司" :
                                    searchResult.nature}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="供应商类型:">{{ searchResult.type == "CAR_TEAM" ?
                                    "车队":(searchResult.type ==
                                    "DEPARTMENT_OF_INFORMATION" ? "信息部" : (searchResult.type == "PLANTFORM_COMPANY" ?
                                    "平台公司"
                                    : ""))}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="结款周期:">{{searchResult.payingCycle}}天</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="公司全称:">{{searchResult.compFullName}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="公司地址:">{{searchResult.compAddress}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="公司优势区域:">{{searchResult.compAdvantageArea}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="公司简介:">{{searchResult.compProfile}}</el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>

                <!--营业执照信息-->
                <el-row class="card">
                    <el-row>
                        <span class="title">营业执照信息 </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-row>
                    <el-row class="card-body">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="营业执照注册号:">{{searchResult.businessLicenseNum}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="注册资本:">{{searchResult.registeredCapital}}万元整</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="营业执照起止日期:">{{searchResult.businessLicenseStartDate }} 至
                                    {{searchResult.businessLicenseEndDate}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="营业执照照片:" style="word-break:break-all;">
                                    <show-image :url="searchResult.businessLicensePhoto"
                                                style="display: inline-block!important; margin-left: 25px;"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>

                <!--企业法人信息-->
                <el-row class="card">
                    <el-row>
                        <span class="title">企业法人信息 </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-row>
                    <el-row class="card-body">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="法人代表姓名:">{{searchResult.corporateName}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="法人身份证号码:">{{searchResult.corporateIdCardNum}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="联系电话:">{{searchResult.corporateTel}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="邮箱:">{{searchResult.email}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="法人身份证照片（正面）:">
                                    <show-image :url="searchResult.corporateIdCardPhotoFront"
                                                style="display: inline-block!important; margin-left: 25px;"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="法人身份证照片（反面）:">
                                    <show-image :url="searchResult.corporateIdCardPhotoBack"
                                                style="display: inline-block!important; margin-left: 25px;"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>

                <!--账户信息-->
                <el-row class="card">
                    <el-row>
                        <span class="title">账户信息</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-row>
                    <el-row class="card-body">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="账户名称:">{{searchResult.payee}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="收款账号:">{{searchResult.dueBankCardNo}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="收款银行:">{{searchResult.dueBank}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="开户支行:">{{searchResult.openingBank}}</el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>

                <!--联系人信息-->
                <el-row class="card">
                    <el-row>
                        <span class="title">联系人信息 </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-row>
                    <el-row class="card-body">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="姓名:">{{searchResult.linkMan}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="身份证号:">{{searchResult.linkManIdCardNum}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="联系电话:">{{searchResult.contact}}</el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>

                <!--道路运输许可证信息-->
                <el-row class="card">
                    <el-row>
                        <span class="title">道路运输许可证信息 </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-row>
                    <el-row class="card-body">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="道路运输许可证代码:">{{searchResult.roadTransportPermitCode}}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="道路运输许可证起止日期:">
                                    {{searchResult.roadTransportPermitStartDate}} 至
                                    {{searchResult.roadTransportPermitEndDate}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="道路运输许可证照片:">
                                    <show-image :url="searchResult.roadTransportPermitPhoto"
                                                style="display: inline-block!important; margin-left: 25px;"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>

                <!--责任物流保险单-->
                <el-row class="card">
                    <el-row>
                        <span class="title">道路运输许可证信息 </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-row>
                    <el-row class="card-body">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="责任物流保险单照片:">
                                    <show-image :url="searchResult.logisticsLiabilityInsurancePhoto"
                                                style="display: inline-block!important; margin-left: 25px;"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="物流责任保险单起止日期:">
                                    {{searchResult.logisticsLiabilityInsuranceStartDate}}至
                                    {{searchResult.logisticsLiabilityInsuranceEndDate}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>
                <!--审核-->
                <el-form size="small" :model="auditOpinionForm" label-position="left">
                    <el-row>
                        <el-col :span="2">
                            <el-form-item label="审核："></el-form-item>
                        </el-col>
                        <el-col :span="22">
                            <el-switch v-model="auditOpinionForm.auditType" active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS"
                                       :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2">
                            <el-form-item label="审核意见："></el-form-item>
                        </el-col>
                        <el-col :span="22">
                            <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="auditOpinionForm.auditView"></el-input>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="24" style="text-align: right;margin: 20px 0px;">
                        <el-button size="small" type="primary" @click="auditSubmit()">确 定</el-button>
                        <el-button size="small" @click="cancelSupplierExamine()">取 消</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-container>
</template>
<script>
    import {Api, Common, Constant, Http} from 'src/global';

    export default {
        data() {
            return {
                Constant: Constant,//常量
                Common: Common,//常量
                //运单详情查询结果
                searchResult: {},
                showModify: false,
                auditOpinionForm: {
                    ids: [],
                    auditType: Constant.AUDIT_STATUS.PASS,
                    auditView: ''
                },
                auditContentForm: {}
            }
        },
        created() {
            this.getSupplierExamin();
        },
        computed: {
            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            }
        },
        methods: {
            //获取供应商审批详情
            getSupplierExamin() {
                let vm = this;
                let detail = this.$route.query.detail
                vm.auditContentForm = detail;
                vm.searchResult = detail;
            },
            cancelSupplierExamine() {
                return this.$router.push({path: '/personal/supplierAudit'});
            },
            auditSubmit() {
                let vm = this;
                vm.auditOpinionForm.ids.push(vm.auditContentForm.id);
                Http.post(Api.supplierAudit.audit, vm.auditOpinionForm, result => {
                    vm.showAuditDetail = false;
                    vm.$message.success('审批完成！');
                    vm.resetAuditForm();
                    return this.$router.push({path: '/personal/supplierAudit'});
                })
            },
            resetAuditForm() {
                let vm = this;
                vm.auditOpinionForm.ids = [],
                    vm.auditOpinionForm.auditType = Constant.AUDIT_STATUS.PASS;
                vm.auditOpinionForm.auditView = '';
            }
        },
        watch: {
            '$route': 'getSupplierExamin'
        }
    }
</script>
<style>
    #supplier .title {
        color: #66B1FF;
        font-size: 16px;
        font-weight: bold;
        display: block;
    }

    #supplier .card-body {
        padding-top: 10px;
        border-top: 1px solid #cccccc
    }

    .contentMain {
        margin: auto !important;
        width: 80% !important;
    }
</style>

