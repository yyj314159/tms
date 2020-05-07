<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 短信管理</el-breadcrumb-item>
                <el-breadcrumb-item>短信发送</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="手机号:">
                            <el-input v-model="searchParam.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="短信内容:">
                            <el-input v-model="searchParam.content"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select style="display: block" option-name="AUDIT_STATUS" v-model="searchParam.auditStatus"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" v-permission="'/sendMessage/add'" icon="el-icon-plus" @click="dialogAddSendMessageVisible=true">新增</el-button>
            <el-button size="mini" type="primary" v-permission="'/sendMessage/audit'" icon="el-icon-plus" @click="dialogAuditSendMessageVisible=true">审核</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="短信内容" prop="content" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="160px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核状态" prop="auditStatus" min-width="140px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" min-width="130px"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" min-width="130px"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/sendMessage/modify'" icon="el-icon-edit" size="mini" @click="showModifySendMessageDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/sendMessage/delete'" icon="el-icon-delete" size="mini" @click="deleteSendMessage(scope.row)"></el-button>
                        <el-button type="text"  size="mini" @click="dialogAddSendMessageMobileWindowShow(scope.row)">手机号</el-button>
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
        <el-dialog title="新增短信" :visible.sync="dialogAddSendMessageVisible" width="580px">
            <el-form size="small"  inline :model="addSendMessageForm" :rules="addSendMessageRules" ref="addSendMessageForm" label-width="130px">
                <el-form-item label="短信内容:" prop="content">
                    <el-input type="textarea" :rows="3" :maxlength="1000" placeholder="最多1000个字符！" v-bind:style="textAreaClass" v-model="addSendMessageForm.content"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="1000" placeholder="最多1000个字符！" v-bind:style="textAreaClass" v-model="addSendMessageForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddSendMessageVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addSendMessage('addSendMessageForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改短信" :visible.sync="dialogModifySendMessageVisible" width="580px">
            <el-form size="small"  inline :model="modifySendMessageForm" :rules="addSendMessageRules" ref="modifySendMessageForm" label-width="130px">
                <el-form-item label="短信内容:" prop="content">
                    <el-input type="textarea" :rows="3" :maxlength="1000" placeholder="最多1000个字符！" v-bind:style="textAreaClass" v-model="modifySendMessageForm.content"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="1000" placeholder="最多1000个字符！" v-bind:style="textAreaClass" v-model="modifySendMessageForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifySendMessageVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySendMessage('modifySendMessageForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="短信手机号信息" :visible.sync="dialogAddSendMessageMobileWindow" width="38%">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="dialogAddSendMessageMobileVisible=true">新增</el-button>
            <el-button v-permission="'/sendMessage/templateDownload'" size="mini" type="primary" icon="el-icon-download" @click="templateDownload">导入模板下载</el-button>
            <el-button size="mini" type="primary" icon="" @click="uploadFile()">导入</el-button>
            <el-table class="content-table" :data="searchMobileResult.result" height="350" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChangeSub"
                      border fit
                      size="small"
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" align="center" label="手机号" prop="mobile" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="80px">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" size="mini"  @click="deleteSendMessageMobile(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div style="height: 45px" v-show="false">
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeSub"
                        @current-change="handleCurrentChangeSub"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchMobileParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchMobileResult.totalCount">
                    </el-pagination>
                </div>
            </div>-->
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddSendMessageMobileWindow = false">取 消</el-button>
                <el-button size="small" type="primary" @click="commitSendMessageMobile">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新增手机号" :visible.sync="dialogAddSendMessageMobileVisible" width="580px">
            <el-form size="small"  inline :model="addSendMessageMobileForm" :rules="addSendMessageMobileRules" ref="addSendMessageMobileForm" label-width="130px">
                <el-form-item label="手机号:" prop="mobile">
                    <el-input v-model="addSendMessageMobileForm.mobile" style="width:320px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddSendMessageMobileVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addSendMessageMobile('addSendMessageMobileForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改手机号" :visible.sync="dialogModifySendMessageMobileVisible" width="580px">
            <el-form size="small" inline :model="modifySendMessageMobileForm" :rules="addSendMessageMobileRules" ref="modifySendMessageMobileForm" label-width="130px">
                <el-form-item label="手机号:" prop="mobile">
                    <el-input v-model="modifySendMessageMobileForm.mobile" style="width:320px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifySendMessageMobileVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySendMessageMobile('modifySendMessageMobileForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="审核短信" :visible.sync="dialogAuditSendMessageVisible" width="400px">
            <el-form inline size="small" :model="auditSendMessageForm" ref="auditSendMessageForm" label-width="100px">
                <el-switch
                    style="display: block"
                    v-model="auditSendMessageForm.auditStatus"
                    active-value="PASS"
                    inactive-value="NO_PASS"
                    active-text="通过"
                    inactive-text="不通过">
                </el-switch>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAuditSendMessageVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditSendMessage()">确 定</el-button>
            </div>
        </el-dialog>
        <input type="file" @change="importFile(this)" id="imFile" style="display: none"
               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import Validate from 'src/global/validate'
    import axios from 'axios'
    import XLSX from 'xlsx'

    export default {
        data() {
            return {
                isLoading: true,
                multipleSelection: [],
                imFile: '', // 导入文件el
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    mobile: '',
                    content: '',
                    auditStatus: ''
                },
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                searchMobileParam: {
                    currentPage: 1,
                    pageSize: 10
                },
                searchMobileResult: {
                    totalCount: 0,
                    result: []
                },
                dialogAddSendMessageVisible: false,
                dialogAuditSendMessageVisible: false,
                addSendMessageForm: {
                    content: '',
                    remark: '',
                    sendMessageMobileList: []
                },
                textAreaClass:{
                    width: '320px',
                    'font-family': 'initial;'
                },
                addSendMessageRules: {
                    content: [
                        {required: true, message: '请输入短信内容', trigger: 'blur'},
                        {min: 1, max: 1000, message: '编号最长1000个字符', trigger: 'blur'}
                    ],
                    remark: [
                        {required: false, message: '请输入备注', trigger: 'blur'},
                        {min: 1, max: 1000, message: '备注最长1000个字符', trigger: 'blur'}
                    ]
                },
                dialogModifySendMessageVisible: false,
                modifySendMessageForm:{
                    id:'',
                    content: '',
                    remark: '',
                    sendMessageMobileList: []
                },
                addSendMessageMobileRules: {
                    mobile: [
                        {required: true, message: '请输入值手机号', trigger: 'blur'},
                        Validate.phone
                    ]
                },
                auditSendMessageForm: {
                    id:'',
                    auditStatus: ''
                },
                dialogAddSendMessageMobileWindow: false,
                dialogAddSendMessageMobileVisible: false,
                dialogModifySendMessageMobileVisible: false,
                addSendMessageMobileForm: {
                    messageId:'',
                    content:'',
                    remark: ''
                },
                modifySendMessageMobileForm:{
                    messageId:'',
                    content:'',
                    remark: ''
                },
                currentSendMessageId: ''
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            this.imFile = document.getElementById('imFile')
        },
        methods: {
            addSendMessage(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.sendMessage.add,vm.addSendMessageForm,response =>{
                            vm.resetAddSendMessageForm();
                            vm.dialogAddSendMessageVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddSendMessageForm(){
                let vm = this;
                vm.addSendMessageForm = {
                    id: '',
                    content: '',
                    remark: '',
                    sendMessageMobileList: []
                }
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.mobile = '';
                vm.searchParam.content = '';
            },
            searchList() {
                let vm = this;
                Http.get(Api.sendMessage.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            showModifySendMessageDialog(row){
                let vm = this;
                Http.get(Api.sendMessage.queryById,{params:{'id':row.id}},result =>{
                    vm.modifySendMessageForm = result.result;
                    vm.dialogModifySendMessageVisible = true;
                })
            },
            modifySendMessage(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.sendMessage.modify,vm.modifySendMessageForm,response =>{
                            vm.dialogModifySendMessageVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            deleteSendMessage(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.sendMessage.delete, ids, result => {
                        vm.searchList();
                    })
                })
            },
            auditSendMessage() {
                let vm = this;
                vm.auditSendMessageForm.ids=[];
                if(vm.multipleSelection && vm.multipleSelection.length > 0){
                    for (let i = 0; i < vm.multipleSelection.length; i++) {
                        vm.auditSendMessageForm.ids.push(vm.multipleSelection[i].id);
                    }
                    Http.post(Api.sendMessage.audit, vm.auditSendMessageForm, result => {
                        vm.dialogAuditSendMessageVisible = false;
                        vm.searchList();
                    })
                } else {
                    this.$message({message: '请至少选择一条数据！', type: 'warning'});
                    return false;
                }
            },
            dialogAddSendMessageMobileWindowShow(row){
                let vm = this;
                vm.currentSendMessageId = row.id;
                vm.searchMobileParam.messageId = row.id;
                Http.get(Api.sendMessageMobile.queryByMessageId, {params: vm.searchMobileParam}, result => {
                    vm.dialogAddSendMessageMobileWindow = true;
                    vm.searchMobileResult.result = result.result;
                    // vm.searchSubResult.totalCount = result.totalCount;
                    // vm.searchSubParam.currentPage = result.currentPage;
                    // vm.searchSubParam.pageSize = result.pageSize;
                })
            },
            addSendMessageMobile(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.searchMobileResult.result.push(vm.addSendMessageMobileForm);
                    }
                });
            },
            deleteSendMessageMobile(row) {
                let vm = this;
                for (let i = 0; i < vm.searchMobileResult.result.length; i++) {
                    if(vm.searchMobileResult.result[i].mobile == row.mobile) {
                        vm.searchMobileResult.result.splice(i, 1);
                        break;
                    }
                }
            },
            commitSendMessageMobile() {
                let vm = this;
                vm.modifySendMessageForm.id = vm.currentSendMessageId;
                vm.modifySendMessageForm.sendMessageMobileList = vm.searchMobileResult.result;
                Http.post(Api.sendMessage.addSendMobile,vm.modifySendMessageForm, response => {
                    vm.dialogAddSendMessageMobileWindow = false;
                    vm.searchList();
                })
            },
            resetAddDataDictionarySubForm(){
                let vm = this;
                vm.addSendMessageMobileForm = {
                    mobile:''
                }
            },
            handleSelectionChangeSub(val) {
                this.multipleSelection = val;
            },
            uploadFile: function () { // 点击导入按钮
                this.imFile.click()
            },
            importFile: function () { // 导入excel
                this.fullscreenLoading = true
                let obj = this.imFile
                if (!obj.files) {
                    this.fullscreenLoading = false
                    return
                }
                var f = obj.files[0]
                var reader = new FileReader()
                let $t = this
                reader.onload = function (e) {
                    var data = e.target.result
                    if ($t.rABS) {
                        $t.wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
                            type: 'base64'
                        })
                    } else {
                        $t.wb = XLSX.read(data, {
                            type: 'binary'
                        })
                    }
                    let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
                    for (let i = 0; i < json.length; i++) {
                        let sendMessageMobile = {};
                        sendMessageMobile.mobile = json[i].手机号;
                        // let regExp = new RegExp(Validate.phone.pattern);
                        // if(!regExp.test(sendMessageMobile.mobile)) {
                        //     throw "第" + (i + 1) + "行手机号错误!";
                        // }
                        $t.searchMobileResult.result.push(sendMessageMobile);
                    }
                }
                if (this.rABS) {
                    reader.readAsArrayBuffer(f)
                } else {
                    reader.readAsBinaryString(f)
                }
            },

        }
    }
</script>
