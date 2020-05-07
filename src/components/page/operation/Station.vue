<template>
    <el-container style="height: 100%;">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>站点管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select style="display: block" audit-status="PASS" v-model="searchParam.customerCode"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select style="display: block" option-name="AUDIT_STATUS" v-model="searchParam.auditStatus"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="位置是否准确:">
                            <dictionary-select style="display: block" option-name="ACCURATE_FLAG" v-model="searchParam.accurateFlag"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="组织:">
                            <org-select style="display: block"  v-model="searchParam.orgCode"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label-width="0px" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-container>
            <el-aside style="border:1px solid #aaa;margin-top: 10px;" width="200px">
                <el-input style="width: 160px; margin: 10px 19px 21px"
                          size="small"
                          placeholder="输入关键字进行过滤"
                          v-model="treeFilterText">
                </el-input>
                <el-tree
                    class="filter-tree"
                    :data="districtTreeData"
                    :props="treeNodeProps"
                    :default-expand-all=false
                    accordion
                    highlight-current
                    expand-on-click-node
                    check-strictly
                    @node-click="clickDistrictNode"
                    :filter-node-method="filterDistrictTreeNode"
                    ref="districtTree">
                </el-tree>
            </el-aside>
            <el-main class="content-main" style="margin-left: 10px;">
            <el-button size="mini" type="primary" v-permission="'/station/add'" icon="el-icon-plus" @click="showAddStationDialog()">新增</el-button>
            <el-button v-if="btnLoading" v-permission="'/station/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table class="content-table"  size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="客户" header-align="center" prop="customer.name" width="100">
                </el-table-column>
                <el-table-column label="城市" header-align="center" prop="city.name" width="90">
                </el-table-column>
                <el-table-column label="区域" header-align="center" prop="area.name" width="90">
                </el-table-column>
                <el-table-column label="所属大区" header-align="center" prop="orgAreaName" width="90">
                </el-table-column>
                <el-table-column label="所属分区" header-align="center" prop="orgName" width="90">
                </el-table-column>
                <el-table-column label="站点名称" header-align="center" prop="name" width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color:#409EFF;" @click="showStationDetailDialog(scope.row)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="站点编号" header-align="center" prop="code" width="120"></el-table-column>
                <!--<el-table-column label="客户站点名称" header-align="center" prop="customerStationName" width="150"></el-table-column>-->
                <el-table-column label="详细地址" header-align="center" prop="address" min-width="300" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系人" header-align="center" prop="contact" width="100"></el-table-column>
                <el-table-column label="联系电话" header-align="center" prop="contactPhone" width="120"></el-table-column>
                <el-table-column label="审核状态" header-align="center" prop="auditStatus" width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="操作状态" header-align="center"  prop="operationStatus" width="90">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OPERATION_STATUS" :value="scope.row.operationStatus" style="color:red;"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="位置是否准确" header-align="center" prop="accurateFlag" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.accurateFlag === true">是</span>
                        <span v-else-if="scope.row.accurateFlag === false" style="color: red; font-weight: bold;">否</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" width="180"></el-table-column>
                <el-table-column label="创建人" header-align="center" prop="createUser" width="150"></el-table-column>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" width="180"></el-table-column>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" width="150"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" v-permission="'/station/modify'" size="mini" v-if="scope.row.deleteFlag === false" @click="showModifyStationDialog(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete" v-permission="'/station/delete'" size="mini" v-if="scope.row.deleteFlag === false" @click="deleteStation(scope.row)"></el-button>
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
        <!-- 新增站点弹出框 -->
        <el-dialog title="新增站点" :visible.sync="dialogAddStationVisible" width="90%" :top="marginTop" @close="resetCurrent">
            <el-form size="small" :model="addStationForm" :rules="addStationRules" ref="addStationForm" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:" prop="customerCode">
                            <customer-select style="display: block" level="lowest" audit-status="PASS" v-model="addStationForm.customerCode" :changeLabel="changeLabel"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="城市:" prop="cityCode">
                            <district-select style="display: block" :level="3" v-model="addStationForm.cityCodes" :callback="cityChange" :need-call-back=true @clear="clearCurrent"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="名称:" prop="name">
                            <el-input  v-model="addStationForm.name">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="120px" v-show="false" label="客户站点名称:" prop="customerStationName">
                            <el-input  v-model="addStationForm.customerStationName">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人:" prop="contact">
                            <el-input v-model="addStationForm.contact"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                     <el-col :span="6">
                        <el-form-item label="联系电话:" prop="contactPhone">
                            <el-input  v-model="addStationForm.contactPhone">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="详细地址:" prop="address">
                            <el-input placeholder ="输入地址后点击右侧按钮或回车定位地址" id = "addressSearch" v-model="addStationForm.address" @keyup.enter.native="addHandleSearch()">
                                <el-button type="primary" slot="append" @click="addHandleSearch()" icon="el-icon-location"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div id="mapContainer" style="width:100%; height:400px"></div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddStationVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addStation('addStationForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="审核站点" :visible.sync="dialogAuditStationVisible" width="400px">
            <el-form inline size="small" :model="auditStationForm" ref="auditStationForm" label-width="100px">
                <el-switch
                    style="display: block"
                    v-model="auditStationForm.auditStatus"
                    active-value="PASS"
                    inactive-value="NO_PASS"
                    active-text="通过"
                    inactive-text="不通过">
                </el-switch>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAuditStationVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditStation()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户弹出框 -->
        <el-dialog title="修改站点" :visible.sync="dialogModifyStationVisible" width="90%" :top="marginTop" @close="resetModifyStationForm">
            <el-form size="small" :model="modifyStationForm" :rules="addStationRules" ref="modifyStationForm" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:" prop="customer">
                            <el-input  :disabled=true v-model="modifyStationForm.customer.name">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="城市:" prop="cityCode">
                            <district-select style="display: block" :level="3" v-model="modifyStationForm.cityCodes" :callback="cityChange" :need-call-back=true ref="cityDom" @clear="clearCurrent"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="名称:" prop="name">
                            <el-input  v-model="modifyStationForm.name">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="120px" v-show="false" label="客户站点名称:" prop="customerStationName">
                            <el-input  v-model="modifyStationForm.customerStationName">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人:" prop="contact">
                            <el-input v-model="modifyStationForm.contact"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="联系电话:" prop="contactPhone">
                            <el-input  v-model="modifyStationForm.contactPhone">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="详细地址:" prop="address">
                            <el-input placeholder ="输入地址后点击右侧按钮或回车定位地址" id = "modifyAddressSearch" v-model="modifyStationForm.address" @keyup.enter.native="modifyHandleSearch()">
                                <el-button slot="append" @click="modifyHandleSearch()" icon="el-icon-location"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div id="modifyMapContainer" style="width:100%; height:400px"></div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyStationVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyStation('modifyStationForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="站点详情" :visible.sync="dialogStationDetailVisible" width="90%" :top="marginTop">
            <el-form inline size="small" :model="stationDetailForm"  ref="stationDetailForm" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:" prop="customerCode">
                            {{stationDetailForm.customerName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="名称:" prop="name">
                            {{stationDetailForm.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="120px" v-show="false" label="客户站点名称:" prop="customerStationName">
                            {{stationDetailForm.customerStationName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人:" prop="contact">
                            {{stationDetailForm.contact}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系电话:" prop="contactPhone">
                            {{stationDetailForm.contactPhone}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="城市:" prop="cityCode">
                            {{stationDetailForm.city.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="详细地址:" prop="address">
                            {{stationDetailForm.address}}
                        </el-form-item>
                    </el-col>
                   <el-col :span="6">
                        <el-form-item label="位置是否准确:" prop="accurateFlag">
                            <span v-if="stationDetailForm.accurateFlag === true">是</span>
                            <span v-else-if="stationDetailForm.accurateFlag === false" style="color: red; font-weight: bold;">否</span>
                            <span v-else></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div id="detailMapContainer" style="width:100%; height:400px"></div>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </el-container>
    </el-container>
</template>
<script>

    import {Http,Api,Validate,Common} from 'src/global'
    import AMap from 'AMap'

    export default {
        data() {
            return {
                mapAddress:'', // 地图返回的地址
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    auditStatus: '',
                    customerCode: '',
                    cityCodes: [],
                    cityCode: '',
                    areaCode: '',
                    treeCityCode: '',
                    treeProvCode: '',
                    treeStationCode: '',
                    accurateFlag:'',
                    orgCode:''
                },
                btnLoading: true,
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                stationList: [],
                cityList: [],
                customerList: [],
                dialogAddStationVisible: false,
                dialogAuditStationVisible: false,
                addStationForm: {
                    customerCode: '',
                    name: '',
                    contact: '',
                    contactPhone: '',
                    customerStationName: '',
                    cityCodes: ['0', '0','0'],
                    cityCode: '',
                    areaCode: '',
                    address: '',
                    lat: '',
                    lng: '',
                    radius: '',
                    accurateFlag: ''
                },
                addStationRules: {
                    customerCode: [
                        {required: true, message: '请选择客户', trigger: 'blur'},
                        {min: 1, max: 50, message: '', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '不能超过50个字符！', trigger: 'blur'}
                    ],
                    contactPhone: [
                        Validate.phone
                    ],
                    cityCode: [
                        {required: true, message: '请选择城市', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入地址', trigger: 'blur'},
                        Validate.address
                    ]
                },
                dialogModifyStationVisible: false,
                modifyStationForm:{
                    customerCode: '',
                    customer: {
                        name: ''
                    },
                    name: '',
                    contact: '',
                    contactPhone: '',
                    customerStationName: '',
                    cityCodes: [],
                    cityCode: '',
                    areaCode: '',
                    city: '',
                    address: '',
                    lat: '',
                    lng: '',
                    radius: '',
                    accurateFlag: ''
                },
                auditStationForm: {
                    auditStatus:'PASS',
                    ids: []
                },
                dialogStationDetailVisible: false,
                stationDetailForm: {
                    customerCode: '',
                    customerName: '',
                    name: '',
                    contact: '',
                    contactPhone: '',
                    customerStationName: '',
                    code: '',
                    city: '',
                    cityCode: '',
                    address: '',
                    lat: '',
                    lng: '',
                    radius: '',
                    accurateFlag:''
                },
                provCityPareameter:'',
                searchKey: '',
                modifySearchKey: '',
                placeSearch: null,
                positionPicker: null,
                modifyPlaceSearch: null,
                map: null,
                mapCircle: null,
                treeFilterText: '',
                districtTreeData:[],
                treeNodeProps: {
                    children: 'children',
                    label: 'label',
                    isLeaf: 'isLeaf'
                },
                tableHeight: window.innerHeight>800?500:null,
                currentLabel:'',
                currentArea:''
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            this.initDistrictTree();
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
        watch: {
            treeFilterText(val) {
                this.$refs.districtTree.filter(val);
            }
        },
        methods: {
            clearCurrent(){
                this.currentArea = ''
                this.setName()
            },
            resetCurrent(){
                this.currentLabel = ''
                this.currentArea = ''
                this.resetAddStationForm()
            },
            changeLabel: function (val){
                this.currentLabel = val
                this.setName()
            },
            setName(){
                if(this.dialogModifyStationVisible){
                    this.modifyStationForm.name = this.modifyStationForm.customer.name + this.currentArea
                }else if(this.dialogAddStationVisible){
                    this.addStationForm.name = this.currentLabel?(this.currentLabel + this.currentArea):''
                }

            },
            changeName(name){
                name = name.replace('区','站点')
                name = name.replace('县','站点')
                return name
            },
            tableColumnBooleanFormatter(row, column, cellValue) {
                if (cellValue) {
                    return '是';
                }
                return '否';
            },
            filterDistrictTreeNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            clickDistrictNode(data) {
                let vm = this;
                this.searchParam.currentPage = 1;
                this.searchParam.pageSize = 10;
                this.searchParam.treeProvCode = '';
                this.searchParam.treeCityCode = '';
                this.searchParam.treeStationCode = '';
                if(data.data.district) {
                    if(data.data.district.type == 2) {
                        this.searchParam.treeProvCode = data.id;
                    }
                    if(data.data.district.type == 3) {
                        this.searchParam.treeCityCode = data.id;
                    }
                }
                if(data.data.station) {
                    this.searchParam.treeStationCode = data.data.station.code
                }
                vm.searchList();
            },
            queryStation(query) {
                let vm = this;
                this.stationList = [];
                Http.get(Api.station.querySelect, {params: {'query': query}}, result => {
                    vm.stationList = result.result;
                })
            },
            queryCustomer(query) {
                let vm = this;
                vm.customerList = [];
                Http.get(Api.customer.lowestLevelSelect, {params: {'query': query}}, result => {
                    vm.customerList = result.result;
                })
            },
            initDistrictTree() {
                let vm = this;
                Http.get(Api.station.getStationTree, null , result =>{
                    vm.districtTreeData = result.result;
                })
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
                        vm.infoWindow(positionResult.position.lng,positionResult.position.lat)
                    });
                    positionPicker.on('fail', function(positionResult) {

                    });
                    if(lng && lat) {
                        positionPicker.start(AMap.LngLat(lng,lat));
                    }
                    vm.positionPicker = positionPicker;
                });
                 if(mapLng){
                    vm.infoWindow(lng,lat)
                }
            },
            toTranslate(lng,lat){
                let geocoder
                let vm = this;
                if(!geocoder){
                    geocoder = new AMap.Geocoder({
                        city: "010", //城市设为北京，默认：“全国”
                        radius: 500 //范围，默认：500
                    });
                }
                return new Promise((resolve,reject) => {
                    geocoder.getAddress([lng,lat], function(status, result) {
                        if (status === 'complete'&&result.regeocode) {
                            var address = result.regeocode.formattedAddress;
                            vm.mapAddress = address
                            resolve()
                        }else{
                                alert(JSON.stringify(result))
                                reject()
                            }
                    });
                })
            },
            async infoWindow(lng,lat){
                let vm = this;
                await vm.toTranslate(lng,lat)
                let info = [];
                info.push("<div><h4 style=\"border-bottom:1px solid;line-height:20px\">地址信息</h4>");
                info.push(`<p style=\"margin-top:10px;\">${vm.mapAddress}</p></div>`);
                let opt = {
                    content: info.join(""),
                    offset: new AMap.Pixel(0, -61),
                    position:new AMap.LngLat(lng,lat)
                }
                let windowBox = new AMap.InfoWindow(opt)
                windowBox.open(vm.map)

                // 使用地图ui，定制型存在问题，已更换直接使用原生api

                // AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
                //     var marker = new AMap.Marker({
                //         map: vm.map,
                //         zIndex: 9999999,
                //         position: vm.map.getCenter()
                //     });

                //     var infoWindow = new SimpleInfoWindow({

                //         infoTitle: '<strong>地址信息</strong>',
                //         infoBody: `<p>${vm.mapAddress}</p>`,

                //         //基点指向marker的头部位置
                //         offset: new AMap.Pixel(0, -61)
                //     });

                //     function openInfoWin() {
                //         console.log("点击了")
                //         infoWindow.open(vm.map, marker.getPosition());
                //     }

                //     //marker 点击时打开
                //     AMap.event.addListener(marker, 'click', function() {
                //         openInfoWin();
                //     });

                //     openInfoWin();
                // });
            },
            cityChange(val,area,prov,city) {
                this.provCityPareameter=val;
                this.currentArea = this.changeName(area)
                this.setName()
                // this.handleSearch(val, 12);
            },
            // 添加站点搜索
            addHandleSearch() {
                // this.addStationForm.address = this.provCityPareameter+this.addStationForm.address;
                this.handleSearch(this.provCityPareameter + this.addStationForm.address, 14);

            },
            // 修改站点搜索
            modifyHandleSearch() {
                this.handleSearch(this.provCityPareameter + this.modifyStationForm.address, 14);
            },
            //搜索
            handleSearch(searchKey, zoom) {
                let searchKeyForCircle = searchKey;
                let oldMapCircle = this.mapCircle;
                let map = this.map;
                let positionPicker = this.positionPicker;
                let vm = this;
                AMap.service('AMap.Geocoder',function(){//回调函数
                    //实例化Geocoder
                    let geocoder = new AMap.Geocoder({});
                    geocoder.getLocation(searchKeyForCircle, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            //获得了有效经纬度，可以做一些展示工作
                            //比如在获得的经纬度上打上一个Marker
                            oldMapCircle.setCenter(result.geocodes[0].location);
                            positionPicker.start(result.geocodes[0].location);
                            map.setZoomAndCenter(zoom, result.geocodes[0].location);
                            vm.infoWindow(result.geocodes[0].location.lng,result.geocodes[0].location.lat)
                        }else{
                            //获取经纬度失败
                        }
                    });
                })
            },
            resetAddStationForm(){
                let vm = this;
                vm.addStationForm = {
                    customerCode: '',
                    name: '',
                    contact: '',
                    contactPhone: '',
                    customerStationName: '',
                    cityCodes: ['0', '0'],
                    cityCode: '',
                    areaCode: '',
                    address: '',
                    lat: '',
                    lng: '',
                    radius: ''
                };
                vm.provCityPareameter = ''
            },
            resetModifyStationForm(){
                let vm = this;
                vm.modifyStationForm = {
                    customerCode: '',
                    customer: {
                        name: ''
                    },
                    name: '',
                    contact: '',
                    contactPhone: '',
                    customerStationName: '',
                    cityCodes: [],
                    cityCode: '',
                    areaCode: '',
                    city: '',
                    address: '',
                    lat: '',
                    lng: '',
                    radius: '',
                    accurateFlag: ''
                };
                vm.provCityPareameter = ''
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    auditStatus: '',
                    customerCode: '',
                    cityCode: '',
                    areaCode: '',
                    cityCodes: [],
                    treeCityCode: '',
                    treeProvCode: '',
                    treeStationCode: ''
                }
            },
            searchList() {
                let vm = this;
                Http.get(Api.station.page, {params: vm.searchParam}, result => {
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
            queryCity(query) {
                let vm = this;
                this.cityList = [];
                Http.get(Api.district.commonSelect, {params: {'query': query, 'type': '3'}}, result => {
                    vm.cityList = result.result;
                })
            },
            showAddStationDialog() {
                let vm = this;
                vm.dialogAddStationVisible=true;
                setTimeout(function () {
                    vm.initMap('mapContainer',null, null, 10, 0, 0, 500);
                }, 0);
            },
            //修改站点相关
            showModifyStationDialog(row){
                let vm = this;
                Http.get(Api.station.queryByCode,{params:{'code':row.code}},result =>{
                    // vm.modifyStationForm = result.result;
                    _.merge(vm.modifyStationForm, result.result);
                    this.modifyStationForm.cityCodes = [result.result.city.parentCode, result.result.city.code,  result.result.areaCode]
                    this.provCityPareameter = (this.modifyStationForm.city?this.modifyStationForm.city.name:'') + (this.modifyStationForm.area?this.modifyStationForm.area.name:'');
                    vm.dialogModifyStationVisible = true;
                    setTimeout(function () {
                        vm.initMap("modifyMapContainer", result.result.lng, result.result.lat, 14, result.result.lng, result.result.lat, result.result.radius);
                        vm.$refs.cityDom.handleChange(vm.modifyStationForm.cityCodes)
                    }, 0);
                })
            },
            showStationDetailDialog(row) {
                let vm = this;
                Http.get(Api.station.queryByCode,{params:{'code':row.code}},result =>{
                    vm.stationDetailForm = result.result;
                    if(result.result.customer) {
                        vm.stationDetailForm.customerName = result.result.customer.name;
                    }
                    vm.dialogStationDetailVisible = true;
                    setTimeout(function () {
                        vm.initMap("detailMapContainer", result.result.lng, result.result.lat, 14, result.result.lng, result.result.lat, result.result.radius);
                    }, 0);
                })
            },
            addStation(formName) {
                let vm = this;
                vm.addStationForm.lat = vm.mapCircle.getCenter().lat;
                vm.addStationForm.lng = vm.mapCircle.getCenter().lng;
                vm.addStationForm.radius = vm.mapCircle.getRadius();
                if(!(vm.addStationForm.lat && vm.addStationForm.lng && vm.addStationForm.radius)) {
                    this.$message({message: '请选择位置！', type: 'warning'});
                    return;
                }
                if(vm.addStationForm.cityCodes) {
                    let cityCodeArr = vm.addStationForm.cityCodes;
                    vm.addStationForm.cityCode = cityCodeArr[cityCodeArr.length - 2];
                    vm.addStationForm.areaCode = cityCodeArr[cityCodeArr.length - 1];
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.addStationForm.accurateFlag = true;
                        Http.post(Api.station.add,vm.addStationForm,response =>{
                            vm.resetAddStationForm();
                            vm.dialogAddStationVisible = false;
                            vm.$message({message: '添加成功！', type: 'success'});
                            vm.searchList();
                            vm.initDistrictTree();
                        },reson=>{
                            vm.addStationForm.accurateFlag = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            modifyStation(formName){
                let vm = this;
                vm.modifyStationForm.lat = vm.mapCircle.getCenter().lat;
                vm.modifyStationForm.lng = vm.mapCircle.getCenter().lng;
                vm.modifyStationForm.radius = vm.mapCircle.getRadius();
                if(!(vm.modifyStationForm.lat && vm.modifyStationForm.lng && vm.modifyStationForm.radius)) {
                    this.$message({message: '请选择位置！', type: 'warning'});
                    return;
                }
                if(vm.modifyStationForm.cityCodes) {
                    let cityCodeArr = vm.modifyStationForm.cityCodes;
                    vm.modifyStationForm.cityCode = cityCodeArr[cityCodeArr.length - 2];
                    vm.modifyStationForm.areaCode = cityCodeArr[cityCodeArr.length - 1];
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.modifyStationForm.accurateFlag = true;
                        Http.post(Api.station.modify,vm.modifyStationForm,response =>{
                            vm.dialogModifyStationVisible = false;
                            vm.$message({message: '修改成功！', type: 'success'});
                            vm.searchList();
                            vm.initDistrictTree();
                        },reson=>{
                            vm.modifyStationForm.accurateFlag = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            checkStation() {
                let vm = this;
                if(vm.multipleSelection && vm.multipleSelection.length > 0){
                    vm.dialogAuditStationVisible = true;
                } else {
                    this.$message({message: '请至少选择一个站点！', type: 'warning'});
                    return false;
                }
            },
            auditStation() {
                let vm = this;
                vm.auditStationForm.ids=[];
                if(vm.multipleSelection && vm.multipleSelection.length > 0){
                    for (let i = 0; i < vm.multipleSelection.length; i++) {
                        vm.auditStationForm.ids.push(vm.multipleSelection[i].id);
                    }
                    Http.post(Api.station.audit, vm.auditStationForm, result => {
                        vm.dialogAuditStationVisible = false;
                        vm.searchList();
                    })
                } else {
                    this.$message({message: '请至少选择一个站点！', type: 'warning'});
                    return false;
                }
            },
            //删除站点
            deleteStation(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.station.delete, ids, result => {
                        vm.searchList();
                        vm.initDistrictTree();
                    })
                })
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.station.page, {params: searchExportParam}, response => {
                    let header = ['客户', '城市', '区域','站点名称','所属大区','所属分区', '站点编号', '详细地址', '联系人', '联系电话', '审核状态', '操作状态','位置是否准确', '创建时间', '创建人', '修改时间', '修改人'];
                    let filterVal = ['customer.name','city.name','area.name', 'name','orgAreaName','orgName', 'code', 'address', 'contact', 'contactPhone', {
                        type: 'dictionary',
                        code: 'AUDIT_STATUS',
                        name: 'auditStatus'
                    }, {
                        type: 'dictionary',
                        code: 'OPERATION_STATUS',
                        name: 'operationStatus'
                    },
                     {
                         type: 'dictionary',
                         code: 'ACCURATE_FLAG',
                         name: 'accurateFlag'
                      }
                        ,'createTime', 'createUser', 'modifyTime', 'modifyUser'];
                    Common.excel.downloadExl(response.result, header, filterVal, "站点");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            }
        }
    }
</script>
<style scoped>
    .el-dialog__body{
        padding-top:0;
        padding-bottom:0;
    }
</style>
