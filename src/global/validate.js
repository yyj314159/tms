export const Validate = {
    //车牌号
    licenseNumber: {pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂]{1}$/, message: '请输入正确的车牌号!'},
    //车牌号
    licenseNumber1: {pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9]{1}$/, message: '请输入正确的车牌号!'},
    //挂厢号--
    trailerLicenseNumber: {pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-Z0-9]{4}[挂]{1}$/, message: '请输入正确的挂厢号!'},
    //手机号
    phone: {pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号!'},
    telePhone: {pattern: /^1[0-9]{10}|0\d{2,3}-\d{7,8}$/, message: '请输入正确的电话号码!'},
    //必填项
    required(val, flag) {
        return {required: flag, message: val + '不能为空!', trigger: 'blur'};
    },
    //通用数字(8位整数2小数)含0
    allNumber: {pattern: /^(([1-9]\d{0,7})|0)(\.\d{1,2})?$/, message: '请输入正确的数字!'},
    //正整数含0
    number: {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正确的数字!'},
    //通用金额(5位整数2小数)含0
    money: {pattern: /^(([1-9]\d{0,5})|0)(\.\d{1,2})?$/, message: '请输入正确的金额!'},
    //通用金额(5位整数2小数)含0,包括负数
    negativeMoney: {pattern: /^(((([1-9]\d{0,4})|0)(\.\d{1,2})?)|(-((([1-9]\d{0,4})|0)(\.\d{1,2})?)))$/, message: '请输入正确的金额!'},
    //通用金额(8位整数3小数)含0
    threeMoney: {pattern: /^(([1-9]\d{0,7})|0)(\.\d{1,3})?$/, message: '请输入正确的金额!'},
    //通用金额(8位整数2小数)不含0
    notZeroMoney: {pattern: /^(([1-9]\d{0,7}))(\.\d{1,2})?$/, message: '请输入正确的金额!'},
    //通用金额(5位整数2小数)不含0
    notZeroMoneyTrue: {pattern: /^(((([1-9]\d{0,4}))(\.\d{1,2})?)|(0(\.0[1-9]))|(0(\.[1-9]\d?)))$/, message: '请输入正确的金额!'},
    //金额(不限整数位数和2位小数)含0
    notLimitMoney: {pattern: /^(([1-9]\d*)|0)(\.\d{1,2})?$/, message: '请输入正确的金额!'},
    //通用金额(8位整数2小数)含0和负数
    allMoney: {pattern: /^([\-]?(([1-9]\d{0,7})|0))([.]\d{1,2})?$/, message: '请输入正确的金额!'},
    //金额(不限整数位数和2位小数)含0和负数
    notLimitAllMoney: {pattern: /^([\-]?(([1-9]\d*)|0))([.]\d{1,2})?$/, message: '请输入正确的金额!'},
    //正数不含0
    plus: {pattern: /^\d+(\.\d+)?$/, message: '请输入大于0的数字值!'},
    //运单号 Y开头12位数字
    waybill: {pattern: /^Y\d{12}$/, message: '运单号格式错误!'},
    //银行卡号 0---20位数字
    bank: {pattern: /^\d{0,30}$/, message: '银行卡格式不正确!'},
    //非零开头的最多带三位小数的数字：
    floatingNumber: {pattern: /^([1-9][0-9]*)+(\.[0-9]{1,3})?$/, message: '请输入正确的数字!'},
    //非零开头的最多带两位小数的数字：
    point2: {pattern: /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/, message: '请输入正确的数字!'},
    //回单号
    receipt: {pattern: /^[A-Za-z0-9-#]{4,50}$/, message: '回单格式不正确!'},
    //至少3位的数字
    threeNum: {pattern: /^\d{3,}$/, message: '不能小于100!'},
    //至少2位的数字
    towNum: {pattern: /^\d{2,}$/, message: '不能小于10!'},
    //校验小时数
    hour: {pattern: /^(([0-9])|(1[0-9])|(2[0-3]))$/, message: '请输入正确的数值!'},
    //校验分钟数
    minute: {pattern: /^[1-5]?[0-9]$/, message: '请输入正确的数值!'},
    //重量(8位整数2小数)不含0
    weight: {pattern: /^(([1-9]\d{0,7}))(\.\d{1,2})?$/, message: '请输入正确的重量!'},
    //体积(8位整数2小数)不含0
    volume: {pattern: /^(([1-9]\d{0,7}))(\.\d{1,2})?$/, message: '请输入正确的体积!'},
    email: {pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱!'},
    //校验计重单价
    weightPrice(flag){
        if(flag){
            return   {pattern: /^((0\.[1-9]{1}?[0-9]{0,2})|(0\.[0-9]{1}[1-9]{1}?[0-9]{1})|(0\.[0-9]{0,2}[1-9]{1})|(([1-9]{1})(\.\d{1,3})?))$/, message: '请输入正确的单价（小于10）!'};
        }else{
            return {};
        }
    },
    //校验按方单价
    volumPrice(flag){
        if(flag){
            return   {pattern: /^((0\.[1-9]{1}?[0-9]{0,2})|(0\.[0-9]{1}[1-9]{1}?[0-9]{1})|(0\.[0-9]{0,2}[1-9]{1})|(([1-9]{1}?[0-9]{0,2})(\.\d{1,3})?))$/, message: '请输入正确的单价（小于1000）!'};
        }else{
            return {};
        }
    },
    //校验详细地址
    address: {pattern: /^.*[道路街村屯]{1}.*$/, message: '地址格式:XXXX路/道/街/村/屯XXX号/弄,例如：华新镇纪鹤公路1988号'}
}

export default Validate
