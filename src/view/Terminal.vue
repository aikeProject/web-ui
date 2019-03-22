/**
* User: 成雨
* Date: 2019/3/19 0019
* Time: 21:55
*/

<template>
    <div class="terminal-view card">
        <div class="xterm-bar">
            <el-button @click="clear" icon="el-icon-delete" circle size="mini"></el-button>
            <el-button @click="scrollToBottom" icon="el-icon-arrow-down" circle size="mini"></el-button>
        </div>
        <div class="view">
            <div ref="render" class="xterm-render"/>
        </div>
        <resize-observer v-if="autoSize" @notify="fit"/>
    </div>
</template>

<script>
    import {Terminal} from 'xterm'
    import * as fit from 'xterm/dist/addons/fit/fit'
    // import * as webLinks from 'xterm/dist/addons/webLinks/webLinks'

    Terminal.applyAddon(fit);
    // Terminal.applyAddon(webLinks);

    const defaultTheme = {
        foreground: '#2c3e50',
        background: '#fff',
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

    const darkTheme = Object.assign({}, defaultTheme, {
        foreground: '#fff',
        background: '#1d2935',
        cursor: 'rgba(255, 255, 255, .4)',
        selection: 'rgba(255, 255, 255, 0.3)',
        magenta: '#e83030',
        brightMagenta: '#e83030'
    });

    export default {
        name: "Terminal",
        props: {
            cols: {
                type: Number,
                required: true
            },

            rows: {
                type: Number,
                required: true
            },

            content: {
                type: String,
                default: undefined
            },

            autoSize: {
                type: Boolean,
                default: false
            },

            options: {
                type: Object,
                default: () => ({})
            },

            toolbar: {
                type: Boolean,
                default: false
            },

            title: {
                type: String,
                default: null
            },

            openLinks: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            theme() {
                if (this.darkMode) {
                    return darkTheme
                } else {
                    return defaultTheme
                }
            }
        },
        watch: {
            cols(c) {
                this.$_terminal.resize(c, this.rows)
            },

            rows(r) {
                this.$_terminal.resize(this.cols, r)
            },

            content: 'setContent',

            darkMode(value, oldValue) {
                console.log(value, oldValue);
                if (typeof oldValue === 'undefined') {
                    this.initTerminal()
                } else if (this.$_terminal) {
                    this.$_terminal.setOption('theme', this.theme)
                }
            }
        },
        methods: {
            initTerminal() {
                const options = Object.assign({}, {
                    rows: this.rows,
                    cols: this.cols,
                    theme: defaultTheme,
                }, this.options);
                let term = this.$_terminal = new Terminal(options);
                term.open(this.$refs.render);
                term.on('blur', () => this.$emit('blur'));
                term.on('focus', () => this.$emit('focus'));
                if (this.autoSize) {
                    this.$nextTick(this.fit)
                }
            },
            async fit() {
                let term = this.$_terminal;
                term.element.style.display = 'none';

                await this.$nextTick();

                term.fit();
                term.element.style.display = '';
                term.refresh(0, term.rows - 1);
            },
            setContent(value, ln = true) {
                if (value.indexOf('\n') !== -1) {
                    value.split('\n').forEach(
                        t => this.setContent(t)
                    );
                    return
                }
                if (typeof value === 'string') {
                    this.$_terminal[ln ? 'writeln' : 'write'](value);
                } else {
                    this.$_terminal.writeln('');
                }
            },
            addLog(log) {
                this.setContent(log.text, log.type === 'stdout')
            },
            clear() {
                this.$_terminal.clear()
            },

            scrollToBottom() {
                this.$_terminal.scrollToBottom()
            },

            focus() {
                this.$_terminal.focus()
            },

            blur() {
                this.$_terminal.blur()
            },
        },
        mounted() {
            this.initTerminal();
        },
        beforeDestroy() {
            this.$_terminal.destroy()
        },
    }
</script>

<style lang="scss">

    .terminal-view {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;

        &.card {
            background: #fff;
            border-radius: 6px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, .05);
        }

        .xterm-bar {
            padding: 10px 16px;
            border-bottom: 1px solid #cccccc;
            box-sizing: border-box;
        }

        .view {
            flex: 100% 1 1;
            height: 0;
            position: relative;
            padding-left: 16px;
        }

        .xterm-render {
            width: 100%;
            height: 100%;
        }

        .xterm-cursor-layer {
            display: none !important;
        }
    }
</style>