/**
 * @author 成雨
 * @date 2019/3/19 0019$
 * @Description:
 */

import util from 'util';
import {exec, spawn} from 'child_process';

const pExec = util.promisify(exec);
const decoder = new util.TextDecoder('gbk');

export default {
    exec: {
        async run(cmd) {
            let {stdout, stderr} = await pExec(cmd, {encoding: 'buffer'});
            if (stdout) {
                stdout = decoder.decode(stdout);
                Promise.resolve(stdout);
            }

            if (stderr) {
                stderr = decoder.decode(stderr);
                Promise.reject(stderr);
            }
        }
    },
    spawn: {
        init(cmd, resultCallback, errorCallback) {
            const result = spawn(cmd, {
                shell: true,
            });

            result.stdout.on('data', (data) => {
                data = decoder.decode(data);
                data = data.trim();
                data = data.replace('\n', '\n\r');
                data = data + '\n\n\r';
                resultCallback && resultCallback(data);
            });

            result.stderr.on('data', (data) => {
                data = decoder.decode(data);
                errorCallback && errorCallback(data);
            });

            result.on('close', (code) => {
                console.log(`子进程退出码：${code}`);
            });

            this.close = function () {
                result.emit();
            }
        },
        run(cmd, resultCallback, errorCallback) {
            return new this.init(cmd, resultCallback, errorCallback);
        }
    }
};