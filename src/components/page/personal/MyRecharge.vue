<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>我的个人充值记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form label-width="80px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <el-input type="text" v-model="searchParam.cardNo" :clearable="true"
                                      placeholder="请输入卡号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值状态:">
                            <dictionary-select option-name="ETC_RECHARGE_TYPE" v-model="searchParam.status"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="批次号:">
                            <el-input v-model="searchParam.rechargeNum" :clearable=true
                                      placeholder="请输入充值批次号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchEtcList">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetWinform">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" @click="applyMoney" :disabled="multipleSelection.length>=1"
                       v-permission="'/myRecharge/preCharge'">预充值
            </el-button>
            <el-button size="mini" type="primary" @click="unWorkMoney" :disabled="multipleSelection.length!==1"
                       v-permission="'/myRecharge/cancel'">撤销
            </el-button>
            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      @selection-change="handleSelectionChange"
                      size="small">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="申请流水号" prop="applyOperationNumber" width="150px;"></el-table-column>
                <el-table-column label="充值批次号" prop="rechargeBatchNumber" width="150px;"></el-table-column>
                <el-table-column label="卡号" prop="cardNo" width="200px;" show-overflow-tooltip/>
                <el-table-column label="合作公司" prop="cardCompany" width="150px;"></el-table-column>
                <el-table-column label="所属组织" prop="applyOrgCode" min-width="120px;"></el-table-column>
                <el-table-column label="车牌号" prop="vehicleCode" min-width="140"></el-table-column>
                <el-table-column label="车辆类型" prop="operationMode">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.operationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="充值金额" prop="rechargeAmount"></el-table-column>
                <el-table-column label="充值类型" prop="type">
                </el-table-column>
                <el-table-column label="供应商" prop="supplier" width="150px;">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CARD_SUPPLIER"
                                                :value="scope.row.supplier"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="申请时间" prop="applyTime" width="150px;"></el-table-column>
                <el-table-column label="申请人" prop="applyUser" width="150px;"></el-table-column>
                <el-table-column label="充值状态" prop="status">
                </el-table-column>
                <el-table-column label="充值人" prop="rechargeUser" width="150px;"></el-table-column>
                <el-table-column label="充值时间" prop="rechargeTime" width="150px;"></el-table-column>
            </el-table>
            <!--分页-->
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
        <el-dialog title="预充值" :visible.sync="rechargeApplyWin" width="600px" :before-close="handleClose">
            <el-form inline size="small" :model="rechargeApplyForm" label-width="200px" ref="rechargeApplyForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="油卡卡号：" prop="cardNos">
                            <oil-card-select style="width: 200px;" v-model="rechargeApplyForm.cardNo"
                                             :currentUser="user.username"
                                             @change="getBalanceAmount"></oil-card-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="油卡余额：" prop="initialBalance">
                            <el-input type="number" style="width: 200px;" v-model="rechargeApplyForm.initialBalance"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="充值金额：" prop="rechargeAmount">
                            <el-input type="number" placeholder="请填写金额" style="width: 200px;"
                                      v-model="rechargeApplyForm.rechargeAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="属性：" prop="operationMode" v-show="rechargeApplyForm.operationModeShow">
                            <dictionary-select style="width: 200px;" v-model="rechargeApplyForm.operationMode"
                                               option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="applyMoneyEtcList('rechargeApplyForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Api, Common, Http} from 'src/global';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                initializeModel: {},
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    cardNo: '',
                    status: '',
                    rechargeNum: ''
                },//返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                rechargeApplyWin: false,
                rechargeApplyForm: {
                    cardNo: '',
                    initialBalance: 0,
                    rechargeAmount: '',
                    operationModeShow: false,
                    operationMode: '',
                    currentUser: this.$store.getters.user.username,
                    oilCardResult: []
                },
                addBaseOilCard: {
                    rechargeAmount: [
                        {required: true, message: '请填写金额', trigger: 'blur'},
                        {pattern: /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/, message: '请输入正确的金额!'},
                    ],
                    operationMode: [
                        {required: true, message: '预充值车辆属性不能为空', trigger: 'blur'},
                    ]
                },
                multipleSelection: [],
                currentRows: null,//操作行的数据
                disabled: {
                    unWorkMoneys: true,
                    preRecharge: true,
                },
            }
        },
        computed: {
            ...mapGetters([
                'user'
            ])
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchEtcList();
        },
        watch: { //数据监听
            multipleSelection(val) {
                this.disabled.unWorkMoneys = val.length != -1;
                this.disabled.preRecharge = val.length != -1;
            }
        },
        methods: {
            //通用
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            //通用
            handleCurrentChange(val) {
                let _this = this;
                _this.searchParam.currentPage = val;
                this.searchEtcList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let _this = this;
                _this.searchParam.pageSize = val;
                this.searchEtcList();
            },
            //查询
            searchEtcList() {
                let _this = this;
                Http.get(Api.oilCardRecharge.myRecharge, {params: _this.searchParam}, result => {
                    _this.searchResult.result = result.result;
                    _this.searchResult.result.forEach((item) => {
                        if (!item.vehicles) {
                            item.vehicles = {}
                        }
                    });
                    _this.searchResult.totalCount = result.totalCount;
                    _this.searchParam.currentPage = result.currentPage;
                    _this.searchParam.pageSize = result.pageSize
                })
            },
            resetWinform() {
                let _this = this;
                _this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    cardNo: '',
                    status: '',
                    rechargeNum: ''
                }
            },
            cancel() {
                this.rechargeApplyWin = false;
                this.rechargeApplyForm = {
                    cardNo: '',
                    initialBalance: '',
                    rechargeAmount: '',
                    oilCardResult: [],
                    cardCompany: ''
                }
            },
            handleClose() {
                this.cancel();
            },
            unWorkMoney() {
                let _this = this;
                let ids = [];
                this.multipleSelection.forEach((item) => {
                    if (item.type === '发车充值') {
                        _this.$message.warning("发车充值不能撤销");
                    } else if (item.status === '已撤销') {
                        _this.$message.warning("已撤销不能撤销");
                    } else if (item.status === '已作废') {
                        _this.$message.warning("已作废不能撤销");
                    } else if (item.status === '已充值') {
                        _this.$message.warning("已充值不能撤销");
                    }
                    else {
                        ids.push(item.id);
                        _this.$confirm('是否撤回?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            Http.post(Api.oilCardRecharge.unWorkMoney, ids, result => {
                                _this.searchEtcList()
                                _this.$message.success('撤销成功！')
                            })
                        })
                    }
                })
            },
            applyMoney() {
                let _this = this;
                _this.multipleSelection.forEach((item) => {
                    _this.rechargeApplyForm.cardNo = item.cardNo;
                    _this.rechargeApplyForm.cardCompany = item.cardCompany;
                });
                _this.rechargeApplyWin = true;
            },
            applyMoneyEtcList(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.oilCardRecharge.myPrecharge, _this.rechargeApplyForm, function (res) {
                            _this.rechargeApplyWin = false;
                            _this.$message.success('申请成功！');
                            _this.searchEtcList();
                        })
                    }
                })
            },
            getBalanceAmount(obj) {
                let _this = this;
                _this.rechargeApplyForm.initialBalance = obj.balanceAmount;
                Http.get(Api.oilCard.getDeTailById, {params: {'id': obj.id}}, result => {
                    let model = result.result;
                    if (model.cardholderType && model.orgCode !== '总部') {
                        _this.rechargeApplyForm.operationMode = "OUT_INVITE";
                        _this.rechargeApplyForm.operationModeShow = true
                        _this.addBaseOilCard.operationMode[0].required = true
                    } else {
                        _this.rechargeApplyForm.operationMode = "";
                        _this.rechargeApplyForm.operationModeShow = false
                        _this.addBaseOilCard.operationMode[0].required = false
                    }
                    _this.rechargeApplyWin = true;
                });
            }
        }
    }
</script>
