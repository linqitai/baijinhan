<style lang="scss">
  @import '../common/scss/common.scss';
  .searchCondition {
    position: relative;
    width: 100%; 
    padding-left: 12px;
    overflow: hidden;
    margin-bottom: 10px; // min-width: $content-min-width;
    display: flex;
    .text{
      flex:auto;
    }
    .btnBox{
      flex:0 0 120px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      padding-right: 12px;
      overflow: hidden;
      .btn{
        flex: 1;
      }
      .icon{
        flex: 0 0 36px;
        .moreIcon {
          // @include extend_click();
          transition: all 0.5s ease;
          color: $mainColor;
          font-size: 20px;
        }
        .iconTransform {
          transform: rotate(180deg);
          -moz-transform: rotate(180deg);
          -webkit-transform: rotate(180deg);
          -o-transform: rotate(180deg);
          -ms-transform: rotate(180deg);
          transition: all 0.5s ease;
        }
      }
    }
    .element {
      float: left;
      margin-right: 15px;
      margin-top: 15px;
      &:last-child {
        margin-right: 0px;
      }
      
    }
  } 
</style>
<template>
  <div class="searchCondition" id="searchCondition">
    <div class="text">
      <slot></slot>
    </div>
    <div class="btnBox">
      <div class="btn">
        <el-button type="primary" @click="searchData" size="medium">筛选</el-button>
      </div>
      <div class="icon" @click="moreBtn" v-if="isShowMoreBtn">
        <i class="el-icon-caret-bottom moreIcon" :class="{iconTransform:isTwoLiine==true}"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowMoreBtn: true,
      isTwoLiine: false
    }
  },
  created() {
    setTimeout(() => {
      let height = document.getElementById('searchCondition').offsetHeight
      // console.log('height:' + height)
      if (height < 53) {
        this.isShowMoreBtn = false
      } else {
        this.isShowMoreBtn = true
        document.getElementById('searchCondition').style.height = '50px'
      }
      document.getElementById('searchCondition').style.overflow = 'hidden'
    }, 20)
  },
  methods: {
    searchData() {
      this.$emit('clickSearchData')
    },
    moreBtn() {
      this.isTwoLiine = !this.isTwoLiine
      if (this.isTwoLiine) {
        document.getElementById('searchCondition').style.height = 'auto'
      } else {
        document.getElementById('searchCondition').style.height = '50px'
      }
    }
  }
}
</script>