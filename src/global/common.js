import Cookies from 'js-cookie';
import DataDictionary from 'src/components/common/data/data.js'
import moment from 'moment'
import XLSX from "xlsx"
import {Http,Api,Constant} from 'src/global'
import axios from 'axios'

const token = {
    getToken: function () {
        return Cookies.get('tms-token');
    },
    setToken: function (token) {
        Cookies.set('tms-token', token);
    },
    removeToken: function () {
        Cookies.remove('tms-token');
    },
    hasToken: function () {
        if (Cookies.get('tms-token')) {
            return true;
        }
        return false;
    }
};

const userId = {
    getUserId: function () {
        return Cookies.get('tms-userId');
    },
    setUserId: function (id) {
        Cookies.set('tms-userId', id);
    }
};

const changePWflag = {//是否更改过密码
    getFlag: function () {
        return Cookies.get('tms-changePWflag');
    },
    setFlag: function (truth) {
        Cookies.set('tms-changePWflag', truth);
    }
};

const dictionary = {
    getName: function (code, subCode) {
        code = code.split(',');
        let values = undefined;
        code.forEach(c => {// ['HEAD_VEHICLE_BRAND','SEMITRAILER_VEHICLE_BRAND'] 多个数据字典 组合内容
            let le = DataDictionary[c];
            if (le) {
                if (values) {
                    values = le.concat(values);
                } else {
                    values = le
                }

            }
        });
        if (values) {
            for (let i = 0; i < values.length; i++) {
                if (values[i].code == subCode) {
                    return values[i].name;
                }
            }
        }
        return null;
    }
};
/**
 * 模板下载公共类
 * @type {{getExcel: templateDownload.getExcel}}
 */
const templateDownload={
    getExcel:function (obj,fileName) {
        let vm = this;
        vm.downloadLoading = false;
        axios.get(obj, {responseType: 'arraybuffer'}).then((response) => {
            let blob = new Blob([response.data], { type: 'application/x-xls' });
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            //配置下载的文件名
            link.download = fileName+'.xls';
            link.click();
            vm.downloadLoading = true;
        }).catch(reason => {
            vm.downloadLoading = true;
        })
    }
};

