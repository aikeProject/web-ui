<template>
    <div class="app">
        <el-container class="custom-el-container">
            <el-header class="cu-el-header">
                <el-button @click="openFile">打开文件</el-button>
            </el-header>
            <el-container>
                <el-aside width="220px" class="cu-el-aside">
                    <cu-aside :scripts="package.scripts"></cu-aside>
                </el-aside>
                <el-main>
                    <div class="app-main">
                        <div class="app-run">
                            <el-button v-if="!cmd.id" @click="spawn" icon="el-icon-caret-right" circle></el-button>
                            <el-button v-if="cmd.id" @click="spawn" type="danger" icon="el-icon-close"
                                       circle></el-button>
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
    import aside from './view/Aside.vue';
    import spawnRun from './utils/spawn.js';

    export default {
        name: 'App',
        data() {
            return {
                path: '',
                package: {},
                run: null,
                loading: null,
                cmd: this.$store.getters.cmd
            }
        },
        components: {
            terminalView,
            'cu-aside': aside
        },
        methods: {
            openFile() {
                this.loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0)'
                });
                ipcRenderer.send('open-file-dialog');
            },
            spawn() {
                this.run = spawnRun({
                    cmd: 'npm run make',
                    // 指定工作目录
                    cwd: '',
                }, (data) => {
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
                if (path) {
                    this.$store.dispatch('setCmd', {
                        path: path[0],
                    });
                    loadJsonFile(path + '\\package.json').then(json => {
                        this.package = json;
                        this.loading.close();
                    }, (e) => {
                        this.loading.close();
                        this.$message({
                            showClose: true,
                            message: '路径不正确，需要包含package.json文件',
                            type: 'error',
                            // duration: 0
                        });
                    });
                } else {
                    this.loading.close();
                }
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

    .cu-el-aside {
        box-sizing: border-box;
        /*border-right: 1px solid #cccccc;*/
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        padding: 10px;
    }

    .cu-el-header {
        box-sizing: border-box;
        /*border-bottom: 1px solid #cccccc;*/
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
    }

    .app-run {
        padding: 10px 16px;
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        margin-bottom: 10px;
    }
</style>
