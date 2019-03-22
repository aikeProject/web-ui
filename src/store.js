/**
 * @author 成雨
 * @date 2019/3/22 0022$
 * @Description:
 */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const types = {
    SET_CMD: 'SET_CMD'
};

const state = {
    cmd: {
        id: '',
        path: '',
        con: '',
    }
};

const getters = {
    cmd: state => state.cmd,
};

const mutations = {
    [types.SET_CMD](state, cmd) {
        if (cmd) state.cmd = Object.assign({}, state.cmd, cmd);
    }
};

const actions = {
    setCmd: ({commit}, cmd) => {
        commit(types.SET_CMD, cmd);
    }
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
