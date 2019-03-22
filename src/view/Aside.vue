<template>
    <div class="_aside">
        <template v-for="(v, i) in scripts">
            <div @click="clickScript(i, v)">
                <el-card :body-style="{ padding: '0px' }">
                    <div style="padding: 24px; cursor: pointer;">
                        <span>{{i}}</span>
                    </div>
                </el-card>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "Aside",
        props: {
            scripts: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        methods: {
            clickScript(key, value) {
                console.log('key---value---', key, value)
                this.$store.dispatch('setCmd', {
                    cmd: key,
                });
            }
        }
    }
</script>

<style scoped>

</style>