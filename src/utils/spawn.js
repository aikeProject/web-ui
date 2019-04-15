/**
 * @author 成雨
 * @date 2019/3/19 0019$
 * @Description:
 */

import util from 'util';
import {spawn, execFile} from 'child_process';

const decoder = new util.TextDecoder('gbk');


class spawnRun {
    constructor(options, resultCallback, errorCallback) {
        this.options = options;
        this.resultCallback = resultCallback;
        this.errorCallback = errorCallback;
        this.result = null;
    }

    run() {
        const options = Object.assign({}, {shell: true}, this.options);
        this.result = spawn(this.options.cmd, options);

        this.result.stdout.on('data', (data) => {
            data = decoder.decode(data);
            data = data.trim();
            // data = data.replace('\n', '\n\r');
            // data = data + '\n\n\r';
            this.resultCallback && this.resultCallback(data);
        });

        this.result.stderr.on('data', (data) => {
            // data = decoder.decode(data);
            // console.log('err');
            // this.errorCallback && this.errorCallback(data);
        });

        this.result.on('close', (code) => {
            this.resultCallback && this.resultCallback('\n\n\n---------exit--------');
            this.errorCallback && this.errorCallback();
        });

        this.result.on('exit', (code) => {
            this.errorCallback && this.errorCallback();
            // this.resultCallback && this.resultCallback('---------exit--------');
        });
    }
}

export const closeChildProcess = (pid) => {
    console.log('child_process--', pid);
    if (this.result) {
        execFile('taskkill', ['/T', '/F', '/PID', pid.toString()]);
    }
};

export default (options, resultCallback, errorCallback) => {
    return new spawnRun(options, resultCallback, errorCallback);
}

