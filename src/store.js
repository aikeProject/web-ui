/**
 * @author 成雨
 * @date 2019/3/22 0022$
 * @Description:
 */

import Vue from 'vue';
import Vuex from 'vuex';
import {clone} from 'underscore';

Vue.use(Vuex);

const CMD = JSON.parse(sessionStorage.getItem('CMD')) || [{
    id: '',
    path: '',
    con: '',
    status: 0,
    pid: '',
    cmd: '',
    cmdValue: ''
}];

const types = {
    SET_CMD: 'SET_CMD',
    SET_CMD_ID: 'SET_CMD_ID'
};

const state = {
    cmd: CMD
};

const getters = {
    cmd: state => state.cmd,
    getCmdId: (state) => (id) => {
        return state.cmd[id];
    }
};

const mutations = {
    [types.SET_CMD](state, cmd) {
        if (cmd) state.cmd = cmd;
        sessionStorage.setItem('CMD', JSON.stringify(cmd));
    },
    [types.SET_CMD_ID](state, data) {
        let cloneCmd = clone(state.cmd);
        cloneCmd[data.id] = Object.assign({}, cloneCmd[data.id], data.data);
        state.cmd = cloneCmd;
        sessionStorage.setItem('CMD', JSON.stringify(cloneCmd));
    }
};

const actions = {
    setCmd: ({commit}, cmd) => {
        commit(types.SET_CMD, cmd);
    },
    setCmdId: ({commit}, data) => {
        commit(types.SET_CMD_ID, data);
    }
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
