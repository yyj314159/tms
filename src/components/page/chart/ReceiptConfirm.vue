<template>
    <el-container id="standby">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 在途管理</el-breadcrumb-item>
                <el-breadcrumb-item>回单确认</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户名称:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input  v-model="searchParam.waybillCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="创建开始时间:">
                            <date-picker-single v-model="searchParam.receiptConfirmStartCreateTime" date-type="start" :end-date="searchParam.receiptConfirmEndCreateTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建结束时间:">
                            <date-picker-single v-model="searchParam.receiptConfirmEndCreateTime" date-type="end" :start-date="searchParam.receiptConfirmStartCreateTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认状态:">
                            <dictionary-select option-name="RECEIPT_HANDLE_FLAG_STATUS"  v-model="searchParam.receiptHandleFlag" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" size="mini" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" size="mini" class="fa fa-repeat" @click="resetSearchParam">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/receiptConfirm/export'" type="primary" size="mini" style="" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe
                      :height="tableHeight" :style="{height:'auto'}">

                <el-table-column header-align="center" label="所属大区" prop="region.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="belongOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="客户" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.customer?scope.row.customer.name:""}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="260" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showLine(scope.row)">{{scope.row.dispatchLine?scope.row.dispatchLine.lineName:''}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="dispatchVehicle.vehicleLicenseNum" min-width="100"></el-table-column>

                <el-table-column header-align="center" label="司机姓名" prop="dispatchVehicle.driver.name" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机电话" prop="dispatchVehicle.driver.mobile" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="运单号" prop="waybillCode" min-width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="departureTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="waybill.status" min-width="160">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS"
                                                :value="scope.row.waybill.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单号" prop="waybill.receiptCodes" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="确认状态" prop="receiptHandleFlag" min-width="160">
                    <template slot-scope="scope">
                        {{scope.row.receiptConfirm.receiptHandleFlag ? '已确认':'待确认'}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="确认人" prop="receiptConfirm.modifyUser" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="确认时间" prop="receiptConfirm.handleTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="receiptConfirmStartCreateTime" min-width="160"></el-table-column>


                <el-table-column align="center" label="操作" fixed="right" min-width="150">
                    <template slot-scope="scope">
                        <!--<el-button v-permission="'/receiptConfirm/view'" type="text" size="mini" @click="showReceiptConfirmForm(scope.row)" >查看</el-button>-->
                        <el-button v-permission="'/receiptConfirm/updateReceipt'" type="text" size="mini" :disabled="scope.row.receiptConfirm.receiptHandleFlag" @click="updateReceiptConfirmForm(scope.row)"  >{{scope.row.receiptConfirm.receiptHandleFlag ? '已确认':'待确认'}}</el-button>

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

        <!-- 线路信息详情 -->
        <line-info v-if="showLineInfo"  :dialogVisible="showLineInfo" @close="hideLineInfo"  :currentRow="currentRow"></line-info>

        <!-- 查看回单 -->
        <el-dialog title="回单详情" :visible.sync="showReceiptConfirm" width="50%" @close="showReceiptConfirm = false" style="">
            <el-form size="small" :model="viewReceiptConfirmForm" ref="departureForm" label-width="120px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="运单号：">
                            {{viewReceiptConfirmForm.waybillCode}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="回单号：">
                        {{viewReceiptConfirmForm.waybill.receiptCodes}}
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="回单附件：">
                        <show-image ref="showImage" :url="url"></show-image>
                        <!--<el-dialog :visible.sync="true" append-to-body>
                            <img width="100%" src="http://zeyi-tms-test.oss-cn-hangzhou.aliyuncs.com/image/null/d64f0391-6fe7-4fe5-bbcc-155f354be346.jpg" alt="">
                        </el-dialog>-->
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="showReceiptConfirm = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 确认回单 -->
        <el-dialog title="确认回单" :visible.sync="showUpdateReceiptConfirm" width="70%" @close="resetViewReceiptConfirmForm" style="margin-left: 50%;">
            <el-form size="small" :model="viewReceiptConfirmForm" ref="departureForm" label-width="120px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="运单号：">
                            {{viewReceiptConfirmForm.waybillCode}}
                            <show-image ref="showImage" :url="url"></show-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22" v-if="!viewReceiptConfirmForm.receiptInputs || !viewReceiptConfirmForm.receiptInputs.length">
                        <el-form-item label="回单号：">
                            <el-tag v-for="tag in dynamicTags" :key="tag.index" style="min-width: 100%" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
                            <el-input maxlength="24" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm">
                                <el-button slot="append" type="primary" plain v-if="canSearch" @click="searchMoreBill">查询更多回单</el-button>
                            </el-input>
                            <el-button v-if="inputVisible" type="text" @click="handleInputConfirm" icon="el-icon-circle-check-outline"></el-button>
                            <el-button v-else type="text" @click="showInput" circle icon="el-icon-circle-plus-outline" :disabled="dynamicTags.length >= 20"></el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22" v-else>
                        <el-form-item label="回单号：">
                            <el-input v-for="(item,index) in viewReceiptConfirmForm.receiptInputs" :key="index" :value="dynamicInputs[index]" :placeholder="item.placeholder" @input="val => $set(dynamicInputs, index, val)">
                                <template slot="prepend">{{item.receiptType}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="回单附件：">
                            <upload-image ref="receiptConfirmImageInfo"
                                          fileModule="receipt"
                                          v-model="viewReceiptConfirmForm.attachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showUpdateReceiptConfirm = false">取 消</el-button>
                <el-button size="small" type="primary" @click="updateReceiptConfirmCommit">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import lineInfo from 'src/components/page/operation/myDispatch/LineInfoDialog'
    import {Constant} from 'src/global/constant'
    import {Validate} from 'src/global/validate'
    import axios from 'axios'

    export default {
        data() {
            return {
                url: '',
                isLoading: true,
                constant: Constant,//常量
                common: Common,
                Validate: Validate,
                showLineInfo: false,//线路详情
                viewReceiptConfirmForm:{
                    dispatchCode: '',
                    waybill: {},
                    attachment: '',
                    receiptCodeList: [],
                    receiptInputs: []
                },//查看回单对象
                showReceiptConfirm:false,
                showUpdateReceiptConfirm:false,
                dynamicTags: [],
                dynamicInputs: [],
                inputVisible: false,
                inputValue: '',
                canSearch:false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    waybillCode: '',
                    waybillStatus:'',
                    vehicleCode: '',
                    receiptCode: '',
                    receiptConfirmStartCreateTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    receiptConfirmEndCreateTime : Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    receiptHandleFlag: false //回单处理状态
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],//要操作的行
                currentRow: null,//操作行的数据
                //导出
                exportLoading: true,
                tableHeight: window.innerHeight>800?430:null,
                canSearch:false
            }
        },
        components:{
            lineInfo
        },
        watch:{
            $route(){
                this.searchList();
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    waybillCode: '',
                    waybillStatus:'',
                    vehicleCode: '',
                    receiptCode: '',
                    receiptConfirmStartCreateTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    receiptConfirmEndCreateTime : Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    receiptHandleFlag: false//回单处理状态
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading  = true;
                Http.get(Api.receiptConfirm.dispatchPage,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },result=>{
                    vm.isLoading = false;
                })
            },
            showWayBill(row) { //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            showLine(row){//线路详情
                this.currentRow = row;
                this.showLineInfo = true;
            },
            hideLineInfo(){//关闭线路详情
                this.showLineInfo = false;
            },
            showReceiptConfirmForm(row){
                this.showReceiptConfirm = true;
                this.viewReceiptConfirmForm = row;
                this.url = row.dispatchLine.stopOverStation[0].attachment;

            },
            updateReceiptConfirmForm(row){
                let vm = this;
                vm.showUpdateReceiptConfirm = true;
                vm.viewReceiptConfirmForm = row;
                vm.viewReceiptConfirmForm.dispatchCode = row.code;
                vm.url = row.dispatchLine.stopOverStation[0].attachment;
                //是否显示input组件
                Http.get(Api.dispatch.getCustomerReceipt, {params: {dispatchCode: row.dispatchCode}}, result => {
                    this.viewReceiptConfirmForm.receiptInputs = result.result || [];
                    this.dynamicInputs = this.viewReceiptConfirmForm.receiptInputs.map((item,index)=>{
                        return ''
                    })
                    Http.get(Api.receiptConfirm.getReceiptListByWaybillCode,{params:{'waybillCode':row.waybillCode}},result =>{
                        let Arry =[];
                        if(!_.isNil(result.result.waybillReceiptList)){
                            result.result.waybillReceiptList.forEach((item)=>{
                                Arry.push(item.code);
                            });
                        }
                        vm.dynamicTags = Arry;
                        //vm.dynamicInputs = Arry;
                        Arry.forEach((item,index)=>{
                            vm.$set(vm.dynamicInputs, index, item)
                        })
                    })
                })

            },
            updateReceiptConfirmCommit(){
                let vm = this;
                vm.viewReceiptConfirmForm.attachment = this.$refs.receiptConfirmImageInfo.getFileList().join(",");
                //vm.viewReceiptConfirmForm.receiptCodeList = vm.dynamicTags
                if(!vm.viewReceiptConfirmForm.receiptInputs || !(vm.viewReceiptConfirmForm.receiptInputs.length>0)){
                    if (!vm.handleInputConfirm()) {
                        return
                    }
                    vm.viewReceiptConfirmForm.receiptCodeList = vm.dynamicTags;
                }else{
                    vm.viewReceiptConfirmForm.receiptCodeList = vm.dynamicInputs;
                    let arr1 = vm.viewReceiptConfirmForm.receiptInputs.filter((item,index)=>{
                        return  !vm.viewReceiptConfirmForm.receiptCodeList[index] && item.required
                    })
                    if(arr1 && arr1.length>0){
                        vm.$message.warning(arr1[0].receiptType+'必填！');
                        return;
                    }
                    let arr2 = vm.viewReceiptConfirmForm.receiptInputs.filter((item,index)=>{
                        return !!vm.viewReceiptConfirmForm.receiptCodeList[index] && !eval(item.regExp).test(vm.viewReceiptConfirmForm.receiptCodeList[index])
                    })
                    if(arr2 && arr2.length>0){
                        vm.$message.warning(arr2[0].errorMessage);
                        return;
                    }
                }
                Http.post(Api.receiptConfirm.modifyReceipt, vm.viewReceiptConfirmForm, result => {
                    vm.showUpdateReceiptConfirm = false;
                    vm.$message.success("回单确认成功！");
                    vm.searchList();
                })
            },
            resetViewReceiptConfirmForm(){
                this.viewReceiptConfirmForm = {
                    dispatchCode: '',
                    waybill: {},
                    attachment: '',
                    receiptCodeList: [],
                    receiptInputs: []
                }
            },

            handleClose(tag) {
                let vm = this;
                vm.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let vm = this;
                let reg = Validate.receipt.pattern;
                let inputValue = vm.inputValue;
                if(inputValue){
                    if (reg.test(inputValue)) {
                        for(let i=0; i<vm.dynamicTags.length; i++){
                            if(inputValue == vm.dynamicTags[i]){
                                vm.inputValue = '';
                                vm.inputVisible = false;
                                vm.$message.error('请勿重复添加回单！');
                                return false
                            }
                        }
                        vm.dynamicTags.push(inputValue);
                    }else{
                        vm.$message.error('请输入正确的回单号！');
                        vm.inputValue = '';
                        return false;
                    }
                }
                vm.inputValue = '';
                vm.inputVisible = false;
                return true;
            },
            // 查询更多回单
            async searchMoreBill(){
                let vm = this;
                if(!vm.handleInputConfirm()){
                    return;
                }
                await Common.bill.searchBill(vm.dynamicTags[vm.dynamicTags.length-1],vm.departure.waybillCode).then((res) => {
                    vm.dynamicTags = vm.dynamicTags.concat(res)
                    vm.dynamicTags = vm.common.util.clean(vm.dynamicTags)
                });
            },
            //导出
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.receiptConfirm.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    ;//配置下载的文件名
                    link.download = '回单确认.xls'
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
<style>
    #standby .imageViewerMask{
        width:50%!important;
        right:50%!important;
    }
</style>
