/**
 * 判断经停是否准点
 * @param stopOverStationList
 * @param stationIndex
 * @param arrivalTime
 * @returns {boolean}
 */
function isOnTimeOfStopOverStation(stopOverStationList, stationIndex, waybillDepartureTime, arrivalTime) {
    let transportTime = getStopOverStationTransportTime(stopOverStationList, stationIndex, waybillDepartureTime, arrivalTime);
    if (transportTime === 0) {
        return true;
    }
    let zeYiMills = getMillsByHourAndMin(stopOverStationList[stationIndex - 1].travelTimeZeyiHour, stopOverStationList[stationIndex - 1].travelTimeZeyiMin);
    if (zeYiMills >= transportTime) {
        return true;
    }
    return false;
}

/**
 * 获取经停站点超时时间
 * @param stopOverStationList
 * @param stationIndex
 * @param arrivalTime
 * @returns {string}
 */
function getOverTimeOfStopOverStation(stopOverStationList, stationIndex, waybillDepartureTime, arrivalTime) {
    let transportTime = getStopOverStationTransportTime(stopOverStationList, stationIndex, waybillDepartureTime, arrivalTime);
    let zeYiTime = getMillsByHourAndMin(stopOverStationList[stationIndex - 1].travelTimeZeyiHour, stopOverStationList[stationIndex - 1].travelTimeZeyiMin)
    return millsToHuoMinStr(getDiffMills(zeYiTime, transportTime));
}

/**
 * 计算经停站点运输时效
 * @param stopOverStationList
 * @param stationIndex
 * @param arrivalTime
 * @returns {number}
 */
function getStopOverStationTransportTime(stopOverStationList, stationIndex, waybillDepartureTime, arrivalTime) {
    let departureTime = 0;
    if (stationIndex - 1 - 1 == 0) {
        departureTime = waybillDepartureTime;
    } else {
        let lastStation = stopOverStationList[stationIndex - 1 - 1];
        if (!lastStation) {
            return 0;
        }
        departureTime = lastStation.confirmDepartureTime ? lastStation.confirmDepartureTime : lastStation.actualDepartureTime;
    }
    return getDiffMills(departureTime, arrivalTime);
}

/**
 * 判断到达是否准时
 * @param stopOverStationList 站点列表
 * @param expectArrivalTime   预计到达时间
 * @param departureTime       发车时间
 * @param arrivalTime         到达时间
 * @param zeYiHourTime        则一时效小时
 * @param zeYiMinTime         则一时效分钟
 * @param evaluationMode      线路考核方式
 * @returns {boolean}
 */
function isOnTime(stopOverStationList, expectArrivalTime, departureTime, arrivalTime, zeYiHourTime, zeYiMinTime, evaluationMode) {
    if (evaluationMode === 'ARRIVE_TIME') {    //到达时间
        return getDiffMills(arrivalTime, expectArrivalTime) >= 0;
    }
    if (evaluationMode === 'OPER_TIME') {  //运行时间
        let transportTime = getDiffMills(departureTime, arrivalTime);
        let zeYiTime = getMillsByHourAndMin(zeYiHourTime, zeYiMinTime);
        return zeYiTime >= transportTime;
    }
    if (evaluationMode === 'RUN_TIME') {
        if (stopOverStationList.length > 2) {
            return getRunTimeOverTime(stopOverStationList, departureTime, arrivalTime) <= 0
        } else {
            let transportTime = getDiffMills(departureTime, arrivalTime);
            let zeYiTime = getMillsByHourAndMin(zeYiHourTime, zeYiMinTime);
            return zeYiTime >= transportTime;
        }
    }
    if (evaluationMode === 'EXECUTION_TIME') {
        if (stopOverStationList.length > 2) {
            return getExecutionOverTime(stopOverStationList, departureTime, arrivalTime) <= 0
        } else {
            let transportTime = getDiffMills(departureTime, arrivalTime);
            let zeYiTime = getMillsByHourAndMin(zeYiHourTime, zeYiMinTime);
            return zeYiTime >= transportTime;
        }
    }
}

