<style lang="scss" scoped>
@import "../../common/scss/common.scss";
.apply {
  .operateTableBox {
    .functionBox {
    }
  }
}
.checkLabel {
  color: #646464;
  font-size: 12px;
  padding: 4px 3px;
  display: block;
}
.checked {
  color: $mainColor;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px !important;
}
</style>
<template>
  <div class="apply" ref="apply">
    <div class="breadcrumbWrapper">
      <div class="breadcrumb">
        <i class="iconfont icon-home iconhomestyle nocurrent"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            <span class="nocurrent">首页</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span class="nocurrent">角色</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span>角色列表</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <div class="inline">
            <el-button type="primary" size="medium" @click="operateBtn('add',null)">新增</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="角色名称" width="180"></el-table-column>
        <!-- <el-table-column prop="level" label="等级">
        </el-table-column>-->
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="updated_at" label="修改时间"></el-table-column>
        <!-- <el-table-column prop="is_deleted" label="是否删除">
        </el-table-column>-->
        <el-table-column prop="name" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="operateBtn('edit',scope.row)"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >修改</el-button>
            <el-button
              @click="handleDeleteClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-close"
            >删除</el-button>
            <el-button
              @click="setPermissionClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[6,8,10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogAddFormVisible"
      :append-to-body="true"
      :fullscreen="false"
      width="400"
    >
      <div class="dialogBody">
        <div class="element">
          <label class="inline">角色名称：</label>
          <div class="inline">
            <el-input v-model="form.name" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="operateEvent">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="设置权限"
      :visible.sync="setPermissionDialog"
      :append-to-body="true"
      :fullscreen="true"
    >
      <div class="headerDialog">角色名称：{{roleName}}</div>
      <div>
        <table class="setRolePermissionsTable">
          <tr class="header">
            <th>一级</th>
            <th>二级</th>
            <th>权限配置细则</th>
          </tr>
          <tr v-for="(items,index1) in rolePermissions">
            <td>
              <el-checkbox v-model="items.check" @change="change1(index1,items)">{{items.text}}</el-checkbox>
              <!-- <label class="checkLabel" :class="[items.check?'checked':'']" @click="clickLevel1(index1)">{{items.text}}</label> -->
            </td>
            <td>
              <el-checkbox
                class="checkLabel"
                v-for="(item,index2) in items.subs"
                v-model="item.check"
                @change="change2(index1,index2,item)"
              >{{item.text}}</el-checkbox>
              <!-- <label v-for="(item,index2) in items.subs" class="checkLabel" :class="[item.check?'checked':'']" @click="clickLevel2(index1,index2)">{{item.text}}</label> -->
            </td>
            <td>
              <div v-for="(item,index) in items.subs">
                <label v-for="(permission,index) in item.subs">
                  <el-checkbox v-model="permission.check">{{permission.text}}</el-checkbox>
                </label>        
                <div>-</div>      
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="left margR20" type="primary" @click="saveEvent">保存</el-button>
        <el-button class="left" @click="closePermissionDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  roleListUrl,
  roleEditUrl,
  roleBindUrl,
  rolePermissionsUrl,
  roleChooseUrl,
  roleOneUrl,
  ERR_OK
} from "@/api/index";
import Vue from "vue";
var rolePermissions = [];
export default {
  data() {
    return {
      loading: true,
      pageIndex: 1, // offset/10+1
      pageSize: 8,
      total: 0,
      title: "",
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      formLabelWidth: "120px",
      showPageTag: false,
      tableData: [],
      levelOptions: [],
      form: {
        name: "",
        role_id: ""
      },
      name: "",
      schoole_id: localStorage.getItem("_school_id"),
      setPermissionDialog: false,
      roleName: "",
      rolePermissions: [],
      role_id: "",
      roleOne: ""
    };
  },
  created() {
    this.getList();
    this.getPermissionInfo();
  },
  methods: {
    // 索引修改、vue无法检测渲染。
    // clickLevel1(index1) {
    //   let that = this;
    //   rolePermissions[index1].check = !rolePermissions[index1].check;
    //   that.rolePermissions = rolePermissions;
    //   console.log(that.rolePermissions[index1].check, "check");
    //   // that.rolePermissions[i].subs[j].check = false;
    // },
    // clickLevel2(index1, index2) {
    //   let that = this;
    //   rolePermissions[index1].subs[index2].check = !rolePermissions[index1]
    //     .subs[index2].check;
    //   that.rolePermissions = rolePermissions;
    //   console.log(that.rolePermissions[index1].subs[index2].check, "check");
    // },
    //关闭权限弹出层
    closePermissionDialog() {
      this.setPermissionDialog = false;
      this.clearPermission();
    },
    //过去当前登录用户可见的所有权限
    getPermissionInfo() {
      console.log('获取所有权限----------------根据不同的级别显示不同的权限')
      let that = this;
      var params = {
        user_id: localStorage.getItem("login_id")
      };
      var url = rolePermissionsUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        that.loading = false;
        var result = res.data;
        if (result.code == ERR_OK) {
          that.rolePermissions = result.data;
          rolePermissions = result.data;
          //整理为安全结构
          for(var i=0;i<that.rolePermissions.length;i++) {
            that.rolePermissions[i].check = false;
            for(var j=0;j<that.rolePermissions[i].subs.length;j++) {
              that.rolePermissions[i].subs[j].check = false;
            }
          }
        }
      });
    },
    //写入对应角色的权限
    saveEvent() {
      let that = this;
      var permission = [];
      for (var i = 0; i < this.rolePermissions.length; i++) {
        if (this.rolePermissions[i].check) {
          permission.push(this.rolePermissions[i].permission_id);
        }
        for (var j = 0; j < this.rolePermissions[i].subs.length; j++) {
          if (this.rolePermissions[i].subs[j].check) {
            permission.push(this.rolePermissions[i].subs[j].permission_id);
          }
        }
      }
      var params = {
        role_id: this.role_id,
        permissions: JSON.stringify(permission)
      };
      var url = roleChooseUrl;
      console.log(params, "params");
      console.log(this.rolePermissions, "rolePermissions");
      this.$axios.post(url, params).then(res => {
        that.loading = false;
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
          that.setPermissionDialog = false;
          that.clearPermission();
        }
      });
    },
    clearPermission() {
      var that = this;
      for (var i = 0; i < that.rolePermissions.length; i++) {
        if (that.rolePermissions[i].check) {
          that.rolePermissions[i].check = false;
        }
        for (var j = 0; j < that.rolePermissions[i].subs.length; j++) {
          if (that.rolePermissions[i].subs[j].check) {
            that.rolePermissions[i].subs[j].check = false;
          }
        }
      }
      console.log(that.rolePermissions, "that.rolePermissions1231231321");
      // for(var i=0;i<rolePermissions.length;i++) {
      //   if(rolePermissions[i].check){
      //     rolePermissions[i].check = false
      //   }
      //   for(var j=0;j<rolePermissions[i].subs.length;j++) {
      //     if(rolePermissions[i].subs[j].check){
      //       rolePermissions[i].subs[j].check = false
      //     }
      //   }
      // }
      // console.log(rolePermissions,'rolePermissions1231231321')
    },
    //单个角色权限
    getRoleOneInfo() {
      let that = this;
      var params = {
        role_id: this.role_id
      };
      var url = roleOneUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        that.loading = false;
        var result = res.data;
        if (result.code == ERR_OK) {
          that.roleOne = result.data;
          // console.log(that.rolePermissions,"rolePermissions")
          console.log(that.roleOne, "roleOne");

          var permission_id_arr = [];
          //提取单个角色的权限 id
          for (var i = 0; i < that.roleOne.permissions.length; i++) {
            var permission_id1 = that.roleOne.permissions[i].permission_id;
            permission_id_arr.push(permission_id1);
            for (var j = 0; j < that.roleOne.permissions[i].subs.length; j++) {
              var permission_id2 =
                that.roleOne.permissions[i].subs[j].permission_id;
                permission_id_arr.push(permission_id2);
            }
          }

          that.rolePermissions = choose(that.rolePermissions,permission_id_arr,'');
          console.log(that.rolePermissions, "that.rolePermissions");

          that.setPermissionDialog = true;
        }
      });
    },
    setPermissionClick(row) {
      this.roleName = row.name;
      this.role_id = row.id;
      this.getRoleOneInfo();
    },
    getRoleBindData() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        user_id: 1,
        role_id: this.form.role_id
      };
      var url = roleBindUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        that.loading = false;
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.tableData = result.data;
          that.total = result.data.count || 0;
          if (that.total < that.pageSize) {
            that.showPageTag = false;
          } else {
            that.showPageTag = true;
          }
        }
      });
    },
    search() {
      this.getList();
    },
    operateBtn(title, row) {
      if (title == "add") {
        this.title = "新增角色";
        this.form = {
          role_id: "",
          name: ""
        };
      } else {
        this.title = "编辑角色";
        this.form.role_id = row.id;
        this.form.name = row.name;
      }
      this.dialogAddFormVisible = true;
      // this.getCourseList();
    },
    operateEvent() {
      let that = this;
      var params = {
        role_id: this.form.role_id,
        name: this.form.name
      };
      var url = roleEditUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.getList();
          that.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
          that.dialogAddFormVisible = false;
        }
      });
    },
    delete() {
      that.$message({
        showClose: true,
        message: "接口缺失",
        type: "success"
      });
      let that = this;
      var params = {
        is_deleted: 1
      };
      // var url = lessonDeleteUrl;
      console.log(params, "params");
      // this.$axios.post(url,params).then((res)=>{
      //   var result = res.data;
      //   console.log(result.code,'--res.code--')
      //   if(result.code == ERR_OK){
      //     that.getList();
      //     that.$message({
      //       showClose: true,
      //       message: '修改成功',
      //       type: 'success'
      //     });
      //     that.dialogFormVisible = false;
      //   }
      // });
    },
    getList() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        area_id: localStorage.getItem("area_id")
      };
      var url = roleListUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        that.loading = false;
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.tableData = result.data;
          that.total = result.data.count || 0;
          if (that.total < that.pageSize) {
            that.showPageTag = false;
          } else {
            that.showPageTag = true;
          }
        }
      });
    },
    handleDeleteClick(row) {
      var that = this;
      this.form.lesson_id = row.id;
      this.$confirm(`此操作将永久删除话题${row.name}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.delete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      // console.log(val);
      this.getList();
    },
    //修复数组索引修改，渲染无响应问题
    change1(index, item) {
      Vue.set(this.rolePermissions, index, item);
    },
    change2(index1, index2, item) {
      Vue.set(this.rolePermissions[index1].subs, index2, item);
    }
  }
};
//递归检测 深度控制为3
function choose(arr,contrast,m=0) {
  for (var q = 0; q < arr.length; q++) {
    if(m>3){
      break
    }
    let permission_id = arr[q].permission_id;
    if (contrast.indexOf(permission_id) > -1) {
       arr[q].check = true;
    }
    if(arr[q].subs.length >0){
      choose(arr[q].subs,contrast,m+1); 
    }
  }
  return arr;
}
</script>


