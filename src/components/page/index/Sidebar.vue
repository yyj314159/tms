<template>
    <div class="sidebar">
        <el-menu unique-opened class="el-menu-vertical-demo" theme="dark" router background-color="#242f42"
                 text-color="#fff"
                 active-text-color="#ffd04b" :collapse="isCollapse" :collapse-transition="false">
            <template v-for="item in items">
                <template v-if="item.subMenus">
                    <el-submenu :index="item.index">
                        <template slot="title"><i style="margin-right: 10px;color:#FCD006;" :class="item.icon"></i>{{
                            item.name }}
                        </template>
                        <template v-for="(subItem,i) in item.subMenus">
                            <template v-if="subItem.subMenus">
                                <el-submenu :index="subItem.index">
                                    <template slot="title"><i style="margin-right: 10px;color:#FCD006;" :class="subItem.icon"></i>{{
                                        subItem.name }}
                                    </template>
                                    <el-menu-item v-for="(thItem,i) in subItem.subMenus" :key="i" :index="thItem.index" style=" min-width: 149px; text-indent: 5px; font-size:12px;">{{ thItem.name }}
                                    </el-menu-item>
                                </el-submenu>
                            </template>
                            <template v-else>
                                <el-menu-item :key="i" :index="subItem.index"
                                              style="min-width: 149px; text-indent: 5px; font-size:12px;">{{ subItem.name }}
                                </el-menu-item>
                            </template>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.name }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import {Http} from 'src/global/http';
    import {Api} from 'src/global/api';

    export default {
        props:{
            collapse: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                items: []
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path;
            },
            isCollapse(){
                return this.collapse
            }
        },
        mounted() {
            this.getCurrentMenus();
        },
        methods: {
            getCurrentMenus() {
                var vm = this;
                Http.get(Api.menu.current, {}, result => {
                    vm.items = result.result;
                })
            }
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        width: 168px;
        left: 0;
        top: 40px;
        bottom: 0;
        background: #2E363F;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
