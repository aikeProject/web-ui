<template>
    <div class="open-file">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div style="padding: 24px; cursor: pointer;">
                <span class="active-color">card</span>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "OpenFile",
        // 组件
        components: {},
        // 组件的定义只接受 function
        data() {
            return {};
        },
        props: {},
        watch: {},
        // 计算属性
        computed: {},
        // props 可以是数组或对象，用于接收来自父组件的数据
        methods: {},
        // 组件实例刚被创建，组件属性计算之前，如data等属性
        beforeCreate() {
        },
        // 组件实例创建完成，属性已经绑定，但dom还未生成，$el属性还不存在
        created() {
        },
        // 在挂载开始之前被调用：相关的 render 函数首次被调用
        beforeMount() {
        },
        // vm.$el已挂载在文档内，对已有dom节点的操作可以在这期间进行
        mounted() {
        },
        // 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
        beforeUpdate() {
        },
        // 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。
        updated() {
        },
        // keep-alive 组件激活时调用。
        activated() {
        },
        // keep-alive 组件停用时调用。
        deactivated() {
        },
        // 实例销毁之前调用。在这一步，实例仍然完全可用。
        beforeDestroy() {
        },
        // Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁
        destroyed() {
        }
    }
</script>

<style scoped lang="scss">
    .open-file {

    }
</style>