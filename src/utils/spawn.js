/**
 * @author 成雨
 * @date 2019/3/19 0019$
 * @Description:
 */

import util from 'util';
import {spawn, execFile} from 'child_process';

const decoder = new util.TextDecoder('gbk');


class spawnRun {
    constructor(cmd, resultCallback, errorCallback) {
        this.cmd = cmd;
        this.resultCallback = resultCallback;
        this.errorCallback = errorCallback;
        this.result = null;
    }

    run() {
        this.result = spawn(this.cmd, {
            shell: true,
        });

        this.result.stdout.on('data', (data) => {
            data = decoder.decode(data);
            data = data.trim();
            // data = data.replace('\n', '\n\r');
            // data = data + '\n\n\r';
            this.resultCallback && this.resultCallback(data);
        });

        this.result.stderr.on('data', (data) => {
            data = decoder.decode(data);
            this.errorCallback && this.errorCallback(data);
        });

        this.result.on('close', (code) => {
            this.resultCallback && this.resultCallback('\n\n\n---------exit--------');
        });

        this.result.on('exit', (code) => {
            // this.resultCallback && this.resultCallback('---------exit--------');
        });

        return this.result;
    }

    close() {
        console.log('child_process--', this.result.pid);
        execFile('taskkill', ['/T', '/F', '/PID', this.result.pid.toString()]);
    }
}

export default (cmd, resultCallback, errorCallback) => {
    return new spawnRun(cmd, resultCallback, errorCallback);
}

