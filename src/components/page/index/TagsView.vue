<template>
  <div class="tags-view-container">
    <scroll-pane class="tags-view-wrapper" ref="scrollPane">
      <router-link ref="tag" class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
        :to="tag.fullPath" :key="tag.fullPath" @contextmenu.prevent.native="openMenu(tag,$event)">
        {{tag.name}}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" v-if="tag.name!=='首页'"></span>
      </router-link>
    </scroll-pane>
    <ul class="contextmenu" v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭全部</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane.vue';

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    }
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.fullPath === this.$route.fullPath;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route) {
        return false;
      }
      this.$store.dispatch('tagsView/addVisitedViews', route);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.fullPath === this.$route.fullPath) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delVisitedViews', view).then(views => {
        if (this.isActive(view)) {
            views.forEach((item,index)=>{
                if(item.fullPath === view.fullPath){
                    views.splice(index,1);
                }
            })
          const latestView = views[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch('tagsView/delAllViews');
      this.$router.push('/');
    },
    openMenu(tag, e) {
      this.visible = true;
      this.selectedTag = tag;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      this.left = e.clientX - offsetLeft + 15; // 15: margin right
      this.top = e.clientY;
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    $blue: #1890ff;
    $blue-light: #69c0ff;
    $blue-hover: #e6f7ff;
    $red: #f5222d;
    $green: #52c41a;
    $orange: #faad14;
    $grey: #8c8c8c;
    $black: #262626;

    //sidebar
    // $menuBg:#304156;
    // $subMenuBg:#1f2d3d;
    // $menuHover:#001528;

    //sidebar
    //$menuBg: #001529;
    //$subMenuBg: #000c17;
    //$menuHover: #000c17;

    $logoWrapperBg: #002140;
    $scrollbarWrapperBgColor: #001529;
    $scrollbarWrapperBg: #001529;
    // $scrollbarWrapperBg: linear-gradient(top, #2ac58e, #51ade4);
    // $scrollbarWrapperBg: linear-gradient(to bottom left, #002766 , #002140);
    $subMenuBg: rgba(0, 0, 0, 0.4);
    $menuHover: rgba(24, 144, 255, 1);
    $menuIcon: rgba(255, 255, 255, 0.8);
.tags-view-container {
  .tags-view-wrapper {
    background: #F0F2F5;
    height: 28px;
    margin-top: -4px;
    margin-bottom: -6px;
      // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 20px;
      line-height: 20px;
      border-radius: 2px;
      color: #495060;
      background: #fff;
      padding: 0 8px 0 12px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 5px;
      }
      &.active {
        // background-color: #42b983;
        background-color: #fff;
        // background: linear-gradient(30deg,#1f74ff,#3a1fff)!important;
        // text-shadow: 1px 2px 4px rgba(0,0,0,.3);
        color: $blue;
        // border-color: #001529;
        // border-color: #42b983;
        &::before {
          content: "";
          background: #52c41a;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: rgba(245, 34, 45, .8);
        color: #ffffff;
      }
    }
  }
}
</style>
