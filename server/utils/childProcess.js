/**
 * @author 成雨
 * @date 2019/4/16 0016$
 * @Description:
 */

import util from 'util';
import {spawn, execFile} from 'child_process';

const decoder = new util.TextDecoder('gbk');

const childProcessSpawn = {
    id: 0,
    result: null,
    run(options) {
        options = Object.assign({}, {shell: true}, options);
        this.result = spawn(options.cmd, options);
        this.id++;
        return this;
    },
    resultCallback(callback) {
        this.result.stdout.on('data', (data) => {
            console.log('childProcessSpawn id--'.this.id);
            data = decoder.decode(data);
            data = data.trim();
            callback && callback(data);
        });
        return this;
    },
    errorCallback(callback) {
        this.result.stderr.on('data', (data) => {
            data = decoder.decode(data);
            console.log('err--', data);
            callback && callback(data);
        });
        return this;
    },
    closeCallback(callback) {
        this.result.on('close', () => {
            callback && callback();
        });
        return this;
    },
    exitCallback(callback) {
        this.result.on('exit', () => {
            callback && callback();
        });
        return this;
    }
};

module.exports = childProcessSpawn;