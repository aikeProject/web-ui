/**
 * @author 成雨
 * @date 2019/4/15 0015$
 * @Description:
 */

import Vue from 'vue';
import Router from 'vue-router';

import Main from './view/Main';

Vue.use(Router);

const router = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/main/0',
        },
        {
            path: '/main/:id',
            name: 'main',
            component: Main,
        },
    ]
});

export default router;