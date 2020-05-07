import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import district from './modules/district';
import tagsView from './modules/tagsView';


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app,
        user,
        district,
        tagsView
    }
})
