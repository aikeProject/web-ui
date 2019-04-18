<template>
    <div class="_aside">
        <template v-for="(v, i) in scripts">
            <router-link :to="`/main/${i}`">
                <div style="margin: 10px 0;">
                    <el-card :body-style="{ padding: '0px' }" shadow="hover">
                        <div style="padding: 24px; cursor: pointer;">
                            <span class="active-color">{{v.key}}</span>
                            <span class="run">{{v.status === 1 ? '运行中' : v.status === 2 ? '已结束' : ''}}</span>
                        </div>
                    </el-card>
                </div>
            </router-link>
        </template>
    </div>
</template>

<script>
    export default {
        name: "Aside",
        data() {
            return {}
        },
        computed: {
            scripts() {
                return this.$store.getters.cmd;
            },
        },
        methods: {}
    }
</script>

<style scoped lang="scss">
    ._aside {
        .router-link-active {
            .active-color {
                color: red !important;
            }
        }

        .run {
            color: yellow;
            margin-left: 10px;
        }
    }
</style>