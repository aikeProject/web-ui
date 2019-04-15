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
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron';
    import loadJsonFile from 'load-json-file';
    import aside from './view/Aside.vue';
    import {each} from 'underscore';

    export default {
        name: 'App',
        data() {
            return {
                path: '',
                package: {},
                run: null,
                loading: null,
            }
        },
        computed: {},
        components: {
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
            }
        },
        created() {
            ipcRenderer.on('selected-dir', (event, path) => {
                console.log('path--', path);
                if (path) {
                    loadJsonFile(path + '\\package.json').then(json => {
                        this.package = json;
                        const list = [];
                        let i = 0;
                        each(json.scripts, (item, key) => {
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
                        this.$store.dispatch('setCmd', list);
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
