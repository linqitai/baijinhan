<style lang="scss" scoped>
  @import '../common/scss/common.scss';
  @import '../common/scss/mixin.scss';
  $ciclepx:56px;
  $lItemHeight:86px;
  $circleml:($lItemHeight - $ciclepx)/2;
  
  .mSidebar{
    position: fixed;
    left: 0;
    top: $headerTop;
    right: 0;
    bottom: 0;
    background-color: #F2F2F2;
    width: $mSidebarWidth;
    float: left;
    border-left:1px solid #F3F2F2 !important;
    .itemTitle{
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e8e8e8;
      color: #646464;
      cursor: pointer;
      .iconStyle{
        margin-left: 12px;
        line-height: 50px;
      }
      .title{
        margin-left: 3px;
      }
      .arrow{
        margin-right: 20px;
        color: #c7c7c7;
      }
    }
    .item{
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
      .title{
        margin-left: 24px;
      }
      &.selected{
        color: $selectedColor;
        background-color: white;
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .3s ease
    }
    .fade-enter, .fade-leave-to{
      opacity: 0;
    }
  }
</style>
<template>
  <ul class="mSidebar">
    <li v-for="(item,index) in mSidebar">
      <div class="itemTitle" @click="flexToggle(index,'click')">
        <i class="el-icon-menu iconStyle left"></i>
        <div class="title left">{{item.text}}</div>
        <!-- <i class="iconfont icon-arrowdowm arrow right"></i> -->
      </div>
      <transition name='fade'>
        <ul v-show="flex[index]">
          <li class="item" v-for="(item,index) in item.subs" :class="[item.id==currentId?'selected':'']" @click="textClick(item)">
            <div class="title left">{{item.text}}</div>
          </li>
        </ul>
      </transition>
    </li>
  </ul> 
</template>

<script>
import { rolePermissionsUrl,roleOneUrl,ERR_OK } from '@/api/index'
var menu = [
            {title:'课程',
            subs:[
                  {id:0,text:'订课总览',path:'/orderClassList'},
                  {id:1,text:'课程安排',path:'/classplan'},
                  {id:2,text:'课程列表',path:'/classList'},
                  {id:3,text:'课程等级列表',path:'/classLevelList'},
                  {id:4,text:'话题列表',path:'/lessonList'},
                  {id:5,text:'退课列表',path:'/dropCourseList'},
                  {id:6,text:'代退课',path:'/studentBookList'},
                  {id:7,text:'代订课',path:'/alterSelectCourse'},
             ]},
            {title:'教师',
            subs:[
                  {id:0,text:'教师列表',path:'/teacherList'},
                  {id:1,text:'教师排班明细表',path:'/teachersArranging'}
            ]},
            {title:'学生',
            subs:[
                  {id:0,text:'学生列表',path:'/studentList'},
                  {id:1,text:'学生等级列表',path:'/studentLevelList'}
            ]}
           ]

export default {
  data() {
    return {
      currentId: this.$cookie.get('currentId') || 0,
      itemTitleLen: '',
      flex: [],
      isCollapse: false,
      activeIndex: '',
      mSidebar:""
    }
  },
  // 接受父组件的值
  // props: {
  //   lSidebar: Array,
  //   required: true
  // },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    }
  },
  created(){
    this.getPermissions();
  },
  mounted() {
  },
  methods: {
    getPermissions() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        user_id: localStorage.getItem('login_id')
      }
      var url = rolePermissionsUrl;
      console.log(params,"params================================================")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.mSidebar = result.data;
          for(var i=0;i<that.mSidebar.length;i++){
            for(var j=0;j<that.mSidebar[i].subs.length;j++) {
              that.mSidebar[i].subs[j].id = j;
            }
          }
          var href = window.location.href;
          var currentTitleId = that.$cookie.get('currentTitleId')||0;
          that.flexToggle(currentTitleId,"created")
          that.$router.push({
            path: href.split('#')[1]
          })
          that.getRoleOneInfo();
        }
      });
    },
    getRoleOneInfo() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        role_id: localStorage.getItem('role_id')
      }
      var url = roleOneUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.roleOne = result.data;
          
          // var permission_id_arr = []
          // for(var i=0;i<that.roleOne.permissions.length;i++) {
          //   var permission_id = that.roleOne.permissions[i].permission_id;
          //   permission_id_arr.push(permission_id)
          //   for(var j=0;j<that.roleOne.permissions[i].subs.length;j++) {
          //     var permission_id =  that.roleOne.permissions[i].subs[j].permission_id
          //     permission_id_arr.push(permission_id)
          //   }
          // }
          // console.log(permission_id_arr,"permission_id_arr")

          // for(var k=0;k<rolePermissions.length;k++){
          //   var permission_id = rolePermissions[k].permission_id;
          //   console.log(permission_id_arr.indexOf(permission_id),permission_id)
          //   if(permission_id_arr.indexOf(permission_id)>-1){
          //     rolePermissions[k].check = true;
          //   }
          //   for(var q=0;q<rolePermissions[k].subs.length;q++) {
          //     var permission_id = rolePermissions[k].subs[q].permission_id;
          //     if(permission_id_arr.indexOf(permission_id)>-1){
          //       rolePermissions[k].subs[q].check = true;
          //     }
          //   }
          // }
          // that.rolePermissions = rolePermissions;
        }
      })
    },
    setRouter(currentTitleId,currentId) {
      var that = this;
      this.$router.push(that.mSidebar[currentTitleId].subs[currentId].path); 
    },
    textClick(item) {
      var currentTitleId = this.$cookie.get('currentTitleId')||0;
      this.currentId = item.id;
      this.$cookie.set('currentId',this.currentId);
      var currentId = this.$cookie.get('currentId');
      console.log(currentTitleId + "," + currentId)
      this.setRouter(currentTitleId,currentId);
    },
    flexToggle(index,from) {
      var arr = [];
      if(from=="created"){
        console.log(from,"from");
        this.flex[index] = true;
      }else if(from=="click"){
        // 全部先收缩
        for(var i=0; i<this.itemTitleLen; i++) {
          arr[i]=false;
        }
        // 正常的闭合
        if(this.flex[index] == true) {
          this.flex = arr; 
        }else{
          arr[index]=true;
          this.flex = arr;
          this.$cookie.set('currentTitleId',index);
          this.$cookie.set('currentId',0);
          this.currentId = 0;
        }
      }
      // var currentTitleId = this.$cookie.get('currentTitleId');
      var currentId = this.$cookie.get('currentId')||0;
      console.log(index + "," + currentId)
      this.setRouter(index,currentId);
    },
    initFlex() {
      this.itemTitleLen = this.mSidebar.length;//标题的长度
      var arr=[]
      for(var i = 0; i < this.itemTitleLen; i++) {
        if(i==0) {
          arr[i] = true;
        }else{
          arr[i] = false;
        }
      }
      return arr;
    }
  }
}
</script>