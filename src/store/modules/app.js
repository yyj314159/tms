const state = {
    env: null
}

const getters = {
    //当前环境
    env: state => state.env
};

const actions = {
    setEnvAction ({ dispatch, commit, state }, env){
        commit('setEnv', env);
    }
}

const mutations = {
    //用户信息
    setEnv (state, env){
        state.env = env;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