/**
 * 计算超时时间
 * @param stopOverStationList
 * @param expectArrivalTime
 * @param departureTime
 * @param arrivalTime
 * @param zeYiHourTime
 * @param zeYiMinTime
 * @param evaluationMode
 * @returns {string}
 */
function getOverTimeStr(stopOverStationList, expectArrivalTime, departureTime, arrivalTime, zeYiHourTime, zeYiMinTime, evaluationMode) {
    return millsToHuoMinStr(getOverTime(stopOverStationList, expectArrivalTime, departureTime, arrivalTime, zeYiHourTime, zeYiMinTime, evaluationMode));
}

/**
 * 获取超时时间
 * @param stopOverStationList
 * @param expectArrivalTime
 * @param departureTime
 * @param arrivalTime
 * @param zeYiHourTime
 * @param zeYiMinTime
 * @param evaluationMode
 * @returns {number}
 */
function getOverTime(stopOverStationList, expectArrivalTime, departureTime, arrivalTime, zeYiHourTime, zeYiMinTime, evaluationMode) {
    if (!stopOverStationList) {
        return -1;
    }
    if (evaluationMode === 'ARRIVE_TIME') {    //到达时间
        return getDiffMills(expectArrivalTime, arrivalTime);
    }
    if (evaluationMode === 'OPER_TIME') {  //运行时间
        let transportTime = getDiffMills(departureTime, arrivalTime);
        let zeYiTime = getMillsByHourAndMin(zeYiHourTime, zeYiMinTime);
        return transportTime - zeYiTime;
    }
    if (evaluationMode === 'RUN_TIME') {
        if (stopOverStationList.length > 2) {
            return getRunTimeOverTime(stopOverStationList, departureTime, arrivalTime);
        } else {
            let transportTime = getDiffMills(departureTime, arrivalTime);
            let zeYiTime = getMillsByHourAndMin(zeYiHourTime, zeYiMinTime);
            return transportTime - zeYiTime;
        }
    }
    if (evaluationMode === 'EXECUTION_TIME') {
        if (stopOverStationList.length > 2) {
            return getExecutionOverTime(stopOverStationList, departureTime, arrivalTime);
        } else {
            let transportTime = getDiffMills(departureTime, arrivalTime);
            let zeYiTime = getMillsByHourAndMin(zeYiHourTime, zeYiMinTime);
            return transportTime - zeYiTime;
        }
    }
}

/**
 * 计算行驶超时时间
 * @param stopOverStationList
 * @param departureTime
 * @param arrivalTime
 * @returns {number}
 */
function getRunTimeOverTime(stopOverStationList, departureTime, arrivalTime) {
    let stationsLength = stopOverStationList.length;
    let totalOverTime;
    let firstStationArrivalTime = stopOverStationList[1].confirmArrivalTime ? stopOverStationList[1].confirmArrivalTime : stopOverStationList[1].actualArrivalTime;
    let firstStationOverTime = getDiffMills(departureTime, firstStationArrivalTime) - getMillsByHourAndMin(stopOverStationList[1].travelTimeZeyiHour, stopOverStationList[1].travelTimeZeyiMin);
    totalOverTime = firstStationOverTime > 0 ? firstStationOverTime : 0;
    for (let i = 2; i < stationsLength - 1; i++) {
        let thisStationArrivalTime = stopOverStationList[i].confirmArrivalTime ? stopOverStationList[i].confirmArrivalTime : stopOverStationList[i].actualArrivalTime;
        let lastStationDepartureTime = stopOverStationList[i - 1].confirmDepartureTime ? stopOverStationList[i - 1].confirmDepartureTime : stopOverStationList[i - 1].actualDepartureTime;
        let thisStationOverTime = getDiffMills(lastStationDepartureTime, thisStationArrivalTime) - getMillsByHourAndMin(stopOverStationList[i].travelTimeZeyiHour, stopOverStationList[i].travelTimeZeyiMin);
        totalOverTime = totalOverTime + (thisStationOverTime > 0 ? thisStationOverTime : 0);
    }
    let lastButOneStationDepartureTime = stopOverStationList[stationsLength - 2].confirmDepartureTime ? stopOverStationList[stationsLength - 2].confirmDepartureTime : stopOverStationList[stationsLength - 2].actualDepartureTime;
    let lastStationOverTime = getDiffMills(lastButOneStationDepartureTime, arrivalTime) - getMillsByHourAndMin(stopOverStationList[stationsLength - 1].travelTimeZeyiHour, stopOverStationList[stationsLength - 1].travelTimeZeyiMin);
    totalOverTime = totalOverTime + (lastStationOverTime > 0 ? lastStationOverTime : 0);
    return totalOverTime;
}

