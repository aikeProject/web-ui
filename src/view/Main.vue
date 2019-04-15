<template>
    <div class="app-main">
        <div class="app-run">
            <el-button v-if="!doneCmd.status" @click="spawn" icon="el-icon-caret-right"
                       circle></el-button>
            <el-button v-if="doneCmd.status" @click="close" type="danger" icon="el-icon-close"
                       circle></el-button>
        </div>
        <div class="terminal-view-wrapper">
            <terminalView ref="terminal" :cols="100" :rows="24"
                          auto-size
                          :options="{scrollback: 5000,disableStdin: true,useFlowControl: true}"></terminalView>
        </div>
    </div>
</template>

<script>
    import spawnRun, {closeChildProcess} from '../utils/spawn.js';
    import terminalView from './Terminal.vue';

    export default {
        name: "Main",
        data: function () {
            return {
                id: this.$route.params.id
            }
        },
        components: {
            terminalView,
        },
        computed: {
            doneCmd() {
                console.log('id', this.id);
                console.log('data', this.$store.getters.getCmdId(this.id));
                return this.$store.getters.getCmdId(this.id);
            }
        },
        methods: {
            spawn() {
                let {cmd, path, con} = this.doneCmd;
                console.log('npm--', cmd);
                this.run = spawnRun({
                    cmd: cmd,
                    // 指定工作目录
                    cwd: path || '',
                }, (data) => {
                    con += data;
                    this.$store.dispatch('setCmdId', {
                        id: this.$route.params.id,
                        data: {
                            status: 1,
                            con: con,
                            pid: this.run.result.pid
                        }
                    });
                    this.result({
                        text: data,
                        type: 'stdout'
                    });
                }, () => {
                    this.$store.dispatch('setCmdId', {
                        id: this.$route.params.id,
                        data: {
                            status: 0,
                        }
                    });
                });
                this.run.run();
            },
            close() {
                this.$store.dispatch('setCmdId', {
                    id: this.$route.params.id,
                    data: {
                        status: 0
                    }
                });
                closeChildProcess(this.doneCmd.pid);
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
            let {con} = this.doneCmd;
            this.result({
                text: con,
                type: 'stdout'
            });
        }
    }
</script>

<style scoped>

</style>