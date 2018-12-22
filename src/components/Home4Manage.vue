<template>
  <div class="home">
    <v-head></v-head>
    <div class="contentWrapper">
      <l-sidebar></l-sidebar>
      <div class="content" ref="content">
          <!-- <keep-alive>
            <router-view></router-view>
          </keep-alive> -->
          <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from './Header.vue'
import lSidebar from './LeftSidebar4Manage.vue'
export default {
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  },
  components: {
    vHead, lSidebar
  }
}
</script>
<style lang="scss">
@import '../common/scss/common.scss';
.home {
  font-size: 13px;
  background-color: gray;
  @include extend();
  .contentWrapper{
    position: relative;
    overflow-y: scroll;
    .content{
      overflow-y: scroll;
      position: fixed;
      left: $mSidebarWidth;
      top: $headerTop;
      right: 0;
      bottom: 0;
      background-color: white;
      float: left;
      min-width: 900px;
      .el-transfer-panel__body{
        height: 400px !important;
        padding-bottom: 16px !important;
      }
      .el-checkbox-group{
        height: 400px !important;
      }
      .el-checkbox__label{
        color: #888889;
        font-size: 13px;
      }
      .transfer-footer{
        margin-left: 50%;
        transform: translateX(-50%);
      }
      .el-step__head.is-success {
        color: $mainColor !important;
        border-color: $mainColor !important;
      }
      .el-step__title.is-success {
          color: $mainColor !important;
      }
      .el-step__description.is-success {
          color: $mainColor !important;
      }
    }
  }
}
</style>
