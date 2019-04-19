/**
 * @author 成雨
 * @date 2019/4/15 0015$
 * @Description:
 */

import Vue from 'vue';
import Router from 'vue-router';

import Main from './view/Main';
import OpenFile from './view/OpenFile';

Vue.use(Router);

const router = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/openFile',
        },
        {
            path: '/openFile',
            name: 'openFile',
            component: OpenFile
        },
        {
            path: '/main/:id',
            name: 'main',
            component: Main,
        },
    ]
});

export default router;