/**
 * 计算执行超时时间
 * @param stopOverStationList
 * @param departureTime
 * @param arrivalTime
 * @returns {number}
 */
function getExecutionOverTime(stopOverStationList, departureTime, arrivalTime) {
    let stationsLength = stopOverStationList.length;
    let totalOverTime;
    let firstStationArrivalTime = stopOverStationList[1].confirmArrivalTime ? stopOverStationList[1].confirmArrivalTime : stopOverStationList[1].actualArrivalTime;
    let firstStationOverTime = getDiffMills(departureTime, firstStationArrivalTime) - getMillsByHourAndMin(stopOverStationList[1].travelTimeZeyiHour, stopOverStationList[1].travelTimeZeyiMin);
    totalOverTime = firstStationOverTime;
    for (let i = 2; i < stationsLength - 1; i++) {
        let thisStationArrivalTime = stopOverStationList[i].confirmArrivalTime ? stopOverStationList[i].confirmArrivalTime : stopOverStationList[i].actualArrivalTime;
        let lastStationDepartureTime = stopOverStationList[i - 1].confirmDepartureTime ? stopOverStationList[i - 1].confirmDepartureTime : stopOverStationList[i - 1].actualDepartureTime;
        let thisStationOverTime = getDiffMills(lastStationDepartureTime, thisStationArrivalTime) - getMillsByHourAndMin(stopOverStationList[i].travelTimeZeyiHour, stopOverStationList[i].travelTimeZeyiMin);
        totalOverTime = totalOverTime + thisStationOverTime;
    }
    let lastButOneStationDepartureTime = stopOverStationList[stationsLength - 2].confirmDepartureTime ? stopOverStationList[stationsLength - 2].confirmDepartureTime : stopOverStationList[stationsLength - 2].actualDepartureTime;
    let lastStationOverTime = getDiffMills(lastButOneStationDepartureTime, arrivalTime) - getMillsByHourAndMin(stopOverStationList[stationsLength - 1].travelTimeZeyiHour, stopOverStationList[stationsLength - 1].travelTimeZeyiMin);
    totalOverTime = totalOverTime + lastStationOverTime;
    return totalOverTime;
}

/**
 * 根据小时和分钟计算毫秒值
 * @param hour
 * @param min
 * @returns {number}
 */
function getMillsByHourAndMin(hour, min) {
    let mills = 0;
    if (hour) {
        mills += hour * 60 * 60 * 1000;
    }
    if (min) {
        mills += min * 60 * 1000;
    }
    return mills;
}

/**
 * 计算时间差
 * @param start
 * @param end
 * @returns {number} 毫秒值
 */
function getDiffMills(start, end) {
    if (!start || !end) {
        return 0;
    }
    return new Date(end).getTime() - new Date(start).getTime()
}

/**
 * 毫秒转时间字符串
 * @param mills
 * @returns {string}
 */
function millsToHuoMinStr(mills) {
    if (mills <= 0) {
        return "";
    }
    let hour = Math.floor(mills / (1000 * 60 * 60));
    let min = Math.floor((mills) / 1000 / 60 - hour * 60);
    return hour + "小时" + min + "分钟";
}

export default {
    isOnTime,
    getOverTimeStr,
    isOnTimeOfStopOverStation,
    getOverTimeOfStopOverStation
}
