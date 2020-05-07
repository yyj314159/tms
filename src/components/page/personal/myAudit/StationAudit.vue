<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>站点审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="申请人:">
                            <user-select v-model="searchParam.applyUser" style="display:block;"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS"  v-model="searchParam.auditStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请时间:" label-width="120px">
                            <el-date-picker
                                v-model="searchParam.applyTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="站点名称:">
                            <el-input v-model="searchParam.stationName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column label="客户" header-align="center" prop="customer.name" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="城市" header-align="center" prop="city.name" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="区域" header-align="center" prop="area.name" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="站点名称" header-align="center" prop="name" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column label="站点编号" header-align="center" prop="code" min-width="180"></el-table-column>
                <!--<el-table-column label="客户站点名称" header-align="center" prop="customerStationName" min-width="200" show-overflow-tooltip></el-table-column>-->
                <el-table-column label="详细地址" header-align="center" prop="address" min-width="280" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系人" header-align="center" prop="contact" min-width="140"></el-table-column>
                <el-table-column label="联系电话" header-align="center" prop="contactPhone" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请人" prop="applyUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请人所属组织" prop="applyOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="applyTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请类型" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_TYPE" v-model="scope.row.auditType"></dictionary-select-name>站点
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核人所属组织" prop="auditOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="300" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/stationAudit/audit'" :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)">审批</el-button>
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

        <!-- 审核申请内容 -->
        <el-dialog :title="title"  :visible.sync="showAuditDetail" width="80%" @close="resetAuditForm" :top="marginTop">
            <el-form :model="auditContentForm" size="small" label-position="left">
                <el-row>
                    <el-col :span="6">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="">
                                    客&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户:&nbsp;&nbsp;&nbsp;&nbsp;{{auditContentForm.customer?auditContentForm.customer.name:''}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="">
                                    名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:&nbsp;&nbsp;&nbsp;&nbsp;{{auditContentForm.name}}
                                </el-form-item>
                            </el-col>
                           <!-- <el-col :span="24">
                                <el-form-item label="客户站点名称:" style="text-align: center;">
                                    {{auditContentForm.customerStationName}}
                                </el-form-item>
                            </el-col>-->
                            <el-col :span="24">
                                <el-form-item label="">
                                    联&nbsp;&nbsp;系&nbsp;&nbsp;人:&nbsp;&nbsp;&nbsp;&nbsp;{{auditContentForm.contact}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="">
                                    联系电话:&nbsp;&nbsp;&nbsp;&nbsp;{{auditContentForm.contactPhone}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="">
                                    城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市:&nbsp;&nbsp;&nbsp;&nbsp;{{auditContentForm.city?auditContentForm.city.name:''}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="">
                                    区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:&nbsp;&nbsp;&nbsp;&nbsp;{{auditContentForm.area?auditContentForm.area.name:''}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="详细地址:">
                                    {{auditContentForm.address}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="18">
                        <div id="detailMapContainer" style="width:100%; height:300px"></div>
                    </el-col>
                </el-row>
            </el-form>
            <el-form size="small" :model="auditOpinionForm" label-position="left">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditOpinionForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS" :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditOpinionForm.auditRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDetail = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditSubmit">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                showAuditDetail: false,//申请内容
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    applyUser: '',//申请人
                    auditStatus: Constant.AUDIT_STATUS.UNAUDITED,//审核状态
                    applyTime: [],//创建时间
                    startApplyTime: '',
                    endApplyTime: '',
                    stationName: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                title: "",
                auditContentForm: {},
                auditOpinionForm: {
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditRemark: ""
                }
            }
        },
        created() {
            this.searchList();
        },
        computed: {
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
            resetSearchParam() {//重置参数
                this.searchParam.applyUser = '';
                this.searchParam.auditStatus = '';
                this.searchParam.applyTime = [];
                this.searchParam.startApplyTime = '';
                this.searchParam.endApplyTime = '';
                this.searchParam.stationName = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if(this.searchParam.applyTime){
                    this.searchParam.startApplyTime = this.searchParam.applyTime[0];
                    this.searchParam.endApplyTime = this.searchParam.applyTime[1];
                }else{
                    this.searchParam.startApplyTime = "";
                    this.searchParam.endApplyTime = "";
                }
                Http.get(Api.stationAudit.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
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
            showAuditWindow(row){
                let vm = this;
                if(row.auditType==='ADD'){
                    vm.title = `新增站点审批`;
                }else if(row.auditType==='MODIFY'){
                    vm.title = `修改站点审批`;
                }else{
                    vm.title = `删除站点审批`;
                }
                vm.auditContentForm = row;
                vm.showAuditDetail = true;
                setTimeout(function () {
                    vm.initMap("detailMapContainer", row.lng, row.lat, 14, row.lng, row.lat, row.radius);
                }, 0);
            },
            auditSubmit(){
                let vm = this;
                vm.auditOpinionForm.id = vm.auditContentForm.id;
                Http.post(Api.stationAudit.audit,vm.auditOpinionForm, result => {
                    vm.showAuditDetail = false;
                    vm.$message.success('审批完成！');
                    vm.searchList();
                })
            },
            resetAuditForm(){
                let vm = this;
                vm.auditOpinionForm.auditStatus = Constant.AUDIT_STATUS.PASS;
                vm.auditOpinionForm.auditRemark = '';
            },
            initMap: function (id, mapLng, mapLat, zoom, lng, lat, radius) {
                let vm = this;
                let mapConfig = {
                    resizeEnable: true,
                    zoom: zoom //10 add,14 modify
                };
                if (mapLng && mapLat) {
                    mapConfig.center = [mapLng, mapLat];
                }
                this.map = new AMap.Map(id, mapConfig);
                let map = this.map;
                map.plugin(["AMap.ToolBar"], function() {
                    map.addControl(new AMap.ToolBar());
                });
                if(location.href.indexOf('&guide=1')!==-1){
                    map.setStatus({scrollWheel:false})
                }
                let mapCircle = new AMap.Circle({
                    map: map,
                    center: [lng, lat],
                    radius: radius,
                    strokeColor: "#F33",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    fillColor: "ee2200",
                    fillOpacity: 0.35
                });

                map.plugin(["AMap.CircleEditor"], function () {
                    let circleEditor = new AMap.CircleEditor(map, mapCircle);
                    circleEditor.open();
                });
                this.mapCircle = mapCircle;

                AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
                    var positionPicker = new PositionPicker({
                        mode: 'dragMarker',
                        map: map
                    });
                    positionPicker.on('success', function(positionResult) {
                        mapCircle.setCenter(positionResult.position);
                    });
                    positionPicker.on('fail', function(positionResult) {

                    });
                    if(lng && lat) {
                        positionPicker.start(AMap.LngLat(lng,lat));
                    }
                    vm.positionPicker = positionPicker;
                });
            },
        }
    }
</script>
<style scoped>
    .blue {
        color: #20a0ff;
        display: inline-block;
        width: 150px;
        margin-bottom: 12px;
    }
    .el-form-item {
        margin-bottom: 8px;
    }
</style>
