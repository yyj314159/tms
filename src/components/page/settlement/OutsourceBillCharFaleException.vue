<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应付信息</el-breadcrumb-item>
                <el-breadcrumb-item>生成合作车账单异常</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form :model="model.searchParam" label-width="80px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="model.searchParam.licenseNumber"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="月份:">
                            <el-date-picker style="display: block; width:100%;"
                                            v-model="model.searchParam.month"
                                            type="month"
                                            value-format="yyyy-MM"
                                            placeholder="选择月"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select style="display: block; width:100%;"
                                             v-model="model.searchParam.supplierId"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right;" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchPayableBillForMainList">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetMainSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <general-table :gridInstance="table.gridInstance"
                           :detailDisabled="table.detailDisabled"
                           @selectChange="handlerChange"
                           @on-dbclick="handleRowHandle"
                           ref="mainTable"/>
        </el-main>
        <el-dialog :title="win.winTitle.outsourceBillExceptionDetailsWin"
                   :visible.sync="win.winShow.outsourceBillExceptionDetailsWinShow"
                   width="1100px">
            <span> 车牌号&nbsp;&nbsp;:&nbsp;&nbsp;{{ win.model.outsourceBillExceptionDetailsModelForm.licenseNumber }}</span>
            <span> &nbsp;&nbsp;&nbsp;账单月份&nbsp;&nbsp;:&nbsp;&nbsp;{{ win.model.outsourceBillExceptionDetailsModelForm.month }}</span>
            <span>&nbsp;&nbsp;&nbsp;产生时间&nbsp;&nbsp;:&nbsp;&nbsp;{{ win.model.outsourceBillExceptionDetailsModelForm.createTime }}</span>
            <span> &nbsp;&nbsp;&nbsp;产生人&nbsp;&nbsp;:&nbsp;&nbsp;{{ win.model.outsourceBillExceptionDetailsModelForm.createUser }}</span>
            <br/><br/>
            <span> 异常信息:<br/>{{ win.model.outsourceBillExceptionDetailsModelForm.causeOfFailure }}</span>
        </el-dialog>
    </el-container>
</template>


<script>
    import {Api, Common, Http} from 'src/global'
    import DatadictionaryName from "../../common/select/DatadictionaryName";

    export default {
        components: {DatadictionaryName},
        data() {
            return {
                exportDetailLoading: true,
                //拷贝 初始化data
                initializeModel: {},
                model: {
                    searchParam: {//查询参数
                        licenseNumber: '',
                        month: '',
                        supplierId: '',
                    }
                },
                win: {
                    winTitle: { //弹出框 表头
                        outsourceBillExceptionDetailsWin: '异常信息'
                    },
                    winShow: {//是否显示弹框
                        outsourceBillExceptionDetailsWinShow: false
                    },
                    model: {
                        outsourceBillExceptionDetailsModelForm: {
                            causeOfFailure: ''
                        }
                    },
                },
                table: {//表格对应属性
                    gridInstance: {//table表单创建属性
                        default: {
                            sortable: false,//是否表格排序
                            headerAlign: "center",
                            minWidth: '80'
                        },
                        columns: [
                            {
                                title: '车牌号',
                                key: 'licenseNumber',
                            }, {
                                title: '月份',
                                key: 'month',
                            }, {
                                title: '供应商',
                                key: 'supplierName',
                                render: function (val) {
                                    return val.supplier ? val.supplier.name : "";
                                }
                            }, {
                                title: '异常信息',
                                key: 'causeOfFailure',
                            }, {
                                title: '创建人',
                                key: 'createUser',
                            }, {
                                title: '创建时间',
                                key: 'createTime',
                            }
                        ]
                    },
                    detailDisabled: false,
                }
            }
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            //立即执行
            this.searchPayableBillForMainList();
        },
        methods: {
            /*拷贝初始化对象*/
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            //main
            searchPayableBillForMainList() {//main 查询
                const _this = this;
                _this.model.searchParam.month = Common.date.dateFormat(_this.model.searchParam.month, "YYYY-MM");
                _this.$refs.mainTable.gridDataInit(Api.outsourceBillCharFale.page, _this.model.searchParam);
            },
            resetMainSearchParam() {
                this.model.searchParam = this.cloneMode().model.searchParam
            },
            //table
            handlerChange(rows) {//选中时触发
                this.selections = rows
            },
            handleRowHandle(row) {
                const _this = this;
                Http.get(Api.outsourceBillCharFale.queryById, {params: {'id': row.id}}, result => {
                    if (result.result) {
                        _this.win.model.outsourceBillExceptionDetailsModelForm = result.result
                        _this.win.winShow.outsourceBillExceptionDetailsWinShow = true
                    } else {
                        _this.$message.error("请刷新重试");
                    }
                })
            }
        }
    }
</script>
