<template>
    <div>
        <el-dialog title="编辑外包信息"
                   :visible.sync="VehicleOutsourceDetailsWin.show"
                   width="80%">
            <div>
                <el-form :model="VehicleOutsourceDetailsWin.formModel" ref="vehicleOutsourceDetailsWinForm"
                         label-width="100px" size="small">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="所属区域:" prop="remainAmount">
                                <label >{{VehicleOutsourceDetailsWin.formModel.org.name}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车牌号:" prop="licenseNumber">
                                <label>{{VehicleOutsourceDetailsWin.formModel.licenseNumber}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车挂:" prop="trailerNumber">
                                <label>{{VehicleOutsourceDetailsWin.formModel.trailerNumber}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车主1:" prop="vehicleOwner1.name">
                                <label>{{VehicleOutsourceDetailsWin.formModel.vehicleOwner1.name}}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车主2:" prop="vehicleOwner2.name">
                                <label>{{VehicleOutsourceDetailsWin.formModel.vehicleOwner2.name}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="责任人:" prop="personInCharge">
                                <label>{{VehicleOutsourceDetailsWin.formModel.personInCharge}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外包时间:" prop="outsourceDate">
                                <label>{{ VehicleOutsourceDetailsWin.formModel.outsourceDate| moment("YYYY-MM-DD") }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外包总价:" prop="outsourceTotalPrice">
                                <label>{{VehicleOutsourceDetailsWin.formModel.outsourceTotalPrice}}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="首付款总额:" prop="downPaymentAmount">
                                <label>{{VehicleOutsourceDetailsWin.formModel.downPaymentAmount}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="尾款总额:" prop="balancePaymentSum">
                                <label>{{VehicleOutsourceDetailsWin.formModel.balancePaymentSum}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="月利率:" prop="monthlyInterestRate">
                                <label>{{VehicleOutsourceDetailsWin.formModel.monthlyInterestRate}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="月还款本金:" prop="principalMonth">
                                <label>{{VehicleOutsourceDetailsWin.formModel.principalMonth}}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="月还款利息:" prop="interestMonth">
                                <label>{{VehicleOutsourceDetailsWin.formModel.interestMonth}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="分期期数:" prop="periodNumber">
                                <label>{{VehicleOutsourceDetailsWin.formModel.periodNumber}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="已还期数:" prop="repaymentPeriodNumber">
                                <label >{{VehicleOutsourceDetailsWin.formModel.repaymentPeriodNumber}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="剩余期数:" prop="surplusPeriod">
                                <label >{{VehicleOutsourceDetailsWin.formModel.surplusPeriod}}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="剩余本金欠款:" prop="surplusPrincipal">
                                <label >{{VehicleOutsourceDetailsWin.formModel.surplusPrincipal}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="剩余利息欠款:" prop="surplusInterest">
                                <label >{{VehicleOutsourceDetailsWin.formModel.surplusInterest}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="欠款总额:" prop="remainAmount">
                                <label >{{VehicleOutsourceDetailsWin.formModel.remainAmount}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="申请人:" prop="createUser">
                                <label >{{VehicleOutsourceDetailsWin.formModel.createUser}}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="申请时间:" prop="createTime">
                                <label >{{VehicleOutsourceDetailsWin.formModel.createTime | moment("YYYY-MM-DD") }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="还款开始时间:">
                                <label >{{VehicleOutsourceDetailsWin.formModel.downPaymentDate | moment("YYYY-MM-DD") }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="还款结束时间:">
                                <label >{{VehicleOutsourceDetailsWin.formModel.paymentEndDate | moment("YYYY-MM-DD") }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-table class="content-table" size="small" :data="VehicleOutsourceDetailsWin.table.model"
                          element-loading-text="拼命加载中"
                          border fitheader-align="center" width="220"
                          highlight-current-row stripe>
                    <el-table-column type="selection" width="40"/>
                    <el-table-column header-align="center" width="120px" prop="licenseNumber" label="车牌号">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: blue;" @click="detailsDetailsForTableList(scope.row)">{{scope.row.licenseNumber}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="120px" prop="vehicle.specification" label="规格">
                        <template slot-scope="scope">
                            <datadictionary-name option-name="VEHICLE_SPECIFICATION"
                                                 :value="scope.row.vehicle.specification"/>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="120px" prop="vehicle.type" label="车型">
                        <template slot-scope="scope">
                            <datadictionary-name option-name="VEHICLE_TYPE" :value="scope.row.vehicle.type"/>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="120px" prop="vehicle.brands" label="品牌"/>
                    <el-table-column header-align="center" width="120px" prop="vehicle.oneWheel" label="单驱/双驱">
                        <template slot-scope="scope">
                            <datadictionary-name option-name="SINGLE_AND_DOUBLE_DRIVE" :value="scope.row.vehicle.oneWheel"/>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="120px" prop="vehicle.purchaseDate" label="购置日期">
                        <template slot-scope="scope">
                            {{scope.row.vehicle.purchaseDate | moment("YYYY-MM-DD")}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="120px" prop="vehicleOutsource.outsourceDate"
                                     label="外包日期">
                        <template slot-scope="scope">
                            {{ scope.row.vehicleOutsource.outsourceDate | moment("YYYY-MM-DD") }}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="120px" prop="kmsOutsource" label="外包公里数"/>
                    <el-table-column header-align="center" width="120px" prop="outsourceTotalPrice" label="外包总价"/>
                    <el-table-column header-align="center" width="120px" prop="invoiceAmount" label="开票金额"/>
                    <el-table-column header-align="center" width="120px" prop="adjustAmount" label="调整金额"/>
                    <el-table-column header-align="center" width="120px" prop="purchaseTaxAmount" label="购置税"/>
                    <el-table-column header-align="center" width="120px" prop="licenseCost" label="上牌费"/>
                    <el-table-column header-align="center" width="120px" prop="advertisementCost" label="车广告"/>
                    <el-table-column header-align="center" width="120px" prop="gpsCost" label="GPS"/>
                    <el-table-column header-align="center" width="120px" prop="operatingLicenseCost" label="营运证"/>
                    <el-table-column header-align="center" width="120px" prop="seatInsuranceCost" label="座位险"/>
                    <el-table-column header-align="center" width="120px" prop="lineCost" label="线路费"/>
                    <el-table-column header-align="center" width="120px" prop="trafficCompulsoryInsuranceCost"
                                     label="交强险保费"/>
                    <el-table-column header-align="center" width="120px" prop="commercialInsuranceCost" label="商业险保费"/>
                    <el-table-column header-align="center" width="120px" prop="vehicle.purchasePrice" label="上路车辆总价"/>
                    <el-table-column header-align="center" width="120px" prop="downPaymentAmount" label="首付金额"/>
                    <el-table-column header-align="center" width="150px" prop="vehicleOutsource.downPaymentDate"
                                     label="首付日期">
                        <template slot-scope="scope">
                            {{scope.row.vehicleOutsource.downPaymentDate | moment("YYYY-MM-DD")}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="150px" prop="trafficCompulsoryInsuranceStartDate"
                                     label="交强险起始时间">
                        <template slot-scope="scope">
                            {{scope.row.trafficCompulsoryInsuranceStartDate | moment("YYYY-MM-DD")}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="150px" prop="trafficCompulsoryInsuranceEndDate"
                                     label="交强险结束时间">
                        <template slot-scope="scope">
                            {{ scope.row.trafficCompulsoryInsuranceEndDate | moment("YYYY-MM-DD")}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="150px" prop="commercialInsuranceStartDate"
                                     label="商业险起始日期">
                        <template slot-scope="scope">
                            {{ scope.row.commercialInsuranceStartDate | moment("YYYY-MM-DD")}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="150px" prop="commercialInsuranceEndDate"
                                     label="商业险结束日期">
                        <template slot-scope="scope">
                            {{ scope.row.commercialInsuranceEndDate | moment("YYYY-MM-DD")}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog title="编辑车辆信息"
                       :visible.sync="VehicleOutsourceDetailsDetailsWin.show"
                       append-to-body
                       width="70%">
                <el-form :model="VehicleOutsourceDetailsDetailsWin.formModel" ref="VehicleOutsourceDetailsDetailsWinForm"
                         label-width="120px" size="small">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车牌号:" prop="licenseNumber">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.licenseNumber }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车型:" prop="vehicle.type">
                                <datadictionary-name :value="VehicleOutsourceDetailsDetailsWin.formModel.vehicle.type"
                                                     option-name="VEHICLE_TYPE"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="品牌:" prop="vehicle.vehicleLicense.brandType">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.vehicle.vehicleLicense.brandType }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单驱/双驱:" prop="vehicle.oneWheel">
                                <datadictionary-name :value="VehicleOutsourceDetailsDetailsWin.formModel.vehicle.oneWheel" option-name="SINGLE_AND_DOUBLE_DRIVE"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="购置日期:" prop="vehicle.purchaseDate">
                                <label> {{VehicleOutsourceDetailsDetailsWin.formModel.vehicle.purchaseDate | moment("YYYY-MM-DD")}} </label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外包日期:" prop="vehicleOutsource.outsourceDate">
                                <label>
                                    {{VehicleOutsourceDetailsDetailsWin.formModel.vehicleOutsource.outsourceDate  | moment("YYYY-MM-DD")}} </label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车辆总价(元):" prop="vehicle.purchasePrice">
                                <label>{{VehicleOutsourceDetailsDetailsWin.formModel.vehicle.purchasePrice}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外包总价(元):" prop="outsourceTotalPrice">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.outsourceTotalPrice }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="外包公里数:" prop="kmsOutsource">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.kmsOutsource }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="开票金额(元):" prop="invoiceAmount">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.invoiceAmount }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="调整金额(元):" prop="adjustAmount">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.adjustAmount }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="购置税(元):" prop="purchaseTaxAmount">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.purchaseTaxAmount }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车广告(元):" prop="advertisementCost">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.advertisementCost }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="GPS(元):" prop="gpsCost">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.gpsCost }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="营运证(元):" prop="operatingLicenseCost">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.operatingLicenseCost }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="座位险(元):" prop="seatInsuranceCost">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.seatInsuranceCost }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="上牌费(元):" prop="licenseCost">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.licenseCost }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="线路费(元):" prop="lineCost">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.lineCost }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="交强险保费(元):" prop="trafficCompulsoryInsuranceCost">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.trafficCompulsoryInsuranceCost }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="商业险保费(元):" prop="commercialInsuranceCost">
                                <label>{{ VehicleOutsourceDetailsDetailsWin.formModel.commercialInsuranceCost }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                        <el-col :span="6">
                            <el-form-item label="交强险起始时间:" prop="trafficCompulsoryInsuranceStartDate">
                                <label> {{VehicleOutsourceDetailsDetailsWin.formModel.trafficCompulsoryInsuranceStartDate | moment("YYYY-MM-DD")}} </label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="交强险结束时间:" prop="trafficCompulsoryInsuranceEndDate">
                                <label> {{VehicleOutsourceDetailsDetailsWin.formModel.trafficCompulsoryInsuranceEndDate | moment("YYYY-MM-DD")}} </label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="商业险起始日期:" prop="commercialInsuranceStartDate">
                                <label> {{VehicleOutsourceDetailsDetailsWin.formModel.commercialInsuranceStartDate | moment("YYYY-MM-DD")}} </label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="商业险结束日期:" prop="commercialInsuranceEndDate">
                                <label> {{VehicleOutsourceDetailsDetailsWin.formModel.commercialInsuranceEndDate | moment("YYYY-MM-DD")}} </label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="首付日期:" prop="vehicleOutsource.downPaymentDate">
                                <label> {{VehicleOutsourceDetailsDetailsWin.formModel.downPaymentDate | moment("YYYY-MM-DD")}} </label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="首付金额:" prop="downPaymentAmount">
                                <label>{{VehicleOutsourceDetailsDetailsWin.formModel.downPaymentAmount}}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import DatadictionaryName from '../../../common/select/DatadictionaryName'
    import moment from 'moment'
    export default {
        components: {
            DatadictionaryName
        },
        data() {
            let user = this.$store.getters.user
            return {
                initializeModel:{},
                VehicleOutsourceDetailsWin: {
                    show: false,
                    formModel: {
                        licenseNumber: '',
                        trailerNumber: '',
                        outsourceDate: '',
                        outsourceTotalPrice: '',
                        downPaymentAmount: '',
                        balancePaymentSum: '',
                        principalMonth: '',
                        interestMonth: '',
                        periodNumber: 0,
                        repaymentPeriodNumber: 0,
                        surplusPeriod: 0,
                        surplusPrincipal: 0,
                        surplusInterest: 0,
                        remainAmount: 0,
                        createUser: '',
                        createTime: '',
                        downPaymentDate: '',
                        paymentEndDate:'',
                        personInCharge:user.name,
                        monthlyInterestRate: 0.7,
                        vehicleOutsource: {
                            name: ''
                        },
                        vehicleOwner1: {
                            name: ''
                        },
                        vehicleOwner2: {},
                        vehicle: {},
                        org: {
                            name: '',
                            code: ''
                        }
                    },
                    table: {//表格对应属性
                        model: []
                    },
                },
                VehicleOutsourceDetailsDetailsWin: {
                    index: '',
                    show: false,
                    formModel: {
                        licenseNumber:'',
                        kmsOutsource:'',
                        invoiceAmount:'',
                        adjustAmount:'',
                        purchaseTaxAmount:'',
                        advertisementCost:'',
                        gpsCost:'',
                        operatingLicenseCost:'',
                        seatInsuranceCost:'',
                        licenseCost:'',
                        lineCost:'',
                        trafficCompulsoryInsuranceCost:'',
                        commercialInsuranceCost:'',
                        trafficCompulsoryInsuranceStartDate:'',
                        trafficCompulsoryInsuranceEndDate:'',
                        commercialInsuranceStartDate:'',
                        commercialInsuranceEndDate:'',
                        downPaymentDate:new Date(),
                        vehicleOutsource: {
                            downPaymentDate:new Date(),
                            downPaymentAmount:''
                        },
                        vehicle: {
                            type:'',
                            brands:'',
                            oneWheel:'',
                            vehicleLicense:{
                                brandType:''
                            },
                        }
                    },
                }
            }
        },
        mounted(){
            this.initializeModel = _.cloneDeep(this._data);
        },
        methods: {
            cloneMode(){
                return _.cloneDeep(this.initializeModel)
            },
            //show
            showDialog(row) {//显示此页面
                const _this = this;
                if (row) {
                    row = _.merge(_this.cloneMode().VehicleOutsourceDetailsWin.formModel, row);
                    if (row.vehicleOutsourceDetails) {
                        row.vehicleOutsourceDetails.forEach(ve => {//列表显示需要 车辆外包信息的字段
                            ve.vehicleOutsource = {
                                downPaymentDate: row.downPaymentDate,
                                outsourceDate: row.outsourceDate
                            } //车辆明细中 放入车辆外包信息
                        });
                        _this.VehicleOutsourceDetailsWin.formModel = row;
                        _this.VehicleOutsourceDetailsWin.table.model = row.vehicleOutsourceDetails; //放入表格
                        _this.VehicleOutsourceDetailsWin.show = true
                    }
                } else {
                    _this.$message.error("数据异常,该合作车信息无明细");
                }
            },
            //table
            detailsDetailsForTableList(row, index) {
                this.VehicleOutsourceDetailsDetailsWin.show = true
                this.VehicleOutsourceDetailsDetailsWin.index = index
                this.VehicleOutsourceDetailsDetailsWin.formModel = _.merge(this.cloneMode().VehicleOutsourceDetailsDetailsWin.formModel, row)
            }
        }
    }
</script>
