<template>
    <div class="header">
        <img class="menubar" src="../../../assets/menu-open.png" v-if="closed" @click="open"/>
        <img class="menubar" src="../../../assets/menu-closed.png" v-else  @click="close"/>
        <img class="logo" src="../../../assets/logo1w.png" width="70" @click="jumpHome"/>
        <span class="title">营运管理系统{{env.ENV_REMARK?`（${env.ENV_REMARK}）`:``}}</span>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{user.name}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                    <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
                    <el-dropdown-item command="personalInformation">个人信息</el-dropdown-item>
                    <el-dropdown-item command="menuCollect">菜单收藏</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <div class="user-info">
            <span class="el-dropdown-link">
                 <a href="javascript:void(0)" v-permission="'/dispatch/noDepartVehicleBtn'" style="color: orange;font-size: 13px" @click="toStandbyVehicleList()">应发未发(<span style="color: white">{{noDepartVehicleCount?noDepartVehicleCount:0}}</span>)</a>
            </span>
            <span class="el-dropdown-link" style="margin-left: 15px">
                 <a href="javascript:void(0)" v-permission="'/waybill/noArrivalVehicleBtn'" style="color: orange;font-size: 13px" @click="toWayBillTracking()">应到未到(<span style="color: white">{{noArrivalVehicleCount?noArrivalVehicleCount:0}}</span>)</a>
            </span>
        </div>
        <el-dialog title="修改密码" :visible.sync="dialogModifyPasswordVisible" width="400px">
            <el-form size="small" inline :model="modifyPasswordForm" :rules="modifyPasswordRules" ref="modifyPasswordForm"
                     label-width="100px">
                <el-form-item label="原始密码:" prop="oldPassword">
                    <el-input type="password" v-model="modifyPasswordForm.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" prop="newPassword">
                    <el-input type="password" v-model="modifyPasswordForm.newPassword"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyPasswordVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyPassword('modifyPasswordForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="个人信息" :visible.sync="dialogPersonalInformationVisible" width="300px">
            <el-form size="small"
                     class="personalInformation"
                     label-position="left"
                     label-width="100px">
                <el-form-item label="姓名:">
                    {{user.name}}
                </el-form-item>
                <el-form-item label="工号:">
                    {{user.username}}
                </el-form-item>
                <el-form-item label="所属组织:">
                    {{user.org.name}}
                </el-form-item>
                <el-form-item label="手机号:">
                    {{user.mobile}}
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="菜单收藏" :visible.sync="dialogMenuCollectVisible" width="500px">
            <el-button size="mini" type="primary" icon="el-icon-star-off" @click="addMenuCollect">收藏当前菜单</el-button>
            <el-table size="small" class="content-table" :data="menuCollectResult.result" element-loading-text="拼命加载中"
                      border fit
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="菜单名称" prop="menu.name"></el-table-column>
                <el-table-column header-align="center" label="收藏时间" prop="createTime" width="150"></el-table-column>
                <el-table-column header-align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" size="mini" @click="deleteMenuCollect(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="height: 32px">
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="menuCollectSearchParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="menuCollectResult.totalCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {Api,Http,Common} from 'src/global';

    export default {
        data(){
            return {
                //修改密码
                dialogModifyPasswordVisible : false,
                modifyPasswordForm: {
                    username: '',
                    oldPassword: '',
                    newPassword: ''
                },
                modifyPasswordRules: {
                    oldPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
                dialogPersonalInformationVisible: false,
                //菜单收藏
                dialogMenuCollectVisible:false,
                menuCollectSearchParam: {
                    username: '',
                    currentPage: 1,
                    pageSize: 10
                },
                menuCollectResult: {
                    totalCount: 0,
                    result: []
                },
                closed: true,
                noArrivalVehicleCount:'',
                noDepartVehicleCount:'',
            }
        },
        computed: {
            ...mapGetters([
                'user',
                'env'
            ])
        },
        mounted() {
            //获取应发未发/应到未到数量
            this.getNoDepartVehicleCount();
            this.getNoArrivalVehicleCount();
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginOut'){
                    Common.token.removeToken();
                    this.$router.push('/login');
                }else if(command == 'modifyPassword'){
                    this.dialogModifyPasswordVisible = true;
                }else if(command == 'personalInformation'){
                    this.dialogPersonalInformationVisible = true;
                }else if(command == 'menuCollect'){
                    this.searchMenuCollect();
                    this.dialogMenuCollectVisible = true;
                }
            },
            jumpHome() {
                this.$router.push("/");
            },
            modifyPassword(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.modifyPasswordForm.username = vm.user.username;
                        Http.post(Api.user.modifyPassword, vm.modifyPasswordForm, response => {
                            vm.dialogModifyPasswordVisible = false;
                            vm.modifyPasswordForm.newPassword = '';
                            vm.modifyPasswordForm.oldPassword = '';
                            this.$confirm('修改密码成功, 请重新登录', '提示', {
                                confirmButtonText: '确定'
                            }).then(() => {
                                Common.token.removeToken();
                                this.$router.push('/login');
                            })
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleSizeChange(val) {
                let vm = this;
                vm.menuCollectSearchParam.pageSize = val;
                this.searchMenuCollect();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.menuCollectSearchParam.currentPage = val;
                this.searchMenuCollect();
            },
            searchMenuCollect(){
                let vm = this;
                vm.menuCollectSearchParam.username = vm.user.username;
                Http.get(Api.menu.collectPage, {params: vm.menuCollectSearchParam}, result => {
                    vm.menuCollectResult.result = result.result;
                    vm.menuCollectResult.totalCount = result.totalCount;
                    vm.menuCollectSearchParam.currentPage = result.currentPage;
                    vm.menuCollectSearchParam.pageSize = result.pageSize;
                })
            },
            addMenuCollect(){
                var vm = this;
                Http.post(Api.menu.collectAdd, {url : this.$route.path}, result => {
                    this.$message({
                        message: '收藏成功!',
                        type: 'success'
                    });
                    vm.searchMenuCollect();
                })
            },
            deleteMenuCollect(row){
                var vm = this;
                var ids = [];
                ids.push(row.id);
                Http.post(Api.menu.collectDelete, ids, result => {
                    this.$message({
                        message: '操作成功!',
                        type: 'success'
                    });
                    vm.searchMenuCollect();
                })
            },
            open(){
               this.closed = false;
               this.$emit('open')
            },
            close(){
                this.closed = true;
                this.$emit('close')
            },
            getNoDepartVehicleCount(){
                debugger;
                Http.get(Api.dispatch.getNoDepartVehicleCount, {}, result => {
                    this.noDepartVehicleCount = result.result;
                })
            },
            getNoArrivalVehicleCount(){
                Http.get(Api.waybill.getNoArrivalVehicleCount, {}, result => {
                    this.noArrivalVehicleCount = result.result;
                })
            },
            toStandbyVehicleList(){
                this.$router.push({path: '/operation/dispatchManage'});
            },
            toWayBillTracking(){
                this.$router.push({path: '/operation/wayBillTracking'});
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        height: 40px;
        font-size: 22px;
        line-height: 40px;
        color: #fff;
        background-color: #242f42;
    }
    .header img{
        display: inline-block;
        cursor: pointer;
    }
    img.menubar{
        width:18px;
        margin-left: 18px;
        margin-top: 16px;
    }
    img.logo{
        margin-left: 10px;
    }
    span.title{
        font-size: 16px;
        font-weight: bold;
        line-height: 40px;
        margin-left: 40px;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .el-dropdown-item{
        text-align: center;
    }
    .personalInformation{
        border:1px solid #aaa;
        padding: 20px;
    }
</style>
