const authUrl = '/auth-service-api'//权限管理系统请求
const tmsUrl = '/tms-web-api'//tms系统请求
const tmsServiceUrl = '/tms-service-api'//tms系统请求
const reportUrl = '/tms-report-api' // report报表
const commonUrl = '/common-service-api' //common系统请求
let apiRoot = process.env.API_ROOT + tmsUrl;
let tmsServiceRoot = process.env.API_ROOT + tmsServiceUrl;
let reportApiRoot = process.env.API_ROOT + reportUrl;
let authApiRoot = process.env.API_ROOT + authUrl;
let commonApiRoot = process.env.API_ROOT + commonUrl;
export const Api = {
    //登录相关
    login: {
        login: authApiRoot + '/login/password',//登录接口
        getDingTalkApp: authApiRoot + '/login/getDingTalkApp',//获取appid，和uri
        dingLogin: authApiRoot + '/login/dingTalkCode',//钉钉登陆
        refreshToken: apiRoot + '/login/refreshToken' //刷新token
    },
    //当前登录信息
    current: {
        user: apiRoot + '/current/user'
    },
    //菜单相关
    menu: {
        current: apiRoot + '/menu/current',//当前用户菜单树
        collectPage: apiRoot + '/menu/collect/page',//
        collectAdd: apiRoot + '/menu/collect/add',//
        collectDelete: apiRoot + '/menu/collect/delete',//
    },
    upload: {
        image: apiRoot + '/upload/image',  //图片上传
        file: apiRoot + '/upload/file',    //文件上传
    },
    dataImport: {
        add: apiRoot + '/dataImport/add',
        uploadFile: commonApiRoot + '/upload/file'
    },
    freeCarrierUpload: {
        driverImage: apiRoot + '/freeCarrierUpload/driverImage',  //图片上传
        vehicleImage: apiRoot + '/freeCarrierUpload/vehicleImage',  //车辆上传
    },
    uploadAndRecognition: {
        vehicleLicense: apiRoot + '/imageRecognition/vehicleLicense',  //上传并识别行驶证
        idCard: apiRoot + '/imageRecognition/idCard',  //上传并识别身份证
        bankCard: apiRoot + '/imageRecognition/bankCard',  //上传并识别银行卡
        // file: apiRoot + '/upload/file',    //文件上传
    },
    //用户相关
    user: {
        page: apiRoot + '/user/page',//分页查询
        add: apiRoot + '/user/add',//新增用户
        modify: apiRoot + '/user/modify',//修改用户
        delete: apiRoot + '/user/delete',//删除用户
        username: apiRoot + '/user/username',//根据用户名查询用户
        resetPassword: apiRoot + '/user/resetPassword',
        modifyPassword: authApiRoot + '/user/modifyPassword',//修改密码
        commonSelect: apiRoot + '/user/commonSelect'//用户选择器
    },
    //组织相关
    org: {
        commonSelect: apiRoot + '/org/commonSelect',
        add: apiRoot + '/org/add',//新增角色
        modify: apiRoot + '/org/modify',//修改角色
        delete: apiRoot + '/org/delete',//删除角色
        queryByCode: apiRoot + '/org/queryByCode',//根据code查询所属组织
        tree: apiRoot + '/org/tree',
        queryByCityCode: apiRoot + '/org/queryByCityCode'
    },
    supplierRole: {
        all: apiRoot + '/supplierRole/all',
    },
    //岗位相关
    position: {
        page: apiRoot + '/position/page',//分页查询
        add: apiRoot + '/position/add',//新增岗位
        modify: apiRoot + '/position/modify',//修改岗位
        queryById: apiRoot + '/position/queryById',//通过编号查询岗位
        delete: apiRoot + '/position/delete',//删除岗位
        getRole: apiRoot + '/position/getRole',//查询角色
        all: apiRoot + '/position/all'
    },

    //回单地址相关
    receiptAddress: {
        page: apiRoot + '/receiptAddress/page',//分页查询
        add: apiRoot + '/receiptAddress/add',//新增回单地址
        modify: apiRoot + '/receiptAddress/modify',//修改回单地址
        delete: apiRoot + '/receiptAddress/delete',//删除回单地址
        queryById: apiRoot + '/receiptAddress/queryById',//通过Id查找回单地址
        queryAllBill: apiRoot + '/customerReceipt/queryByWaybillCode',// 通过code查找所有的回单
    },
    //区域线路
    districtLine: {
        page: apiRoot + '/lineDistrict/page',//分页查询
        add: apiRoot + '/lineDistrict/add',//新增区域
        modify: apiRoot + '/lineDistrict/modify',//修改区域
        delete: apiRoot + '/lineDistrict/delete',//删除区域
        queryById: apiRoot + '/lineDistrict/queryById',//通过Id查找区域

    },
    //车辆保险折旧信息
    vehicleInsuranceDepreciation: {
        page: apiRoot + '/vehicleInsuranceDepreciation/page',//分页查询
        add: apiRoot + '/vehicleInsuranceDepreciation/add',//新增车辆保险折旧信息
        modify: apiRoot + '/vehicleInsuranceDepreciation/modify',//修改车辆保险折旧信息
        delete: apiRoot + '/vehicleInsuranceDepreciation/delete',//删除车辆保险折旧信息
        queryById: apiRoot + '/vehicleInsuranceDepreciation/queryById',//通过Id查找车辆保险折旧信息
        getExcel: apiRoot + '/vehicleInsuranceDepreciation/getExcel',//车辆保险折旧模板下载
        upload: apiRoot + '/vehicleInsuranceDepreciation/upload',//车辆保险折旧导入
        batchDelete: apiRoot + '/vehicleInsuranceDepreciation/batchDelete',//车辆保险折旧批量删除
        export: reportApiRoot + '/trailerHouseCarDepreciation/export', // 导出
    },
    //车辆保险折旧信息
    trailerHouseCarDepreciation: {
        page: apiRoot + '/trailerHouseCarDepreciation/page',//分页查询
        add: apiRoot + '/trailerHouseCarDepreciation/add',//新增挂车保险折旧信息
        modify: apiRoot + '/trailerHouseCarDepreciation/modify',//修改挂车保险折旧信息
        delete: apiRoot + '/trailerHouseCarDepreciation/delete',//删除挂车保险折旧信息
        queryById: apiRoot + '/trailerHouseCarDepreciation/queryById',//通过Id查找挂车保险折旧信息
        getExcel: apiRoot + '/trailerHouseCarDepreciation/getExcel',//挂车保险折旧模板下载
        upload: apiRoot + '/trailerHouseCarDepreciation/upload',//挂车保险折旧导入
        batchDelete: apiRoot + '/trailerHouseCarDepreciation/batchDelete',//车辆保险折旧批量删除
        export: reportApiRoot + '/trailerHouseCarDepreciation/export', // 导出
    },
    //小甩挂车辆信息
    smallSlingVehicle: {
        page: apiRoot + '/vehicleFinancial/page',//分页查询
        add: apiRoot + '/vehicleFinancial/add',//新增小甩挂车辆信息
        modify: apiRoot + '/vehicleFinancial/modify',//修改小甩挂车辆信息
        delete: apiRoot + '/vehicleFinancial/delete',//删除小甩挂车辆信息
        queryById: apiRoot + '/vehicleFinancial/queryById',//通过Id查找小甩挂车辆信息
    },
    //角色相关
    role: {
        page: apiRoot + '/role/page',//分页查询
        add: apiRoot + '/role/add',//新增角色
        modify: apiRoot + '/role/modify',//修改角色
        delete: apiRoot + '/role/delete',//删除角色
        all: apiRoot + '/role/all',
        queryByCode: apiRoot + '/role/queryByCode' //通过编号查找角色
    },
    userRole: {
        modify: apiRoot + '/userRole/modify',//分页查询
        add: apiRoot + '/role/page'//分页查询
    },
    positionRole: {
        modify: apiRoot + '/positionRole/modify',//修改岗位角色
    },
    permission: {
        page: apiRoot + '/permission/page',//分页
        add: apiRoot + '/permission/add',//新增角色
        modify: apiRoot + '/permission/modify',//修改角色
        delete: apiRoot + '/permission/delete',//删除角色
        all: apiRoot + '/permission/all',
        queryByCode: apiRoot + '/permission/queryByCode', //通过编号查找角色
        querySelect: apiRoot + '/permission/querySelect', //通过编号查找角色
        queryPermissionTree: apiRoot + '/permission/queryPermissionTree' //通过编号查找角色
    },
    rolePermission: {
        addList: apiRoot + '/rolePermission/addList',
        queryByRole: apiRoot + '/rolePermission/queryByRole',
        modify: apiRoot + '/userRole/modify'//分页查询
    },
    station: {
        page: apiRoot + '/station/page',//分页
        add: apiRoot + '/station/add',//新增
        modify: apiRoot + '/station/modify',//修改
        audit: apiRoot + '/station/audit',//审核
        delete: apiRoot + '/station/delete',//删除
        all: apiRoot + '/station/all',
        commonSelect: apiRoot + '/station/commonSelect',
        commonOption: apiRoot + '/station/commonOption',
        stationOption: apiRoot + '/station/stationOption',
        queryByName: apiRoot + '/station/queryByName',
        queryByCode: apiRoot + '/station/queryByCode',
        getStationTree: apiRoot + '/station/getStationTree'
    },
    customerServiceConfig: {
        page: apiRoot + '/customerServiceConfig/page',//分页
        add: apiRoot + '/customerServiceConfig/add',//新增
        modify: apiRoot + '/customerServiceConfig/modify',//修改
        delete: apiRoot + '/customerServiceConfig/delete',//删除
        queryById: apiRoot + '/customerServiceConfig/queryById',//根据编号查询
    },
    oilStation: {
        page: apiRoot + '/oilStation/page',//分页
        oilStationCommonPage: apiRoot + '/oilStation/oilStationCommonPage'
    },
    district: {
        page: apiRoot + '/district/page',//分页
        commonSelect: apiRoot + '/district/commonSelect',
        commonOption: apiRoot + '/district/commonOption',
        getDistrictTree: apiRoot + '/district/getDistrictTree',
        getDistrictTreeDto: apiRoot + '/district/getDistrictTreeDto'
    },
    customer: {
        page: apiRoot + '/customer/page',//分页
        add: apiRoot + '/customer/add',//新增客户
        modify: apiRoot + '/customer/modify',//修改客户
        delete: apiRoot + '/customer/delete',//删除客户
        audit: apiRoot + '/customer/audit',//删除客户
        getCustomerTree: apiRoot + '/customer/getCustomerTree',
        getCustomerByCode: apiRoot + '/customer/getCustomerByCode',
        commonSelect: apiRoot + '/customer/commonSelect',
        topLevelCustomer: apiRoot + '/customer/topLevelCustomer',
        lowestLevelSelect: apiRoot + '/customer/lowestLevelSelect'
    },
    //数据字典
    dataDictionary: {
        page: apiRoot + '/dataDictionary/page',//分页
        add: apiRoot + '/dataDictionary/add',//新增数据字典
        modify: apiRoot + '/dataDictionary/modify',//修改数据字典
        delete: apiRoot + '/dataDictionary/delete',//删除数据字典
        queryById: apiRoot + '/dataDictionary/queryById', //通过Id回显数据字典
        pageSub: apiRoot + '/dataDictionary/pageSub',//分页
        addSub: apiRoot + '/dataDictionary/addSub',//新增数据字典值信息
        deleteSub: apiRoot + '/dataDictionary/deleteSub',//删除数据字典值信息
        modifySub: apiRoot + '/dataDictionary/modifySub',//修改数据字典值信息
        queryByIdSub: apiRoot + '/dataDictionary/queryByIdSub',//通过Id回显数据字典值信息
        queryAll: apiRoot + '/dataDictionary/queryAll'//通过Id回显数据字典值信息
    },
    auditConfig: {
        page: apiRoot + '/auditConfig/page',//分页
        add: apiRoot + '/auditConfig/add',
        modify: apiRoot + '/auditConfig/modify',//修改
        delete: apiRoot + '/auditConfig/delete',//删除
        queryById: apiRoot + '/auditConfig/queryById'
    },
    //钉钉审批
    auditProcess: {
        page: apiRoot + '/auditProcess/page',//分页
        auditApproversSelect: apiRoot + '/auditProcess/auditApproversSelect',//审批人查询
        auditTypeSelect: apiRoot + '/auditProcess/auditTypeSelect',//审批类型查询
    },
    //钉钉审批记录
    auditCallback: {
        page: apiRoot + '/auditCallback/page',
    },
    auditNode: {
        add: apiRoot + '/auditNode/add',
        modify: apiRoot + '/auditNode/modify',//修改
        delete: apiRoot + '/auditNode/delete',//删除
        queryById: apiRoot + '/auditNode/queryById',
        list: apiRoot + '/auditNode/list'
    },
    sendMessage: {
        page: apiRoot + '/sendMessage/page',//分页
        add: apiRoot + '/sendMessage/add',
        modify: apiRoot + '/sendMessage/modify',//修改
        delete: apiRoot + '/sendMessage/delete',//删除
        audit: apiRoot + '/sendMessage/audit',
        queryById: apiRoot + '/sendMessage/queryById',
        templateDownload: apiRoot + '/sendMessage/templateDownload',
        addSendMobile: apiRoot + '/sendMessage/addSendMobile'
    },
    messageRecord: {
        page: apiRoot + '/messageRecord/page',//分页
    },
    sendMessageMobile: {
        queryByMessageId: apiRoot + '/sendMessageMobile/queryByMessageId', //分页
        page: apiRoot + '/sendMessageMobile/page'//分页
    },
    //配置参数
    configParam: {
        page: apiRoot + '/configParam/page',//分页查询
        add: apiRoot + '/configParam/add',//新增配置参数
        modify: apiRoot + '/configParam/modify',//修改配置参数
        delete: apiRoot + '/configParam/delete',//删除配置参数
        queryById: apiRoot + '/configParam/queryById' //根据ID回显配置参数信息
    },
    //线路管理-标准线路
    line: {
        page: apiRoot + '/line/page',//分页查询
        allPage: apiRoot + '/line/allPage',//分页查询
        exportPage: apiRoot + '/line/exportPage',//分页查询
        add: apiRoot + '/line/add',//新增
        modify: apiRoot + '/line/modify',//修改
        delete: apiRoot + '/line/delete',//删除
        queryById: apiRoot + '/line/queryById',//根据ID回显
        queryDetailById: apiRoot + '/line/queryDetailById', //根据ID回显所有详情
        auditStatus: apiRoot + '/line/auditStatus',  //审核状态
        commonSelect: apiRoot + '/line/commonSelect', //选择器
        lineCollectAdd: apiRoot + '/line/lineCollectAdd',  //线路收藏
        lineExport: reportApiRoot + '/lineExport/export',//线路导出
        linePayableAndReceivableExport: reportApiRoot + '/linePayableAndReceivableExport/export',//线路合作应收应付导出
    },
    //线路管理-临时线路
    tmpLine: {
        page: apiRoot + '/line/queryAllPage',//分页查询
        tmpPage: apiRoot + '/tmpLine/page',//临时线路分页查询
        add: apiRoot + '/tmpLine/add',//新增
        modify: apiRoot + '/tmpLine/modify',//修改
        delete: apiRoot + '/tmpLine/delete',//删除
        queryById: apiRoot + '/tmpLine/queryById',//根据ID回显
        changeTmpLine: apiRoot + '/tmpLine/changeTmpLine',//转合同线路
        export: reportApiRoot + '/tmpLine/export', // 导出
    },
    //线路合同管理
    lineContract: {
        add: apiRoot + '/lineContract/add',//新增
        queryByLineId: apiRoot + '/lineContract/queryByLineId' //根据ID回显
    },
    //线路外包应付
    lineOutsource: {
        add: apiRoot + '/lineOutsource/add',//新增
        batchModify: apiRoot + '/lineOutsource/batchModify',//批量修改
        queryById: apiRoot + '/lineOutsource/queryById',//根据ID回显单条数据
        modify: apiRoot + '/lineOutsource/modify',//修改
        delete: apiRoot + '/lineOutsource/delete',//删除
        page: apiRoot + '/lineOutsource/page' //分页查询
    },
    //线路外请应付
    lineOutInvite: {
        add: apiRoot + '/lineOutInvite/add',//新增
        queryById: apiRoot + '/lineOutInvite/queryById',//根据ID回显单条数据
        modify: apiRoot + '/lineOutInvite/modify',//修改
        delete: apiRoot + '/lineOutInvite/delete',//删除
        page: apiRoot + '/lineOutInvite/page' //分页查询
    },
    vehicle: {
        page: apiRoot + '/vehicle/page',//分页查询
        add: apiRoot + '/vehicle/add',//新增
        addOutInvite: apiRoot + '/vehicle/addOutInvite',//外请车新增
        modify: apiRoot + '/vehicle/modify',//修改
        delete: apiRoot + '/vehicle/delete',//删除
        all: apiRoot + '/vehicle/all',
        change: apiRoot + '/vehicle/change',
        commonSelect: apiRoot + '/vehicle/commonSelect',
        queryByCode: apiRoot + '/vehicle/queryByCode',//通过编号查找
        updateVehicleStatus: apiRoot + '/vehicle/updateVehicleStatus',//修改车辆运行状态为 未使用
        operationAttributeChange: apiRoot + '/vehicle/operationAttributeChange',//营运属性变更
        vehicleTransfer: apiRoot + '/vehicle/vehicleTransfer',//过户
        vehicleOutsourceAdd: apiRoot + '/vehicle/vehicleOutsourceAdd',//过户
        claimVehicle: apiRoot + '/vehicle/claimVehicle',//过户
        notClaimVehicle: apiRoot + '/vehicle/notClaimVehicle',//过户
        export: apiRoot + '/vehicle/export',//过户
        credentials: apiRoot + '/vehicle/credentials',
        modifyVehicleOperationMode: apiRoot + '/vehicle/modifyVehicleOperationMode',//外请车营运属性变更
        certificatesDonwload: apiRoot + '/vehicle/certificatesDonwload', //车辆证件下载
        certificatesManage: apiRoot + '/vehicle/certificatesManage', // 维护证件提交
        certBatchUpload: apiRoot + '/vehicle/certBatchUpload', // 证件批量上传
        upload: apiRoot + '/vehicle/upload',//油卡,etc导入
    },
    vehicleOwner: {
        page: apiRoot + '/vehicleOwner/page',//分页查询
        add: apiRoot + '/vehicleOwner/add',//新增
        modify: apiRoot + '/vehicleOwner/modify',//修改
        delete: apiRoot + '/vehicleOwner/delete',//删除
        getVehicleOwnerById: apiRoot + '/vehicleOwner/getVehicleOwnerById',//根据ID获取要修改的数据
        getVehicleDetailById: apiRoot + '/vehicleOwner/getVehicleDetailById',//获取车辆详细信息
        getExcelForVehicleOwner: apiRoot + '/vehicleOwner/getExcelForVehicleOwner',//导出
        commonSelect: apiRoot + '/vehicleOwner/commonSelect',
        pullIntoBlack: apiRoot + '/vehicleOwner/pullIntoBlack', // 拉黑操作
        pullOutBlack: apiRoot + '/vehicleOwner/pullOutBlack', // 取消拉黑操作
    },
    vehicleOwnerBankCard: {
        page: apiRoot + '/vehicleOwnerBankCard/page',//分页查询
        add: apiRoot + '/vehicleOwnerBankCard/add',//新增
        modify: apiRoot + '/vehicleOwnerBankCard/modify',//修改
        delete: apiRoot + '/vehicleOwnerBankCard/delete'//删除
    },
    driver: {
        page: apiRoot + '/driver/page',//分页查询
        add: apiRoot + '/driver/add',//新增
        modify: apiRoot + '/driver/modify',//修改
        delete: apiRoot + '/driver/delete',//删除
        resetPassWord: apiRoot + '/driver/resetPassWord',//重置密码
        commonSelect: apiRoot + '/driver/commonSelect',
        getDriverById: apiRoot + '/driver/getDriverById',
        getExcelData: apiRoot + '/driver/getExcelData',//导出
        modifyBankCard: apiRoot + '/driver/modifyBankCard',//修改银行卡信息
        cancel: apiRoot + '/driver/cancel', //注销
        getDriverByMobile: apiRoot + '/driver/getDriverByMobile',//根据手机号查询司机姓名
    },
    driverDetail: {
        page: apiRoot + '/driverDetail/page',//分页查询
    },
    /*
    * 到达车辆信息导出
    * */
    exportExcel: {
        exportExcel: reportApiRoot + '/arrivalVehicleExport/export',
    },
    /**
     * 信息部
     * */
    InformationDepart: {
        page: apiRoot + '/informationDepart/page', //分页查询
        add: apiRoot + '/informationDepart/add',//新增
        modify: apiRoot + '/informationDepart/modify',//修改
        delete: apiRoot + '/informationDepart/delete',//删除
        getInformationDepartById: apiRoot + '/informationDepart/getInformationDepartById',//根据ID获取要修改的数据
        getInformationOwnerWatchById: apiRoot + '/informationDepart/getInformationOwnerWatchById',//根据ID获取详细的数据
        getInformationDepartList: apiRoot + '/informationDepart/getInformationDepartList', //公共组件查询
    },
    supplier: {
        page: apiRoot + '/supplier/page',//分页查询
        add: apiRoot + '/supplier/add',//新增
        modify: apiRoot + '/supplier/modify',//修改
        delete: apiRoot + '/supplier/delete',//删除
        queryById: apiRoot + '/supplier/queryById',//通过id查找
        commonSelect: apiRoot + '/supplier/commonSelect',
        audit: apiRoot + '/supplier/audit',//审核成功
        resetPassWord: apiRoot + '/supplier/resetPassWord',//重置密码
        bindingOilCardInSupplier: apiRoot + '/supplier/bindingOilCardInSupplier',//绑定油卡
        getExcelData: apiRoot + '/supplier/getExcelData',//导出
        myAuditPage: apiRoot + '/supplier/myAuditPage',//我的审批
        invalidResult: apiRoot + '/supplier/invalidResult',//作废
        modifySupplier: apiRoot + '/supplier/modifySupplier',//修改供应商
    },
    supplierAudit: {
        page: apiRoot + '/supplierAudit/page',//分页查询
        // add: apiRoot + '/supplierAudit/add',//新增
        modify: apiRoot + '/supplierAudit/modify',//修改
        delete: apiRoot + '/supplierAudit/delete',//删除
        invalidResult: apiRoot + '/supplierAudit/invalidResult',//作废
        audit: apiRoot + '/supplierAudit/audit',//审核成功
    },
    supplierLine: {
        add: apiRoot + '/supplierLine/add',//新增
        page: apiRoot + '/supplierLine/page',//分页查询
        delete: apiRoot + '/supplierLine/delete',//删除
    },
    supplierRecord: {
        page: apiRoot + '/supplierDetail/page'
    },
    supplierUser: {
        page: apiRoot + '/supplierUser/page',//分页查询
        add: apiRoot + '/supplierUser/add',//新增
        modify: apiRoot + '/supplierUser/modify',//修改
        delete: apiRoot + '/supplierUser/delete',//删除
        username: apiRoot + '/supplierUser/username',//
        queryById: apiRoot + '/supplierUser/queryById',//通过id查找
        resetPassWord: apiRoot + '/supplierUser/resetPassWord'//重置密码
    },
    supplierUserRole: {
        modify: apiRoot + '/supplierUserRole/modify',//组织
    },
    dispatch: {
        page: apiRoot + '/dispatch/page',
        waitSendPage: apiRoot + '/dispatch/waitSendPage',
        waitDispatchExport: reportApiRoot + '/waitDispatchExport/export',
        waitDepartPage: apiRoot + '/dispatch/waitDepartPage',
        rejectDepartVehicle: apiRoot + '/dispatch/rejectDepartVehicle',//驳回待发车辆
        addDispatchByLineId: apiRoot + '/dispatch/addDispatchByLineId',//单边回货
        arrangeReturnGood: apiRoot + '/dispatch/arrangeReturnGood',//往返回货
        add: apiRoot + '/dispatch/add',//临时加车
        modify: apiRoot + '/dispatch/modify',//修改
        modifyDepartedDispatch: apiRoot + '/dispatch/modifyDepartedDispatch',//待发车辆修改派车单
        modifyWeightAttachment: apiRoot + '/dispatch/modifyWeightAttachment',//修改磅重附件
        send: apiRoot + '/dispatch/send',//派车
        addVehicle: apiRoot + '/dispatch/addVehicle',//加车
        departVehicle: apiRoot + '/dispatch/departVehicle',//发车
        getCustomerReceipt: apiRoot + '/customerReceiptRule/getCustomerReceipt',//发车时获取回单规则
        delete: apiRoot + '/dispatch/delete',//删除
        queryByCode: apiRoot + '/dispatch/queryByCode', //通过编号查找
        alreadySend: apiRoot + '/dispatch/alreadySend',//是否已发车
        //alreadySendPage: apiRoot + '/dispatch/alreadySendPage', //已派车辆
        confirm: apiRoot + '/dispatch/confirm', // 派车单确认
        getNoDepartVehicleCount: apiRoot + '/dispatch/getNoDepartVehicleCount', // 获取应发未发派车单数量

        //新派车确认 和 指派供应商
        assignVehicle: apiRoot + '/dispatch/assignVehicle',
        assignSupplier: apiRoot + '/dispatch/assignSupplier',

        //上报临时需求
        tempAssignVehicle: apiRoot + '/dispatch/tempAssignVehicle',
        tempAssignSupplier: apiRoot + '/dispatch/tempAssignSupplier',

        //待发车辆司机异常上报查询
        getByDispatchCode: tmsServiceRoot + '/driverReportException/getByDispatchCode',
    },
    waybill: {
        page: apiRoot + '/waybill/page',
        trackPage: apiRoot + '/waybill/trackPage',
        arrivalVehiclePage: apiRoot + '/waybill/arrivalVehiclePage',
        returnGoodsPage: apiRoot + '/waybill/returnGoodsPage',
        //paymentPage: apiRoot + '/waybill/paymentPage',
        queryByCode: apiRoot + '/waybill/queryByCode', //通过编号查找
        upload: apiRoot + '/waybill/upload',
        commitDeparture: apiRoot + '/waybill/commitDeparture',
        modifyWeight: apiRoot + '/waybill/modifyWeight',
        modifyEvaluationMode: apiRoot + '/waybill/modifyEvaluationMode',
        modifyOnTimeFlagAndOverTime: apiRoot + '/waybill/modifyOnTimeFlagAndOverTime',
        modifyCustomerOnTimeFlagAndCustomerOverTime: apiRoot + '/waybill/modifyCustomerOnTimeFlagAndCustomerOverTime',
        confirmArrive: apiRoot + '/waybill/confirmArrive',
        signIn: apiRoot + '/waybill/signIn',//运单签收
        signPage: apiRoot + '/waybill/signPage',//设备签收
        signGps: apiRoot + '/waybill/signGps',//gps签收
        signOilCard: apiRoot + '/waybill/signOilCard',//油卡签收
        signReceipt: apiRoot + '/waybill/signReceipt',//回单签收
        addReceiptAttachment: apiRoot + '/waybill/addReceiptAttachment',//回单附件
        confirmArriveStation: apiRoot + '/waybill/confirmArriveStation',//经停站点--添加到车时间
        customerConfirmArriveStation: apiRoot + '/waybill/customerConfirmArriveStation',//经停站点--添加到车时间-客服回单
        confirmDepartureStation: apiRoot + '/waybill/confirmDepartureStation',///经停站点--添加发车时间
        customerConfirmDepartureStation: apiRoot + '/waybill/customerConfirmDepartureStation',///经停站点--添加发车时间--客服回单
        export: apiRoot + '/waybill/export',//导出
        exportSign: apiRoot + '/waybill/exportSign',//设备签收导出
        getProfitData: apiRoot + '/waybill/getProfitData',//报表中心
        synchronizePayee: apiRoot + '/waybill/synchronizePayee',//同步收款人信息
        modifyPayee: apiRoot + '/waybill/modifyPayee',//修改收款人信息
        synchronizeWaybillPayee: apiRoot + '/waybill/synchronizeWaybillPayee',//同步收款人信息(从运单同步)
        addStopOverStation: apiRoot + '/waybill/addStopOverStation',//运单新增经停站点
        addStopOverStationNew: apiRoot + '/waybill/addStopOverStationNew',//运单新增经停站点New
        updateStopOverStation: apiRoot + '/waybill/updateStopOverStation',//运单新增经停站点可修改发车到车时间
        modifyDepartureTime: apiRoot + '/waybill/modifyDepartureTime',//修改发车时间
        customerModifyDepartureTime: apiRoot + '/waybill/customerModifyDepartureTime',//修改发车时间--客服回单
        modifyArrivalTime: apiRoot + '/waybill/modifyArrivalTime',//修改到达时间
        customerModifyArrivalTime: apiRoot + '/waybill/customerModifyArrivalTime',//修改到达时间--客服回单
        modify: apiRoot + '/waybill/modify',//修改运单
        getCustomerWaybill: apiRoot + '/customerWaybill/queryByCode', // 获取客户运单
        getNoArrivalVehicleCount: apiRoot + '/waybill/getNoArrivalVehicleCount' // 获取应到未到运单数量

    },
    waybillReceipt: {
        add: apiRoot + '/waybillReceipt/add',
        delete: apiRoot + '/waybillReceipt/delete',
        myReceiptPage: apiRoot + '/waybillReceipt/myReceiptPage',
    },
    waybillTrack: {
        add: apiRoot + '/waybillTrack/add',
        getByWaybillCode: apiRoot + '/waybillTrack/getByWaybillCode',
        downDriverExceptionImage: apiRoot + '/waybillTrack/downDriverExceptionImage',
        downCustomerExceptionImage: apiRoot + '/waybillTrack/downCustomerExceptionImage',
        //gps上报
        gpsPage: apiRoot + '/gpsExceptionReport/page',
        gpsExport: reportApiRoot + '/gpsExceptionReport/export',
        gpsModifyRemindTime: apiRoot + '/gpsExceptionReport/modifyRemindTime',
    },
    contractData: {
        page: apiRoot + '/contractData/page',
        update: apiRoot + '/contractData/update'
    },
    waybillException: {
        modifyExceptionTime: apiRoot + '/waybillException/modifyExceptionTime',
        confirmException: apiRoot + '/waybillException/confirmException',
        getByWaybillCode: apiRoot + '/waybillException/getByWaybillCode'
    },
    waybillPayableDeduct: {
        export: reportApiRoot + '/waybillPayableDeduct/export',
        page: apiRoot + '/waybillPayableDeduct/page',
        // timeFinePage: apiRoot + '/waybillPayableDeduct/timeFinePage',
        add: apiRoot + '/waybillPayableDeduct/add',
        modify: apiRoot + '/waybillPayableDeduct/modify',
        delete: apiRoot + '/waybillPayableDeduct/delete',
        audit: apiRoot + '/waybillPayableDeduct/audit',
        selectById: apiRoot + '/waybillPayableDeduct/selectById',
        auditSystemGeneration: apiRoot + '/waybillPayableDeduct/auditSystemGeneration',//系统生成的时效扣款审批
        upload: apiRoot + '/waybillPayableDeduct/upload'//上传
    },
    waybillTimeFine: {
        export: reportApiRoot + '/waybillTimeFine/export',
        // page: apiRoot + '/waybillTimeFine/page',
        timeFinePage: apiRoot + '/waybillTimeFine/timeFinePage',
        add: apiRoot + '/waybillTimeFine/add',
        modify: apiRoot + '/waybillTimeFine/modify',
        delete: apiRoot + '/waybillTimeFine/delete',
        audit: apiRoot + '/waybillTimeFine/audit',
        selectById: apiRoot + '/waybillTimeFine/selectById',
        auditSystemGeneration: apiRoot + '/waybillTimeFine/auditSystemGeneration'//系统生成的时效扣款审批
    },
    waybillInvalid: {//运单作废
        add: apiRoot + '/waybillInvalid/add',//运单作废
        page: apiRoot + '/waybillInvalid/page',//查询
        audit: apiRoot + '/waybillInvalid/audit',//审核
        modify: apiRoot + '/waybillInvalid/modify',//修改
    },
    refuelingRecord: {//合作加油记录
        page: apiRoot + '/refuelingRecord/page',//查询
        upload: apiRoot + '/refuelingRecord/upload',//导入
        queryById: apiRoot + '/refuelingRecord/queryById',//回显
        modify: apiRoot + '/refuelingRecord/modify',//修改
        delete: apiRoot + '/refuelingRecord/delete',//删除
        check: apiRoot + '/refuelingRecord/check',//核对
        settlement: apiRoot + '/refuelingRecord/settlement',//结算
        hide: apiRoot + '/refuelingRecord/hide',//结算
        pageDetail: apiRoot + '/refuelingRecord/pageDetail',//查询
    },
    refuelingOutInviteRecord: {//外请加油记录
        page: apiRoot + '/refuelingOutInviteRecord/page',//查询
        // upload: apiRoot + '/refuelingRecord/upload',//导入
        // queryById: apiRoot + '/refuelingRecord/queryById',//回显
        // modify: apiRoot + '/refuelingRecord/modify',//修改
        // delete: apiRoot + '/refuelingRecord/delete',//删除
        // check: apiRoot + '/refuelingRecord/check',//核对
        // settlement: apiRoot + '/refuelingRecord/settlement',//结算
        // pageDetail: apiRoot + '/refuelingRecord/pageDetail',//查询
    },
    refuelingDriverAccount: {//司机账户
        page: apiRoot + '/refuelingDriverAccount/page'//查询
    },
    refuelingDriverAccountRecord: {//账户记录流水
        page: apiRoot + '/refuelingDriverAccountRecord/page'//查询
    },
    refuelingDriverSupplierPay: {//支出流水
        page: apiRoot + '/refuelingDriverSupplierPay/page'//查询
    },
    refuelingDriverSupplierReceive: {//收入流水
        page: apiRoot + '/refuelingDriverSupplierReceive/page'//查询
    },
    waybillRefuelingRecord: { // 充值记录（运单维度）
        page: apiRoot + '/refuelingDriverAccountRecord/waybillRefuelingRecordPage'//查询
    },
    electronicRefuelingReceiveReport: { // 电子加油消费
        page: apiRoot + '/refuelingDriverAccountRecord/electronicRefuelingReceiveReport'//查询
    },
    refuelingRechargeApply: { // 充值申请
        page: apiRoot + '/refuelingRechargeApply/page',//查询
        add: apiRoot + '/refuelingRechargeApply/add', //新增
        queryById: apiRoot + '/refuelingRechargeApply/queryById', //新增
        modify: apiRoot + '/refuelingRechargeApply/modify' //修改
    },
    electronicRefuelingPayReport: { // 电子加油充值
        page: apiRoot + '/refuelingDriverAccountRecord/electronicRefuelingPayReport'//查询
    },
    waybillRechargeConsume: { // 运单充值消费报表
        page: reportApiRoot + '/waybillRechargeConsume/page', //运单充值消费查询
        export: reportApiRoot + '/waybillRechargeConsume/export'//运单充值消费导出
    },
    electronicRefuelingStatistics: { // 电子加油统计报表
        // 电子加油合计报表
        page: reportApiRoot + '/electronicRefuelingStatistics/page', //电子加油合计查询
        export: reportApiRoot + '/electronicRefuelingStatistics/export',//电子加油合计导出
        // 电子加油明细
        pageDetail: reportApiRoot + '/electronicRefuelingStatisticsDetail/page', //电子加油明细查询
        exportDetail: reportApiRoot + '/electronicRefuelingStatisticsDetail/export'//电子加油明细导出
    },
    refuelingRecordOutInvite: {//外请加油记录
        page: apiRoot + '/refuelingRecordOutInvite/page',//查询
    },
    refuelingInvoiceRecord: { //加油消费开票记录
        upload: apiRoot + '/refuelingInvoiceRecord/upload',//上传
        download: apiRoot + '/refuelingInvoiceRecord/download',//下载
    },
    replacementOrder: {//加油补单
        page: apiRoot + '/replacementOrder/page',//查询
        audit: apiRoot + '/replacementOrder/audit',//审核
    },
    outInviteReplacementOrder: {//外请加油补单
        page: apiRoot + '/outInviteReplacementOrder/page',//查询
        // audit: apiRoot + '/outFillTheBill/audit',//审核
    },
    refuelingSupplierSettlementRel: {//加油供应商结算
        upload: apiRoot + '/refuelingSupplierSettlementRel/upload'//导入
    },
    refuelingSupplierSettlement: {//加油供应商结算
        page: apiRoot + '/refuelingSupplierSettlement/page',//查询
        queryById: apiRoot + '/refuelingSupplierSettlement/queryById',//回显
        modify: apiRoot + '/refuelingSupplierSettlement/modify',//修改
        delete: apiRoot + '/refuelingSupplierSettlement/delete',//删除
        check: apiRoot + '/refuelingSupplierSettlement/check',//核对
        settlement: apiRoot + '/refuelingSupplierSettlement/settlement',//结算
    },
    refuelingVehicle: {//加油车辆
        page: apiRoot + '/refuelingVehicle/page',//查询
        add: apiRoot + '/refuelingVehicle/add',//新增
        queryById: apiRoot + '/refuelingVehicle/queryById',//回显
        modify: apiRoot + '/refuelingVehicle/modify',//修改
        delete: apiRoot + '/refuelingVehicle/delete',//删除
        disable: apiRoot + '/refuelingVehicle/disable',//禁用启用
    },
    refuelingVehicleRemark: {//加油车辆
        query: apiRoot + '/refuelingVehicleRemark/query',//查询
    },
    pushStationInfo: { //加油供应商选择器
        page: apiRoot + '/pushStationInfo/page',//查询
        commonSelect: apiRoot + '/pushStationInfo/commonSelect'//选择器
    },
    oilPrice: {//今日油价
        page: apiRoot + '/oilPrice/page',//查询
        update: apiRoot + '/oilPrice/update',//更新
    },
    //工作日
    todayDate: {//查询工作日
        page: apiRoot + '/todayDate/page',//查询
        update: apiRoot + '/todayDate/update',//更新
        getPredictAccountTime: apiRoot + '/todayDate/getPredictAccountTime'//获取查询 requestDate 第 num 天后工作日
    },
    openPushOilInfo: { //供应商油品选择器
        page: apiRoot + '/openPushOilInfo/page',//查询
        commonSelect: apiRoot + '/openPushOilInfo/commonSelect'//选择器
    },
    equipmentHandover: {
        page: apiRoot + '/equipmentHandover/page',
        myReceiptPage: apiRoot + '/equipmentHandover/myReceiptPage',
        batchSign: apiRoot + '/equipmentHandover/batchSign'
    },
    SettlementCustomer: {
        page: apiRoot + '/settlementCustomer/page', //分页查询
        add: apiRoot + '/settlementCustomer/add',//新增
        modify: apiRoot + '/settlementCustomer/modify',//修改
        delete: apiRoot + '/settlementCustomer/delete',//删除
        getSettlementCustomerById: apiRoot + '/settlementCustomer/getSettlementCustomerById',//根据ID获取要修改的数据
        getSettlementCustomerWatchById: apiRoot + '/settlementCustomer/getSettlementCustomerWatchById',//根据ID获取详细的数据
        getSettlementCustomerList: apiRoot + '/settlementCustomer/getSettlementCustomerList', //公共组件查询
        getExcelData: apiRoot + '/settlementCustomer/getExcelData', //结算客户的导出
    },
    lineCollect: {//我的派车单--线路收藏
        page: apiRoot + '/lineCollect/page', //分页查询
        add: apiRoot + '/lineCollect/add',//新增
        addLine: apiRoot + '/lineCollect/addLine',//新增已经被其他用户收藏的客户
        delete: apiRoot + '/lineCollect/delete',//删除
        handSelectLine: apiRoot + '/lineCollect/handLineCollectById',//手动生成派生单
        returnGoodsPage: apiRoot + '/lineCollect/returnGoodsPage'  //线路收藏
    },
    vehicleOutsource: {
        page: apiRoot + '/vehicleOutsource/page', //分页查询
        add: apiRoot + '/vehicleOutsource/add',//新增
        modify: apiRoot + '/vehicleOutsource/modify',//修改
        delete: apiRoot + '/vehicleOutsource/delete',//删除
        audit: apiRoot + '/vehicleOutsource/audit',//审核成功
        getVehicleOutsourceById: apiRoot + '/vehicleOutsource/getVehicleOutsourceById',
    },
    blackList: {
        page: apiRoot + '/blackList/byPage', //分页查询
        queryById: apiRoot + '/blackList/queryById', //根据id查询
        add: apiRoot + '/blackList/add',//新增
        modify: apiRoot + '/blackList/modify',//修改
        delete: apiRoot + '/blackList/delete',//删除
        audit: apiRoot + '/blackList/audit',//审核
    },
    userOrg: {
        page: apiRoot + '/userOrg/page',//分页查询
        add: apiRoot + '/userOrg/add',//新增配置参数
        modify: apiRoot + '/userOrg/modify',//修改配置参数
        delete: apiRoot + '/userOrg/delete',//删除配置参数
        queryById: apiRoot + '/userOrg/queryById' //根据ID回显配置参数信息
    },
    dispatchOrg: {
        page: apiRoot + '/dispatchOrg/page',//分页查询
        add: apiRoot + '/dispatchOrg/add',//新增配置参数
        modify: apiRoot + '/dispatchOrg/modify',//修改配置参数
        delete: apiRoot + '/dispatchOrg/delete',//删除配置参数
        queryById: apiRoot + '/dispatchOrg/queryById' //根据ID回显配置参数信息
    },
    outInviteVehicle: {
        page: apiRoot + '/outInviteVehicle/page',//分页查询
        add: apiRoot + '/outInviteVehicle/add',//新增
        modify: apiRoot + '/outInviteVehicle/modify',//修改
        delete: apiRoot + '/outInviteVehicle/delete',//删除
    },
    oilCard: {
        page: apiRoot + '/oilCard/page',//分页查询
        add: apiRoot + '/oilCard/add',//新增
        modify: apiRoot + '/oilCard/modify',//修改
        delete: apiRoot + '/oilCard/delete',//删除
        getDeTailById: apiRoot + '/oilCard/getDeTailById',//数据回显
        commonSelect: apiRoot + '/oilCard/commonSelect',//公共组件
        showOilCardByVehicle: apiRoot + '/oilCard/showOilCardByVehicle',//通过车牌号查询所属油卡
        showOilCardByOrgCode: apiRoot + '/oilCard/showOilCardByOrgCode',//通过分区查询所属油卡
        bindVehicle: apiRoot + '/oilCard/bindVehicle',//绑定车牌号
        sendOut: apiRoot + '/oilCard/sendOut',//下发
        setUnworked: apiRoot + '/oilCard/setUnworked',//回收
        myOilCard: apiRoot + '/oilCard/myOilCard',//我的油卡
        transferUser: apiRoot + '/oilCard/transferUser',//移交
        // getExcelData: apiRoot + '/oilCard/getExcelData',//导出
        export: reportApiRoot + '/oilCard/export',//导出
        resetPassWord: apiRoot + '/oilCard/resetPassword',//重置密码
        pullOut: apiRoot + '/oilCard/pullOut',//领取
        claimed: apiRoot + '/oilCard/claimed',//认领
        cancelClaim: apiRoot + '/oilCard/cancelClaim',//取消认领
        updateBalance: apiRoot + '/oilCard/updateBalance',//修改余额
        updateOrg: apiRoot + '/oilCard/updateOrg',//修改平台公司
        cancellation: apiRoot + '/oilCard/cancellation',//油卡挂失
        upload: apiRoot + '/oilCard/upload',//油卡导入
        getExcel: apiRoot + '/oilCard/getExcel',//油卡模板下载
        prohibit: apiRoot + '/oilCard/prohibit',//油卡批量启用禁用
    },
    gps: {
        page: apiRoot + '/gps/page',//分页查询
        add: apiRoot + '/gps/add',//新增
        modify: apiRoot + '/gps/modify',//修改
        delete: apiRoot + '/gps/delete',//删除
        getGpsById: apiRoot + '/gps/getGpsById',//数据回显
        setUnworked: apiRoot + '/gps/setUnworked',//回收
        setGpsInvalid: apiRoot + '/gps/setGpsInvalid',//作废
        setGpsInUse: apiRoot + '/gps/setGpsInUse',//下放
        getExcelData: apiRoot + '/gps/getExcelData',//导出
        commonSelect: apiRoot + '/gps/commonSelect',//gps选择器
        bindVehicle: apiRoot + '/gps/bindVehicle',//绑定车辆
        myGps: apiRoot + '/gps/myGps',//我的Gps
        transferUser: apiRoot + '/gps/transferUser',//我的移交
        pullOut: apiRoot + '/gps/pullOut',//我的领取
        claimed: apiRoot + '/gps/claimed',//组织认领
        cancelClaim: apiRoot + '/gps/cancelClaim',//取消组织认领
        upload: apiRoot + '/gps/upload',//gps导入
        getExcel: apiRoot + '/gps/getExcel',//gps模板下载
        prohibit: apiRoot + '/gps/prohibit',//gps启用禁用功能
        queryGpsByCodes: apiRoot + '/gps/queryGpsByCodes',//批量查询
        modifyRemark: apiRoot + '/gps/modifyRemark'//修改备注
    },
    pda: {
        page: apiRoot + '/pda/page',//分页查询
        add: apiRoot + '/pda/add',//新增
        modify: apiRoot + '/pda/modify',//修改
        delete: apiRoot + '/pda/delete',//删除
        getGpsById: apiRoot + '/pda/getGpsById',//数据回显
        setUnworked: apiRoot + '/pda/setUnworked',//回收
        setGpsInvalid: apiRoot + '/pda/setGpsInvalid',//作废
        setGpsInUse: apiRoot + '/pda/setGpsInUse',//下放
        getExcelData: apiRoot + '/pda/getExcelData',//导出
        commonSelect: apiRoot + '/pda/commonSelect',//gps选择器
        bindVehicle: apiRoot + '/pda/bindVehicle',//绑定车辆
        myGps: apiRoot + '/pda/myGps',//我的Gps
        transferUser: apiRoot + '/pda/transferUser',//我的移交
        myPda: apiRoot + '/pda/myPda',//我的pda
        pullOut: apiRoot + '/pda/pullOut',//我的领取
        claimed: apiRoot + '/pda/claimed',//组织认领
        cancelClaim: apiRoot + '/pda/cancelClaim',//取消组织认领
    },
    etcManager: {
        page: apiRoot + '/etc/page', //分页查询
        add: apiRoot + '/etc/add',//新增
        modify: apiRoot + '/etc/modify',//修改
        delete: apiRoot + '/etc/delete',//删除
        getDeTailById: apiRoot + '/etc/getDeTailById',//数据回显
        commonSelect: apiRoot + '/etc/commonSelect',//公共组件
        applyAmount: apiRoot + '/etc/applyAmount',//充值申请
        auditAmount: apiRoot + '/etc/auditAmount',//充值审批
        // getExcelData: apiRoot + '/etc/getExcelData',//导出
        export: reportApiRoot + '/etc/export',
        claimed: apiRoot + '/etc/claimed',//认领
        cancelClaim: apiRoot + '/etc/cancelClaim',//取消认领
        unBindVehicle: apiRoot + '/etc/unBindVehicle',//解绑
        inBindVehicle: apiRoot + '/etc/inBindVehicle',//绑定
        cancellation: apiRoot + '/etc/cancellation',//挂失
    },
    gpsSendOut: {
        page: apiRoot + '/gpsSendOut/page',//分页查询
        add: apiRoot + '/gpsSendOut/add',//新增
        modify: apiRoot + '/gpsSendOut/modify',//修改
        delete: apiRoot + '/gpsSendOut/delete',//删除
        setUnworked: apiRoot + '/gpsRecord/setUnworked',//回收
        setGpsInvalid: apiRoot + '/gpsRecord/setInvalid',//作废
        watchGrantList: apiRoot + '/gpsRecord/page',//查看详细信息
    },
    //应收确认
    receiveConfirm: {
        page: apiRoot + '/receiveConfirm/page',//分页查询
        pageDetail: apiRoot + '/receiveConfirm/pageDetail',//分页查询详情
        modify: apiRoot + '/receiveConfirm/modify',//修改
        createBill: apiRoot + '/receiveConfirm/createBill',//生成对账单
        queryById: apiRoot + '/receiveConfirm/queryById',//根据ID回显信息
        templateDownload: apiRoot + '/receiveConfirm/templateDownload',//模板下载
        upload: apiRoot + '/receiveConfirm/upload', //导入
        modifyQualityDeductionsAmount: apiRoot + '/receiveConfirm/modifyQualityDeductionsAmount', //修改质量扣款
        customerFinesUpload: apiRoot + '/receiveConfirm/customerUpload', //客户质量扣款导入
        customerFinesDownload: apiRoot + '/receiveConfirm/customerDownload',//客户质量扣款模板下载
    },
    //应收账单
    receiveBill: {
        page: apiRoot + '/receiveBill/page',//分页查询
        modify: apiRoot + '/receiveBill/modify',//修改
        delete: apiRoot + '/receiveBill/delete',//修改
        queryById: apiRoot + '/receiveBill/queryById'//根据ID回显信息
    },
    //应收导入
    receiveImport: {
        page: apiRoot + '/receiveImport/page',//分页查询
        upload: apiRoot + '/receiveImport/upload', //导入
        uploadFail: apiRoot + '/receiveImport/uploadFail', //导入失败
        modify: apiRoot + '/receiveImport/modify',//修改
        delete: apiRoot + '/receiveImport/delete',//删除
        queryById: apiRoot + '/receiveImport/queryById',//根据ID回显信息
        createBill: apiRoot + '/receiveImport/createBill',//生成账单
        templateDownload: apiRoot + '/receiveImport/templateDownload',//模板下载
        queryFailByImportCode: apiRoot + '/receiveImport/queryFailByImportCode'//根据导入编号回显导入失败信息
    },
    //应收调整
    receiveAdjustBill: {
        page: apiRoot + '/receiveAdjustBill/page',//分页查询
        add: apiRoot + '/receiveAdjustBill/add',//新增
        modify: apiRoot + '/receiveAdjustBill/modify',//修改
        modifyInvoice: apiRoot + '/receiveAdjustBill/modifyInvoice',//修改发票号
        delete: apiRoot + '/receiveAdjustBill/delete',//删除
        auditStatus: apiRoot + '/receiveAdjustBill/auditStatus',//审核状态
        queryById: apiRoot + '/receiveAdjustBill/queryById' //根据ID回显
    },
    //应付调整
    payableAdjustBill: {
        page: apiRoot + '/payableAdjustBill/page',//分页查询
        add: apiRoot + '/payableAdjustBill/add',//新增
        modify: apiRoot + '/payableAdjustBill/modify',//修改
        delete: apiRoot + '/payableAdjustBill/delete',//删除
        auditStatus: apiRoot + '/payableAdjustBill/auditStatus',//审核状态
        queryById: apiRoot + '/payableAdjustBill/queryById' //根据ID回显
    },
    //合作车应付账单
    outsourcePayableBill: {
        page: apiRoot + '/outsourcePayableBillSupplier/page',//分页查询
        generateStatement: apiRoot + '/outsourcePayableBillSupplier/generateStatement',//分页查询
        getOutsourceVehicleList: apiRoot + '/outsourcePayableBillSupplier/getOutsourceVehicleList',//分页查询
        generateStatementLicenseNumbers: apiRoot + '/outsourcePayableBillSupplier/generateStatementLicenseNumbers',//分页查询
    },
    gasStation: {
        page: apiRoot + '/gasStation/page', //分页查询
        add: apiRoot + '/gasStation/add',//新增
        modify: apiRoot + '/gasStation/modify',//修改
        delete: apiRoot + '/gasStation/delete',//删除
        getDeTailById: apiRoot + '/gasStation/getDeTailById',//数据回显
        commonSelect: apiRoot + '/gasStation/commonSelect',//公共组件
        resetPassWord: apiRoot + '/gasStation/resetPassWord',//重置密码
        templateDownload: apiRoot + '/gasStation/templateDownload',//模板下载
        getExcelData: apiRoot + '/gasStation/getExcelData',//导出
    },
    gasStationPrice: {
        add: apiRoot + '/gasStationPrice/add',//新增
        page: apiRoot + '/gasStationPrice/page', //分页查询
        upload: apiRoot + '/gasStationPrice/upload',//导入
        getDeTailById: apiRoot + '/gasStationPrice/getDeTailById',//回显详情
        modify: apiRoot + '/gasStationPrice/modifyGasPrice'//修改
    },
    outOilStation: {//外请加油站点
        page: apiRoot + '/oilStation/page',//查询
        disable: apiRoot + '/oilStation/disable'//禁用启用
    },
    oilCardRecharge: {
        add: apiRoot + '/oilCardRecharge/add',//新增
        page: apiRoot + '/oilCardRecharge/page',//查询
        addBatchApply: apiRoot + '/oilCardRecharge/addBatchApply',//充值申请
        getExcelData: apiRoot + '/oilCardRecharge/getExcelData',//导出充值
        unWorkMoney: apiRoot + '/oilCardRecharge/unWorkMoney', //撤回
        inValidMoney: apiRoot + '/oilCardRecharge/inValidMoney',//作废
        // getExcel: apiRoot + '/oilCardRecharge/getExcel',//导出
        myRecharge: apiRoot + '/oilCardRecharge/myRecharge',//我的充值记录
        myPrecharge: apiRoot + '/oilCardRecharge/myPrecharge',//我的充值申请预计充值
        returned: apiRoot + '/oilCardRecharge/returned',//圈回导入
        export: reportApiRoot + '/oilCardRecharge/export',//导出
    },
    //油卡平台
    oilCardSupplier: {
        add: apiRoot + '/oilCardSupplier/add',//新增
        page: apiRoot + '/oilCardSupplier/page',//查询
        export: apiRoot + '/oilCardSupplier/export',//导出
        delete: apiRoot + '/oilCardSupplier/delete',//删除
    },
    oilCardRecord: {
        add: apiRoot + '/oilCardRecord/add',//新增
        setUnworked: apiRoot + '/oilCardRecord/setUnworked',//回收
        setGpsInvalid: apiRoot + '/oilCardRecord/setInvalid',//作废
        watchGrantList: apiRoot + '/oilCardRecord/page',//查看充值详细信息
    },
    supplierBill: { //供应商账单
        queryPage: reportApiRoot + '/supplierBillQuery/page',//分页查询
        queryExport: reportApiRoot + '/supplierBillQuery/export',//导出
        confirmPage: reportApiRoot + '/supplierBillConfirm/page',//分页查询
        confirmExport: reportApiRoot + '/supplierBillConfirm/export',//导出
        sum: reportApiRoot + '/supplierBillConfirmSum/page',// 计算金额
        confirmAdd: apiRoot + '/supplierBillConfirm/add',//账单确认
        confirmDelete: apiRoot + '/supplierBillConfirm/delete',//账单确认删除
        createBill: apiRoot + '/supplierBillConfirm/createBill',//生成供应商账单


        page: apiRoot + '/supplierBill/page',
        delete: apiRoot + '/supplierBill/delete',
        modify: apiRoot + '/supplierBill/modify',
        queryById: apiRoot + '/supplierBill/queryById',
        detailPage: reportApiRoot + '/supplierBillDetail/page',
        detailExport: reportApiRoot + '/supplierBillDetail/export',//明细导出

    },
    payableConfirm: {//应付确认
        page: apiRoot + '/payableConfirm/pageHQ', //分页查询
        add: apiRoot + '/payableConfirm/add',//新增
        modify: apiRoot + '/payableConfirm/modify',//修改
        delete: apiRoot + '/payableConfirm/delete',//删除
        getPayableConfirmById: apiRoot + '/payableConfirm/getPayableConfirmById',
        generateStatementHQ: apiRoot + '/payableConfirm/generateStatementHQ',//生成对账单,
        queryHQListByBillType: apiRoot + '/payableConfirm/queryHQListByBillType',//生成对账单,
        getPayableConfirmPageConfirm: apiRoot + '/payableConfirm/getPayableConfirmPageConfirm',//付款申请查询
        getPayableConfirmPageConfirmSum: apiRoot + '/payableConfirm/getPayableConfirmPageConfirmSum',//付款申请--账单明细--dialog查询
        generatedBills: apiRoot + '/payableConfirm/generatedBills',//付款申请--生成账单
        getRefuelingRecordSum: apiRoot + '/payableConfirm/getRefuelingRecordSum',//查询定点加油记录以生成账单
        getPayableConfirmBySettlement: apiRoot + '/payableConfirm/getPayableConfirmBySettlement',//查询已结算运单信息

        getSupplierSettlementWaybillPage: apiRoot + '/payableConfirm/getSupplierSettlementWaybillPage',//查询已结算运单信息(优化后查询)
    },
    etcRecharge: {
        page: apiRoot + '/etcRecharge/page', //分页查询
        getExcelData: apiRoot + '/etcRecharge/getExcelData', //导出充值
        unWorkMoney: apiRoot + '/etcRecharge/unWorkMoney', //撤回
        inValidMoney: apiRoot + '/etcRecharge/inValidMoney',//作废
        // getExcel: apiRoot + '/etcRecharge/getExcel',//导出
        export: reportApiRoot + '/etcRecharge/export'
    },
    etcConsumerRecord: {
        page: apiRoot + '/etcRecord/page', //分页查询
        upload: apiRoot + '/etcRecord/upload',//上传
        getExcel: apiRoot + '/etcRecord/getExcel',//下载
        // getExcelData: apiRoot + '/etcRecord/getExcelData'//导出
        export: reportApiRoot + '/etcRecord/export'
    },
    payableBill: {
        page: apiRoot + '/payableBill/page',//查询
        getDetailById: apiRoot + '/payableBill/getDetailById',//查询
        generateStatement: apiRoot + '/payableBill/generateStatement',//生成外请车对账单
        confirmThePayment: apiRoot + '/payableBill/confirmThePayment',//付款确认
        synchronization: apiRoot + '/payableBill/synchronization',
        notarizePayment: apiRoot + '/payableBill/notarizePayment',//确认付款
        toBeConfirmed: apiRoot + '/payableBill/toBeConfirmed',//转入待付款
        paymentFailed: apiRoot + '/payableBill/paymentFailed',//付款失败
        deleteTheBill: apiRoot + '/payableBill/deleteTheBill'//删除账单
    },
    g7: {
        monitorUrl: apiRoot + '/g7/monitorUrl',
        vehicleReviewUrl: apiRoot + '/g7/vehicleReviewUrl',
        vehicleFollowUrl: apiRoot + '/g7/vehicleFollowUrl'
    },
    driverLocation: {
        driverReviewUrl: apiRoot + '/driverLocation/getDriverTrail'
    },
    customerAudit: {
        page: apiRoot + '/customerAudit/page',
        audit: apiRoot + '/customerAudit/audit'
    },
    stationAudit: {
        page: apiRoot + '/stationAudit/page',
        audit: apiRoot + '/stationAudit/audit'
    },
    lineAudit: {//线路基本信息审批
        page: apiRoot + '/lineAudit/page',
        audit: apiRoot + '/lineAudit/audit'
    },
    vehicleAudit: {// 车辆证件审批
        page: apiRoot + '/vehicleCertAudit/page',
        audit: apiRoot + '/vehicleCertAudit/audit',
        exportVehicleCertAudit: apiRoot + '/vehicleCertAudit/exportVehicleCertAudit'
    },
    lineOutsourceAudit: {//合作应付审批
        page: apiRoot + '/lineOutsourceAudit/page',
        audit: apiRoot + '/lineOutsourceAudit/audit'
    },
    lineOutInviteAudit: {//外请应付审批
        page: apiRoot + '/lineOutInviteAudit/page',
        audit: apiRoot + '/lineOutInviteAudit/audit'
    },
    lineContractAudit: {//应收合同审批
        page: apiRoot + '/lineContractAudit/page',
        audit: apiRoot + '/lineContractAudit/audit'
    },
    paymentAudit: {//应付审批
        page: apiRoot + '/paymentCheckBeforeApproval/page',
        audit: apiRoot + '/paymentCheckBeforeApproval/auditPayment',
        selectById: apiRoot + '/paymentCheckBeforeApproval/selectById'
    },
    oilCardAudit: {//油卡审批
        page: apiRoot + '/oilCardAudit/page',
        audit: apiRoot + '/oilCardAudit/audit'
    },
    outsourceDeductionDetail: {
        page: apiRoot + '/outsourceDeductionDetail/page',
        download: apiRoot + '/outsourceDeductionDetail/download',
        upload: apiRoot + '/outsourceDeductionDetail/upload',
        confirm: apiRoot + '/outsourceDeductionDetail/confirm',
        updateFilePath: apiRoot + '/outsourceDeductionDetail/updateFilePath',
        deleteByCode: apiRoot + '/outsourceDeductionDetail/deleteByCode',
        deleteOne: apiRoot + '/outsourceDeductionDetail/delete',
        modify: apiRoot + '/outsourceDeductionDetail/modify',
        toBeDeducted: apiRoot + '/outsourceDeductionDetail/toBeDeducted',
        noDeductions: apiRoot + '/outsourceDeductionDetail/noDeductions'
    },
    //时效扣款配置
    timeFine: {
        page: apiRoot + '/timeFine/page',//分页查询
        add: apiRoot + '/timeFine/add',//新增
        modify: apiRoot + '/timeFine/modify',//修改
        delete: apiRoot + '/timeFine/delete'//删除
    },
    //时效扣款配置
    outsourceBillCharFale: {
        page: apiRoot + '/outsourceBillCharFale/page',//分页查询
        queryById: apiRoot + '/outsourceBillCharFale/queryById',//
    },
    //发车汇总
    departSummary: {
        page: apiRoot + '/departSummary/page',//分页查询
        receiveDetail: apiRoot + '/departSummary/receiveDetail',//应收明细
        paidDetail: apiRoot + '/departSummary/paidDetail',//应付明细
        payableSettlement: apiRoot + '/departSummary/payableSettlement',//外请车应付结算进度明细
        payableSettlement2: apiRoot + '/departSummary/payableSettlement2',//合作车应付结算进度明细
        monthlySupplementStatistics: apiRoot + '/departSummary/monthlySupplementStatistics',//当月补单明细
        customerGrossProfitRate: apiRoot + '/departSummary/customerGrossProfitRate',//客户毛利率明细
        grossMargin: apiRoot + '/departSummary/grossMargin',//毛利率区间统计明细
        lossLineCustomerStatistics: apiRoot + '/departSummary/lossLineCustomerStatistics',//亏损线路客户统计明细
        export: apiRoot + '/departSummary/export',//分页导出查询
        receiveSettlementUnusualDetailDialog: apiRoot + '/departSummary/receiveSettlementUnusualDetailDialog',//应收结算价格异常报表明细
        payableSettlementUnusualDetailDialog: apiRoot + '/departSummary/payableSettlementUnusualDetailDialog',//应付结算价格异常报表明细
        customerProfitChartDetailDialog: apiRoot + '/departSummary/customerProfitChartDetailDialog',//客户利润报表明细
        accountsReceivableProgressStatementDialog: apiRoot + '/departSummary/accountsReceivableProgressStatement'//应收结算进度(已结算运单)明细
    },
    checkComputationReceivePaidDetail: {
        page: reportApiRoot + '/checkComputationReceivePaidDetail/page',//分页查询
        export: reportApiRoot + '/checkComputationReceivePaidDetail/export',//分页导出查询

    },
    //运单添加备注
    waybillRemark: {
        add: apiRoot + '/waybillRemark/add'
    },
    //运单管理--付款申请
    supplierPayableBill: {
        page: apiRoot + '/supplierPayableBill/page',
        queryById: apiRoot + '/supplierPayableBill/queryById',//
        applyForBalancePayment: apiRoot + '/supplierPayableBill/applyForBalancePayment',//申请付款
        auditForBalancePayment: apiRoot + '/supplierPayableBill/auditForBalancePayment'//审核
    },
    //放空费
    dispatchEmpty: {
        page: apiRoot + '/dispatchEmpty/page',
        add: apiRoot + '/dispatchEmpty/add',
        audit: apiRoot + '/dispatchEmpty/audit',
        getAuditDetailById: apiRoot + '/dispatchEmpty/getAuditDetailById',
        modifyEmptyAmount: apiRoot + '/dispatchEmpty/modifyEmptyAmount' //修改放空费
    },
    //压车未发
    dispatchDelayDeparture: {
        page: tmsServiceRoot + '/dispatchDelayDeparture/page',
        modify: tmsServiceRoot + '/dispatchDelayDeparture/modify',
        add: tmsServiceRoot + '/dispatchDelayDeparture/add',
        export: reportApiRoot + '/dispatchDelayDeparture/export'
    },
    //任务异常
    taskException: {
        page: tmsServiceRoot + '/taskException/page',
        handled: tmsServiceRoot + '/taskException/handled',
        add: tmsServiceRoot + '/taskException/add',
        export: reportApiRoot + '/taskException/export'
    },
    //合作车价确认
    dispatchPriceConfirm: {
        page: apiRoot + '/dispatchPriceConfirm/page',
        queryById: apiRoot + '/dispatchPriceConfirm/queryById',
        confirm: apiRoot + '/dispatchPriceConfirm/confirm',
        export: apiRoot + '/dispatchPriceConfirm/export',
        templateDownload: apiRoot + '/dispatchPriceConfirm/templateDownload',
        upload: apiRoot + '/dispatchPriceConfirm/upload',
        modify: apiRoot + '/dispatchPriceConfirm/modify',
        modifyConfirm: apiRoot + '/dispatchPriceConfirm/modifyConfirm',
        audit: apiRoot + '/dispatchPriceConfirm/audit',
        delete: apiRoot + '/dispatchPriceConfirm/delete'
    },
    outsourcePriceAudit: {
        export: apiRoot + '/outsourcePriceAudit/export',
        page: apiRoot + '/outsourcePriceAudit/page',
        add: apiRoot + '/outsourcePriceAudit/add',
        modify: apiRoot + '/outsourcePriceAudit/modify',
        delete: apiRoot + '/outsourcePriceAudit/delete',
        auditOutsourcePrice: apiRoot + '/outsourcePriceAudit/auditOutsourcePrice',
        getOutsourcePriceAuditById: apiRoot + '/outsourcePriceAudit/getOutsourcePriceAuditById'
    },
    financialPriceRecord: {//金融价格导入记录
        export: reportApiRoot + '/financialPriceRecord/export',
        page: reportApiRoot + '/financialPriceRecord/page',
        upload: apiRoot + '/financialPriceRecord/upload'
    },
    //系统管理--报表管理
    report: {
        page: apiRoot + '/report/page',
        add: apiRoot + '/report/add',
        modify: apiRoot + '/report/modify',
        delete: apiRoot + '/report/delete'
    },
    //系统管理--报表管理
    noDingtalkAuditCustomer: {
        page: apiRoot + '/noDingtalkAuditCustomer/page',
        add: apiRoot + '/noDingtalkAuditCustomer/add',
        delete: apiRoot + '/noDingtalkAuditCustomer/delete'
    },
    //系统管理--配置管理-报表导出记录
    exportReport: {
        page: apiRoot + '/exportReport/page'
    },
    //系统管理--配置管理-订单钉钉通知
    orderDingTalkNotice: {
        page: apiRoot + '/customerDispatcher/page',
        add: apiRoot + '/customerDispatcher/add',
        delete: apiRoot + '/customerDispatcher/delete',
        modify: apiRoot + '/customerDispatcher/modify',
        queryById: apiRoot + '/customerDispatcher/queryById' //根据ID回显订单钉钉通知信息
    },
    //利润异常报表
    exceptionProfit: {
        page: reportApiRoot + '/exceptionProfit/page',
        export: reportApiRoot + '/exceptionProfit/export',
    },
    //未录入应付价格
    noEntryPayReport: {
        page: reportApiRoot + '/noEntryPayReport/page',
        export: reportApiRoot + '/noEntryPayReport/export',
    },
    //未录入应收价格
    noEntryIncomeReport: {
        page: reportApiRoot + '/noEntryIncomeReport/page',
        export: reportApiRoot + '/noEntryIncomeReport/export',
    },
    //应付结算进度
    payableSettlementSchedule: {
        page: reportApiRoot + '/payableSettlementSchedule/page',
        export: reportApiRoot + '/payableSettlementSchedule/export',
    },
    //应收结算进度
    accountsReceivableProgressStatement: {
        pageFormat1: reportApiRoot + '/accountsReceivableProgressStatement1/page',//格式一查询
        exportFormat1: reportApiRoot + '/accountsReceivableProgressStatement1/export',//格式一导出
        pageFormat2: reportApiRoot + '/accountsReceivableProgressStatement2/page',//格式二查询
        exportFormat2: reportApiRoot + '/accountsReceivableProgressStatement2/export',//格式二导出
    },
    //应收账款完成率
    accountsReceivableCompletionRate: {
        pageFormat1: reportApiRoot + '/accountsReceivableCompletionRate1/page',//格式一查询
        exportFormat1: reportApiRoot + '/accountsReceivableCompletionRate1/export',//格式一导出
        pageFormat2: reportApiRoot + '/accountsReceivableCompletionRate2/page',//格式二查询
        exportFormat2: reportApiRoot + '/accountsReceivableCompletionRate2/export',//格式二导出
    },
    //当月补单统计
    monthlySupplementStatistics: {
        page: reportApiRoot + '/monthlySupplementStatistics/page',
        export: reportApiRoot + '/monthlySupplementStatistics/export',
    },
    //客户毛利率统计
    customerGrossProfitRateReport: {
        page: reportApiRoot + '/customerGrossProfitRateReport/page',
        export: reportApiRoot + '/customerGrossProfitRateReport/export',
    },
    //亏损线路客户统计
    lossLineCustomerStatistics: {
        pageRegion: reportApiRoot + '/lossLineCustomerStatisticsRegion/page',//(查询地区)
        exportRegion: reportApiRoot + '/lossLineCustomerStatisticsRegion/export',//(导出地区)
        pageMonth: reportApiRoot + '/lossLineCustomerStatisticsMonth/page',//(查询月份)
        exportMonth: reportApiRoot + '/lossLineCustomerStatisticsMonth/export',//(导出月份)
    },
    //发车汇总
    departSummaryExport: {
        page: reportApiRoot + '/departSummaryExport/page',
        export: reportApiRoot + '/departSummaryExport/export',
    },
    //应收应付明细
    receivePaidDetail: {
        page: reportApiRoot + '/receivePaidDetail/page',
        export: reportApiRoot + '/receivePaidDetail/export',
    },
    //应收应付明细COPY
    receivePaidDetailCopy: {
        page: reportApiRoot + '/receivePaidDetailCopy/page',
        export: reportApiRoot + '/receivePaidDetailCopy/export',
    },
    //应收确认
    receiveConfirmExport: {
        export: reportApiRoot + '/receiveConfirmExport/export',
    },
    //应收账单详情
    receiveBillDetail: {
        export: reportApiRoot + '/receiveBillDetail/export',
    },
    //客户收入成本报表
    customerIncome: {
        page: reportApiRoot + '/customerIncome/page',
        export: reportApiRoot + '/customerIncome/export',
    },
    //车辆收入成本报表
    vehicleIncome: {
        page: reportApiRoot + '/vehicleIncome/page',
        export: reportApiRoot + '/vehicleIncome/export',
    },
    //线路收入成本报表
    lineIncome: {
        page: reportApiRoot + '/lineIncome/page',
        export: reportApiRoot + '/lineIncome/export'
    },
    //客户罚款报表
    customerFine: {
        page: reportApiRoot + '/customerFine/page',
        export: reportApiRoot + '/customerFine/export',
        add: apiRoot + '/customerFines/add'
    },
    //准点率报表
    arrivalRate: {
        page: reportApiRoot + '/arrivalRate/page',
        export: reportApiRoot + '/arrivalRate/export',
    },
    //应收监控报表
    receiveMonitor: {
        page: reportApiRoot + '/receiveMonitor/page',
        export: reportApiRoot + '/receiveMonitor/export',
    },
    //应收监控详情
    receiveMonitorDetail: {
        page: reportApiRoot + '/receiveMonitorDetail/page',
        export: reportApiRoot + '/receiveMonitorDetail/export',
    },
    //应付监控报表
    paymentMonitoring: {
        page: reportApiRoot + '/paymentMonitoringExport/page',
        export: reportApiRoot + '/paymentMonitoringExport/export',
    },
    //应付明细报表
    payableConfirmExport: {
        page: reportApiRoot + '/payableConfirmExport/page',
        export: reportApiRoot + '/payableConfirmExport/export',
    },
    //ETC外请车开票
    etcInvoice: {
        page: apiRoot + '/etcInvoice/page',
        vehicle: apiRoot + '/etcInvoice/vehicle',
        start: apiRoot + '/etcInvoice/start',
        end: apiRoot + '/etcInvoice/end',
    },
    //区域利润扣除
    areaProfitDeduct: {
        page: apiRoot + '/areaProfitDeduct/page',
    },
    //百世单边线路证件报表
    certificateDetails: {
        page: reportApiRoot + '/certificateDetails/page',
        export: reportApiRoot + '/certificateDetails/export',
    },
    //烟草车辆
    tobaccoVehicle: {
        page: apiRoot + '/tobaccoVehicle/page',
        add: apiRoot + '/tobaccoVehicle/add',
        delete: apiRoot + '/tobaccoVehicle/delete',
    },
    //应收应付汇总报表
    receivePaidSummary: {
        page: reportApiRoot + '/receivePaidSummary/page',
        export: reportApiRoot + '/receivePaidSummary/export',
    },
    //毛利率区间分布
    grossMargin: {
        page: reportApiRoot + '/grossMargin/page',
        export: reportApiRoot + '/grossMargin/export',
    },
    //回单责任人报表
    receiptLiablePerson: {
        page: reportApiRoot + '/receiptLiablePerson/page',
        export: reportApiRoot + '/receiptLiablePerson/export',
    },
    //GPS使用统计报表
    gpsUsageStatistics: {
        page: reportApiRoot + '/gpsUsageStatistics/page',
        export: reportApiRoot + '/gpsUsageStatistics/export',
    },
    //油卡使用统计报表
    oilCardUsageStatistics: {
        page: reportApiRoot + '/oilCardUsageStatistics/page',
        export: reportApiRoot + '/oilCardUsageStatistics/export',
    },
    //补单明细
    supplementWaybill: {
        page: reportApiRoot + '/supplementWaybill/page',
        export: reportApiRoot + '/supplementWaybill/export',
    },
    //补单明细
    paymentQueryReport: {
        page: reportApiRoot + '/paymentQueryReport/page',
        export: reportApiRoot + '/paymentQueryReport/export',
    },
    vehicleExport: {
        page: reportApiRoot + '/vehicleExport/page',
        export: reportApiRoot + '/vehicleExport/export',
    },
    financeVehicle: {
        page: reportApiRoot + '/financeVehicle/page',
        export: reportApiRoot + '/financeVehicle/export',
    },
    receiveNoSettlement: {
        page: reportApiRoot + '/receiveNoSettlement/page',
        export: reportApiRoot + '/receiveNoSettlement/export',
    },
    //高峰期包天车辆
    allDayVehicle: {
        page: apiRoot + '/allDayVehicle/page',
        add: apiRoot + '/allDayVehicle/add',
        modify: apiRoot + '/allDayVehicle/modify',
        delete: apiRoot + '/allDayVehicle/delete',
        queryById: apiRoot + '/allDayVehicle/queryById',
        queryByVehicleCode: apiRoot + '/allDayVehicle/queryByVehicleCode',//派车单调用查询包天车辆信息
        totalAmount: apiRoot + '/allDayVehicle/totalAmount',//派车单调用查询包天车辆信息
        settlementTime: apiRoot + '/allDayVehicle/settlementTime',//派车单调用查询包天车辆信息
    },
    supplierBillOutInvite: {
        page: apiRoot + '/supplierBillOutInvite/page',
        add: apiRoot + '/supplierBillOutInvite/add',
        addAll: apiRoot + '/supplierBillOutInvite/addAll',
        delete: apiRoot + '/supplierBillOutInvite/delete',
        makeOutAnInvoice: apiRoot + '/supplierBillOutInvite/makeOutAnInvoice',
        getSupplierBillOutInviteByCode: reportApiRoot + '/supplierBillOutInviteDetail/page',
        exportDetail: reportApiRoot + '/supplierBillOutInviteDetail/export',//明细导出
        export: reportApiRoot + '/supplierBillOutInvite/export',//账单
    },
    backlog: {
        page: apiRoot + '/backlog/page',
        modify: apiRoot + '/backlog/modify',
        beingProcessed: apiRoot + '/backlog/beingProcessed',
        processed: apiRoot + '/backlog/processed',
        delete: apiRoot + '/backlog/delete',
        queryById: apiRoot + '/backlog/queryById',
        export: reportApiRoot + '/backlogExport/export'
    },
    //运单导出查询
    waybillExport: {
        page: reportApiRoot + '/waybillExport/page',
        export: reportApiRoot + '/waybillExport/export',
    },
    //合同公司
    contractCompany: {
        page: apiRoot + '/contractCompany/page',
        add: apiRoot + '/contractCompany/add'
    },
    //合同公司
    companyMoulage: {
        getBySignerId: apiRoot + '/companyMoulage/getBySignerId',
        add: apiRoot + '/companyMoulage/add'
    },
    //公司印章
    companySeal: {
        page: apiRoot + '/companySeal/page',
        add: apiRoot + '/companySeal/add'
    },
    //设备签收导出查询
    equipmentSignExport: {
        page: reportApiRoot + '/equipmentSignExport/page',
        export: reportApiRoot + '/equipmentSignExport/export',
    },
    //派车明细报表
    dispatchDetailReport: {
        page: reportApiRoot + '/dispatchDetailReport/page',
        export: reportApiRoot + '/dispatchDetailReport/export'
    },
    //待发车辆导出
    waitDepartExport: {
        export: reportApiRoot + '/waitDepartExport/export'
    },
    //运单跟踪导出
    waybillTrackExport: {
        driverReportExport: reportApiRoot + '/driverReportException/export',
        followingExport: reportApiRoot + '/waybillFollowing/export',
        export: reportApiRoot + '/waybillTrackExport/export'
    },
    //车辆统计报表
    vehicleCount: {
        page: reportApiRoot + '/vehicleCount/page',
        export: reportApiRoot + '/vehicleCount/export'
    },
    //油卡未使用导出
    oilEmploy: {
        page: reportApiRoot + '/oilEmploy/page',
        export: reportApiRoot + '/oilEmploy/export'
    },
    //油路费占比报表
    oilEtcRatio: {
        page: reportApiRoot + '/oilEtcRatio/page',
        export: reportApiRoot + '/oilEtcRatio/export'
    },
    //油卡比例统计
    oilRatioCount: {
        page: reportApiRoot + '/oilRatioCount/page',
        export: reportApiRoot + '/oilRatioCount/export'
    },
    //客户利润报表
    customerProfitChart: {
        pageRegion: reportApiRoot + '/customerProfitChartRegion/page',
        pageMonth: reportApiRoot + '/customerProfitChartMonth/page',
        exportRegion: reportApiRoot + '/customerProfitChartRegion/export',
        exportMonth: reportApiRoot + '/customerProfitChartMonth/export',
    },
    //合作车扣款明细导出
    outsourceDeductionExport: {
        page: reportApiRoot + '/outsourceDeductionExport/page',
        export: reportApiRoot + '/outsourceDeductionExport/export'
    },
    //油卡比例导出
    oilRatio: {
        page: reportApiRoot + '/oilRatio/page',
        export: reportApiRoot + '/oilRatio/export'
    },
    //当月利润统计
    monthlyProfitStatistics: {
        page: reportApiRoot + '/monthlyProfitStatistics/page',
        export: reportApiRoot + '/monthlyProfitStatistics/export',
    },
    //应付结算价格异常报表
    payableSettlementUnusual: {
        page: reportApiRoot + '/payableSettlementUnusual/page',
        export: reportApiRoot + '/payableSettlementUnusual/export'
    },
    //应收结算价格异常报表
    receiveSettlementUnusual: {
        page: reportApiRoot + "/receiveSettlementUnusual/page",
        export: reportApiRoot + "/receiveSettlementUnusual/export"
    },
    //应付审批自动审核占比
    payableApprovalAppt: {
        page: reportApiRoot + '/payableApprovalAppt/page',
        export: reportApiRoot + '/payableApprovalAppt/export'
    },
    payableApprovalMppt: {
        page: reportApiRoot + '/payableApprovalMppt/page',
        export: reportApiRoot + '/payableApprovalMppt/export'
    },
    //合作车应付报表
    outsourceVehiclePayableConfirm: {
        page: reportApiRoot + '/outsourceVehiclePayableConfirm/page',
        export: reportApiRoot + '/outsourceVehiclePayableConfirm/export',
    },
    //百世运单导出
    bestWaybill: {
        page: reportApiRoot + '/bestWaybill/page',
        export: reportApiRoot + '/bestWaybill/export',
        queryByJobCode: apiRoot + '/bestWaybill/queryByJobCode'
    },
    // 跨越订单
    kyOrder: {
        page: apiRoot + '/kyOrder/page',
        driverPrice: apiRoot + '/kyOrder/driverPrice',
        cancelDriverPrice: apiRoot + '/kyOrder/cancelDriverPrice',
        export: reportApiRoot + '/kyOrder/export',
        queryByOrderSn: apiRoot + '/kyOrder/queryByOrderSn',
        createOrder: apiRoot + '/kyOrder/createOrder',
        quotationDetail: apiRoot + '/kyOrderQuotation/queryByThirdSn'
    },
    //跨越城配
    kyOrderIntraCity: {
        page: apiRoot + '/kyOrderIntraCity/page',
        driverPrice: apiRoot + '/kyOrder/driverPrice',
        cancelDriverPrice: apiRoot + '/kyOrder/cancelDriverPrice',
        export: reportApiRoot + '/kyOrderIntraCity/export',
        queryByOrderSn: apiRoot + '/kyOrder/queryByOrderSn',
        createOrder: apiRoot + '/kyOrder/createOrder',
        quotationDetail: apiRoot + '/kyOrderQuotation/queryByThirdSn'
    },
    driverFenceException: {
        page: apiRoot + '/driverFenceException/page',
        export: reportApiRoot + '/driverFenceException/export',
        queryById: apiRoot + '/driverFenceException/queryById',
        handledFenceException: apiRoot + '/driverFenceException/handledFenceException',
        modifyDepartureTime: apiRoot + '/driverFenceException/modifyDepartureTime', //发车修改发车时间
        modifyArrivalTime: apiRoot + '/driverFenceException/modifyArrivalTime', //到达修改到车时间
        confirmArriveStation: apiRoot + '/driverFenceException/confirmArriveStation', // 经停站点--添加/编辑到车时间
        confirmDepartureStation: apiRoot + '/driverFenceException/confirmDepartureStation' //经停站点--添加发车时间
    },
    driverFenceExceptionRecord: {
        page: apiRoot + '/driverFenceExceptionRecord/page',

    },
    receiptConfirm: {
        page: apiRoot + '/receiptConfirm/page',
        dispatchPage: apiRoot + '/receiptConfirm/dispatchPage',
        receiptConfirmPage: apiRoot + '/receiptConfirm/receiptConfirmPage',
        getReceiptListByWaybillCode: apiRoot + '/receiptConfirm/getReceiptListByWaybillCode',
        modifyReceipt: apiRoot + '/receiptConfirm/modifyReceipt',
        export: reportApiRoot + '/receiptConfirm/export'
    },
    lossLineStatistics: {
        page: reportApiRoot + '/lossLineStatistics/page',
        export: reportApiRoot + '/lossLineStatistics/export',
    },
    //应发未发车辆
    noDepartDispatch: {
        page: reportApiRoot + '/noDepartDispatch/page',
        export: reportApiRoot + '/noDepartDispatch/export',
    },
    //应到未到车辆
    noArrivalWaybill: {
        page: reportApiRoot + '/noArrivalWaybill/page',
        export: reportApiRoot + '/noArrivalWaybill/export',
    },
    //零散业务审批
    scatteredBusinessAudit: {
        page: apiRoot + '/scatteredBusinessAudit/page',
        modify: apiRoot + '/scatteredBusinessAudit/reportScatteredBusinessAudit',
        audit: apiRoot + '/scatteredBusinessAudit/modify',
        export: reportApiRoot + '/scatteredBusinessAudit/export',
    },
    //我的业务
    myBusiness: {
        page: apiRoot + '/myBusiness/page',
        export: reportApiRoot + '/myBusiness/export',
    },
    //G7油卡显示接口
    g7OilType: {
        page: apiRoot + '/g7OilType/page',
        cardQuerypPage: apiRoot + '/g7OilType/cardQuerypPage',
    },
    //油卡平台配置参数
    cardCompanyConfig: {
        page: apiRoot + '/cardCompanyConfig/page',//分页查询
        add: apiRoot + '/cardCompanyConfig/add',//新增配置参数
        modify: apiRoot + '/cardCompanyConfig/modify',//修改配置参数
        delete: apiRoot + '/cardCompanyConfig/delete',//删除配置参数
        queryById: apiRoot + '/cardCompanyConfig/queryById' //根据ID回显配置参数信息
    },
    //业务员提成
    salesmanCommission: {
        page: reportApiRoot + '/salesmanCommission/page',//分页查询
        export: reportApiRoot + '/salesmanCommission/export'//导出
    },
    //零散业务
    scatteredBusiness: {
        page: reportApiRoot + '/scatteredBusiness/page',//分页查询
        export: reportApiRoot + '/scatteredBusiness/export',//导出
        getExcel: apiRoot + '/scatteredBusinessAudit/getExcel',//零散业务模板下载
        upload: apiRoot + '/scatteredBusinessAudit/upload',//导入数据接口
        queryBywaybillCode: apiRoot + '/scatteredBusinessAudit/queryBywaybillCode',//根据waybillCode查询
        modifyBonus: apiRoot + '/scatteredBusinessAudit/modifyBonus',//更新奖金金额
    },
    //客户订单丢失
    customerOrderLack: {
        export: reportApiRoot + '/customerOrderLack/export',//导出
        page: apiRoot + '/customerOrderLack/page',//分页查询
        modify: apiRoot + '/customerOrderLack/modify',//修改
    },
    freeCarrierDriver: {
        page: apiRoot + '/freeCarrierDriver/page',//分页查询
        G7CarFreeCarrierPage: apiRoot + '/freeCarrierDriver/G7CarFreeCarrierPage',
        delete: apiRoot + '/freeCarrierDriver/delete',
        modify: apiRoot + '/freeCarrierDriver/modify',//修改
        getDeTailById: apiRoot + '/freeCarrierDriver/getDeTailById'
    },
    freeCarrierVehicle: {
        page: apiRoot + '/freeCarrierVehicle/page',//分页查询
        G7CarFreeCarrierPage: apiRoot + '/freeCarrierVehicle/G7CarFreeCarrierPage',
        delete: apiRoot + '/freeCarrierVehicle/delete'
    },
    freeCarrierPayee: {
        page: apiRoot + '/freeCarrierPayee/page',//分页查询
        G7CarFreeCarrierPage: apiRoot + '/freeCarrierPayee/G7CarFreeCarrierPage',
        delete: apiRoot + '/freeCarrierPayee/delete'
    },
    freeCarrierWaybill: {
        page: apiRoot + '/freeCarrierWaybill/page',//分页查询
        G7CarFreeCarrierPage: apiRoot + '/freeCarrierWaybill/G7CarFreeCarrierPage',
        delete: apiRoot + '/freeCarrierWaybill/delete',
        updateDriverCard: apiRoot + '/freeCarrierWaybill/updateDriverCard',
        modifyStartPlace: apiRoot + '/freeCarrierWaybill/modifyStartPlace',
        modifyToPlace: apiRoot + '/freeCarrierWaybill/modifyToPlace',
        exportExcel: reportApiRoot + '/freeCarrierWaybill/export',
        addRecordFlag: apiRoot + '/freeCarrierWaybill/addRecordFlag',
        waybillCodePush: apiRoot + '/freeCarrierWaybill/waybillCodePush',
    },
    freeCarrierPayment: {
        page: apiRoot + '/freeCarrierPayment/page',//分页查询
        pushFee: apiRoot + '/freeCarrierPayment/pushFee',//推送费用
        G7CarFreeCarrierPage: apiRoot + '/freeCarrierPayment/G7CarFreeCarrierPage',
    },
    freeCarrierLog: {
        page: apiRoot + '/freeCarrierLog/page',//分页查询
    },
    // 订单
    order: {
        reportDemand: apiRoot + '/order/reportDemand', // 需求上报
        temporaryAdd: apiRoot + '/order/temporaryAdd',//临时上报需求
        add: apiRoot + '/order/add', // 增加订单
        modify: apiRoot + '/order/modify', // 修改订单
        cancel: apiRoot + '/order/cancel', // 取消订单
        release: apiRoot + '/order/release', // 发布订单
        page: apiRoot + '/order/page',//分页查询
        orderSendVehicle: apiRoot + '/order/orderSendVehicle',// 订单页面的派车
        export: reportApiRoot + '/order/export',//导出
    },
    // 排班
    orderSchedule: {
        page: apiRoot + '/orderSchedule/page',//分页查询
        addOrderSchedule: apiRoot + '/orderSchedule/addOrderSchedule', // 增加排班
        modifyRuleContent: apiRoot + '/orderSchedule/modifyRuleContent', // 修改排班
        delete: apiRoot + '/orderSchedule/delete', // 删除排班
        export: reportApiRoot + '/orderSchedule/export',//导出
        getExcel: apiRoot + '/orderSchedule/getExcel',//模板下载
        upload: apiRoot + '/orderSchedule/upload',//导入
        hasSameOrderSchedule: apiRoot + '/orderSchedule/hasSameOrderSchedule',//查询是否存在排班
        getLineWithCreateDispatchBySchedule: apiRoot + '/orderSchedule/getLineWithCreateDispatchBySchedule' //查询由排班生成的派车单线路
    },
    // 班次
    orderScheduleShifts: {
        page: apiRoot + '/orderScheduleShifts/page',//分页查询
        add: apiRoot + '/orderScheduleShifts/add',//添加班次
        modify: apiRoot + '/orderScheduleShifts/modify',//修改班次
        delete: apiRoot + '/orderScheduleShifts/delete',//删除班次
        getMaxShifts: apiRoot + '/orderScheduleShifts/getMaxShifts',//查询最大值
        getByOrderScheduleId: apiRoot + '/orderScheduleShifts/getByOrderScheduleId',//根据排班id查询
    },
    orderBid: {
        page: apiRoot + '/orderBid/page',//分页查询
        dispatchOrderBid: apiRoot + '/orderBid/dispatchOrderBid', // 订单派车
        confirmOrderBid: apiRoot + '/orderBid/confirmOrderBid', // 订单确认
        export: reportApiRoot + '/orderBid/export',//导出
        dispatchOrder: apiRoot + '/orderBid/dispatchOrder', // 指派车辆
        modifyOrderBidFailure: apiRoot + '/orderBid/modifyOrderBidFailure', // 竞价失败
        cancelOrderBid: apiRoot + '/orderBid/cancelOrderBid', //取消竞价
    },
    // 司机报价
    orderBidRecord: {
        page: apiRoot + '/orderBidRecord/page',//分页查询
        confirmOrderBidRecord: apiRoot + '/orderBidRecord/confirmOrderBidRecord',// 确认中标
        notCancelPage: apiRoot + '/orderBidRecord/notCancelPage',// 确认中标
        export: reportApiRoot + '/orderBidRecord/export', //导出
        confirmPage: apiRoot + '/orderBidRecord/confirmPage', //查询确认中标的记录
        modifyRefundAmountPrice: apiRoot + '/orderBidRecord/modifyRefundAmountPrice',//修改定货费退款金额
    },
    // 司机取消竞价
    orderBidCancel: {
        page: apiRoot + '/orderBidCancel/page',//分页查询
        approval: apiRoot + '/orderBidCancel/approval',//受理
        export: reportApiRoot + '/orderBidCancel/export', //导出
    },
    oilFinancialAccounting: {
        page: reportApiRoot + '/oilFinancialAccounting/page',
        export: reportApiRoot + '/oilFinancialAccounting/export'
    },
    etcFinancialAccounting: {
        page: reportApiRoot + '/etcFinancialAccounting/page',
        export: reportApiRoot + '/etcFinancialAccounting/export'
    },
    insuranceAndDepreciationFinancialAccounting: {
        page: reportApiRoot + '/insuranceAndDepreciationFinancialAccounting/page',
        export: reportApiRoot + '/insuranceAndDepreciationFinancialAccounting/export'
    },
    //保证金
    deposit: {
        export: reportApiRoot + '/deposit/export',//导出
        page: apiRoot + '/deposit/page',//分页查询
        add: apiRoot + '/deposit/add',//新增
        queryByCode: apiRoot + '/deposit/queryByCode', //通过编号查找
        upload: apiRoot + '/deposit/uploadAttachment', //上传附件
        modify: apiRoot + '/deposit/modify',//修改
        depositTransfer: apiRoot + '/deposit/depositTransfer',//转
        depositReturn: apiRoot + '/deposit/depositReturn',//退
        depositBad: apiRoot + '/deposit/depositBad',//坏账
        voucherMaintain: apiRoot + '/deposit/voucherMaintain'//凭证维护
    },
    //履约金
    performance: {
        export: reportApiRoot + '/performance/export',//导出
        page: apiRoot + '/performance/page',//分页查询
        add: apiRoot + '/performance/add',//新增
        queryByCode: apiRoot + '/performance/queryByCode', //通过编号查找
        upload: apiRoot + '/performance/uploadAttachment', //上传附件
        modify: apiRoot + '/performance/modify',//修改
        performanceTransfer: apiRoot + '/performance/performanceTransfer',//转
        performanceReturn: apiRoot + '/performance/performanceReturn',//退
        performanceBad: apiRoot + '/performance/performanceBad',//坏账
        voucherMaintain: apiRoot + '/performance/voucherMaintain'//凭证维护
    },
    //保证金审核
    depositAudit: {
        page: apiRoot + '/depositAudit/page',//分页查询
        queryById: apiRoot + '/depositAudit/queryById',//根据ID查询
        audit: apiRoot + '/depositAudit/audit'//审核
    },
    //履约金审核
    performanceAudit: {
        page: apiRoot + '/performanceAudit/page',//分页查询
        queryById: apiRoot + '/performanceAudit/queryById',//根据ID查询
        audit: apiRoot + '/performanceAudit/audit'//审核
    },
    // 京东订单
    jdOrder: {
        commonSelect: apiRoot + '/jdOrderVehicleType/commonSelect',
        page: apiRoot + '/jdOrder/page',
        cancel: apiRoot + '/jdOrder/cancelOrder',
        export: reportApiRoot + '/jdOrder/export',
        queryByOrderCode: apiRoot + '/jdOrder/getOrderDetailInfoByCode'
    },
    // 德邦订单
    dpOrder: {
        page: apiRoot + '/dpOrder/page',
        driverPrice: apiRoot + '/dpOrder/driverPrice',
        cancelDriverPrice: apiRoot + '/dpOrder/cancelDriverPrice',
        export: reportApiRoot + '/dpOrder/export',
        queryByDpOrderCode: apiRoot + '/dpOrder/queryByDpOrderCode',
        queryTruckByDpOrderCode: apiRoot + '/dpOrderTruckDetail/getOrderTruckDetailByDpOrderCode',
        quotationDetail: apiRoot + '/dpOrderQuotation/queryByDetailId'
    },
    //车辆异常
    vehicleException: {
        page: apiRoot + '/vehicleException/page',//分页查询
        success: apiRoot + '/vehicleException/acceptSuccess',//分页查询
        fail: apiRoot + '/vehicleException/acceptFail',//分页查询
        export: reportApiRoot + '/vehicleException/export',//导出
    },
    //利润报表
    profitChart: {
        getData: reportApiRoot + '/profitChart/getData',//可视化和table
    },
    //营运看板
    operationBoard: {
        queryRevenue: apiRoot + '/operationBoard/queryRevenue',
        queryCustomerDeparture: apiRoot + '/operationBoard/queryCustomerDeparture',
        queryOrgDeparture: apiRoot + '/operationBoard/queryOrgDeparture',
        getPayData: reportApiRoot + '/operationBoard/getPayData',

        queryShortageVehicleNum: apiRoot + '/operationBoard/queryShortageVehicleNum',
        queryWaitDepartureNum: apiRoot + '/operationBoard/queryWaitDepartureNum',
        queryDepartureNum: apiRoot + '/operationBoard/queryDepartureNum',
        queryRevenueAmount: apiRoot + '/operationBoard/queryRevenueAmount',
    },
    //收入主体公共选择器
    incomeSubject: {
        commonSelect: apiRoot + '/incomeSubject/commonSelect',//公共选择器
    },
    //挂车to运单分摊明细报表
    trailerApportionToWaybill: {
        page: reportApiRoot + '/trailerApportionToWaybill/page',//挂车分摊to运单报表统计
        export: reportApiRoot + '/trailerApportionToWaybill/export',//挂车分摊to运单报表导出
    },
    //挂车to区域分摊明细报表
    trailerApportionToCount: {
        page: reportApiRoot + '/trailerApportionToCount/page',//挂车分摊to运单报表统计
        export: reportApiRoot + '/trailerApportionToCount/export',//挂车分摊to运单报表导出
    },
    //充值申请
    vehicleRechargeApply: {
        page: apiRoot + '/vehicleRechargeApply/page',
        add: apiRoot + '/vehicleRechargeApply/add',
        modify: apiRoot + '/vehicleRechargeApply/modify',
        queryById: apiRoot + '/vehicleRechargeApply/queryById',
    },
    //车价异常报表
    vehiclePriceException: {
        page: reportApiRoot + '/vehiclePriceException/page',
        export: reportApiRoot + '/vehiclePriceException/export',
    }
};
export default Api