const date = {
    /**
     * 日期格式化
     * @param date 日期
     * @param format 格式
     * @returns {string}
     */
    dateFormat: function (date, format) {
        if (date) {
            return moment(date).format(format);
        }
    },
    /**
     * 获取两个时间 相差天
     * @param startDate
     * @param endStart
     */
    getIntervalDay: function (startDate, endDate) {
        if (startDate && endDate) {
            return Math.floor((moment(endDate).format('X') - moment(startDate).format('X')) / (24 * 3600));
        }
    },
    /**
     * 获取两个时间 相差月份
     * @param startDate
     * @param endStart
     */
    getIntervalMonth: function (startDate, endDate) {
        let startMonth = moment(startDate).month();
        let endMonth = moment(endDate).month();
        return (moment(endDate).year() * 12 + endMonth) - (moment(startDate).year() * 12 + startMonth);
    },
    /**
     * 时间格式化处理
     * @param startDate
     * @param endStart
     */
    dateFtt: function (fmt, date) {
        let o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
};

const util = {
    /**
     *  用于计算
     * @param val
     * @returns {number}
     */
    numberFormat: function (val) {
        if (val) {
            if (Number.isFinite(val)) {
                return val
            } else {
                if (isNaN(Number(val))) {
                    throw "参数错误,当前类型无法转为数字 用于计算"
                } else {
                    return Number(val)
                }
            }
        } else {
            return 0
        }
    },
    // 数组去重
    clean(arr){
        let list = new Set(arr);
        return Array.from(list);
    }
};


const excel = {
    reportExcel(url,params,name,booble){
        axios.get(url, {
            params: params,
            responseType: 'arraybuffer'
        }).then((response) => {
            let blob = new Blob([response.data], {type: 'application/x-xls'});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            //配置下载的文件名
            link.download = name;
            link.click();
            // return new Promise(function(resolve, reject) {});
        }).catch(reason => {
          //   return new Promise(function(resolve, reject) {});
        });
        //return new Promise(function(resolve, reject) {});
    },
    /**
     * json 转 Excel
     * @param list json
     * @param fileName excel 表名
     * @param bookType boolean true:xlsx false xls
     * @param tHeader 表头             1.  ['gps设备号', '所属机构名称']
     * @param filterVal 内容对应字段       ['code', 'belongOrgName']
     2.  ['gps设备号', '车辆.所属机构名称']
     ['code', 'vehicle.belongOrgName']
     3   ['gps设备号', '车辆.车辆性质']
     ['code', {type:'dictionary','code':'VEHICLE_TYPE','name':'vehicle.vehicleType'}]
     4   ['gps设备号', '车辆.车辆性质']
     ['code',
     {
             type: 'function',
             render: function (val) {
                 return val.code
             }
        },
     ]
     */
    downloadExl(jsonData, header, filterVal, fileName, bookType) {
        if (jsonData) {
            let _this = this;
            //删除 其他元素
            let data = jsonData.map(v =>
                filterVal.map(j => {
                    if (typeof j === 'object') {
                        if (j.type === 'dictionary') {
                            //转化数据字典
                            return Common.dictionary.getName(j.code, _.get(v, j.name))
                        } else if (j.type === 'function') {
                            return j.render(v);
                        }
                    } else if (typeof j === 'string') {
                        let a = _.get(v, j);
                        // if (isNaN(a) && !isNaN(Date.parse(a))) {
                        //     a = Common.date.dateFormat(a, "YYYY-MM-DD HH:mm:ss ")
                        // }
                        if(a){
                            return String(a) ;
                        }else{
                            return a;
                        }
                    }
                })
            );
            //设置表头
            data.unshift(header);
            const wopts = {bookType: bookType || false ? 'xlsx' : 'biff8', bookSST: false, type: 'binary'};
            const wb = {SheetNames: ['Sheet1'], Sheets: {}, Props: {}};
            wb.Sheets['Sheet1'] = _this.sheet_from_array_of_arrays(data);//通过json_to_sheet转成单页(Sheet)数据
            _this.saveAs(new Blob([_this.s2ab(XLSX.write(wb, wopts))], {type: "application/octet-stream"}), (Common.date.dateFormat(new Date(),'YYYY-MM-DD')+ fileName || "列表") + '.' + (wopts.bookType == "biff8" ? "xls" : wopts.bookType));
        }
    },
    s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        } else {
            let buf = new Array(s.length);
            for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    },
    //如果使用 FileSaver.js 就不要同时使用以下函数
    saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式
        let tmpa = document.createElement("a");
        tmpa.download = fileName || "下载";
        tmpa.href = URL.createObjectURL(obj); //绑定a标签
        tmpa.click(); //模拟点击实现下载
        setTimeout(function () { //延时释放
            URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);
    },
    sheet_from_array_of_arrays(data, opts) {
        let _this = this
        let ws = {};
        let range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
        for (let R = 0; R != data.length; ++R) {
            for (let C = 0; C != data[R].length; ++C) {
                if (range.s.r > R) range.s.r = R;
                if (range.s.c > C) range.s.c = C;
                if (range.e.r < R) range.e.r = R;
                if (range.e.c < C) range.e.c = C;
                let cell = {v: data[R][C]};
                if (cell.v == null) continue;
                let cell_ref = XLSX.utils.encode_cell({c: C, r: R});

                if (typeof cell.v === 'number') cell.t = 'n';
                else if (typeof cell.v === 'boolean') cell.t = 'b';
                else if (cell.v instanceof Date) {
                    cell.t = 'n';
                    cell.z = XLSX.SSF._table[14];
                    cell.v = _this.datenum(cell.v);
                }
                else cell.t = 's';

                ws[cell_ref] = cell;
            }
        }
        if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    },
    datenum(v, date1904) {
        if (date1904) v += 1462;
        let epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }
};

// 回单相关函数
const bill = {
    /**
     * 查询是否支持查询回单
     * @param code 顾客topcode
     * @returns {boolean}
    */
    canSearch(code){
        const LIST = ["C00000001"] // 可查询topCode
        return LIST.includes(code);
    },
    /**
     * 查询是否支持查询回单
     * @param code 回单code
     * @param wayBillCode 运单号code
     * @returns {Array}
    */
    searchBill(code,wayBillCode){
        return new Promise((resolve,reject) => {
            Http.get(Api.receiptAddress.queryAllBill,{params:{receiptCodes:code,waybillCode:wayBillCode}},res => {
                resolve(util.clean(res.result))
              },() => reject());
        })

    }
}

export const Common = {
    token,
    userId,
    changePWflag,
    dictionary,
    date,
    util,
    excel,
    bill,
    templateDownload
};


export default Common
