<template>
    <div class="app-main">
        <div class="app-run">
            <el-button v-if="!doneCmd.pid" @click="childSpawn" icon="el-icon-caret-right"
                       circle></el-button>
            <el-button v-if="!!doneCmd.pid" @click="close" type="danger" icon="el-icon-close"
                       circle></el-button>
        </div>
        <div class="terminal-view-wrapper">
            <terminalView ref="terminal" :cols="100" :rows="24" auto-size
                          :options="{scrollback: 5000,disableStdin: true,useFlowControl: true}"></terminalView>
        </div>
    </div>
</template>

<script>
    import terminalView from './Terminal.vue';
    import {ipcRenderer} from 'electron';

    export default {
        name: "Main",
        data: function () {
            return {
                id: this.$route.params.id,
            }
        },
        components: {
            terminalView,
        },
        watch: {
            '$route'(to, from) {
                // 对路由变化作出响应...
                this.id = to.params.id;
            },
            doneCmd(data) {
                // pid
                ipcRenderer.send('runScriptsPid', {
                    pid: data.pid
                });
                // 清空 窗口
                this.$refs.terminal.clear();
                ipcRenderer.send('pidValue', {
                    pid: data.pid
                });
            }
        },
        computed: {
            doneCmd() {
                return this.$store.getters.getCmdId(this.id);
            }
        },
        methods: {
            childSpawn() {
                const {path, cmd, id} = this.doneCmd;
                // 执行命令
                ipcRenderer.send('runScripts', {
                    path, cmd, id
                });
            },
            close() {
                const {pid} = this.doneCmd;
                ipcRenderer.send('close', {
                    pid: pid || ''
                });
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
            // 运行中进程返回的数据
            ipcRenderer.on('childData', (event, data) => {
                const {pid} = this.doneCmd;
                if (data && data.pid === pid) {
                    this.result({
                        text: data.data,
                        type: 'stdout'
                    });
                }
            });

            ipcRenderer.on('prePidValue', (event, data) => {
                const {pid} = this.doneCmd;
                if (data && data.pid === pid) {
                    this.result({
                        text: data.data
                    });
                }
            });

            // getRunScripts
            ipcRenderer.on('getRunScripts', (event, data) => {
                console.log('getRunScripts', data);
            });

            // 当前的进程
            ipcRenderer.on('oneChild', (event, data) => {
                console.log('oneChild', data);
            });
        }
    }
</script>

<style scoped>

</style>