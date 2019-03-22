<template>
    <template v-for="(v, i) in scripts">
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
        }
    }
</script>

<style scoped>

</style>