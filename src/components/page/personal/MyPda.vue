<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>我的把枪</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="pda设备号:">
                            <pda-select v-model="searchParam.code"style="display: block;"></pda-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button type="primary" size="mini" @click="showDialog=true" :disabled="multipleSelection.length==0" v-permission="'/myPda/transUser'">移交</el-button>
            <el-button type="primary" size="mini" @click="pullOut" :disabled="multipleSelection.length==0" v-permission="'/myPda/pull'">领取</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="PDA设备号" prop="code" min-width="150"></el-table-column>
                <el-table-column  label="PDA名称" prop="pdaName" min-width="100"></el-table-column>
                <el-table-column  label="品牌" prop="brand" min-width="120"></el-table-column>
                <el-table-column  label="型号" prop="model" min-width="150"></el-table-column>
                <el-table-column  label="状态" prop="pdaStatus" min-width="100"></el-table-column>
                <!--<el-table-column header-align="center" label="GPS来源" prop="" min-width="150"></el-table-column>-->
                <el-table-column label="到手时间" prop="payTime" min-width="120">
                    <template slot-scope="scope">
                        {{scope.row.payTime | moment("YYYY-MM-DD")}}
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
                    code: ""
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
                this.searchParam.code = '';
            },
            searchList() {//查询
                let vm = this;
                Http.get(Api.pda.myPda, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    console.log(result.result)
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
                var codes=[];
                vm.multipleSelection.forEach(item=>{
                    codes.push(item.code);
                })
                vm.$refs.transferForm.validate((valid)=>{
                    if(valid){
                        Http.get(Api.pda.transferUser, {params: {'cardNos':codes,'transferUser':vm.transferForm.transferUser}}, result => {
                            vm.hideDialog();
                            vm.$message.success('PDA移交成功！')
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
                    cardNos.push(item.code);
                })
                this.$confirm('是否领取?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.pda.pullOut, cardNos, result => {
                        vm.$message.success("领取成功")
                        vm.searchList();
                    })
                })
            }
        }
    }
</script>

