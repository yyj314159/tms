import axios from 'axios';
import {Loading, Message} from 'element-ui';

export const Http = {
    /**
     * get请求
     * @param url
     * @param param
     * @param successFunction
     * @param errorFunction
     * @param isLoading
     */
    get: function (url, param = {}, successFunction, errorFunction, isLoading = false) {
        if (isLoading) {
            var loadingInstance = Loading.service({text: "拼命加载中"});
        }
        axios.get(url, param).then(response => {
            if (isLoading) {
                loadingInstance.close();
            }
            var result = response.data;
            if (result.success) {
                successFunction(result);
            } else {
                if (result.businessException) {
                    Message({
                        showClose: true,
                        message: result.message,
                        type: 'error'
                    });
                } else {
                    Message({
                        showClose: true,
                        message: '系统异常',
                        type: 'error'
                    });
                }
                if (errorFunction != null) {
                    errorFunction(result);
                }
            }
        }).catch(reason => {
            console.error(reason);
            Message.error(reason.toString());

        })
    },
    /**
     * post请求
     * @param url
     * @param param
     * @param successFunction
     * @param errorFunction
     * @param isLoading
     */
    post: function (url, param, successFunction, errorFunction, isLoading = false) {
        if (isLoading) {
            var loadingInstance = Loading.service({text: "拼命加载中"});
        }
        axios.post(url, param).then(response => {
            if (isLoading) {
                loadingInstance.close();
            }
            var result = response.data;
            if (result.success) {
                successFunction(result);
            } else {
                if (result.businessException) {
                    Message({
                        showClose: true,
                        message: result.message,
                        type: 'error'
                    });
                } else {
                    console.log(response);
                    Message({
                        showClose: true,
                        message: '系统异常',
                        type: 'error'
                    });
                }
                if (errorFunction != null) {
                    errorFunction(result);
                }
            }
        }).catch(reason => {
            console.error(reason);
            Message.error(reason.toString())
        })
    }
}

export default Http
