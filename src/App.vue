<template>
    <div class="app">
        <el-button @click="openFile">打开文件</el-button>
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
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron';
    import loadJsonFile from 'load-json-file';

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
                        message: '路径不正确，不包含package.json文件',
                        type: 'error'
                    });
                });
            });
        }
    }
</script>
