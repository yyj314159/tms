import BANK_DATA from 'src/components/common/data/bankData.js'
import OIL_RATIO from 'src/components/common/data/oilRatio.js'

const data = {
    VEHICLE_TYPE: [
        {
            code: 'VAN',
            name: '单车'
        }, {
            code: 'TRACTOR',
            name: '牵引车'
        }, {
            code: 'TRAILER',
            name: '半挂车'
        }
    ],
    DRIVER_TYPE: [
        {
            code: 'SELF_SUPPORT',
            name: '自营'
        }, {
            code: 'NO_SELF_SUPPORT',
            name: '非自营'
        }
    ],
    DRIVER_STATUS: [
        {
            code: false,
            name: '有效'
        }, {
            code: true,
            name: '无效'
        }
    ],
    LINE_TYPE: [{
        code: 'ONCE',
        name: '单边'
    }, {
        code: 'DOUBLE',
        name: '往返'
    }],
    LINE_BUSINESS_TYPE: [{
        code: 'FIXATION_BUSINESS_TYPE',
        name: '传统业务'
    }, {
        code: 'SCATTERED_BUSINESS_TYPE',
        name: '零散业务'
    }, {
        code: 'NEW_BUSINESS_TYPE',
        name: '新业务'
    }],
    RECEIPT_TYPE: [{
        code: 'ELECTRON_TYPE',
        name: '电子回单'
    }, {
        code: 'PAPER_TYPE',
        name: '纸质回单'
    }],
    LINE_OPERATION_TYPE: [
        {
            code: 'ON_WORK',
            name: '正班'
        }, {
            code: 'OVER_TIME',
            name: '加班'
        }
    ],
    LINE_EVALUATION_MODE: [
        {
            code: 'OPER_TIME',
            name: '运行时间'
        }, {
            code: 'RUN_TIME',
            name: '行驶时间'
        }, {
            code: 'ARRIVE_TIME',
            name: '达到时间'
        }, {
            code: 'EXECUTION_TIME',
            name: '执行时间'
        }
    ],
    LINE_PRICE_TYPE: [
        {
            code: 'NORMAL',
            name: '按趟'
        }, {
            code: 'WEIGHT',
            name: '计重'
        }, {
            code: 'VOLUME',
            name: '按方'
        }
    ],
    LINE_IS_EXIST: [
        {
            code: '0',
            name: '有'
        }, {
            code: '1',
            name: '无'
        }
    ],
    VEHICLE_OPERATION_MODE: [
        {
            code: 'SELF_SUPPORT',
            name: '自营'
        }, {
            code: 'OUTSOURCE',
            name: '合作'
        }, {
            code: 'OUT_INVITE',
            name: '外请'
        }
    ],
    VEHICLE_OPERATION_MODE_NO_OUT_INVITE: [
        {
            code: 'NO_OUT_INVITE',
            name: '非外请'
        },
        {
            code: 'SELF_SUPPORT',
            name: '自营'
        }, {
            code: 'OUTSOURCE',
            name: '合作'
        }
    ],
    SELF_OPERATION_MODE: [
        {
            code: 'SELF_SELF_SUPPORT',
            name: '常规自营'
        }, {
            code: 'SELF_OUTSOURCE',
            name: '合作自营'
        }
    ],
    VEHICLE_OUT_INVITE_OPERATION_MODE: [
        {
            code: 'SELF_SUPPORT',
            name: '自营'
        }/*, {
            code: 'OUTSOURCE',
            name: '合作'
        }*/
    ],
    VEHICLE_OUT_INVITE_OPERATION_SELF_MODE: [
        {
            code: 'SELF_SELF_SUPPORT',
            name: '普通自营'
        }, {
            code: 'SELF_OUTSOURCE',
            name: '合作自营'
        }
    ],
    VEHICLE_SPECIFICATION: [
        {
            code: '4.2',
            name: '4.2'
        }, {
            code: '6.8',
            name: '6.8'
        }, {
            code: '7.6',
            name: '7.6'
        }, {
            code: '9.6',
            name: '9.6'
        }, {
            code: '11',
            name: '11'
        }, {
            code: '12.5',
            name: '12.5'
        }, {
            code: '13.5',
            name: '13.5'
        }, {
            code: '15',
            name: '15'
        }, {
            code: '16.5',
            name: '16.5'
        }, {
            code: '17.5',
            name: '17.5'
        }, {
            code: '19',
            name: '19'
        }
    ],
    VEHICLE_OPERATION_ATTRIBUTE: [
        {
            code: 'COMMON_BUSINESS',
            name: '自有车辆'
        }, {
            code: 'JD_FINANCE',
            name: '京东金融'
        }, {
            code: 'BAISHI_CONSTRUCTION',
            name: '百世金融'
        }, {
            code: 'INTRA_CITY_SERVICE',
            name: '诚驹配送'
        }, {
            code: 'YTO_FINANCE',
            name: '圆通租赁'
        }, {
            code: 'YMDD_FINANCE',
            name: '壹米滴答金融'
        }, {
            code: 'YMDDZL_FINANCE',
            name: '壹米滴答租赁'
        }, {
            code: 'SXZL_FINANCE',
            name: '三笑租赁'
        }, {
            code: 'DGZL_FINANCE',
            name: '鼎格租赁'
        },{
            code: 'YOUSU_FINANCE',
            name: '优速共建'
        },{
            code: 'SHUNFENG_FINANCE',
            name: '顺丰共建'
        }],
    NEW_BUSINESS_CUSTOMER_TYPE: [
        {
            code: '1',
            name: '是'
        }, {
            code: '0',
            name: '否'
        }
    ],
    SUPPLIER_TYPE: [
        {
            code: 'CAR_TEAM',
            name: '车队'
        }, {
            code: 'DEPARTMENT_OF_INFORMATION',
            name: '信息部'
        }, {
            code: 'PLANTFORM_COMPANY',
            name: '平台公司'
        }
    ], SUPPLIER_NATURE: [
        {
            code: 'ENTERPRISE',
            name: '企业'
        }
    ],
    INFORMATION_DEPART_TYPE: [
        {
            code: '0',
            name: '个人'
        }, {
            code: '1',
            name: '公司'
        }
    ],
    IS_NEW_CUSTOMER: [
        {
            code: '1',
            name: '是'
        }, {
            code: '0',
            name: '否'
        }
    ],

    AUDIT_STATUS: [
        {
            code: 'UNAUDITED',
            name: '未审核'
        }, {
            code: 'PASS',
            name: '审核通过'
        }, {
            code: 'NO_PASS',
            name: '审核不通过'
        }
    ],
    SALESMAN_AUDIT_STATUS: [
        {
            code: 'PASS',
            name: '审核通过'
        }, {
            code: 'NO_PASS',
            name: '审核不通过'
        }
    ],
    //付款申请--审核状态
    PAYMENT_APPLY_AUDIT_STATUS: [
        {
            code: 'NOT_APPLY',
            name: '未申请'
        }, {
            code: 'CHECK_PENDING',
            name: '待审核'
        }, {
            code: 'PASS',
            name: '审核通过'
        }, {
            code: 'NO_PASS',
            name: '审核不通过'
        }
    ],
    DISPATCH_STATUS: [
        {
            code: 'UNASSIGNED',
            name: '待指派'
        }, {
            code: 'ASSIGNED',
            name: '已指派'
        }, {
            code: 'BY_STATION',
            name: '已靠站'
        }, {
            code: 'STARTED',
            name: '已发车'
        }, {
            code: 'IN',
            name: '已到达'
        }
    ],
    DISPATCH_CONFIRM_STATUS: [
        {
            code: 'UNASSIGNED',
            name: '待指派'
        }, {
            code: 'WAIT_CONFIRM',
            name: '待确认'
        }, {
            code: 'CONFIRM',
            name: '已确认'
        }, {
            code: 'DELETE',
            name: '已删除'
        }
    ],
    DISPATCH_PAY_TYPE: [
        {
            code: 'SUPPLIER',
            name: '供应商'
        }, {
            code: 'DRIVER',
            name: '司机'
        }
    ],
    RECONCILIATION_TYPE: [ //对账单 对应类型
        {
            code: 'SUPPLIER',
            name: '供应商'
        }, {
            code: 'VERSION',
            name: '车辆'
        }
    ],
    VEHICLE_COMPARTMENT_TYPE: [
        {
            code: 'MOTOR_VAN',
            name: '厢车'
        }, {
            code: 'GAOLAN_VAN',
            name: '高栏'
        }, {
            code: 'SLAB_VAN',
            name: '平板'
        }, {
            code: 'REFRIGERATOR_CAR',
            name: '冷藏'
        }, {
            code: 'ELSE_VAN',
            name: '其他'
        }
    ],
    VEHICLE_SOURCE: [
        {
            code: 'COMPANY',
            name: '自有'
        }, {
            code: 'DEPARTMENT_OF_INFORMATION',
            name: '信息部'
        }, {
            code: 'CAR_TEAM',
            name: '车队'
        }, {
            code: 'PERSONAL',
            name: '个人'
        }
    ],
    VEHICLE_PROCUREMEN_TYPE: [
        {
            code: 'IMPORTED',
            name: '进口'
        }, {
            code: 'MADE_IN_CHINA',
            name: '国产'
        }/*, {
            code: 'FINANCE_LEASE',
            name: '融资租赁'
        }*/
    ],
    VEHICLE_STATUS: [
        {
            code: 'FORBIDDEN',
            name: '禁用'
        }, {
            code: 'USED',
            name: '使用中'
        }, {
            code: 'NOT_USED',
            name: '未使用'
        }
    ],
    VEHICLE_OPERATION_STATUS: [
        {
            code: 'NOT_TRANSFER',
            name: '运营'
        }, {
            code: 'TRANSFERRED',
            name: '过户'
        }, {
            code: 'DISCARDED',
            name: '已报废'
        }
        , {
            code: 'SEALED',
            name: '已封存'
        }
    ],
    BLACKLIST_TYPE: [
        {
            code: 'supplierId',
            name: '供应商'
        }, {
            code: 'vehicleId',
            name: '车辆'
        }, {
            code: 'driverId',
            name: '司机'
        }
    ],
    IS_EXIST: [
        {
            code: '0',
            name: '否'
        }, {
            code: '1',
            name: '是'
        }
    ],
    IS_PROJECT_CUSTOMER: [
        {
            code: false,
            name: '否'
        }, {
            code: true,
            name: '是'
        }
    ],
    BLACKlIST_AUDIT_STATUS: [
        {
            code: 'UNAUDITED',
            name: '未审核'
        }, {
            code: 'PASS',
            name: '审核通过'
        }, {
            code: 'NO_PASS',
            name: '审核不通过'
        }
    ],
    LINE_INCOME_SUBJECT: [
        {
            code: '马鞍山则一物流有限公司',
            name: '马鞍山则一物流有限公司'
        }, {
            code: '淮安则一物流有限公司',
            name: '淮安则一物流有限公司'
        }, {
            code: '上海则一供应链管理有限公司',
            name: '上海则一供应链管理有限公司'
        }, {
            code: '北京则一供应链管理有限公司',
            name: '北京则一供应链管理有限公司'
        }, {
            code: '沈阳则一物流有限公司',
            name: '沈阳则一物流有限公司'
        }, {
            code: '武汉则一供应链管理有限公司',
            name: '武汉则一供应链管理有限公司'
        }, {
            code: '马鞍山广盛物流有限公司',
            name: '马鞍山广盛物流有限公司'
        }, {
            code: '徐州则一物流有限公司',
            name: '徐州则一物流有限公司'
        }, {
            code: '上海一荣物流有限公司',
            name: '上海一荣物流有限公司'
        }
    ],
    SINGLE_AND_DOUBLE_DRIVE: [
        {
            code: '6*2',
            name: '6*2'
        }, {
            code: '6*4',
            name: '6*4'
        }, {
            code: '4*2',
            name: '4*2'
        }
    ],
    LINE_INVOICE_TYPE: [
        {
            code: 'THE_RATIO',
            name: '按比例'
        }, {
            code: 'THE_AMOUNT',
            name: '按金额'
        }
    ],
    OIL_CARD_TYPE: [
        {
            code: 'CN_PC',
            name: '中石油'
        }, {
            code: 'SIN_OPEC',
            name: '中石化'
        }
    ],
    OIL_CARD_SUPPLIER: [
        {
            code: 'G7',
            name: 'G7'
        }, {
            code: 'YI_TONG_JIA',
            name: '益桶佳'
        }, {
            code: 'JIN_RUN_DANG_JIA',
            name: '金润二当家'
        }, {
            code: 'ZHONG_AN_ROAD',
            name: '中交兴路(柴油卡)'
        }, {
            code: 'TIAN_DI_HUI',
            name: '天地汇'
        }, {
            code: 'SHANG_HAI_CNPC',
            name: '上海石化'
        }
    ],
    ETC_TYPE: [
        {
            code: 'A_CARD',
            name: 'A卡'
        }, {
            code: 'B_CARD',
            name: 'B卡'
        }
    ],
    EQUIPMENT_STATUS: [
        {
            code: 'UNWORKED',
            name: '可下发'
        }, {
            code: 'IN_USE',
            name: '已下发'
        }, {
            code: 'INVALID',
            name: '作废'
        }
    ],
    ETC_SUPPILER: [
        {
            code: 'LUTONG_CARD',
            name: '齐鲁交通'
        }, {
            code: 'SHANDONG_HIGH_SPEED',
            name: '山东高速'
        }, {
            code: 'YUN_TONG_CARD',
            name: '云通卡'
        }, {
            code: 'BAI_SHI_ETC_CARD',
            name: '百世ETC'
        }, {
            code: 'YUE_TONG_CARD',
            name: '粤通卡'
        }
    ],
    ORGANIZATION: [
        {
            code: 'HEADQUARTERS',
            name: '总部'
        }, {
            code: 'AREA',
            name: '大区'
        }, {
            code: 'PARTITION',
            name: '分区'
        }
    ],
    GAS_STATION: [
        {
            code: 'WAN_JIN_YOU',
            name: '万金油'
        },
        {
            code: 'FA_YOU_WEBSITE',
            name: '找油网'
        },
        {
            code: 'YU_HENG',
            name: '裕恒'
        },
        {
            code: 'CHENG_HUA',
            name: '辰华'
        },
        {
            code: 'YI_ZHI_DAO',
            name: '易智道'
        },
        {
            code: 'ZHONG_YOU_YI_TONG',
            name: '中油易通'
        },
        {
            code: 'HAI_FU',
            name: '一海富'
        },
        {
            code: 'SI_RUN_MEI_DA',
            name: '斯润美达'
        },
        {
            code: 'NENG_LIAN',
            name: '九车能源'
        },
        {
            code: 'GANG_MAO',
            name: '广东港茂'
        },
        {
            code: 'SHEN_HAI_SHI_HUA',
            name: '深海石化'
        },
        {
            code: 'XIN_WEI',
            name: '信薇'
        },
        {
            code: 'ZHUO_YI',
            name: '卓一'
        }
    ],
    OIL_PRICE_TYPE: [
        {
            code: 'JIE_SUAN_PRICE',
            name: '结算油价'
        }, {
            code: 'HE_ZUO_PRICE',
            name: '合作车油价'
        }, {
            code: 'WAI_QING_PRICE',
            name: '外请车油价'
        }
    ],
    OIL_RECHAREGE_TYPE: [
        {
            code: 'APPLY',
            name: '已申请'
        }, {
            code: 'RECHARGE',
            name: '已充值'
        }, {
            code: 'FAILED',
            name: '审核不通过'
        }
    ],
    WAY_BILL_NATURE: [
        {
            code: 'false',
            name: '正班'
        }, {
            code: 'true',
            name: '临时'
        }
    ],
    WAY_BILL_STATUS: [
        {
            code: 'IN_TRANSIT',
            name: '运输中'
        }, {
            code: 'IN',
            name: '已到达'
        },
        {
            code: 'SIGNED',
            name: '已签收'
        }, {
            code: 'BEEN_ABANDONED',
            name: '已作废'
        }, {
            code: 'WAIT_DEPART',
            name: '待发车'
        }
    ],
    WAY_BILL_STATUS_NO_BEEN_ABANDONED: [
        {
            code: 'IN_TRANSIT',
            name: '运输中'
        }, {
            code: 'IN',
            name: '已到达'
        },
        {
            code: 'SIGNED',
            name: '已签收'
        }
    ],
    OIL_RECORD_TYPE: [
        {
            code: 'DRIVER_OUT',
            name: '分配'
        },
        {
            code: 'GRANT_OUT',
            name: '下发'
        },
        {
            code: 'RECHARGE',
            name: '充值'
        },
        {
            code: 'RECOVERY',
            name: '回收'
        },
        {
            code: 'CRASH_OUT',
            name: '作废'
        }, {
            code: 'UPDATE_BALANCR',
            name: '修改余额'
        }, {
            code: 'MODIFY',
            name: '修改操作',
        }, {
            code: 'BIND_VEHICLE',
            name: '油卡绑定车辆',
        }, {
            code: 'SEND_OUT',
            name: '油卡下发',
        }, {
            code: 'CANCEL_OIL_CARD',
            name: '油卡挂失',
        }, {
            code: 'WAYBILL_CODE_INVALID',
            name: '运单作废'
        }, {
            code: 'WAYBILL_CODE_DELETE',
            name: '运单删除'
        }, {
            code: 'CANCEL_OIL_CARD_USE',
            name: '油卡挂失后使用'
        }, {
            code: 'CLAIM',
            name: '油卡认领'
        }, {
            code: 'CANCEL_CLAIM',
            name: '取消油卡认领'
        }, {
            code: 'UN_PROHIBIT',
            name: '油卡启用'
        }, {
            code: 'PROHIBIT',
            name: '油卡禁用'
        }, {
            code: 'TRANSFER_USER',
            name: '移交'
        }, {
            code: 'SIGN_IN',
            name: '签收'
        }, {
            code: 'BING_SUPPLIER',
            name: '绑定供应商'
        }, {
            code: 'UN_BING_SUPPLIER',
            name: '解绑供应商'
        }, {
            code: 'PULL_OUT',
            name: '领取'
        }

    ],
    GPS_RECORD_TYPE: [
        {
            code: 'DRIVER_OUT',
            name: '新增'
        }, {
            code: 'GRANT_OUT',
            name: '下发'
        }, {
            code: 'RECOVERY',
            name: '回收'
        }, {
            code: 'DELETE',
            name: '删除'
        }, {
            code: 'MODIFY',
            name: '修改'
        }, {
            code: 'BIND_VEHICLE',
            name: 'Gps绑定车辆',
        }, {
            code: 'WAYBILL_CODE_INVALID',
            name: '运单作废',
        }, {
            code: 'WAYBILL_CODE_DELETE',
            name: '运单删除',
        }, {
            code: 'CLAIMED',
            name: '认领'
        }, {
            code: 'UN_CLAIM',
            name: '取消认领'
        }, {
            code: 'PROHIBIT',
            name: '禁用'
        }, {
            code: 'UN_PROHIBIT',
            name: '启用'
        }, {
            code: 'DISPATCH_BY_DRIVER',
            name: '派车单根据司机来改变相对应的gps持有人'
        }, {
            code: 'SIGN_GPS_BY_DISPATCH',
            name: '签收修改Gps状态'
        }, {
            code: 'MODIFY_GPSORGCODE_BY_VEHICLE',
            name: '自营外包车辆修改分区对应的Gps所属组织跟着改变'
        }, {
            code: 'MODIFY_REMARK',
            name: '修改备注'
        }, {
            code: 'CANCEL_OILCARD',
            name: 'Gps挂失'
        }
    ],
    ETC_RECHARGE_TYPE: [
        {
            code: 'UN_RECHARGE',
            name: '未充值'
        }, {
            code: 'RECHARGE',
            name: '已充值'
        }, {
            code: 'CANCELED',
            name: '已撤销'
        }, {
            code: 'INVALIDED',
            name: '已作废'
        },
    ],
    OIL_RECHARGE_TYPE: [
        {
            code: 'UN_RECHARGE',
            name: '未充值'
        }, {
            code: 'RECHARGE',
            name: '已充值'
        }, {
            code: 'CANCELED',
            name: '已撤销'
        }, {
            code: 'INVALIDED',
            name: '已作废'
        }, {
            code: 'RETURNED',
            name: '已圈回'
        },
    ],
    OIL_CARD_COMPANY: [
        {
            code: 'MA_AN_SHAN',
            name: '马鞍山'
        },
        {
            code: 'HONG_YUN_DA',
            name: '宏运达'
        },
        {
            code: 'GUANG_SHENG',
            name: '广盛'
        }, {
            code: 'WAN_TONG',
            name: '皖通'
        },
        {
            code: 'YUN_CHANG',
            name: '运畅'
        }, {
            code: 'CHENG_ZE',
            name: '诚则'
        }, {
            code: 'SU_GUANG',
            name: '速广'
        }, {
            code: 'YING_YI',
            name: '盈易'
        }
    ],
    OIL_CARD_COMPANY_ONLY_MA_AN_SHAN: [
        {
            code: 'MA_AN_SHAN',
            name: '马鞍山'
        }
    ],
    OIL_CARD_GRANT_TYPE: [
        {
            code: 'ORGCODE',
            name: '组织'
        }, {
            code: 'USER',
            name: '用户'
        }
    ],
    OIL_RECHARGE_STATUS: [
        {
            code: 'PRE_CHARGE',
            name: '预充值'
        }, {
            code: 'DISPATCH_CHARGE',
            name: '发车充值'
        }
    ],
    //挂车尺寸
    TRAILER_SIZE: [
        {
            code: '53',
            name: '53尺(16.35-16.5米)'
        }, {
            code: '48',
            name: '48尺(14.8-15米)'
        }, {
            code: '45',
            name: '45尺(13.85-14米)'
        }, {
            code: '40',
            name: '40尺(12.4-12.6米)'
        }, {
            code: '35',
            name: '35尺(10.5-11米)'
        }, {
            code: '30',
            name: '30尺(8.6米)'
        }
    ],
    //挂车轴数
    TRAILER_AXLE: [
        {
            code: '1*4',
            name: '1*4'
        }, {
            code: '2*8',
            name: '2*8'
        }, {
            code: '3*12',
            name: '3*12'
        }, {
            code: '3*6',
            name: '3*6'
        }
    ],
    //单双胎
    NUMBER_OF_TIRES: [
        {
            code: 'ONE',
            name: '单胎'
        }, {
            code: 'TWO',
            name: '双胎'
        }
    ],
    //挂车车厢材质
    TRAILER_TEXTURE: [
        {
            code: 'ALUMINUM',
            name: '铝箱'
        }, {
            code: 'IRON',
            name: '铁箱'
        }, {
            code: 'COMPOUND',
            name: '复合板'
        }
    ],
    //车头-车辆类型
    HEAD_VEHICLE_TYPE: [
        {
            code: 'SEMITRAILER_LOW_COMPOUND',
            name: '重型低平板半挂车'
        },
        {
            code: 'HEAD_HEAVY_VAN',
            name: '重型厢式货车'
        }, {
            code: 'HEAD_HEAVY_MOTOR_TRACTOR',
            name: '重型半挂牵引车'
        }, {
            code: 'HEAD_HEAVY_BOX_TRUCK',
            name: '重型仓栅式货车'
        }, {
            code: 'LIGHT_BOX_TRUCK',
            name: '轻型箱式货车'
        }, {
            code: 'HEAVY_SPECIAL_CONSTRUCTION',
            name: '重型特殊结构货车'
        }
    ],
    //车挂-车辆类型
    SEMITRAILER_VEHICLE_TYPE: [
        {
            code: 'SEMITRAILER_LOW_COMPOUND',
            name: '重型低平板半挂车'
        },
        {
            code: 'SEMITRAILER_ALUMINUM',
            name: '重型集装箱半挂车'
        }, {
            code: 'SEMITRAILER_HEAVY_BOX_TRUCK',
            name: '重型厢式半挂车'
        }, {
            code: 'SEMITRAILER_COMPOUND',
            name: '重型平板半挂车'
        }, {
            code: 'HEAVY_MEDIUM_AXLE_COMMON',
            name: '重型中置轴普通挂车'
        }
    ],
    //箱车-车辆类型
    VAN_VEHICLE_TYPE: [
        {
            code: 'VAN',
            name: '箱车'
        }
    ],
    //车头 - 车辆品牌
    HEAD_VEHICLE_BRAND: [
        {
            code: 'FT',
            name: '福田'
        },
        {
            code: 'QL',
            name: '庆铃'
        }, {
            code: 'JL',
            name: '江铃'
        }, {
            code: 'WSL',
            name: '五十铃'
        }, {
            code: 'JF',
            name: '解放'
        }, {
            code: 'LQ',
            name: '柳汽'
        }, {
            code: 'DF',
            name: '东风'
        }, {
            code: 'SQ',
            name: '陕汽'
        }, {
            code: 'ZQ',
            name: '重汽'
        }, {
            code: 'SD-STE',
            name: '斯达-斯太尔'
        }, {
            code: 'RY',
            name: '日野'
        }, {
            code: 'WOW',
            name: '沃尔沃'
        }, {
            code: 'SKNY',
            name: '斯堪尼亚'
        }, {
            code: 'BC',
            name: '奔驰'
        }, {
            code: 'SDK',
            name: '汕德卡'
        }, {
            code: 'OM',
            name: '欧曼'
        }, {
            code: 'CL',
            name: '乘龙'
        }, {
            code: 'AKTS',
            name: '阿克托斯'
        }, {
            code: 'HW',
            name: '豪沃'
        }, {
            code: 'QTCT',
            name: '其他'
        }, {
            code: 'JH',
            name: '江淮'
        }, {
            code: 'TJXS',
            name: '天将雄狮'
        }
    ],
    //车挂-车辆品牌
    SEMITRAILER_VEHICLE_BRAND: [
        {
            code: 'LXP',
            name: '鲁襄'
        },
        {
            code: 'GDHYP',
            name: '广大鸿远'
        }, {
            code: 'HJ',
            name: '华骏'
        }, {
            code: 'JY',
            name: '劲越'
        }, {
            code: 'ST',
            name: '速通'
        }, {
            code: 'ZX',
            name: '兆鑫'
        }, {
            code: 'DLS',
            name: '大力士'
        }, {
            code: 'TH',
            name: '通华'
        }, {
            code: 'WT',
            name: '鹜通'
        }, {
            code: 'ZJ',
            name: '中集'
        }, {
            code: 'ST1',
            name: '晟通'
        }, {
            code: 'SY',
            name: '盛润'
        }, {
            code: 'TJJD',
            name: '天骏德锦'
        }, {
            code: 'LSDY',
            name: '梁山东岳'
        }, {
            code: 'YC',
            name: '勇超'
        }, {
            code: 'WY',
            name: '五岳'
        }, {
            code: 'FH',
            name: '凤凰'
        }, {
            code: 'WJ',
            name: '皖骏'
        },
        {
            code: 'XYC',
            name: '鑫永成'
        },
        {
            code: 'QTCG',
            name: '其他'
        }
    ],
    //设备签收状态
    EQUIPMENT_SIGN_STATUS: [
        {
            code: 'SIGNED',
            name: '已签收'
        },
        {
            code: 'WAIT_SIGN',
            name: '待签收'
        }
    ],
    //设备交接方式
    EQUIPMENT_SIGN_MODE: [
        {
            code: 'SCENE',
            name: '现场交接'
        },
        {
            code: 'EXPRESS',
            name: '快递寄回'
        }
    ],
    GPS_TYPE: [
        {
            code: 'VEHICLE_MOUNTED',
            name: '车载'
        }, {
            code: 'MOBILE',
            name: '移动'
        }
    ],
    GPS_BRAND: [
        {
            code: 'G7',
            name: 'G7'
        }, {
            code: 'XING_RUAN',
            name: '星软'
        }, {
            code: 'BEI_DOU',
            name: '北斗'
        }, {
            code: 'YOU_ZHENG',
            name: '邮政'
        }
    ],
    GPS_STATUS: [
        {
            code: 'IN_USE',
            name: '使用中'
        }, {
            code: 'UN_USE',
            name: '未使用'
        },
        {
            code: 'INVALID',
            name: '挂失'
        }
    ],

    //签收状态
    SING_IN_TYPE: [
        {
            code: 'SING_IN',
            name: '签收'
        }, {
            code: 'NOT_SIGN',
            name: '未签收'
        }
    ],
    //运单跟踪方式
    TRACK_TYPE: [
        {
            code: 'PHONE',
            name: '电话'
        }, {
            code: 'WE_CHAT',
            name: '微信'
        }, {
            code: 'SMS',
            name: '短信'
        }
    ],
    //运单异常类型
    EXCEPTION_TYPE: [
        {
            code: 'TRAFFIC_JAM',
            name: '堵车'
        }, {
            code: 'ROUND',
            name: '绕行'
        }, {
            code: 'AMBLE',
            name: '缓行'
        }, {
            code: 'TRAFFIC_ACCIDENT',
            name: '交通事故'
        }, {
            code: 'VEHICLE_FAILURE',
            name: '车辆故障'
        }, {
            code: 'CHECK_CAR',
            name: '查车'
        }, {
            code: 'BAD_WEATHER',
            name: '异常天气'
        }, {
            code: 'HUMAN_REASONS',
            name: '人为原因'
        }, {
            code: 'OTHER',
            name: '其它'
        }
    ],
    //设备类型
    WAYBILL_EQUIPMENT_TYPE: [
        {
            code: 'OIL_CARD',
            name: '油卡'
        }, {
            code: 'GPS',
            name: 'GPS'
        }, {
            code: 'RECEIPT',
            name: '回单'
        }
    ],
    //审批内容类型
    MY_AUDIT_TYPE: [
        {
            code: 'WAYBILL_ADJUSTMENT',
            name: '运单调整'
        }, {
            code: 'WAYBILL_VOID',
            name: '运单作废'
        }, {
            code: 'ADD_SUPPLIER',
            name: '新增供应商'
        }, {
            code: 'ADD_BLACKLIST',
            name: '新增黑名单'
        }, {
            code: 'ADD_CUSTOMER',
            name: '新增客户'
        }, {
            code: 'ADD_STATION',
            name: '新增站点'
        }, {
            code: 'ADD_LINE',
            name: '新增线路'
        }, {
            code: 'RECEIVE_PRICE_ADJUSTMENT',
            name: '应收价格调整'
        }, {
            code: 'PAY_PRICE_ADJUSTMENT',
            name: '应付价格调整'
        }, {
            code: 'PAY_PRICE_CONFIRM',
            name: '应付价格确认'
        }
    ],
    RECEIVE_BILL_STATUS: [
        {
            code: '1',
            name: '已结算'
        }, {
            code: '0',
            name: '未结算'
        }
    ],
    SETTLEMENT_STATE: [
        {
            code: 'ALREADY_SETTLEMENT',
            name: '已结算'
        }, {
            code: 'NO_SETTLEMENT',
            name: '未结算'
        }
    ],
    PAY_SETTLEMENT_STATE: [
        {
            code: 'ALREADY_SETTLEMENT',
            name: '已付款'
        }, {
            code: 'NO_SETTLEMENT',
            name: '未付款'
        }
    ],
    MY_BUSINESS_RECEIVE_BILL_STATUS: [
        {
            code: true,
            name: '已结算'
        }, {
            code: false,
            name: '未结算'
        }
    ],
    //账单生成状态
    PAID_BILL_STATUS: [
        {
            code: 'NOT_BILL',
            name: '未生成账单'
        }, {
            code: 'BILL',
            name: '已生成账单'
        }
    ],
    //司机管理-账户类型
    ACCOUNT_TYPE: [
        {
            code: 'PERSONAL',
            name: '个人账户'
        }, {
            code: 'COMPANY',
            name: '公司账户'
        }
    ],
    //司机管理-开户银行
    OPENING_BANK: [
        {
            code: 'CCB',
            name: '中国建设银行'
        }, {
            code: 'ABC',
            name: '中国农业银行'
        }
    ],
    //申请审核类型
    AUDIT_TYPE: [
        {
            code: 'ADD',
            name: '添加'
        }, {
            code: 'MODIFY',
            name: '修改'
        }, {
            code: 'DELETE',
            name: '删除'
        }
    ],
    //操作类型
    OPERATION_TYPE: [
        {
            code: 'ADD',
            name: '添加'
        }, {
            code: 'MODIFY',
            name: '修改'
        }, {
            code: 'DELETE',
            name: '删除'
        }, {
            code: 'ENABLED',
            name: '启用'
        }, {
            code: 'DISABLE',
            name: '禁用'
        }
    ],
    //油卡认领的状态
    OIL_CLAIM: [
        {
            code: 'CLAIMED',
            name: '已认领'
        }, {
            code: 'UN_CLAIM',
            name: '待认领'
        }
    ],
    //账单金额状态
    PAYMENT_TYPE: [
        {
            code: 'PAYMENT',
            name: '已付'
        }, {
            code: 'NOT_PAYMENT',
            name: '未付'
        }, {
            code: 'NOT_SIGN',
            name: '未签收'
        }, {
            code: 'WITHOUT',
            name: '无'
        }, {
            code: 'LOSE',
            name: '丢失'
        }
    ],
    //付款状态
    PAY_STATUS: [
        {
            code: 'NOT_PAYMENT',
            name: '未付款'
        },
        {
            code: 'OBLIGATION',
            name: '待付款'
        },
        {
            code: 'PAID',
            name: '已付款'
        },
        {
            code: 'OBLIGATION2',
            name: '付款确认'
        },
        {
            code: 'PAYMENT_FAILED',
            name: '付款失败'
        }
    ],
    //操作状态
    OPERATION_STATUS: [
        {
            code: 'ADD_AUDIT',
            name: '添加审核中'
        },
        {
            code: 'MODIFY_AUDIT',
            name: '修改审核中'
        },
        {
            code: 'DELETE_AUDIT',
            name: '删除审核中'
        }
    ],
    //油卡状态
    OIL_CARD_STATUS: [
        {
            code: 'PULL_OUT',
            name: '领取'
        }, {
            code: 'UN_PULL_OUT',
            name: '未领取'
        }
    ],
    //油卡启用禁用状态
    PROHIBIT_STATUS: [
        {
            code: false,
            name: '启用'
        }, {
            code: true,
            name: '禁用'
        }
    ],
    //油卡的持卡人
    OIL_CARD_CARD_HOLDER: [
        {
            code: 'USER',
            name: '用户'
        }, {
            code: 'DRIVER',
            name: '司机'
        }, {
            code: 'SUPPILER',
            name: '供应商'
        }, {
            code: 'VEHICLE',
            name: '车辆'
        }
    ],
    GPS_PULL_STATUS: [
        {
            code: 'PULL_OUT',
            name: '领取'
        }, {
            code: 'UN_PULL_OUT',
            name: '未领取'
        }
    ],
    //运单作废原因
    WAYBILL_VOID_REASON: [
        {
            code: 'VEHICLE_ERROR',
            name: '车牌错误'
        }, {
            code: 'WAYBILL_ERROR',
            name: '运单错误'
        },
        {
            code: 'OTHER',
            name: '其它原因'
        }, {
            code: 'REPEAT_DISPATCH',
            name: '重复指派'
        },
        {
            code: 'NO_DEPART',
            name: '实际未发车'
        }
    ],
    //运单调整项
    WAYBILL_ADJUSTMENT_TYPE: [
        {
            code: 'ADJUST_AMOUNT',
            name: '运费调整'
        }, {
            code: 'QUALITY_DEDUCTIONS_AMOUNT',
            name: '时效扣款(调减)'
        },
        {
            code: 'SECURITY_DEDUCTIONS_AMOUNT',
            name: '安全扣款(调减)'
        },
        {
            code: 'OIL_PRICE_SUPPLEMENT',
            name: '油价补差(调增)'
        },
        {
            code: 'OTHER_DEDUCTIONS_AMOUNT',
            name: '其它扣款(调减)'
        },
        {
            code: 'QUALITY_AWARD',
            name: '质量奖励(调增)'
        },
        {
            code: 'DETENTION_CHARGE',
            name: '压车费(调增)'
        }
    ],
    DEDUCTION_TYPE: [
        {
            code: 'PREMIUM',
            name: '保险'
        },
        {
            code: 'MATERIAL_DETAILS',
            name: '物料明细'
        },
        {
            code: 'OTHER_DEDUCTION',
            name: '其它扣款'
        },
        {
            code: 'MACHINE_OIL',
            name: '机油'
        },
        {
            code: 'TYRE',
            name: '轮胎'
        },
        {
            code: 'SMOKE_DETECTOR',
            name: '烟感报警器'
        },
        {
            code: 'FAIRING',
            name: '导流罩'
        },
        {
            code: 'OTHER_INCIDENTAL_EXPENSES',
            name: '其他杂费'
        },
        {
            code: 'DEDUCT_GAS_MONEY',
            name: '油比不足扣款'
        },
        {
            code: 'DEDUCT_NEGATIVE_MONEY',
            name: '扣上月负数金额'
        },
        {
            code: 'DEDUCT_INTERESTS',
            name: '扣上月负数利息'
        },
        {
            code: 'BORROWING_BALANCE',
            name: '借款金额'
        },
        {
            code: 'LOAN_INTEREST',
            name: '借款利息'
        },
        {
            code: 'TELEPHONE_CHARGE',
            name: '话费'
        }, {
            code: 'CARBAMIDE',
            name: '尿素'
        }, {
            code: 'GPS',
            name: 'GPS'
        }, {
            code: 'WZ',
            name: '违章'
        },
        {
            code: 'TXNWGH',
            name: '体系内外过户'
        }, {
            code: 'FPL',
            name: '防疲劳'
        }, {
            code: 'CPBB',
            name: '车牌补办'
        }, {
            code: 'YYZ',
            name: '营运证'
        },
        {
            code: 'XSZ',
            name: '行驶证'
        }, {
            code: 'BBZJ',
            name: '补办证件'
        },
        {
            code: 'CCS',
            name: '车船税'
        }, {
            code: 'XSZNS',
            name: '行驶证年审'
        }, {
            code: 'TXNGH',
            name: '体系内过户'
        }, {
            code: 'YYZNS',
            name: '营运证年审'
        },
        {
            code: 'NULL',
            name: '其他'
        }
    ],
    //扣款大类
    DEDUCTION_CATEGORIES: [
        {
            code: 'PREMIUM',
            name: '保险'
        },
        {
            code: 'MATERIAL_DETAILS',
            name: '物料明细'
        },
        {
            code: 'OTHER_DEDUCTION',
            name: '其它扣款'
        }
    ],
    DEDUCTION_STATE: [
        {
            code: 'DEDUCTED',
            name: '已扣款'
        }, {
            code: 'SUSPEND_THE_DEDUCTIONS',
            name: '暂缓扣款'
        }, {
            code: 'TO_BE_DEDUCTED',
            name: '待扣款'
        }, {
            code: 'NO_DEDUCTIONS',
            name: '自营车不扣款'
        }
    ],
    FLAG: [
        {
            code: 'true',
            name: '是'
        }, {
            code: 'false',
            name: '否'
        }
    ],
    BOOLEAN_FLAG: [//只能回写，不能选择
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    REVERSE_BOOLEAN_FLAG: [//反过来
        {
            code: false,
            name: '是'
        }, {
            code: true,
            name: '否'
        }
    ],
    OIL_CARD_KIND: [
        {
            code: 'VEHICLE',
            name: '车辆'
        }, {
            code: 'USER',
            name: '用户'
        }, {
            code: 'DRIVER',
            name: '司机'
        }, {
            code: 'SUPPILER',
            name: '车队'
        }, {
            code: 'ORGCODE',
            name: '组织'
        }
    ],
    OIL_CANCELLATION: [
        {
            code: 'EMPLOY',
            name: '未使用'
        }, {
            code: 'INVALID',
            name: '挂失'
        }, {
            code: 'IN_USE',
            name: '使用中'
        }
    ],
    //银行列表
    BANK_DATA: BANK_DATA.data,
    //收款对象
    DISTINGUISH_BETWEEN_OBJECTS: [
        {
            code: 'SUPPLIER',
            name: '承运方'
        }, {
            code: 'DRIVER',
            name: '司机'
        }
    ],
    //申请付款状态
    PAYMENT_REQUEST_STATUS: [
        {
            code: true,
            name: '已申请'
        }, {
            code: false,
            name: '未申请'
        }
    ],
    //核对状态
    CHECK_STATUS: [
        {
            code: true,
            name: '已核对'
        }, {
            code: false,
            name: '未核对'
        }
    ],
    //结算状态
    SETTLEMENT_STATUS: [
        {
            code: true,
            name: '已结算'
        }, {
            code: false,
            name: '未结算'
        }
    ],
    //车辆禁用状态
    VEHICLE_DISABLE_STATUS: [
        {
            code: true,
            name: '已禁用'
        }, {
            code: false,
            name: '已启用'
        }
    ],
    //油卡的充值方式
    OIL_CARD_RECHARGE_METHOD: [
        {
            code: 'CASH_RECHARGE',
            name: '现金充值'
        }, {
            code: 'CREDIT_RECHARGE',
            name: '积分充值'
        }
    ],

    ETC_STATUS: [
        {
            code: 'IN_USE',
            name: '使用中'
        }, {
            code: 'LOSE_CARD',
            name: '挂失'
        }
    ],
    TYPE_OPTION: [{
        code: 'BUTTON',
        name: '按钮'
    }, {
        code: 'MENU',
        name: '菜单'
    }, {
        code: 'PAGE',
        name: '页面'
    }
    ],
    PDA_MODEL: [
        {
            code: 'IWRIST i7',
            name: 'IWRIST i7'
        }
    ],
    PDA_BRAND: [
        {
            code: 'awst',
            name: '艾维斯特'
        }
    ],
    SUPPLIER_DEPOSIT_STATUS: [
        {
            code: 'DEPOSITED',
            name: '已提交押金'
        }, {
            code: 'UN_DEPOSIT',
            name: '未提交押金'
        }

    ],
    GPS_PROHIBIT: [
        {
            code: '0',
            name: '禁用'
        }, {
            code: '1',
            name: '启用'
        }
    ],
    WJY_MESSAGE_STATUS: [
        {
            code: '0',
            name: '成功'
        }, {
            code: '1',
            name: '失败'
        }
    ],
    OILS_TYPE: [
        {
            code: '0#',
            name: '0#'
        }, {
            code: '-10#',
            name: '-10#'
        }, {
            code: '-20#',
            name: '-20#'
        }, {
            code: '-35#',
            name: '-35#'
        }
    ],
    BACK_LOG_STATUS: [
        {
            code: 'UNDISPOSED',
            name: '未处理'
        }, {
            code: 'BEING_PROCESSED',
            name: '已指派'
        }, {
            code: 'PROCESSED',
            name: '已处理'
        }
    ],
    BACKLOG_MAX_TYPE: [
        {
            code: 'WAYBILL_INVALID',
            name: '运单作废'
        }
    ],
    WAYBILL_INVALID: [
        {
            code: 'OUT_INVITE_PREPAYMENT',
            name: '预付款'
        }, {
            code: 'OUT_INVITE_COD',
            name: '货到款'
        }, {
            code: 'OIL_CARD_RECHARGE',
            name: '油卡充值'
        }
    ],
    OIL_RATIO: OIL_RATIO.data,
    //是否开票
    IS_INVOICE: [
        {
            code: 'INVOICE',
            name: '开票'
        }, {
            code: 'UN_INVOICE',
            name: '不开票'
        }
    ],
    //供应商操作状态
    SUPPLIER_OPERATION_STATUS: [
        {
            code: 'NEW_AUDIT',
            name: '新增审核中'
        }, {
            code: 'UPDATE_AUDIT',
            name: '修改审核中'
        }, {
            code: 'DELETE_AUDIT',
            name: '删除审核中'
        }, {
            code: 'INVALID_AUDIT',
            name: '作废审核中'
        }, {
            code: 'QUALIFY_AUDIT',
            name: '资质审核中'
        }, {
            code: 'DELAY_AUDIT',
            name: '已过期'
        }, {
            code: 'INVALIDED',
            name: '已作废'
        }
    ],
    ACCURATE_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    VALID_FLAG: [
        {
            code: 0,
            name: '是'
        }, {
            code: 1,
            name: '否'
        }
    ],
    DINGTALK_AUDIT_NODE: [
        {
            code: 'areaPersonInCharge',
            name: '大区负责人'
        }, {
            code: 'partitionPersonInCharge',
            name: '分区负责人'
        }, {
            code: 'personInCharge',
            name: '负责人'
        }, {
            code: 'operationUser',
            name: '营运负责人'
        }, {
            code: 'pleaseCarUser',
            name: '请车负责人'
        }, {
            code: 'customerUser',
            name: '客服负责人'
        }, {
            code: 'financeUser',
            name: '财务负责人'
        }, {
            code: 'selfSupportUser',
            name: '自营车负责人'
        }, {
            code: 'cooperativeUser',
            name: '合作车负责人'
        }, {
            code: 'scatteredBusinessUser',
            name: '零散业务负责人'
        }
    ],
    //钉钉审批回调记录类型
    AUDIT_CALLBACK_TYPE: [
        {
            code: 'finish',
            name: '完成',
        },
        {
            code: 'start',
            name: '开始',
        },
    ],
    //钉钉审批回调记录结果
    AUDIT_CALLBACK_RESULT: [
        {
            code: 'agree',
            name: '同意',
        },
        {
            code: 'refuse',
            name: '拒绝',
        }
    ],
    //应收导入是否生成对账单
    BILL_STATUS: [
        {
            code: 1,
            name: '是'
        }, {
            code: 0,
            name: '否'
        }
    ],
    //围栏异常类型
    FENCE_EXCEPTION_TYPE: [
        {
            code: 'DRIVER_VEHICLE_EXCEPTION',
            name: '车辆异常'
        },
        {
            code: 'DRIVER_TIME_EXCEPTION',
            name: '时间异常'
        },
        {
            code: 'DRIVER_OUT_FENCE_EXCEPTION',
            name: '围栏异常'
        }
    ],
    //处理围栏异常原因类型
    FENCE_HANDLE_EXCEPTION_REASON_TYPE: [
        {
            code: 'DRIVER_OPERATION_ERROR',
            name: '司机操作错误'
        },
        {
            code: 'DISPATCH_ASSIGNMENT_ERROR',
            name: '调度指派错误'
        },
        {
            code: 'STATION_ADDRESS_ERROR',
            name: '站点地址错误'
        },
        {
            code: 'VEHICLE_GPS_ERROR',
            name: '车辆GPS异常'
        },
        {
            code: 'OTHER_ERROR',
            name: '其他'
        }
    ],
    //围栏异常操作类型
    FENCE_OPERATION_TYPE: [
        {
            code: 'DRIVER_DEPARTURE',
            name: '发车'
        },
        {
            code: 'DRIVER_IN_STATION_SIGN',
            name: '经停进站'
        },
        {
            code: 'DRIVER_OUT_STATION_SIGN',
            name: '经停出站'
        },
        {
            code: 'DRIVER_ARRIVE_SIGN',
            name: '到达'
        }
    ],
    RECEIPT_HANDLE_FLAG_STATUS: [
        {
            code: true,
            name: '已确认'
        },
        {
            code: false,
            name: '待确认'
        }
    ],
    CERT_COMPLETE_FLAG: [
        {
            code: true,
            name: '是'
        },
        {
            code: false,
            name: '否'
        }
    ],
    CERT_EXPIRE_FLAG: [
        {
            code: 'NORMAL',
            name: '正常'
        },
        {
            code: 'WAITCONFIRM',
            name: '待审'
        },
        {
            code: 'UNAUDITED',
            name: '脱审'
        }
    ],
    PAYEE_STATUS: [
        {
            code: 'NO_PAYEE',
            name: '未收款'
        },
        {
            code: 'PART_PAYEE',
            name: '部分收款'
        },
        {
            code: 'ALL_PAYEE',
            name: '全部收款'
        }
    ],
    OWNERCODE: [
        {
            code: '扬州三笑物流有限公司',
            name: '扬州三笑物流有限公司'
        },
        {
            code: '上海则一货运有限公司',
            name: '上海则一货运有限公司'
        },
        {
            code: '上海一荣物流有限公司',
            name: '上海一荣物流有限公司'
        },
        {
            code: '上海则顺物流有限公司',
            name: '上海则顺物流有限公司'
        },
        {
            code: '武汉则一物流有限公司',
            name: '武汉则一物流有限公司'
        },
        {
            code: '上海则一供应链管理有限公司',
            name: '上海则一供应链管理有限公司'
        },
        {
            code: '上海则一货运有限公司广州分公司',
            name: '上海则一货运有限公司广州分公司'
        },
        {
            code: '武汉诚则物流有限公司',
            name: '武汉诚则物流有限公司'
        },
        {
            code: '武汉则一供应链管理有限公司',
            name: '武汉则一供应链管理有限公司'
        },
        {
            code: '上海昱芈物流有限公司',
            name: '上海昱芈物流有限公司'
        },
        {
            code: '北京尚德运输有限公司',
            name: '北京尚德运输有限公司'
        },
        {
            code: '马鞍山则一物流有限公司',
            name: '马鞍山则一物流有限公司'
        },
        {
            code: '马鞍山宏运达物流有限公司',
            name: '马鞍山宏运达物流有限公司'
        },
        {
            code: '马鞍山皖通物流有限公司',
            name: '马鞍山皖通物流有限公司'
        },
        {
            code: '马鞍山广盛物流有限公司',
            name: '马鞍山广盛物流有限公司'
        },
        {
            code: '北京则一物流有限公司',
            name: '北京则一物流有限公司'
        },
        {
            code: '北京则一货运有限公司',
            name: '北京则一货运有限公司'
        },
        {
            code: '北京则一供应链管理有限公司',
            name: '北京则一供应链管理有限公司'
        },
        {
            code: '淮安则一物流有限公司',
            name: '淮安则一物流有限公司'
        },
        {
            code: '广州则一物流有限公司',
            name: '广州则一物流有限公司'
        },
        {
            code: '深圳市则一物流有限公司',
            name: '深圳市则一物流有限公司'
        },
        {
            code: '沈阳则一物流有限公司',
            name: '沈阳则一物流有限公司'
        },
        {
            code: '徐州则一物流有限公司',
            name: '徐州则一物流有限公司'
        },
        {
            code: '庆铃汽车集团有限公司',
            name: '庆铃汽车集团有限公司'
        },
        {
            code: '杭州锦圆货运有限公司',
            name: '杭州锦圆货运有限公司'
        },
        {
            code: '湖南圆汇物流有限公司',
            name: '湖南圆汇物流有限公司'
        },
        {
            code: '深圳市圆汇物流有限公司',
            name: '深圳市圆汇物流有限公司'
        },
        {
            code: '济南富力龙物流有限公司',
            name: '济南富力龙物流有限公司'
        },
        {
            code: '上海利星行物流有限公司',
            name: '上海利星行物流有限公司'
        },
        {
            code: '远运(天津)物流有限公司',
            name: '远运(天津)物流有限公司'
        },
        {
            code: '长沙则一物流科技有限公司',
            name: '长沙则一物流科技有限公司'
        },
        {
            code: '武汉运畅物流有限责任公司',
            name: '武汉运畅物流有限责任公司'
        },
        {
            code: '杭州飞龙汽车运输有限公司',
            name: '杭州飞龙汽车运输有限公司'
        },
        {
            code: '湖北赤湾东方物流有限公司',
            name: '湖北赤湾东方物流有限公司'
        },
        {
            code: '江西赤湾东方物流有限公司',
            name: '江西赤湾东方物流有限公司'
        },
        {
            code: '上海赤湾东方物流有限公司',
            name: '上海赤湾东方物流有限公司'
        },
        {
            code: '上海诚驹供应链管理有限公司',
            name: '上海诚驹供应链管理有限公司'
        },
        {
            code: '深圳市赤湾东方物流有限公司',
            name: '深圳市赤湾东方物流有限公司'
        },
        {
            code: '宜丰县龙祥汽车运输有限公司',
            name: '宜丰县龙祥汽车运输有限公司'
        },
        {
            code: '湖南五六联盟电商物流有限公司',
            name: '湖南五六联盟电商物流有限公司'
        },
        {
            code: '江西赤湾东方智慧公路港有限公司',
            name: '江西赤湾东方智慧公路港有限公司'
        },
        {
            code: '百世物流科技中国有限公司南宁分公司',
            name: '百世物流科技中国有限公司南宁分公司'
        },
        {
            code: '成都则一物流有限公司',
            name: '成都则一物流有限公司'
        },
        {
            code: '广州吉旗物流有限公司',
            name: '广州吉旗物流有限公司'
        }
    ],
    BONUSINCENTIVE_FLAG: [
        {
            code: false,
            name: '否'
        }, {
            code: true,
            name: '是'
        }
    ],
    GRANT_FLAG: [
        {
            code: 0,
            name: '否'
        }, {
            code: 1,
            name: '是'
        }
    ],
    DATA_SOURCE_TYPE: [
        {
            code: 'WEB',
            name: '客户端',
        },
        {
            code: 'AUTOMATIC',
            name: '自动生成',
        }
    ],
    WAYBILL_IS_NULL: [
        {
            code: true,
            name: '是'
        },
        {
            code: false,
            name: '否'
        }
    ],
    G7_OIL_COM: [
        {
            code: '1',
            name: '中石化'
        }, {
            code: '2',
            name: '中石油'
        }, {
            code: '52',
            name: '柴油专用卡'
        }, {
            code: '6',
            name: '充值卡'
        }, {
            code: '7',
            name: '记账卡'
        }, {
            code: '8',
            name: '加油员卡'
        }
    ],
    G7_OIL_TYPE: [
        {
            code: 0,
            name: '未绑'
        }, {
            code: 1,
            name: '已绑'
        }
    ],
    G7_TRADE_TYPE: [
        {
            code: 10,
            name: '使用'
        }, {
            code: 30,
            name: '锁定'
        }, {
            code: 40,
            name: '受限'
        }, {
            code: 50,
            name: '未激活'
        }
    ],
    //钉钉审批节点类型
    AUDIT_NODE_TYPE: [
        {
            code: 'POSITION',
            name: '职务职责'
        }, {
            code: 'USER',
            name: '具体用户'
        }
    ],
    // 排班类型
    SCHEDULE_TYPE: [
        {
            code: 'BY_DAY',
            name: '按天'
        }, {
            code: 'BY_WEEK',
            name: '按周'
        }, {
            code: 'BY_MONTH',
            name: '按月'
        }
    ],
    // 订单状态
    ORDER_STATUS: [
        {
            code: 'REPORT',
            name: '已上报'
        }, {
            code: 'WAIT_RELEASE',
            name: '待发布'
        }, {
            code: 'CANCEL',
            name: '已取消'
        }, {
            code: 'PENDING_BIDDING',
            name: '待竞价'
        }, {
            code: 'BIDDING',
            name: '竞价中'
        }, {
            code: 'ASSIGNED',
            name: '已指派'
        }, {
            code: 'COMPLETION_OF_BIDDING',
            name: '竞价完成'
        }, {
            code: 'FAILURE_OF_BIDDING',
            name: '竞价失败'
        }, {
            code: 'ORDER_ASSIGNED',
            name: '订单指派'
        }
    ],
    // 竞价状态
    BIDDING_STATUS: [
        {
            code: 'BIDDING',
            name: '报价中'
        }, {
            code: 'CONFIRM',
            name: '已中标'
        }, {
            code: 'LOSE_BID',
            name: '未中标'
        }
    ],
    ORDER_BID_STATUS: [
        {
            code: 'BIDDING',
            name: '竞价中'
        }, {
            code: 'COMPLETION_OF_BIDDING',
            name: '竞价完成'
        }, {
            code: 'FAILURE_OF_BIDDING',
            name: '竞价失败'
        }, {
            code: 'CANCEL',
            name: '已取消'
        }, {
            code: 'BID_EVALUTION',
            name: '待评标'
        }, {
            code: 'ASSIGNED',
            name: '已指派'
        }, {
            code: 'PENDING_BIDDING',
            name: '待竞价'
        },
    ],
    // 司机竞价状态
    ORDER_BID_RECORD_STATUS: [
        {
            code: 'BIDDING',
            name: '竞价中'
        }, {
            code: 'CONFIRM',
            name: '已中标'
        }, {
            code: 'LOSE_BID',
            name: '未中标'
        }, {
            code: 'CANCEL_PRICE',
            name: '已取消报价'
        }, {
            code: 'CANCEL',
            name: '已取消'
        }, {
            code: 'WAIT_CANCEL',
            name: '取消中'
        }
    ],
    // 竞价弹出框查询司机报价记录
    DIALOG_RECORD_STATUS: [
        {
            code: 'BIDDING',
            name: '竞价中'
        }, {
            code: 'CONFIRM',
            name: '已中标'
        }, {
            code: 'LOSE_BID',
            name: '未中标'
        }, {
            code: 'CANCEL_PRICE',
            name: '已取消报价'
        }, {
            code: 'CANCEL',
            name: '已取消'
        },
    ],
    // 司机竞价用户类型
    ORDER_BID_USER_TYPE: [
        {
            code: 'DRIVER',
            name: '司机'
        }, {
            code: 'SHIPPER',
            name: '承运方'
        }
    ],
    // 司机竞价取消状态类型
    ORDER_BID_CANCEL_STATUS: [
        {
            code: 'ACCEPTANCE',
            name: '受理中'
        }, {
            code: 'ACCEPTANCE_SUCCESSFUL',
            name: '受理成功'
        }, {
            code: 'ACCEPTANCE_FAILURE',
            name: '受理失败'
        }
    ],
    //车辆保险折旧类型
    VEHICLE_INSURANCE_DEPRECIATION_TYPE: [
        {
            code: 'INSURANCE',
            name: '保险'
        }, {
            code: 'DEPRECIATION',
            name: '折旧'
        }, {
            code: 'INSURANCE_MONTH',
            name: '尾款保险'
        }
    ],
    // 客户订单状态
    CUSTOMER_STATUS: [
        {
            code: 'CONFIRM',
            name: '已中标'
        }, {
            code: 'UN_CONFIRM',
            name: '未中标'
        }, {
            code: 'CANCEL',
            name: '已取消'
        }, {
            code: 'OFFER',
            name: '报价中'
        }, {
            code: 'NEW_CREATE',
            name: '待报价'
        }, {
            code: 'EXPIRE',
            name: '已过期'
        }
    ],
    // 京东订单状态
    JD_CUSTOMER_STATUS: [
        {
            code: 'CANCEL',
            name: '已取消'
        }, {
            code: 'NEW_CREATE',
            name: '待派车'
        }, {
            code: 'DISPATCH',
            name: '已派车'
        }
    ],
    // 客户回单状态
    CUSTOMER_DISPATCH: [
        {
            code: '0',
            name: '不需要'
        }, {
            code: '1',
            name: '需要'
        }
    ],
    CUSTOMER_ORDER_NEED: [
        {
            code: '1',
            name: '需要'
        }, {
            code: '2',
            name: '不需要'
        }
    ],
    JD_CUSTOMER_ORDER_NEED: [
        {
            code: true,
            name: '需要'
        }, {
            code: false,
            name: '不需要'
        }
    ],
    // 合同线路计价模式
    VALUATION_PRICE_MPDEL: [
        {
            code: 'UNIFIED_PRICE_MODEL',
            name: '统价模式'
        }, {
            code: 'PRIORITY_CONTINUATION',
            name: '首重+续重'
        },
    ],
    //客户订单缺失
    LACK_STATUS: [
        {
            code: 'WAIT_HANDLE',
            name: '待处理'
        }, {
            code: 'HANDLED',
            name: '已处理'
        }
    ],
    //无车承运司机状态
    NO_CAR_DRIVER_STATUS: [
        {
            code: 'WAIT_PUSH',
            name: '待推送'
        }, {
            code: 'PUSH_SUCCESS',
            name: '推送成功'
        }, {
            code: 'PUSH_FAILED',
            name: '推送失败'
        }
    ],
    G7_CAR_CHECK_STATUS: [
        {
            code: '0',
            name: '处理中'
        }, {
            code: '1',
            name: '处理失败'
        }, {
            code: '2',
            name: '校验通过'
        }
    ],
    G7_CAR_PAYMENT_STATUS: [
        {
            code: '0',
            name: '未支付'
        }, {
            code: '1',
            name: '支付完成'
        },
    ],
    G7_CAR_BILL_STATUS: [
        {
            code: '0',
            name: '不可开票'
        }, {
            code: '1',
            name: '可开票'
        }, {
            code: '2',
            name: '开票中'
        }, {
            code: '3',
            name: '已开票'
        },
    ],
    G7_CAR_PAY_TYPE: [
        {
            code: '0',
            name: '现付'
        }, {
            code: '1',
            name: '油费'
        }, {
            code: '3',
            name: '到付'
        }, {
            code: '4',
            name: '尾款'
        }
    ],
    //是否有收据
    IS_RECEIVED: [
        {
            code: 'YES',
            name: '是'
        }, {
            code: 'NO',
            name: '否'
        }
    ],
    //是否有凭证
    IS_VOUCHER: [
        {
            code: 'YES',
            name: '是'
        }, {
            code: 'NO',
            name: '否'
        }
    ],
    //保证金操作类型
    DEPOSIT_OPERATION_TYPE: [
        {
            code: 'ADD',
            name: '新增'
        }, {
            code: 'MODIFY',
            name: '修改'
        }, {
            code: 'RETURN',
            name: '退回'
        }, {
            code: 'BAD',
            name: '坏账'
        }, {
            code: 'DEPOSIT_TRANSFER',
            name: '保证金转履约金'
        }
    ],
    //履约金操作类型
    PERFORMANCE_OPERATION_TYPE: [
        {
            code: 'ADD',
            name: '新增'
        }, {
            code: 'MODIFY',
            name: '修改'
        }, {
            code: 'RETURN',
            name: '退回'
        }, {
            code: 'BAD',
            name: '坏账'
        }, {
            code: 'PERFORMANCE_TRANSFER',
            name: '履约金转履约金'
        }, {
            code: 'DEPOSIT_TRANSFER',
            name: '保证金转履约金'
        }
    ],
    SETTLEMENT_MODEL: [
        {
            code: 'SELF_SELF_SUPPORT',
            name: '自营'
        }, {
            code: 'SELF_OUTSOURCE',
            name: '承包'
        }, {
            code: 'OUTSOURCE_NOT_TRANSFERRED',
            name: '合作'
        }, {
            code: 'OUTSOURCE_TRANSFERRED',
            name: '长期外请'
        }
    ],
    //车辆异常受理状态
    VEHICLE_ABNORMAL_ACCEPT_STATUS: [
        {
            code: 'NO_ACCEPT',
            name: '未受理'
        }, {
            code: 'ACCEPT_SUCCESS',
            name: '受理成功'
        }, {
            code: 'ACCEPT_FAIL',
            name: '受理失败'
        }
    ],
    //保证金履约金状态
    DEPOSIT_PERFORMANCE_STATUS: [
        {
            code: 'APPLYING',
            name: '申请中'
        }, {
            code: 'APPLY_REFUSE',
            name: '申请拒绝'
        }, {
            code: 'USING',
            name: '使用中'
        }, {
            code: 'OVERDUE',
            name: '逾期中'
        }, {
            code: 'CANCEL',
            name: '已销账'
        }, {
            code: 'BAD',
            name: '已坏账'
        }
    ],
    //当前班次标识
    ORDER_SCHEDULE_SHIFTS_CURRENT_FLAG: [
        {
            code: true,
            name: '是'
        },
    ],
    //班次标识
    ORDER_SCHEDULE_SHIFTS_NEXT_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    //外请加油记录是否取消订单标识
    CANCEL_ORDER_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    //排班有无车辆标识
    ORDER_SCHEDULE_SHIFTS_HAS_VEHICLE_FLAG: [
        {
            code: false,
            name: '有'
        }, {
            code: true,
            name: '无'
        }
    ],
    //订单支付标识
    ORDER_BID_RECORD_PAY_FLAG: [
        {
            code: 'NO_PAY',
            name: '未付款'
        }, {
            code: 'WAIT_PAY',
            name: '待付款'
        }, {
            code: 'PAY',
            name: '已付款'
        }
    ],
    //订单退款标识
    ORDER_BID_RECORD_WX_REFUND_FLAG: [
        {
            code: 'NO_REFUND',
            name: '未退款'
        }, {
            code: 'WAIT_REFUND',
            name: '待退款'
        }, {
            code: 'REFUND',
            name: '已退款'
        }
    ],
    //定货费退款查询类型
    SEARCH_ORDER_BID_RECORD_WX_REFUND_FLAG: [
        {
            code: 'NO_REFUND',
            name: '未退款'
        }, {
            code: 'REFUND',
            name: '已退款'
        }
    ],
    REFUELING_DRIVER_RECORD_BUSINESS_TYPE: [
        {
            code: 'DISPATCH_RECHARGE',
            name: '发车充值'
        }, {
            code: 'FUEL_CONSUME',
            name: '加油消费'
        }, {
            code: 'ACCOUNT_IN',
            name: '账户转入'
        }, {
            code: 'ACCOUNT_OUT',
            name: '账户转出'
        }, {
            code: 'WAYBILL_INVALID',
            name: '运单作废'
        }, {
            code: 'UNDO_DISPATCH_RECHARGE',
            name: '发车充值撤销'
        }, {
            code: 'CANCEL_ORDER',
            name: '加油订单取消'
        }
    ],
    // 运单维度充值类型
    WAYBILL_RECORD_BUSINESS_TYPE: [
        {
            code: 'DISPATCH_RECHARGE',
            name: '发车充值'
        }, {
            code: 'WAYBILL_INVALID',
            name: '运单作废'
        }, {
            code: 'UNDO_DISPATCH_RECHARGE',
            name: '发车充值撤销'
        }
    ],
    // 运单维度充值状态
    RECHARGE_STATUS: [
        {
            code: true,
            name: '已充值'
        }, {
            code: false,
            name: '已撤销'
        }
    ],
    // 是否扣款完成标识
    DEDUCT_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    // 加油金额分配类型
    ALLOCATION_TYPE: [
        {
            code: 10,
            name: '正分配'
        }, {
            code: 20,
            name: '反分配'
        }
    ],
    // 派车单定点加油类型
    REFUELING_TYPE: [
        {
            code: 'DRIVER',
            name: '司机'
        },
        {
            code: 'SHIPPER',
            name: '承运方'
        }
    ],
    // 是否到达结款周期
    SETTLE_ACCOUNTS_CYCLE_FLAG: [
        {
            code: false,
            name: '到达'
        },
        {
            code: true,
            name: '未到达'
        }
    ],
    // 是否高速站点
    HIGH_SPEED_STATION: [
        {
            code: true,
            name: '是'
        },
        {
            code: false,
            name: '否'
        }
    ],
    // 外请站点状态 (online正常服务，pause暂停服务，offline已下)
    OUT_STATION_STATUS: [
        {
            code: "online",
            name: '正常服务'
        },
        {
            code: "PAUSE",
            name: '暂停服务'
        },
        {
            code: "offline",
            name: '已下'
        }
    ],
    // 外请站点禁用启用状态
    OUT_STATION_DISABLE_STATUS: [
        {
            code: true,
            name: '启用'
        }, {
            code: false,
            name: '禁用'
        }
    ],
    // 是否顺丰C端
    SF_Client: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    //定点加油消费是否已开票
    HAS_INVOICE: [
        {
            code: true,
            name: '已开票'
        }, {
            code: false,
            name: '未开票'
        }
    ],
    // 是否确认
    CONFIRM_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    // 是否删除
    DELETE_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    // 所属公司类型
    TYPE_OF_COMPANY: [
        {
            code: "HEADQUARTERS",
            name: '总部'
        }, {
            code: "PLANTFORM_COMPANY",
            name: '平台公司'
        }
    ],
    //驳回待发车辆状态
    REJECT_DEPART_VEHICLE_STATUS: [
        {
            code: "NO_REJECT",
            name: '未驳回'
        }, {
            code: "REJECT",
            name: '已驳回'
        }
    ],
    CERTIFY_TYPE: [
        {
            code: '1',
            name: '社会信用代码'
        },
        {
            code: '2',
            name: '营业执照注册号'
        },
        {
            code: '3',
            name: '组织机构代码'
        }
    ],
    MOULAGE_STYLE_TYPE: [
        {
            code: '1',
            name: '常规圆章'
        },
        {
            code: '2',
            name: '椭圆章'
        }
    ],
    MOULAGE_COLOR: [
        {
            code: 'C1',
            name: '红色'
        },
        {
            code: 'C2',
            name: '蓝色'
        },
        {
            code: 'C3',
            name: '黑色'
        }
    ],
    MOULAGE_MODE: [
        {
            code: '0',
            name: '常规'
        },
        {
            code: '2',
            name: '脱敏处理'
        }
    ],
    CONTRACT_DATA_STATUS: [
        {
            code: 'WAIT_SIGN',
            name: '待签订'
        },
        {
            code: 'SIGNED',
            name: '已签订'
        }
    ],
    //应付审批是否审核
    PAYMENT_CHECK_BEFORE_APPROVAL_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    //应发未发
    NO_DEPART_VEHICLE_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    //应到未到
    NO_ARRIVAL_VEHICLE_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    //罚款是否审核
    FINE_AUDIT_FLAG: [
        {
            code: true,
            name: '是'
        }, {
            code: false,
            name: '否'
        }
    ],
    DEPRECIATION_SUBJECT: [
        {
            code: 'TRAILER',
            name: '挂车'
        },
        {
            code: 'HOUSE_CAR',
            name: '箱体'
        }
    ],
    //异常类型
    TASK_EXCEPTION_TYPE: [
        {
            code: 'VEHICLE_ERROR',
            name: '车牌号错误'
        },
        {
            code: 'CUSTOMER_CANCEL',
            name: '客户取消'
        },
        {
            code: 'DRIVER_REJECT',
            name: '司机拒绝'
        }, {
            code: 'OTHER',
            name: '其它'
        }
    ],
    //异常原因
    EXCEPTION_REASON: [
        {
            code: 'CUSTOMER_CANCEL',
            name: '客户取消'
        },
        {
            code: 'EMPTY',
            name: '车辆放空'
        },
        {
            code: 'ASSIGN_ERROR',
            name: '指派错误'
        }, {
            code: 'DRIVER_CANCEL',
            name: '司机放鸽子'
        }
        , {
            code: 'REPEAT_TASK',
            name: '重复任务'
        }
        , {
            code: 'DELAY_DEPARTURE',
            name: '压车未发'
        }
        , {
            code: 'OTHER',
            name: '其他'
        }
    ],
    //异常处理状态
    HANDLER_STATUS: [
        {
            code: 'WAIT_HANDLED',
            name: '待处理'
        },
        {
            code: 'ALREADY_HANDLED',
            name: '已处理'
        }
    ],
    //柴油主卡号
    CARD_MASTER_NO: [
        {
            code: '1000118621060011998',
            name: '1000118621060011998'
        }, {
            code: '1000113100060010345',
            name: '1000113100060010345'
        }, {
            code: '1000113100060077338',
            name: '1000113100060077338'
        }
    ],
    INDUSTRY_TYPE: [
        {
            code: 'GOODS',
            name: '消费品'
        },
        {
            code: 'ELECTRIC_ENERGY',
            name: '电力能源'
        },
        {
            code: 'INDUSTRIAL_VEHICLE',
            name: '工业汽车'
        },
        {
            code: 'POPULAR_COMMODITIES',
            name: '大众商品'
        },
        {
            code: 'SELL',
            name: '零售'
        },
        {
            code: 'EXPRESS',
            name: '快递行业'
        },
        {
            code: 'EXPRESS_TRANSPORTATION',
            name: '快运行业'
        },
        {
            code: 'OTHER',
            name: '其他'
        }
    ],
    DEDUCT_TYPE: [
        {
            code: '合作车坏账',
            name: '合作车坏账'
        },
        {
            code: '应收坏账',
            name: '应收坏账'
        },
        {
            code: '货损赔付',
            name: '货损赔付'
        },
        {
            code: '时效扣款',
            name: '时效扣款'
        },
        {
            code: '违章罚款',
            name: '违章罚款'
        },
        {
            code: '自营车扣款',
            name: '自营车扣款'
        },
        {
            code: '设备丢失处罚',
            name: '设备丢失处罚'
        },
        {
            code: '车牌补办',
            name: '车牌补办'
        },
        {
            code: '证件补办扣款',
            name: '证件补办扣款'
        },
        {
            code: '保险理赔',
            name: '保险理赔'
        },
        {
            code: '其他扣款项',
            name: '其他扣款项'
        }
    ],
    //gps上报异常类型
    GPS_REPORT_RXCEPTION_TYPE: [
        {
            code: 'SLOW_RUNNING',
            name: '行驶里程低于预期里程'
        },
        {
            code: 'LONG_TIME_STAY',
            name: '长时间停留'
        }
    ],
    PAYMENT_TYPE: [
        {
            code: '油卡充值',
            name: '油卡充值'
        },
        {
            code: '电子油卡',
            name: '电子油卡'
        },
        {
            code: '预付款',
            name: '预付款'
        }, {
            code: '货到款',
            name: '货到款'
        }, {
            code: '尾款',
            name: '尾款'
        }, {
            code: '油卡押金',
            name: '油卡押金'
        },
        {
            code: 'GPS押金',
            name: 'GPS押金'
        },
        {
            code: '回单押金',
            name: '回单押金'
        }, {
            code: 'NOT',
            name: '无'
        }
    ],
    WAYBILL_INVALID_HANDLED_STATUS: [
        {
            code: 'WAIT_HANDLED',
            name: '待处理'
        },
        {
            code: 'ALREADY_HANDLED',
            name: '已处理'
        }
    ],
    AREA_PROFIT_DEDUCT: [
        {
            code: 'AUDIT_BACKOUT',
            name: '已撤回'
        },
        {
            code: 'AUDIT_AGREE',
            name: '已同意'
        },
        {
            code: 'AUDIT_REFUSE',
            name: '已拒绝'
        }
    ],
    RECHARGE_TYPE: [
        {
            code: 'BANK_RECHARGE',
            name: '银行充值'
        },
        {
            code: 'CASH_REBATES',
            name: '现金返利'
        },
        {
            code: 'INTEGRAL_REBATES',
            name: '积分返利'
        }
    ],
    //申请类型
    APPLY_TYPE: [
        {
            code: 'ELECTRONIC_OIL_CARD',
            name: '电子油卡'
        },
        {
            code: 'MATERIAL_OBJECT_OIL_CARD',
            name: '实物油卡'
        },
        {
            code: 'ETC',
            name: 'ETC'
        }
    ],
    SEAL_TYPE: [
        {
            code: '0',
            name: '圆形'
        },
        {
            code: '1',
            name: '椭圆形'
        }
    ],
    SEAL_COLOR: [
        {
            code: '0',
            name: '红色'
        },
        {
            code: '1',
            name: '蓝色'
        },
        {
            code: '2',
            name: '黑色'
        }
    ],
    SEAL_FONT: [
        {
            code: '0',
            name: '宋体'
        },
        {
            code: '1',
            name: '楷体'
        },
        {
            code: '2',
            name: '正⽅⿊体'
        }
    ],
    PHYSICAL_OIL_CARD:[
        {
            code: 'G7',
            name: 'G7'
        },
        {
            code: 'TRANS_WISEWAY_ROAD',
            name: '中交兴路'
        }
    ],
    BUSINESS_CUSTOMER_TYPE: [{
        code: 'TRADITION_BUSINESS',
        name: '传统业务'
    }, {
        code: 'NEW_BUSINESS',
        name: '新业务'
    }],
    SETTLEMENT_MODE: [
        {
            code: 'SELF_SUPPORT',
            name: '自营'
        }, {
            code: 'SELF_OUTSOURCE',
            name: '自营合作'
        }, {
            code: 'OUTSOURCE',
            name: '合作'
        }, {
            code: 'FINANCIAL_OUTSOURCE',
            name: '金融合作'
        }, {
            code: 'SELF_CONSTRUCTION',
            name: '自营共建'
        }, {
            code: 'TRAILER_CONSTRUCTION',
            name: '甩挂共建'
        }, {
            code: 'OUTSOURCE_CONSTRUCTION',
            name: '合作共建'
        }, {
            code: 'CONTRACT_OUT_INVITE',
            name: '合同外请车'
        }, {
            code: 'TEMPORARY_OUT_INVITE',
            name: '临时外请车'
        }, {
            code: 'LONG_TERM_OUT_INVITE',
            name: '长期外请车'
        }
    ],
};
export default data

