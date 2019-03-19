<template>
    <div class="app">
        <el-container class="custom-el-container">
            <el-header>
                <el-button @click="openFile">打开文件</el-button>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <template v-for="(v, i) in package.scripts">
                        <el-card :body-style="{ padding: '0px' }">
                            <img src="" class="image">
                            <div style="padding: 14px;">
                                <span>{{i}}</span>
                                <div class="bottom clearfix">
                                    <time class="time">{{ v }}</time>
                                </div>
                            </div>
                        </el-card>
                    </template>
                </el-aside>
                <el-main>
                    <el-button @click="shell">TEST</el-button>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron';
    import loadJsonFile from 'load-json-file';
    import {Terminal} from 'xterm';
    import util from 'util';
    import {exec} from 'child_process';
    const pExec = util.promisify(exec);
    const decoder = new util.TextDecoder('gbk');

    export default {
        name: 'App',
        data() {
            return {
                path: '',
                package: {},
            }
        },
        methods: {
            openFile() {
                ipcRenderer.send('open-file-dialog');
            },
            shell() {
                async function lsExample() {
                    let {stdout, stderr} = await pExec('dir', {encoding: 'buffer'});
                    stdout = decoder.decode(stdout);
                    stderr = decoder.decode(stderr);
                    console.log('stdout:', stdout);
                    console.log('stderr:', stderr);
                }

                lsExample();
            }
        },
        created() {
            ipcRenderer.on('selected-dir', (event, path) => {
                console.log('path--', path);
                loadJsonFile(path + '\\package.json').then(json => {
                    this.package = json;
                }, (e) => {
                    this.$message({
                        showClose: true,
                        message: '路径不正确，需要包含package.json文件',
                        type: 'error',
                        // duration: 0
                    });
                });
            });
        }
    }
</script>

<style lang="scss">
    @import "assets/global";

    .app {
        width: 100%;
        height: 100%;
    }

    .custom-el-container {
        width: 100%;
        height: 100%;
    }
</style>
