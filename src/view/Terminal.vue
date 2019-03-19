/**
* User: 成雨
* Date: 2019/3/19 0019
* Time: 21:55
*/

<template>
    <div class="terminal-view">
        <div class="view">
            <div ref="render" class="xterm-render"/>
        </div>
    </div>
</template>

<script>
    import {Terminal} from 'xterm'
    import * as fit from 'xterm/dist/addons/fit/fit'
    import * as webLinks from 'xterm/dist/addons/webLinks/webLinks'

    Terminal.applyAddon(fit)
    Terminal.applyAddon(webLinks)

    const defaultTheme = {
        // foreground: '#2c3e50',
        foreground: '#e4f5ef',
        // background: '#fff',
        // background: '#e4f5ef',
        background: '#2c3e50',
        cursor: 'rgba(0, 0, 0, .4)',
        selection: 'rgba(0, 0, 0, 0.3)',
        black: '#000000',
        red: '#e83030',
        brightRed: '#e83030',
        green: '#42b983',
        brightGreen: '#42b983',
        brightYellow: '#ea6e00',
        yellow: '#ea6e00',
        magenta: '#e83030',
        brightMagenta: '#e83030',
        cyan: '#03c2e6',
        brightBlue: '#03c2e6',
        brightCyan: '#03c2e6',
        blue: '#03c2e6',
        white: '#d0d0d0',
        brightBlack: '#808080',
        brightWhite: '#ffffff'
    };

    const darkTheme = Object.assign(defaultTheme, {
        foreground: '#fff',
        background: '#1d2935',
        cursor: 'rgba(255, 255, 255, .4)',
        selection: 'rgba(255, 255, 255, 0.3)',
        magenta: '#e83030',
        brightMagenta: '#e83030'
    });

    export default {
        name: "Terminal",
        methods: {
            initTerminal() {
                let term = this.$_terminal = new Terminal({
                    // cols: this.cols,
                    // rows: this.rows,
                    theme: defaultTheme,
                    // ...this.options
                });
                // webLinks.webLinksInit(term, this.handleLink)
                term.open(this.$refs.render)
            }
        },
        mounted() {
            this.initTerminal();
        }
    }
</script>

<style scoped lang="stylus">
    .terminal-view
        v-box()
        align-items stretch

        .view
            flex 100% 1 1
            height 0
            position relative
            padding-left $padding-item

        .xterm-render
            width 100%
            height 100%

            >>> .xterm
                .xterm-cursor-layer
                    display none
</style>