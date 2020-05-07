import {Http} from 'src/global/http';
import {Api} from 'src/global/api';

const state = {
    district: null
}

const getters = {
    district: state => state.district
};

const actions = {
    getDistrictFromServer({ dispatch, commit, state }){
        return new Promise((resolve, reject) => {
            Http.get(Api.district.commonOption, {} , result =>{
                let district = result.result;
                commit('setDistrict', district);
                resolve();
            },result => {
                reject(result);
            });
        });
    }
}

const mutations = {
    //用户信息
    setDistrict (state, district){
        state.district = district;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
