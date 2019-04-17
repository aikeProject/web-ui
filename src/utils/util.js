/**
 * @author 成雨
 * @date 2019/3/19 0019$
 * @Description:
 */

import {execFile} from 'child_process';

export const closeChildProcess = (pid) => {
    console.log('closeChildProcess--', pid);
    if (pid) {
        execFile('taskkill', ['/T', '/F', '/PID', pid.toString()]);
        console.log('taskkill 结束', pid);
    }
};