<template>
    <el-container style="height: 100%;">
        <el-header height="" style="padding-left: 0">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 外请运力</el-breadcrumb-item>
                    <el-breadcrumb-item>供应商详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <div class="contentMain">
            <el-row style="color: #66B1FF; font-size: 20px; text-align: center">
                <el-col :span="24">供应商资质详情</el-col>
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
                                <el-form-item label="供应商性质:">{{searchResult.nature == "ENTERPRISE" ? "企业" :searchResult.nature }}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="供应商类型:">{{ searchResult.type == "CAR_TEAM" ? "车队":(searchResult.type
                                    ==
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
                                <el-form-item label="营业执照起止日期:">{{searchResult.businessLicenseStartDate}} 至
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
                                <el-form-item label="物流责任保险单起止日期:">{{searchResult.logisticsLiabilityInsuranceStartDate}}
                                    至 {{searchResult.logisticsLiabilityInsuranceEndDate}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                </el-row>
                <div class="bottom clearfix" style="text-align: right">
                    <el-button type="primary" size="medium" @click="cancelSupplier()">返回</el-button>
                </div>
            </el-form>
        </div>
    </el-container>
</template>
<script>
    import DataDictionary from 'src/components/common/data/data.js';
    import {Http, Api, Common, Constant} from 'src/global';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                Constant: Constant,//常量
                Common: Common,//常量
                //运单详情查询结果
                searchResult: {},
                showModify: false
            }
        },
        created() {
            this.getSupplier(this.$route.query.id);
        },
        computed: {
            ...mapGetters([
                'user'
            ]),
            activeStatus: function () { //设置激活步骤
                let status = this.searchResult.reviewType;
                if (status == 'PASS') {
                    return 3;
                } else if (status = "UNAUDITED") {
                    return 2;
                } else {
                    return 1;
                }
            },
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
            //获取运单详情
            getSupplier(id) {
                let vm = this;
                Http.get(Api.supplier.queryById, {params: {'id': id}}, result => {
                    if (result) {
                        vm.searchResult = result.result;
                    }
                })
            },
            cancelSupplier() {
                return this.$router.push({path: '/operation/supplier'});
            }
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

