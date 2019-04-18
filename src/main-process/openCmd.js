/**
 * @author 成雨
 * @date 2019/4/16 0016$
 * @Description:
 */

import {ipcMain} from 'electron';
import {each} from 'underscore';
import childProcessSpawn from '../utils/childProcess';
import {dbJSON} from '../db';
import {closeChildProcess} from '../utils/util';

// 存储所有进程
const childProcessSpawnObj = {};

// test
ipcMain.on('test', (event, data) => {
    const result = dbJSON.get('scriptsList').find({id: 3}).value();
    console.log('find--id', result);
});

// scripts命令
ipcMain.on('scripts', (event, data) => {
    if (data) {
        const {path, scripts} = data;
        const list = [];
        let i = 0;
        each(scripts, (item, key) => {
            list.push({
                id: i,
                path: path,
                status: 0,
                pid: '',
                cmd: `npm run ${key}`,
                cmdValue: item,
                key: key,
            });
            i++;
        });
        dbJSON.set('scripts', scripts).write();
        dbJSON.set('scriptsList', list).write();
        event.sender.send('scripts', scripts);
        event.sender.send('scriptsList', list);
    } else {
        event.sender.send('scripts', dbJSON.get('scripts').value());
    }
});

// scriptsList
ipcMain.on('scriptsList', (event) => {
    event.sender.send('scriptsList', dbJSON.get('scriptsList').value());
});

// 监听发送过来需要执行的命令
ipcMain.on('runScripts', (event, data) => {
    if (data) {
        const {cmd, path, id} = data;
        console.log('id', id);
        // 创建一个新的进程
        let child = new childProcessSpawn().run({
            cmd: cmd,
            cwd: path
        });
        if (child) {
            childProcessSpawnObj[child.result.pid] = child;
            dbJSON.set(`pidValue.${child.result.pid}`, []).write();
            /* status 1 运行中 2 结束*/
            dbJSON.get('scriptsList').find({id: id}).assign({pid: child.result.pid, status: 1}).write();
        }
    }
    event.sender.send('getRunScripts', childProcessSpawnObj);
    event.sender.send('scriptsList', dbJSON.get('scriptsList').value());
});

// 已经在运行的进程
ipcMain.on('runScriptsPid', (event, data) => {
    console.log('runScriptsPid data', data);
    event.sender.send('getRunScripts', childProcessSpawnObj);
    if (data) {
        const {pid} = data;
        if (pid) {
            const child = childProcessSpawnObj[pid];
            if (child) {
                child.resultCallback((data) => {
                    console.log('child-data-runScriptsPid', {
                        data: data,
                        pid: pid
                    });
                    event.sender.send('childData', {
                        data: data,
                        pid: pid
                    });
                    dbJSON.get(`pidValue.${pid}`).push(data).write();
                });
                child.errorCallback((data) => {
                    event.sender.send('childData', {
                        data: data,
                        pid: pid
                    });
                    dbJSON.get(`pidValue.${pid}`).push(data).write();
                });
                child.closeCallback(() => {
                    // 结束进程
                    dbJSON.get('scriptsList').find({pid: pid}).assign({status: 2}).write();
                    event.sender.send('scriptsList', dbJSON.get('scriptsList').value());
                    event.sender.send('getRunScripts', childProcessSpawnObj);
                    event.sender.send('childData', '\n\n----exit---');
                });
            }

            event.sender.send('oneChild', child);
        }
    }
});

// 获取命令行内容
ipcMain.on('pidValue', (event, {pid}) => {
    if (pid) {
        let result = dbJSON.get(`pidValue.${pid}`).value();
        result = (result || []).join('');
        event.sender.send('prePidValue', {
            data: result,
            pid: pid
        });
    }
});

// 关闭当前运行的命令行
ipcMain.on('close', (event, data) => {
    if (data) {
        const {pid} = data;
        // 结束node进程
        closeChildProcess(pid);
    }
});

// 通过 pid 查询进程
ipcMain.on('queryPid', (event, data) => {
    if (data) {
        const {pid} = data;
        if (pid) {
            const pidRun = childProcessSpawnObj[pid];
            pidRun.successCallback(function (data) {
                console.log('success data --', data);
                event.sender.send('queryPidData', {
                    success: true,
                    data: data
                });
            });
        }
    }
});

