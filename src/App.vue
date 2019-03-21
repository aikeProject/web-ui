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
                    <div class="app-main">
                        <div>
                            <el-button @click="spawn">spawn</el-button>
                            <el-button @click="close">close</el-button>
                        </div>
                        <div class="terminal-view-wrapper">
                            <terminalView ref="terminal" :cols="100" :rows="24"
                                          auto-size
                                          :options="{scrollback: 5000,disableStdin: true,useFlowControl: true}"></terminalView>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron';
    import loadJsonFile from 'load-json-file';
    import terminalView from './view/Terminal.vue';
    import spawnRun from './utils/spawn.js';

    export default {
        name: 'App',
        data() {
            return {
                path: '',
                package: {},
                run: null,
            }
        },
        components: {
            terminalView
        },
        methods: {
            openFile() {
                ipcRenderer.send('open-file-dialog');
            },
            spawn() {
                this.run = spawnRun('npm run make', (data) => {
                    this.result({
                        text: data,
                        type: 'stdout'
                    });
                });
                this.run.run();
            },
            close() {
                this.run.close();
            },
            async result(data) {
                await this.$nextTick();
                const terminal = this.$refs.terminal;
                if (terminal) {
                    terminal.addLog(data);
                }
            },
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
        },
        mounted() {
        }
    }
</script>

<style lang="scss">
    @import "assets/global";

    .app {
        width: 100%;
        height: 100%;
    }

    .app-main {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        height: 100%;
    }

    .custom-el-container {
        width: 100%;
        height: 100%;
    }

    .terminal-view-wrapper {
        flex: auto 1 1;
        height: 0;
        position: relative;
    }
</style>
