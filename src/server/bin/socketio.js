/**
 * @author 成雨
 * @date 2019/4/16 0016$
 * @Description:
 */

const socket_io = require('socket.io');
const _ = require('underscore');
const childProcessSpawn = require('../utils/childProcess');
// 存储所有进程
const childProcessSpawnObj = {};
// 存储scripts命令
let scripts = {};
let scriptsEmit = [];
const socketIo = {
    setSocketIo(server) {
        let io = socket_io.listen(server);
        io.sockets.on('connection', (socket) => {
            console.log('连接成功....');

            // 监听客户端消息
            socket.on('test', (data) => {
                console.info('test-data--', data);
            });
            socket.emit('kk', 'kkkkk');

            // scripts命令
            socket.on('scripts', (data) => {
                if (data) {
                    scripts = data;
                    const list = [];
                    let i = 0;
                    _.each(data, (item, key) => {
                        list.push({
                            id: i,
                            path: path[0],
                            con: '',
                            status: 0,
                            pid: '',
                            cmd: `npm run ${key}`,
                            cmdValue: item
                        });
                        i++;
                    });
                    scriptsEmit = list;
                    socket.emit('scripts', list);
                }
            });

            // 监听发送过来需要执行的命令
            socket.on('run', (data) => {
                if (data) {
                    const {cmd, path, id} = data;
                    // 创建一个新的进程
                    let result = childProcessSpawn.run({
                        cmd: cmd,
                        cwd: path
                    });
                    childProcessSpawnObj[result.pid] = result;
                }
            });

            // 通过 pid 查询进程
            socket.on('queryPid', (data) => {
                if (data) {
                    const {pid} = data;
                    if (pid) {
                        const pidRun = childProcessSpawnObj[pid];
                        pidRun.successCallback(function (data) {
                            console.log('success data --', data);
                            socket.emit('queryPidData', {
                                success: true,
                                data: data
                            });
                        });
                    }
                }
            });
        });
    }
};

module.exports = socketIo;
