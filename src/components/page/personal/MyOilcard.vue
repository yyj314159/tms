<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>我的油卡</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <oil-card-select v-model="searchParam.cardNo"
                                             style="display: block;"></oil-card-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="领取状态:">
                            <dictionary-select v-model="searchParam.status"  style="display:block;" option-name="OIL_CARD_STATUS">
                            </dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button type="primary" size="mini" @click="showDialog=true" :disabled="multipleSelection.length==0" v-permission="'/myOilCard/transUser'">移交
            </el-button>
            <el-button type="primary" size="mini" @click="pullOut" :disabled="multipleSelection.length==0" v-permission="'/myOilCard/pull'">领取
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column  label="油卡卡号" prop="cardNo" min-width="150"></el-table-column>
                <el-table-column  label="油卡类型" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CARD_TYPE" v-model="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="status" min-width="100"></el-table-column>
                <el-table-column label="待领取人" prop="waitPullOut" min-width="100"></el-table-column>
                <el-table-column  label="油卡供应商" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CARD_SUPPLIER" v-model="scope.row.supplier"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column  label="所属公司" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CARD_COMPANY" v-model="scope.row.cardCompany"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column  label="油卡余额" prop="balanceAmount" min-width="100"></el-table-column>
                <el-table-column  label="到手时间" prop="modifyTime" min-width="120"></el-table-column>
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

        <!--移交-->
        <el-dialog size="small" :visible.sync="showDialog" title="移交" width="30%" @close="hideDialog">
            <el-form :model="transferForm" ref="transferForm">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="移交人:" prop="transferUser" label-width="40%" :rules="[{required: true, message: '请选择移交对象！'}]">
                            <user-select v-model="transferForm.transferUser"></user-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="samll" @click="hideDialog">取 消</el-button>
                <el-button size="samll" type="primary" @click="transferSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'

    export default {
        data() {
            return {
                Api: Api,
                showDialog: false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    cardNo: "",
                    status:''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],//要操作的行
                transferForm:{
                    transferUser: ""
                }
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.cardNo = '';
                this.searchParam.status= '';
            },
            searchList() {//查询
                let vm = this;
                Http.get(Api.oilCard.myOilCard, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                })
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            transferSubmit(){
                let vm = this;
                var cardNos=[];
                vm.multipleSelection.forEach(item=>{
                    cardNos.push(item.cardNo);
                })
                vm.$refs.transferForm.validate((valid)=>{
                    if(valid){
                        Http.get(Api.oilCard.transferUser, {params: {'cardNos':cardNos,'transferUser':vm.transferForm.transferUser}}, result => {
                            vm.hideDialog();
                            vm.$message.success('油卡移交成功！')
                            vm.searchList();
                        })
                    }
                })
            },
            hideDialog(){
                let vm = this;
                vm.showDialog = false;
                vm.transferForm.transferUser = "";
            },
            pullOut(){
                let vm=this;
                var cardNos=[];
                vm.multipleSelection.forEach((item)=>{
                    cardNos.push(item.cardNo);
                })
                this.$confirm('是否领取?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.oilCard.pullOut, cardNos, result => {
                        vm.$message.success("领取成功")
                        vm.searchList();
                    })
                })
            }
        }
    }
</script>

