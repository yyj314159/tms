<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>应付结算进度</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属大区:">
                            <org-select-report v-model="searchParam.orgCode" style="display: block"
                                               :disabled="disabled"
                                               :natureList="[Constant.ORGANIZATION.HEADQUARTERS,Constant.ORGANIZATION.AREA]"></org-select-report>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/payableSettlementSchedule/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="所属大区" prop="name" min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="超过6个月"  min-width="110" show-overflow-tooltip >
                    <el-table-column align="center" label="外请车未支付笔数" min-width="110" show-overflow-tooltip >
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(1,scope.row,'OUT_INVITE',6)">{{scope.row.oversix1}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="合作车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(2,scope.row,'OUTSOURCE',6)">{{scope.row.oversix2}}</a>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="5~6个月"   min-width="110" show-overflow-tooltip>
                    <el-table-column  align="center" label="外请车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(1,scope.row,'OUT_INVITE',5,6)">{{scope.row.fiveTosix1}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="合作车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(2,scope.row,'OUTSOURCE',5,6)">{{scope.row.fiveTosix2}}</a>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="4~5个月"   min-width="110" show-overflow-tooltip>
                    <el-table-column  align="center" label="外请车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(1,scope.row,'OUT_INVITE',4,5)">{{scope.row.fourTofive1}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="合作车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(2,scope.row,'OUTSOURCE',4,5)">{{scope.row.fourTofive2}}</a>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="3~4个月"   min-width="110" show-overflow-tooltip>
                    <el-table-column  align="center" label="外请车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(1,scope.row,'OUT_INVITE',3,4)">{{scope.row.threeTofour1}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="合作车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(2,scope.row,'OUTSOURCE',3,4)">{{scope.row.threeTofour2}}</a>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="2~3个月"   min-width="110" show-overflow-tooltip>
                    <el-table-column  align="center" label="外请车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(1,scope.row,'OUT_INVITE',2,3)">{{scope.row.twoTothree1}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="合作车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(2,scope.row,'OUTSOURCE',2,3)">{{scope.row.twoTothree2}}</a>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="1~2个月"  min-width="110" show-overflow-tooltip>
                    <el-table-column  align="center" label="外请车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(1,scope.row,'OUT_INVITE',1,2)">{{scope.row.oneTotwo1}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="合作车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(2,scope.row,'OUTSOURCE',1,2)">{{scope.row.oneTotwo2}}</a>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="1个月以内" min-width="110" show-overflow-tooltip>
                    <el-table-column  align="center" label="外请车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(1,scope.row,'OUT_INVITE',0,1)">{{scope.row.one1}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="合作车未支付笔数" min-width="110" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409eff;" @click="showLaunchSummary(2,scope.row,'OUTSOURCE',0,1)">{{scope.row.one2}}</a>
                        </template>
                    </el-table-column>
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
        <!--外请车应付结算进度明细详情-->
        <launchSummary v-if="launchSummary" :visible="launchSummary" @close="hideLaunchSummary"
                       :currentRowed="currentRows" :vehicleNature="vehicleNature" :startActualDepartureTime="startActualDepartureTime" :endActualDepartureTime="endActualDepartureTime"
                        :num1="num1" :num2="num2" :orgCode="orgCode"/>

        <!--合作车应付结算进度明细详情-->
        <launchSummary2 v-if="launchSummary2" :visible="launchSummary2" @close="hideLaunchSummary2"
                       :currentRowed="currentRows" :vehicleNature="vehicleNature" :startActualDepartureTime="startActualDepartureTime" :endActualDepartureTime="endActualDepartureTime"
                       :num1="num1" :num2="num2" :orgCode="orgCode"/>
    </el-container>
</template>

<script>
    import {Http,Api,Common,Constant} from 'src/global'
    import axios from 'axios'
    import launchSummary from "./LaunchSummaryDialog";
    import launchSummary2 from "./LaunchSummaryDialog2";

    export default {
        components: {launchSummary,launchSummary2},
        data() {
            return {
                Constant: Constant,//常量
                launchSummary:false,//外请车应付结算进度明细对话框
                launchSummary2:false,//合作车应付结算进度明细对话框
                currentRows:null,//操作行的数据
                vehicleNature:'',//车辆属性
                startActualDepartureTime:'',//发车开始时间
                endActualDepartureTime:'',//发车结束时间
                num1:'',//月份范围头
                num2:'',//月份范围尾
                disabled:'',//用来控制大区查看数据权限
                orgCode:'',//当查询条件不为空时,将改大区的编号传给总计
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 20,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    orgCode: ''
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
                status:true,
            }
        },
        created() {
            this.searchParam.orgCode=this.$store.getters.org.code;
            if(this.$store.getters.org.code==='99999999'){
                    this.disabled=false;
                    this.searchParam.orgCode='';
            }else{
                this.disabled=true;
            }
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 20,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    orgCode: ''
                };
            },
            searchList() {//查询
                if(!this.searchParam.endActualDepartureTime || !this.searchParam.startActualDepartureTime){
                    return this.$message.warning('请输入时间进行查询！')
                }
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.payableSettlementSchedule.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            //显示应付结算进度明细对话框
            showLaunchSummary(num,row,vehicleNature,num1,num2){
                let vm = this;
                vm.currentRows=row;
                vm.vehicleNature=vehicleNature;
                vm.orgCode=vm.searchParam.orgCode;
                vm.startActualDepartureTime=vm.searchParam.startActualDepartureTime;
                vm.endActualDepartureTime=vm.searchParam.endActualDepartureTime;
                vm.num1=num1;
                vm.num2=num2;
                if(num===1){
                    vm.launchSummary=true;//显示外请车对话框
                }else if(num===2){
                    vm.launchSummary2=true;//显示合作车对话框
                }
            },
            //关闭外请车应付结算进度明细对话框
            hideLaunchSummary(){
                this.launchSummary=false;
            },
            //关闭合作车应付结算进度明细对话框
            hideLaunchSummary2(){
                this.launchSummary2=false;
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.payableSettlementSchedule.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应付结算进度报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
