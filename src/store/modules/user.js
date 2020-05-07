import {Http} from 'src/global/http';
import {Api} from 'src/global/api';
import common from 'src/global/common';
const state = {
    currentUser: null
}

const getters = {
    //当前用户
    user: state => state.currentUser,
    //当前组织
    org: state => state.currentUser.org,
    //当前拥有的权限
    permission: state => state.currentUser.permissionUrls,
    //当前用户组织
    orgList: state => state.currentUser.orgList
};

const actions = {
    getCurrentUserFromServer({ dispatch, commit, state }){
        return new Promise((resolve, reject) => {
            Http.get(Api.current.user, {} , result =>{
                let user = result.result || {};
                common.userId.setUserId(user.id);//cookie里面设置userId信息用于校验实际用户
                commit('setCurrentUser', user);
                resolve();
            },result => {
                reject(result);
            });
        });
    }
}

const mutations = {
    //用户信息
    setCurrentUser (state, user){
        state.currentUser = user;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
