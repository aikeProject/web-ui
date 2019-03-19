/**
 * @author 成雨
 * @date 2019/3/19 0019$
 * @Description:
 */

import util from 'util';
import {spawn} from 'child_process';

const decoder = new util.TextDecoder('gbk');

class test {

}

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
            data = data.replace('\n', '\n\r');
            data = data + '\n\n\r';
            this.resultCallback && this.resultCallback(data);
        });

        this.result.stderr.on('data', (data) => {
            data = decoder.decode(data);
            this.errorCallback && this.errorCallback(data);
        });

        this.result.on('close', (code) => {
            console.log(`exit子进程退出码：${code}`);
        });

        this.result.on('exit', (code) => {
            console.log(`exit子进程退出码：${code}`);
        });
    }

    close() {
        console.log('kill  SIGHUP');
        console.log(this.result)
        process.kill(-this.result.pid);
        // let a = this.result.kill();
        // console.log(a)
    }
}

export default (cmd, resultCallback, errorCallback) => {
    return new spawnRun(cmd, resultCallback, errorCallback);
}

