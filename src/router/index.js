import Vue from 'vue';
import Router from 'vue-router';

const index = resolve => require(['../components/page/index/Index.vue'], resolve);


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index/home'
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/login/Login.vue'], resolve)
        },
        {
            path: '/resetPassWord',
            component: resolve => require(['../components/page/login/resetPassWord.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/common/error/403.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/common/error/404.vue'], resolve)
        },
        {
            path: '/index',
            component: index,
            children: [
                {
                    path: 'home',
                    name: '首页',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/home/Home.vue'], resolve)
                }
            ]
        },
        {
            path: '/system',
            component: index,
            children: [
                {
                    path: 'user',
                    name: '用户管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/User.vue'], resolve)
                },
                {
                    path: 'role',
                    name: '角色管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/Role.vue'], resolve)
                },
                {
                    path: 'position',
                    name: '岗位管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/Position.vue'], resolve)
                },
                {
                    path: 'permission',
                    name: '权限管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/Permission.vue'], resolve)
                },
                {
                    path: 'org',
                    name: '组织管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/Org.vue'], resolve)
                },
                {
                    path: 'userOrg',
                    name: '用户组织',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/UserOrg.vue'], resolve)
                },
                {
                    path: 'dispatchOrg',
                    name: '调度组织',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/DispatchOrg.vue'], resolve)
                },
                {
                    path: 'sendMessage',
                    name: '短信发送',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/message/SendMessage.vue'], resolve)
                },
                {
                    path: 'messageRecord',
                    name: '短信记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/message/MessageRecord.vue'], resolve)
                },
                {
                    path: 'dataDictionary',
                    name: '数据字典',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/DataDictionary.vue'], resolve)
                },
                {
                    path: 'configParam',
                    name: '配置参数',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/ConfigParam.vue'], resolve)
                },
                {
                    path: 'contractCompany',
                    name: '合同用户',
                    component: resolve => require(['../components/page/system/ContractCompany.vue'], resolve)
                },
                {
                    path: 'companySeal',
                    name: '公司印章',
                    component: resolve => require(['../components/page/system/CompanySeal.vue'], resolve)
                },
                {
                    path: 'timeFine',
                    name: '时效扣款配置',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/TimeFine.vue'], resolve)
                },
                {
                    path: 'auditConfig',
                    name: '钉钉审批配置',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/AuditConfig.vue'], resolve)
                },
                {
                    path: 'auditRecord',
                    name: '钉钉审批记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/AuditProcess.vue'], resolve)
                },
                {
                    path: 'reportManagement',
                    name: '报表管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/ReportManagement.vue'], resolve)
                },
                {
                    path: 'noDingtalkAuditCustomer',
                    name: '不发应付审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/NoDingtalkAuditCustomer.vue'], resolve)
                },
                {
                    path: 'reportExportRecord',
                    name: '报表导出记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/ReportExportRecord.vue'], resolve)//123
                },
                {
                    path: 'orderDingTalkNotice',
                    name: '订单钉钉通知',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/system/OrderDingTalkNotice.vue'], resolve)//123
                }
            ]
        },
        {
            path: '/operation',
            component: index,
            children: [
                {
                    path: 'station',
                    name: '站点管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Station.vue'], resolve)
                },
                {
                    path: 'customerServiceConfig',
                    name: '客服配置',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/CustomerServiceConfig.vue'], resolve)
                },
                {
                    path: 'customer',
                    name: '客户管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Customer.vue'], resolve)
                },
                {
                    path: 'receiptAddress',
                    name: '回单地址',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/ReceiptAddress.vue'], resolve)
                },
                {
                    path: 'vehicle',
                    name: '车辆管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Vehicle.vue'], resolve),
                },
                {
                    path: 'vehicleAdd',
                    name: '新增/修改车辆',
                    meta: {
                        keepAlive: false
                    },
                    component: resolve => require(['../components/page/operation/VehicleAdd.vue'], resolve)
                },
                {
                    path: 'vehicleDetail',
                    name: '车辆信息',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/VehicleDetail.vue'], resolve)
                },
                {
                    path: 'line',
                    name: '线路管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Line/Line.vue'], resolve)
                },
                {
                    path: 'lineDetail',
                    name: '线路管理详情',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Line/LineDetail.vue'], resolve)
                },
                {
                    path: 'tmpLine',
                    name: '临时线路',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Line/TmpLine.vue'], resolve)
                },
                {
                    path: 'tobaccoVehicle',
                    name: '烟草车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Line/TobaccoVehicle.vue'], resolve)
                },
                {
                    path: 'allDayVehicle',
                    name: '包天车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Line/AllDayVehicle.vue'], resolve)
                },
                {
                    path: 'districtLine',
                    name: '区域线路',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Line/DistrictLine.vue'], resolve)
                },
                {
                    path: 'vehicleOwner',
                    name: '车主管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/VehicleOwner.vue'], resolve)
                },
                {
                    path: 'driver',
                    name: '司机管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Driver.vue'], resolve)
                },
                {
                    path: 'informationDepart',
                    name: '信息部管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/InformationDepart.vue'], resolve)
                },
                {
                    path: 'supplier',
                    name: '供应商管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Supplier/Supplier.vue'], resolve)
                },
                {
                    path: 'supplierDetail',
                    name: '供应商详情',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Supplier/ShowSupplierDetail.vue'], resolve)
                },
                {
                    path: 'dispatchManage',
                    name: '待发车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myDispatch/StandbyVehicleList.vue'], resolve)
                },
                {
                    path: 'dispatchEmpty',
                    name: '放空车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myDispatch/EmptyVehicleList.vue'], resolve)
                },
                {
                    path: 'dispatchDelayDeparture',
                    name: '压车未发',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myDispatch/DispatchDelayDeparture.vue'], resolve)
                },
                {
                    path: 'dispatchTaskAbnormal',
                    name: '任务异常',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myDispatch/DispatchTaskAbnormal.vue'], resolve)
                },
                {
                    path: 'myLine',
                    name: '我的线路',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myDispatch/MyLineList.vue'], resolve)
                },
                {
                    path: 'dispatch',
                    name: '我的派车单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myDispatch/DispatchList.vue'], resolve)
                },
                {
                    path: 'waybill',
                    name: '运单查询',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/WayBillList.vue'], resolve)
                },
                {
                    path: 'waybillAdjustment',
                    name: '运单调整',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/WayBillAdjustment.vue'], resolve)
                },
                {
                    path: 'waybillTimefine',
                    name: '时效扣款',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/WayBillTimeFine.vue'], resolve)
                },
                {
                    path: 'waybillVoid',
                    name: '运单作废',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/WayBillVoid.vue'], resolve)
                },
                {
                    path: 'paymentRequest',
                    name: '付款申请',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/PaymentRequestList.vue'], resolve)
                },
                {
                    path: 'paymentRequests',
                    name: '付款申请',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/PaymentRequestLists.vue'], resolve)
                },
                {
                    path: 'refuelingRecord',
                    name: '合作加油记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingRecord.vue'], resolve)
                },
                {
                    path: 'refuelingOutInviteRecord',
                    name: '外请加油记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingOutInviteRecord.vue'], resolve)
                },
                {
                    path: 'refuelingDriverAccount',
                    name: '司机账户',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingDriverAccount.vue'], resolve)
                },
                {
                    path: 'refuelingDriverAccountRecord',
                    name: '账户记录流水',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingDriverAccountRecord.vue'], resolve)
                },
                {
                    path: 'refuelingDriverSupplierPay',
                    name: '支出流水',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingDriverSupplierPay.vue'], resolve)
                },
                {
                    path: 'refuelingDriverSupplierReceive',
                    name: '收入流水',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingDriverSupplierReceive.vue'], resolve)
                },
                {
                    path: 'waybillRefuelingRecord',
                    name: '充值记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/WaybillRefuelingRecord.vue'], resolve)
                },
                {
                    path: 'electronicRefuelingReceiveReport',
                    name: '加油消费',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/ElectronicRefuelingReceiveReport.vue'], resolve)
                },
                {
                    path: 'refuelingRechargeApply',
                    name: '充值申请',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingRechargeApply.vue'], resolve)
                },
                {
                    path: 'electronicRefuelingPayReport',
                    name: '加油充值',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/ElectronicRefuelingPayReport.vue'], resolve)
                },
                {
                    path: 'refuelingVehicle',
                    name: '合作加油车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingVehicle.vue'], resolve)
                },
                {
                    path: 'refuelingSupplierStation',
                    name: '供应商站点',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingSupplierStation.vue'], resolve)
                },
                {
                    path: 'oilPrice',
                    name: '今日油价',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/TodayOilPrice.vue'], resolve)
                },
                {
                    path: 'openPushOilInfo',
                    name: '供应商油品',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/OpenPushOilInfo.vue'], resolve)
                },
                {
                    path: 'refuelingSupplierSettlement',
                    name: '供应商结算',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingSupplierSettlement.vue'], resolve)
                },
                {
                    path: 'replacementOrder',
                    name: '合作加油补单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/RefuelingSupplierAudit.vue'], resolve)
                },
                {
                    path: 'outInviteReplacementOrder',
                    name: '外请加油补单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/OutInviteReplacementOrder.vue'], resolve)
                },
                {
                    path: 'paymentInquiry',
                    name: '付款查询',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/PaymentInquiry.vue'], resolve)
                },
                {
                    path: 'waybillDetail',
                    name: 'waybillDetail',
                    meta: {
                        keepAlive: false
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/WayBillDetail.vue'], resolve)
                },
                //新运单详情
                {
                    path: 'newWaybillDetail',
                    name: 'newWaybillDetail',
                    meta: {
                        keepAlive: false
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/NewWayBillDetail.vue'], resolve)
                },
                {
                    path: 'monitorScreen',
                    name: '监控大屏',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/wayManagement/MonitorScreen.vue'], resolve)
                },
                {
                    path: 'runningTrack',
                    name: '运行轨迹',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/wayManagement/RunningTrack.vue'], resolve)
                },
                {
                    path: 'outRunningTrack',
                    name: '外请车运行轨迹',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/wayManagement/OutRunningTrack.vue'], resolve)
                },
                {
                    path: 'following',
                    name: '实时轨迹',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/wayManagement/Following.vue'], resolve)
                },
                {
                    path: 'equipmentSigning',
                    name: '设备签收',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/portManagement/EquipmentSigning.vue'], resolve)
                },
                {
                    path: 'equipmentHandover',
                    name: '设备交接记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/portManagement/EquipmentHandover.vue'], resolve)
                },
                {
                    path: 'arrivalVehicle',
                    name: '到达车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/portManagement/ArrivalVehicle.vue'], resolve)
                },
                {
                    path: 'wayBillTracking',
                    name: '运单跟踪',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/WayBillTracking.vue'], resolve)
                },
                {
                    path: 'vehicleOutsource',
                    name: '车辆外包',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/VehicleOutsource/VehicleOutsource.vue'], resolve)
                }, {
                    path: 'blackList',
                    name: '黑名单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/BlackList.vue'], resolve)
                }, {
                    path: 'outInviteVehicle',
                    name: '外请车',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OutInviteVehicle/OutInviteVehicle.vue'], resolve)
                }, {
                    path: 'oilCard',
                    name: '油卡管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OilCard/OilCard.vue'], resolve)
                }, {
                    path: 'etc',
                    name: 'ETC管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Etc/Etc.vue'], resolve)
                }, {
                    path: 'gps',
                    name: 'GPS',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/GPS/Gps.vue'], resolve)
                }, {
                    path: 'gasStation',
                    name: '合作加油站管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/GasStation/GasStation.vue'], resolve)
                }, {
                    path: 'OutOilStation',
                    name: '外请加油站点',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/GasStation/OutOilStation.vue'], resolve)
                }, {
                    path: 'oilCardRecharge',
                    name: '油卡充值管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OilCard/OilCardRecharge.vue'], resolve)
                }, {
                    path: 'oilCardSupplier',
                    name: '油卡所属公司',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OilCard/OilCardSupplier.vue'], resolve)
                }, {
                    path: 'etcRecharge',
                    name: 'ETC充值管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Etc/EtcRecharge.vue'], resolve)
                }, {
                    path: 'etcConsumeRecord',
                    name: 'ETC消费记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Etc/EtcConsumeRecord.vue'], resolve)
                }, {
                    path: 'supplementWaybillList',
                    name: '补单明细',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/SupplementWaybillList.vue'], resolve)
                },
                {
                    path: 'handCannon',
                    name: '把枪管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/HandCannon/HandCannon.vue'], resolve)
                },
                {
                    path: 'bestWaybill',
                    name: '百世运单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/CustomerWaybill/BestWaybill.vue'], resolve)
                },
                {
                    path: 'oilConsumer',
                    name: '油卡消费记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OilcardType/OilConsumer.vue'], resolve)
                },
                {
                    path: 'cardQuery',
                    name: '卡片查询记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OilcardType/CardQuery.vue'], resolve)
                },
                {
                    path: 'cardCompanyConfig',
                    name: '油卡平台参数',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OilcardType/CardCompanyConfig.vue'], resolve)
                },
                {
                    path: 'kyOder',
                    name: '跨越订单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/CustomerOrder/KyOrder.vue'], resolve)
                },
                {
                    path: 'jdOrder',
                    name: '京东订单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/CustomerOrder/JdOrder.vue'], resolve)
                },
                {
                    path: 'dpOrder',
                    name: '德邦订单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/CustomerOrder/DpOrder.vue'], resolve)
                },
                {
                    path: 'kyOrderIntraCity',
                    name: '跨越城配',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/CustomerOrder/KyOrderIntraCity.vue'], resolve)
                }
                , {
                    path: 'freeCarCarrierDriver',
                    name: '无车承运司机管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/FreeCarCarrier/FreeCarCarrierDriver.vue'], resolve)
                },
                {
                    path: 'freeCarCarrierVehicle',
                    name: '无车承运车辆管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/FreeCarCarrier/FreeCarCarrierVehicle.vue'], resolve)
                }, {
                    path: 'freeCarCarrierPayee',
                    name: '无车承运收款人管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/FreeCarCarrier/FreeCarCarrierPayee.vue'], resolve)
                }, {
                    path: 'freeCarCarrierWaybill',
                    name: '无车承运运单管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/FreeCarCarrier/FreeCarCarrierWaybill.vue'], resolve)
                },
                {
                    path: 'vehicleInsuranceDepreciation',
                    name: '保险折旧',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/VehicleInsuranceDepreciation.vue'], resolve)
                },
                {
                    path: 'vehicleAbnormal',
                    name: '车辆异常',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Abnormal/VehicleAbnormal.vue'], resolve)
                },
                {
                    path: 'smallSlingVehicle',
                    name: '小甩挂车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/SmallSlingVehicle.vue'], resolve)
                },
                {
                    path: 'contractData',
                    name: '合同管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/myWayBill/ContractData.vue'], resolve)
                },
                {
                    path: 'todayDate',
                    name: '工作日',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/TodayDate.vue'], resolve)
                },
            ]
        },
        {
            path: '/settlement',
            component: index,
            children: [
                {
                    path: 'launchSummary',
                    name: '发车汇总',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/LaunchSummary.vue'], resolve)
                },
                {
                    path: 'etcInvoice',
                    name: 'ETC开票',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/EtcInvoice.vue'], resolve)
                },
                {
                    path: 'areaProfitDeduct',
                    name: '区域利润扣除',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/AreaProfitDeduct.vue'], resolve)
                },
                {
                    path: 'vehicleRechargeApply',
                    name: '自营合作车充值申请',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/VehicleRechargeApply.vue'], resolve)
                },
                {
                    path: 'receivePaidDetail',
                    name: '应收应付明细',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/ReceivePaidDetail.vue'], resolve)
                },
                {
                    path: 'receivePaidDetailC',
                    name: '应收应付明细',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/ReceivePaidDetailC.vue'], resolve)
                },
                {
                    path: 'payableSettlementUnusual',
                    name: '应付结算价格异常报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/PayableSettlementUnusual.vue'], resolve)
                },
                {
                    path: 'receiveSettlementUnusual',
                    name: '应收结算价格异常报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ReceiveSettlementUnusual.vue'], resolve)
                },
                {
                    path: 'checkComputationReceivePaidDetail',
                    name: '核算应收应付明细',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/CheckComputationReceivePaidDetail.vue'], resolve)
                },
                {
                    path: 'settlementCustomer',
                    name: '结算客户',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/SettlementCustomer.vue'], resolve)
                },
                {
                    path: 'receiveNoSettlement',
                    name: '应收未结',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/ReceiveNoSettlement.vue'], resolve)
                },
                {
                    path: 'receiveConfirm',
                    name: '应收确认',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/ReceiveConfirm.vue'], resolve)
                },
                {
                    path: 'receiveBill',
                    name: '应收账单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/ReceiveBill.vue'], resolve)
                },
                {
                    path: 'receiveAdjust',
                    name: '应收调整',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/ReceiveAdjust.vue'], resolve)
                },
                {
                    path: 'receiveImport',
                    name: '应收导入',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/ReceiveImport.vue'], resolve)
                },
                {
                    path: 'payableConfirm',
                    name: '应付明细',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/PayableConfirm.vue'], resolve)
                },
                {
                    path: 'payableBill',
                    name: '承运商账单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/PayableBill.vue'], resolve)
                },
                {
                    path: 'outsourcePrice',
                    name: '合作车价',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/OutsourcePrice.vue'], resolve)
                },
                {
                    path: 'outsourcePayableBill',
                    name: '合作车应付账单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/OutsourcePayableBill.vue'], resolve)
                },
                {
                    path: 'payableAdjust',
                    name: '应付调整账单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/PayableAdjust.vue'], resolve)
                },
                {
                    path: 'outsourceDeductionDetail',
                    name: '合作扣款',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/OutsourceDeductionDetail.vue'], resolve)
                },
                {
                    path: 'outsourceBillCharFaleException',
                    name: '生成合作车账单异常',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/OutsourceBillCharFaleException.vue'], resolve)
                },
                {
                    path: 'supplierBillConfirm',
                    name: '供应商确认',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/SupplierBillConfirm.vue'], resolve)
                },
                {
                    path: 'supplierBill',
                    name: '供应商账单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/SupplierBill.vue'], resolve)
                },
                {
                    path: 'supplierSettlementWaybill',
                    name: '旧供应商查询',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/SupplierSettlementWaybill.vue'], resolve)
                },
                {
                    path: 'supplierBillOutInvite',
                    name: '旧供应商账单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/SupplierBillOutInvite.vue'], resolve)
                },
                {
                    path: 'financialPriceImport',
                    name: '金融运单价格导入',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/settlement/FinancialPriceImport.vue'], resolve)
                }
            ]
        },
        {
            path: '/personal',
            component: index,
            children: [
                {
                    path: 'myOilcard',
                    name: '我的油卡',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/MyOilcard.vue'], resolve)
                },
                {
                    path: 'myGps',
                    name: '我的GPS',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/MyGps.vue'], resolve)
                },
                {
                    path: 'myReceipt',
                    name: '我的回单',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/MyReceipt.vue'], resolve)
                },
                {
                    path: 'customerAudit',
                    name: '客户审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/CustomerAudit.vue'], resolve)
                },
                {
                    path: 'stationAudit',
                    name: '站点审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/StationAudit.vue'], resolve)
                },
                {
                    path: 'lineAudit',
                    name: '线路审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/LineAudit.vue'], resolve)
                },
                {
                    path: 'lineReceiveAudit',
                    name: '线路应收审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/LineReceiveAudit.vue'], resolve)
                },
                {
                    path: 'lineOutSourcePayAudit',
                    name: '线路合作应付审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/LineOutSourcePayAudit.vue'], resolve)
                },
                {
                    path: 'lineOutInvitePayAudit',
                    name: '线路外请应付审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/LineOutInvitePayAudit.vue'], resolve)
                },
                {
                    path: 'paymentCheckBeforeApproval',
                    name: '应付审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/PaymentCheckBeforeApproval.vue'], resolve)
                },
                {
                    path: 'outsourcePriceAudit',
                    name: '合作应付审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/OutsourcePriceAudit.vue'], resolve)
                },
                {
                    path: 'oilCardAudit',
                    name: '油卡审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/OilCardAudit.vue'], resolve)
                },
                {
                    path: 'myRecharge',
                    name: '我的充值记录',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/MyRecharge.vue'], resolve)
                },
                {
                    path: 'myPda',
                    name: '我的PDA',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/MyPda.vue'], resolve)
                },
                {
                    path: 'backlog',
                    name: '待办事宜',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/Backlog.vue'], resolve)
                },
                {
                    path: 'supplierAudit',
                    name: '供应商审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/SupplierAudit.vue'], resolve)
                },
                {
                    path: 'supplierExamine',
                    name: '供应商审批详情',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/SupplierExamine.vue'], resolve)
                },
                {
                    path: 'vehicleAudit',
                    name: '车辆审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/VehicleAudit.vue'], resolve)
                },
                {
                    path: 'scatteredBusinessAudit',
                    name: '零散业务审批',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/ScatteredBusinessAudit.vue'], resolve)
                },
                {
                    path: 'myBusiness',
                    name: '我的业务',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/MyBusiness.vue'], resolve)
                },
                {
                    path: 'depositAudit',
                    name: '保证金审核',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/DepositAudit.vue'], resolve)
                },
                {
                    path: 'performanceAudit',
                    name: '履约金审核',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/personal/myAudit/PerformanceAudit.vue'], resolve)
                },
            ]
        },
        {
            path: '/chart',
            component: index,
            children: [
                {
                    path: 'operationKanban',
                    name: '营运看板',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OperationKanban.vue'], resolve)
                },
                {
                    path: 'DataImport',
                    name: '数据中心',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/DataImport.vue'], resolve)
                },
                {
                    path: 'profitChart',
                    name: '利润报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ProfitChart.vue'], resolve)
                },
                {
                    path: 'abnormalProfitReport',
                    name: '利润异常报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/AbnormalProfitReport.vue'], resolve)
                },
                {
                    path: 'noEntryPayPriceReport',
                    name: '未录入应付',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/NoEntryPayPriceReport.vue'], resolve)
                },
                {
                    path: 'noEntryIncomePriceReport',
                    name: '未录入应收',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/NoEntryIncomePriceReport.vue'], resolve)
                },
                {
                    path: 'payableSettlementScheduleReport',
                    name: '应付结算进度',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/PayableSettlementScheduleReport.vue'], resolve)
                },
                {
                    path: 'accountsReceivableProgressStatement',
                    name: '应收结算进度',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/AccountsReceivableProgressStatement.vue'], resolve)
                },
                {
                    path: 'accountsReceivableCompletionRate',
                    name: '应收账款完成率',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/AccountsReceivableCompletionRate.vue'], resolve)
                },
                {
                    path: 'monthlySupplementStatisticsReport',
                    name: '当月补单统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/MonthlySupplementStatisticsReport.vue'], resolve)
                },
                {
                    path: 'customerGrossProfitRateReport',
                    name: '客户毛利率统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/CustomerGrossProfitRateReport.vue'], resolve)
                },
                {
                    path: 'lossLineCustomerStatistics',
                    name: '亏损线路客户统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/LossLineCustomerStatistics.vue'], resolve)
                },
                {
                    path: 'customerIncomeReport',
                    name: '客户收入成本报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/CustomerIncomeReport.vue'], resolve)
                },
                {
                    path: 'vehicleIncomeReport',
                    name: '车辆收入成本报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/VehicleIncomeReport.vue'], resolve)
                },
                {
                    path: 'lineIncomeReport',
                    name: '线路收入成本报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/LineIncomeReport.vue'], resolve)
                },
                {
                    path: 'onTimeReport',
                    name: '准点率报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OnTimeReport.vue'], resolve)
                },
                {
                    path: 'receiveAmountMonitorReport',
                    name: '应收监控报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ReceiveAmountMonitorReport.vue'], resolve)
                },
                {
                    path: 'grossMargin',
                    name: '毛利率区间分布',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/GrossMargin.vue'], resolve)
                },
                {
                    path: 'receivePaidSummary',
                    name: '应收应付汇总报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ReceivePaidSummary.vue'], resolve)
                },
                {
                    path: 'paymentQueryReport',
                    name: '付款查询',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/PaymentQueryReport.vue'], resolve)
                },
                {
                    path: 'certificateDetails',
                    name: '百世单边线路证件报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/CertificateDetails.vue'], resolve)
                },
                {
                    path: 'dispatchDetailReport',
                    name: '派车明细',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/DispatchDetailReport.vue'], resolve)
                },
                {
                    path: 'vehicleStatisticsReport',
                    name: '车辆统计报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/VehicleStatisticsReport.vue'], resolve)
                },
                {
                    path: 'financeVehicleInfo',
                    name: '财务车辆信息',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/FinanceVehicleInfo.vue'], resolve)
                },
                {
                    path: 'customerFine',
                    name: '客户罚款',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/CustomerFine.vue'], resolve)
                },
                {
                    path: 'customerOrderLack',
                    name: '客户订单缺失',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/CustomerOrderLack.vue'], resolve)
                },
                {
                    path: 'oilCardUnUse',
                    name: '油卡使用情况监控报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OilCardUnUse.vue'], resolve)
                }, {
                    path: 'paymentMonitoringReport',
                    name: '应付监控报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/PaymentMonitoringReport.vue'], resolve)
                }, {
                    path: 'oilRatio',
                    name: '油卡使用情况监控报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OilRatio.vue'], resolve)
                },
                {
                    path: 'payableApproval',
                    name: '应付审批统计表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/PayableApproval.vue'], resolve)
                },
                {
                    path: 'oilEtcRatio',
                    name: '油路费占比报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OilEtcRatio.vue'], resolve)
                },
                {
                    path: 'fence',
                    name: '围栏异常',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/Fence.vue'], resolve)
                },
                {
                    path: 'receiptConfirm',
                    name: '回单确认',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ReceiptConfirm.vue'], resolve)
                },
                {
                    path: 'lossLineStatistics',
                    name: '亏损线路统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/LossLineStatistics.vue'], resolve)
                },
                {
                    path: 'noDepartVehicle',
                    name: '应发未发车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/NoDepartVehicle.vue'], resolve)
                },
                {
                    path: 'noArrivalVehicle',
                    name: '应到未到车辆',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/NoArrivalVehicle.vue'], resolve)
                },
                {
                    path: 'monthlyProfitStatistics',
                    name: '当月利润统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/MonthlyProfitStatistics.vue'], resolve)
                },
                {
                    path: 'oilRatioCount',
                    name: '油卡比例统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OilRatioCount.vue'], resolve)
                },
                {
                    path: 'customerProfitChart',
                    name: '客户利润报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/CustomerProfitChart.vue'], resolve)
                },
                {
                    path: 'receiptLiablePerson',
                    name: '回单责任人',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ReceiptLiablePersonReport.vue'], resolve)
                },
                {
                    path: 'salesmanCommission',
                    name: '业务员提成',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/SalesmanCommission.vue'], resolve)
                },
                {
                    path: 'gpsUsageStatistics',
                    name: 'GPS使用统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/GPSUsageStatisticsReport.vue'], resolve)
                },
                {
                    path: 'oilCardUsageStatistics',
                    name: '油卡使用统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OilCardUsageStatistics.vue'], resolve)
                },
                {
                    path: 'scatteredBusiness',
                    name: '零散业务',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ScatteredBusinessReport.vue'], resolve)
                },
                {
                    path: 'outsourceVehiclePayableConfirm',
                    name: '合作车应付明细',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OutsourceVehiclePayableConfirm.vue'], resolve)
                }, {
                    path: 'oilFinancialAccounting',
                    name: '油费分摊统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/OilCostApportionToArea.vue'], resolve)
                }, {
                    path: 'etcFinancialAccounting',
                    name: 'ETC分摊统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ETCApportionToArea.vue'], resolve)
                }, {
                    path: 'insuranceAndDepreciationFinancialAccounting',
                    name: '保险折旧分摊统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/InsuranceAndDepreciationApportionToArea.vue'], resolve)
                }, {
                    path: 'waybillRechargeConsume',
                    name: '运单充值消费',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/WaybillRechargeConsume.vue'], resolve)
                }, {
                    path: 'electronicRefuelingStatistics',
                    name: '电子加油统计',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/ElectronicRefuelingStatistics.vue'], resolve)
                },{
                    path: 'trailerApportion',
                    name: '挂车分摊报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/TrailerApportionReport.vue'], resolve)
                },{
                    path: 'vehiclePriceException',
                    name: '车价异常报表',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/chart/VehiclePriceException.vue'], resolve)
                }
            ]
        },
        {
            path: '/schedule',
            component: index,
            children: [
                {
                    path: 'orderSchedule',
                    name: '排班设定',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Schedule.vue'], resolve)
                }
            ]
        },
        {
            path: '/order',
            component: index,
            children: [
                {
                    path: 'order',
                    name: '订单发布',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/Order.vue'], resolve)
                },
                {
                    path: 'orderBid',
                    name: '竞价管理',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OrderBid.vue'], resolve)
                },
                {
                    path: 'orderBidRecord',
                    name: '司机报价',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OrderBidRecord.vue'], resolve)
                },
                {
                    path: 'orderBidCancel',
                    name: '司机取消竞价',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OrderBidCancel.vue'], resolve)
                },
                {
                    path: 'wxRefund',
                    name: '定货费退款',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/operation/OrderWxPartialRefund.vue'], resolve)
                }
            ]
        },
        {
            path: '/business',
            component: index,
            children: [
                {
                    path: 'deposit',
                    name: '保证金',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/business/DepositList.vue'], resolve)
                },
                {
                    path: 'performance',
                    name: '履约金',
                    meta: {
                        keepAlive: true
                    },
                    component: resolve => require(['../components/page/business/PerformanceList.vue'], resolve)
                },
            ]
        }
    ]
})
