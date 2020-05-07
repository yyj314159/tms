<template>
    <div>
        <el-dialog title="编辑外包信息"
                   :visible.sync="VehicleOutsourceEditWin.show"
                   width="80%">
            <div>
                <el-form :model="VehicleOutsourceEditWin.formModel" ref="vehicleOutsourceEditWinForm" :rules="VehicleOutsourceEditWin.editFormRules"
                         label-width="100px" size="small">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="所属区域:" prop="remainAmount">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.org.name" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车牌号:" prop="licenseNumber">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.licenseNumber" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车挂:" prop="trailerNumber">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.trailerNumber" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车主1:" prop="vehicleOwner1.name">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.vehicleOwner1.name"
                                          :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车主2:" prop="vehicleOwner2.name">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.vehicleOwner2.name"
                                          :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="责任人:" prop="personInCharge">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.personInCharge"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外包时间:" prop="outsourceDate">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.outsourceDate" :disabled="true">
                                    {{ VehicleOutsourceEditWin.formModel.outsourceDate| moment("YYYY-MM-DD") }}
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外包总价:" prop="outsourceTotalPrice">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.outsourceTotalPrice"
                                          :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="首付款总额:" prop="downPaymentAmount">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.downPaymentAmount"
                                          :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="尾款总额:" prop="balancePaymentSum">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.balancePaymentSum"
                                          :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="月利率:" prop="monthlyInterestRate">
                                <!--<el-input v-model="VehicleOutsourceEditWin.formModel.monthlyInterestRate"/>-->
                                <el-input-number v-model="VehicleOutsourceEditWin.formModel.monthlyInterestRate" :controls="false" style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="月还款本金:" prop="principalMonth">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.principalMonth" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="月还款利息:" prop="interestMonth">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.interestMonth" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="分期期数:" prop="periodNumber">
                                <el-input-number v-model="VehicleOutsourceEditWin.formModel.periodNumber" :disabled="true"
                                                 :controls="false"
                                                 :min='0'
                                                 style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="已还期数:" prop="repaymentPeriodNumber">
                                <!--<el-input v-model="VehicleOutsourceEditWin.formModel.repaymentPeriodNumber"
                                          v-if="VehicleOutsourceEditWin.formModel.auditStatus!=='PASS'" @change="calculateByStages"/>-->
                                <el-input-number v-model="VehicleOutsourceEditWin.formModel.repaymentPeriodNumber"
                                                 :controls="false"
                                                 :min='0'
                                                 style="width: 100%"
                                                 @change="calculateByStages"/>
                                <!--<label v-if="VehicleOutsourceEditWin.formModel.auditStatus==='PASS'">{{VehicleOutsourceEditWin.formModel.repaymentPeriodNumber}}</label>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="剩余期数:" prop="surplusPeriod">
                                <el-input-number v-model="VehicleOutsourceEditWin.formModel.surplusPeriod" :disabled="true"
                                                 :controls="false"
                                                 :min='0'
                                                 style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="剩余本金欠款:" prop="surplusPrincipal">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.surplusPrincipal"
                                          :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="剩余利息欠款:" prop="surplusInterest">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.surplusInterest" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="欠款总额:" prop="remainAmount">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.remainAmount" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="申请人:" prop="createUser">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.createUser" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="申请时间:" prop="createTime">
                                <el-input v-model="VehicleOutsourceEditWin.formModel.createTime" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="还款开始时间:">
                                <el-date-picker
                                    v-model="VehicleOutsourceEditWin.formModel.downPaymentDate"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    style="width: 100%"
                                    @change="calculateByStages"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="还款结束时间:">
                                <el-date-picker
                                    v-model="VehicleOutsourceEditWin.formModel.paymentEndDate"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    style="width: 100%"
                                    @change="calculateByStages"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-table class="content-table" size="small" :data="VehicleOutsourceEditWin.table.model"
                          element-loading-text="拼命加载中"
                          border fitheader-align="center" width="220"
                          highlight-current-row stripe>
                    <el-table-column type="selection" width="40"/>
                    <el-table-column header-align="center" width="120px" prop="licenseNumber" label="车牌号">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: blue;" @click="editDetailsForTableList(scope.row)">{{scope.row.licenseNumber}}</a>
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
                    <el-table-column header-align="center" width="150px" prop="downPaymentDate"
                                     label="首付日期">
                        <template slot-scope="scope">
                            {{scope.row.downPaymentDate | moment("YYYY-MM-DD")}}
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


                    <el-table-column label="操作" header-align="center" fixed="right" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" size="mini"
                                       @click="editDetailsForTableList(scope.row,scope.$index)"></el-button>
                            <el-button type="text" icon="el-icon-edit" size="mini" v-if="false"
                                       @click="deleteDetailsForTableList(scope.row,scope.$index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div slot="footer" class="dialog-footer" align="center" style="margin-top: 10px">
                    <el-button @click="VehicleOutsourceEditWin.show = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="vehicleOutsourceEditWinSubmit('vehicleOutsourceEditWinForm')"
                               size="small">确 定
                    </el-button>
                </div>
            </div>
            <el-dialog title="编辑车辆信息"
                       :visible.sync="VehicleOutsourceEditDetailsWin.show"
                       append-to-body
                       width="70%">
                <el-form :model="VehicleOutsourceEditDetailsWin.formModel" ref="VehicleOutsourceEditDetailsWinForm"
                         :rules="VehicleOutsourceEditDetailsWin.detailsFormRules"
                         label-width="120px" size="small">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车牌号:" prop="licenseNumber">
                                <label>{{ VehicleOutsourceEditDetailsWin.formModel.licenseNumber }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车型:" prop="vehicle.type">
                                <datadictionary-name :value="VehicleOutsourceEditDetailsWin.formModel.vehicle.type"
                                                     option-name="VEHICLE_TYPE"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="品牌:" prop="vehicle.vehicleLicense.brandType">
                                <label>{{ VehicleOutsourceEditDetailsWin.formModel.vehicle.vehicleLicense.brandType }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单驱/双驱:" prop="vehicle.oneWheel">
                                <datadictionary-name :value="VehicleOutsourceEditDetailsWin.formModel.vehicle.oneWheel" option-name="SINGLE_AND_DOUBLE_DRIVE"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="购置日期:" prop="vehicle.purchaseDate">
                                <label> {{VehicleOutsourceEditDetailsWin.formModel.vehicle.purchaseDate |
                                    moment("YYYY-MM-DD")}} </label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外包日期:" prop="vehicleOutsource.outsourceDate">
                                <label> {{VehicleOutsourceEditDetailsWin.formModel.vehicleOutsource.outsourceDate}} </label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车辆总价(元):" prop="vehicle.purchasePrice">
                                <label>{{VehicleOutsourceEditDetailsWin.formModel.vehicle.purchasePrice}}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外包总价(元):" prop="outsourceTotalPrice">
                                <label>{{ VehicleOutsourceEditDetailsWin.formModel.outsourceTotalPrice }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="外包公里数:" prop="kmsOutsource">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.kmsOutsource"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="开票金额(元):" prop="invoiceAmount">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.invoiceAmount"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="调整金额(元):" prop="adjustAmount">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.adjustAmount"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="购置税(元):" prop="purchaseTaxAmount">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.purchaseTaxAmount"
                                          disabled/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车广告(元):" prop="advertisementCost">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.advertisementCost"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="GPS(元):" prop="gpsCost">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.gpsCost"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="营运证(元):" prop="operatingLicenseCost">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.operatingLicenseCost"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="座位险(元):" prop="seatInsuranceCost">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.seatInsuranceCost"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="上牌费(元):" prop="licenseCost">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.licenseCost"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="线路费(元):" prop="lineCost">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.lineCost"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="交强险保费(元):" prop="trafficCompulsoryInsuranceCost">
                                <el-input
                                    v-model="VehicleOutsourceEditDetailsWin.formModel.trafficCompulsoryInsuranceCost"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="商业险保费(元):" prop="commercialInsuranceCost">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.commercialInsuranceCost"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                        <el-col :span="6">
                            <el-form-item label="交强险起始时间:" prop="trafficCompulsoryInsuranceStartDate">
                                <el-date-picker
                                    v-model="VehicleOutsourceEditDetailsWin.formModel.trafficCompulsoryInsuranceStartDate"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    style="width: 100%"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="交强险结束时间:" prop="trafficCompulsoryInsuranceEndDate">
                                <el-date-picker
                                    v-model="VehicleOutsourceEditDetailsWin.formModel.trafficCompulsoryInsuranceEndDate"
                                    size="small"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 100%"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="商业险起始日期:" prop="commercialInsuranceStartDate">
                                <el-date-picker
                                    v-model="VehicleOutsourceEditDetailsWin.formModel.commercialInsuranceStartDate"
                                    size="small"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 100%"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="商业险结束日期:" prop="commercialInsuranceEndDate">
                                <el-date-picker
                                    v-model="VehicleOutsourceEditDetailsWin.formModel.commercialInsuranceEndDate"
                                    size="small"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 100%"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="首付日期:" prop="vehicleOutsource.downPaymentDate">
                                <el-date-picker
                                    v-model="VehicleOutsourceEditDetailsWin.formModel.downPaymentDate"
                                    size="small"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 100%"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="首付金额:" prop="downPaymentAmount">
                                <el-input v-model="VehicleOutsourceEditDetailsWin.formModel.downPaymentAmount" @change="downPaymentAmountVerify"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer" align="center">
                    <el-button @click="VehicleOutsourceEditDetailsWin.show = false" size="small">取 消</el-button>
                    <el-button type="primary"
                               @click="vehicleOutsourceEditDetailsWinSubmit('VehicleOutsourceEditDetailsWinForm')"
                               size="small">确 定
                    </el-button>
                </div>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import {Http, Common, Api,Constant} from 'src/global'
    import DatadictionaryName from '../../../common/select/DatadictionaryName'
    import moment from 'moment'
    export default {
        components: {
            DatadictionaryName
        },
        data() {
            //let user = this.$store.getters.user;
            return {
                initializeModel:{},
                VehicleOutsourceEditWin: {
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
                        downPaymentDate: moment().add(1, 'months').date(1),
                        paymentEndDate:moment(moment().add(1, 'months')).add(36, 'months').date(1),
                        personInCharge:'',
                        monthlyInterestRate: Constant.OUTSOURCE_SUM.MONTHLY_INTEREST_RATE,
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
                    editFormRules: {
                        monthlyInterestRate: [
                            {required: true, message: '月利率不能为空', trigger: 'blur'}
                        ],
                        personInCharge:[
                            {required: true, message: '责任人不能为空', trigger: 'blur'}
                        ],
                        repaymentPeriodNumber:[
                            {pattern: /^[0-9]\d*$/, message: '只能输入整数'}
                        ]

                    },
                },
                VehicleOutsourceEditDetailsWin: {
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
                    detailsFormRules: {
                        kmsOutsource: [
                            {required: true, message: '请输入外包公里数', trigger: 'blur'}
                        ]
                    },
                }
            }
        },
        watch: {
            'VehicleOutsourceEditDetailsWin.show'(val) {
                if (val) {
                    this.detailMoneySum()
                } else {
                    this.VehicleOutsourceEditDetailsWin = this.cloneMode().VehicleOutsourceEditDetailsWin
                }
            },
            //已还期数监听 算 剩余期数
            "VehicleOutsourceEditWin.formModel.periodNumber"(val) {
                let _this = this;
                //期数-已还 = 未还
                _this.VehicleOutsourceEditWin.formModel.surplusPeriod = Common.util.numberFormat(val) - Common.util.numberFormat(_this.VehicleOutsourceEditWin.formModel.repaymentPeriodNumber);
                //期数-未还 = 已还 (给已还赋值 省的她为空)
                _this.VehicleOutsourceEditWin.formModel.repaymentPeriodNumber = Common.util.numberFormat(val) - Common.util.numberFormat(_this.VehicleOutsourceEditWin.formModel.surplusPeriod);
                _this.calculateSum()
            },
            'VehicleOutsourceEditWin.formModel.repaymentPeriodNumber'(val) {
                let periodNumber = Common.util.numberFormat(this.VehicleOutsourceEditWin.formModel.periodNumber);
                val = Common.util.numberFormat(val)
                //期数 - 已还 = 未还 (已还 大于期数 未还归零)
                this.VehicleOutsourceEditWin.formModel.surplusPeriod = parseInt(periodNumber - val) > 0 ? parseInt(periodNumber - val) : 0
                this.calculateByStages()
            },
            'VehicleOutsourceEditWin.formModel.monthlyInterestRate'(){
                this.calculateByStages()
            },
            //明细金额监听
            'VehicleOutsourceEditDetailsWin.formModel.invoiceAmount'() {
                this.VehicleOutsourceEditDetailsWin.formModel.purchaseTaxAmount =
                    (Common.util.numberFormat(this.VehicleOutsourceEditDetailsWin.formModel.invoiceAmount) / Constant.OUTSOURCE_SUM.PURCHASE_TAX_AMOUNT_RATIO).toFixed(2)
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.adjustAmount'() {
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.licenseCost'() {
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.advertisementCost'() {
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.gpsCost'() {
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.operatingLicenseCost'() {
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.seatInsuranceCost'() {
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.lineCost'() {
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.trafficCompulsoryInsuranceCost'() {
                this.detailMoneySum()
            },
            'VehicleOutsourceEditDetailsWin.formModel.commercialInsuranceCost'() {
                this.detailMoneySum()
            },
            deep: true
        },
        mounted(){
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data)
        },
        methods: {
            cloneMode(){
                return _.cloneDeep(this.initializeModel)
            },
            //计算金额
            calculateSum() {
                const _this = this;
                var model = _this.VehicleOutsourceEditWin.table.model
                if (model) {
                    let outsourceTotalPrice = 0;//外包总价
                    let downPaymentAmount = 0;//首付总金额
                    let balancePaymentSum = 0;// 尾款总额
                    model.forEach(row => {
                        //外包总价 = 开票金额+调整金额（由领导定夺）+购置税+上牌费+车广告+GPS+营运证+座位险+线路费+交强险保费+商业险保费
                        outsourceTotalPrice +=
                            Common.util.numberFormat(row.invoiceAmount)//开票金额
                            + (Common.util.numberFormat(row.purchaseTaxAmount))//购置税
                            + Common.util.numberFormat(row.adjustAmount)//调整金额
                            + Common.util.numberFormat(row.licenseCost)//上牌费
                            + Common.util.numberFormat(row.advertisementCost)//车广告
                            + Common.util.numberFormat(row.gpsCost)//GPS
                            + Common.util.numberFormat(row.operatingLicenseCost)//营运证
                            + Common.util.numberFormat(row.seatInsuranceCost)//座位险
                            + Common.util.numberFormat(row.lineCost)//线路费
                            + Common.util.numberFormat(row.vehicle.purchasePrice)//上路车辆总价
                            + Common.util.numberFormat(row.trafficCompulsoryInsuranceCost)//交强险保费
                            + Common.util.numberFormat(row.commercialInsuranceCost)//商业险保费

                        if (row) {
                            downPaymentAmount += Common.util.numberFormat(row.downPaymentAmount)
                        }
                    })
                    balancePaymentSum = Common.util.numberFormat(outsourceTotalPrice) - Common.util.numberFormat(downPaymentAmount)
                    this.VehicleOutsourceEditWin.formModel.outsourceTotalPrice = outsourceTotalPrice.toFixed(2);
                    this.VehicleOutsourceEditWin.formModel.downPaymentAmount = downPaymentAmount.toFixed(2);
                    this.VehicleOutsourceEditWin.formModel.balancePaymentSum = balancePaymentSum.toFixed(2);
                    this.calculateByStages()
                }
            },
            //明细外包总价
            detailMoneySum() {
                var detailsModel = this.VehicleOutsourceEditDetailsWin.formModel
                let outsourceTotalPrice = 0
                outsourceTotalPrice += Common.util.numberFormat(detailsModel.invoiceAmount)
                    + Common.util.numberFormat(detailsModel.adjustAmount)
                    + Common.util.numberFormat(detailsModel.purchaseTaxAmount)
                    + Common.util.numberFormat(detailsModel.licenseCost)
                    + Common.util.numberFormat(detailsModel.advertisementCost)
                    + Common.util.numberFormat(detailsModel.gpsCost)
                    + Common.util.numberFormat(detailsModel.operatingLicenseCost)
                    + Common.util.numberFormat(detailsModel.seatInsuranceCost)
                    + Common.util.numberFormat(detailsModel.lineCost)
                    + Common.util.numberFormat(detailsModel.trafficCompulsoryInsuranceCost)
                    + Common.util.numberFormat(detailsModel.commercialInsuranceCost)
                    + Common.util.numberFormat(detailsModel.vehicle.purchasePrice)
                this.VehicleOutsourceEditDetailsWin.formModel.outsourceTotalPrice = outsourceTotalPrice.toFixed(2)
            },
            //计算分期期数
            calculateByStages(newVal,oldVal) {
                let _this = this;
                //根据还款开始结束时间  计算 分期期数
                let startDate = _this.VehicleOutsourceEditWin.formModel.downPaymentDate;
                let endDate = _this.VehicleOutsourceEditWin.formModel.paymentEndDate;
                if (startDate && endDate) {
                    _this.VehicleOutsourceEditWin.formModel.periodNumber = Common.date.getIntervalMonth(startDate, endDate);
                } else {
                    _this.VehicleOutsourceEditWin.formModel.periodNumber = "0";
                }
                _this.principalAndInterestCompute();
            },
            //计算利息
            principalAndInterestCompute() {
                let _this = this
                let balancePaymentSum = Common.util.numberFormat(_this.VehicleOutsourceEditWin.formModel.balancePaymentSum || 0); //尾款总额
                let periodNumber = Common.util.numberFormat(_this.VehicleOutsourceEditWin.formModel.periodNumber || 0); //分期期数
                let monthlyInterestRate = Common.util.numberFormat(_this.VehicleOutsourceEditWin.formModel.monthlyInterestRate || Constant.OUTSOURCE_SUM.MONTHLY_INTEREST_RATE); //月利率
                let surplusPeriod = Common.util.numberFormat(_this.VehicleOutsourceEditWin.formModel.surplusPeriod || 0); //剩余期数
                let principalMonth, interestMonth, surplusPrincipal, surplusInterest, remainAmount;

                if (periodNumber != 0 && balancePaymentSum > 0) {
                    //月还本金 尾款总额 /分期期数
                    principalMonth = (balancePaymentSum/periodNumber).toFixed(2);
                    //月还利息 月还本金 * 0.007
                    interestMonth = (Common.util.numberFormat(principalMonth) * monthlyInterestRate).toFixed(2);
                    //本金欠款 月还本金 * 剩余期数
                    surplusPrincipal = (Common.util.numberFormat(principalMonth) * surplusPeriod).toFixed(2);
                    //利息欠款 月还利息 * 剩余期数
                    surplusInterest = (interestMonth * surplusPeriod).toFixed(2);
                    //欠款总额 利息欠款 + 本金欠款
                    remainAmount = (Common.util.numberFormat(surplusPrincipal)+ Common.util.numberFormat(surplusInterest)).toFixed(2);
                } else {
                    principalMonth = 0;
                    interestMonth = 0;
                    surplusPrincipal = balancePaymentSum;
                    surplusInterest = 0;
                    remainAmount = balancePaymentSum;
                }
                _this.VehicleOutsourceEditWin.formModel.principalMonth = principalMonth;
                _this.VehicleOutsourceEditWin.formModel.interestMonth = interestMonth;
                _this.VehicleOutsourceEditWin.formModel.surplusPrincipal = surplusPrincipal;
                _this.VehicleOutsourceEditWin.formModel.surplusInterest = surplusInterest;
                _this.VehicleOutsourceEditWin.formModel.remainAmount = remainAmount;
            },
            //show
            showDialog(row) {//显示此页面
                const _this = this;
                if (row) {
                    row = _.merge(_this.cloneMode().VehicleOutsourceEditWin.formModel, row);
                    if (row.vehicleOutsourceDetails) {
                        row.vehicleOutsourceDetails.forEach(ve => {//列表显示需要 车辆外包信息的字段
                            ve.vehicleOutsource = {
                                downPaymentDate: row.downPaymentDate,
                                outsourceDate: row.outsourceDate
                            } //车辆明细中 放入车辆外包信息
                        });
                        _this.VehicleOutsourceEditWin.formModel = row;
                        _this.VehicleOutsourceEditWin.table.model = row.vehicleOutsourceDetails; //放入表格
                        _this.calculateSum()
                        _this.VehicleOutsourceEditWin.show = true
                    }
                } else {
                    _this.$message.error("数据异常,该合作车信息无明细");
                }
            },
            //table
            editDetailsForTableList(row, index) {
                this.VehicleOutsourceEditDetailsWin.show = true
                this.VehicleOutsourceEditDetailsWin.index = index
                this.VehicleOutsourceEditDetailsWin.formModel = _.merge(this.cloneMode().VehicleOutsourceEditDetailsWin.formModel, row)
            },
            deleteDetailsForTableList(row, index) {
                this.VehicleOutsourceEditWin.table.model.splice(index, 1);
            },
            //submit
            vehicleOutsourceEditWinSubmit(formName) {
                let _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.VehicleOutsourceEditWin.formModel.vehicleOutsourceDetails = _this.VehicleOutsourceEditWin.table.model
                        Http.post(Api.vehicleOutsource.modify, _this.VehicleOutsourceEditWin.formModel, function (res) {
                            _this.VehicleOutsourceEditWin.show = false
                            _this.$emit('close-edit-dialog');
                        })
                    }
                })
            },
            vehicleOutsourceEditDetailsWinSubmit(formName) {
                let _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.VehicleOutsourceEditDetailsWin.show = false
                        _this.VehicleOutsourceEditWin.table.model.splice(_this.VehicleOutsourceEditDetailsWin.index, 1, _this.VehicleOutsourceEditDetailsWin.formModel);
                        _this.calculateSum()
                    }
                })
            },
            downPaymentAmountVerify(val){
                let _this = this
                if(Common.util.numberFormat(val) > Common.util.numberFormat(_this.VehicleOutsourceEditDetailsWin.formModel.outsourceTotalPrice)){
                    _this.VehicleOutsourceEditDetailsWin.formModel.downPaymentAmount = _this.VehicleOutsourceEditDetailsWin.formModel.outsourceTotalPrice
                }
            }
        }
    }
</script>
