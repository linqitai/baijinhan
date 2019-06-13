import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/orderClassList'
    },
    {
      path: '/login',
      name: 'Login',
      component: (resolve) => {
        import('../pages/Login/Login').then((module) => {
          resolve(module)
        })
      }
    },
    {
      path: '/',
      name: 'Home4Manage',
      component: (resolve) => {
        import('../components/Home4Manage').then((module) => {
          resolve(module)
        })
      },
      children: [
        {
          path: '/schoolRoom',
          name: '校区教室',
          component: (resolve) => {
            import('../pages/class/schoolRoom').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/attendance',
          name: '到课率',
          component: (resolve) => {
            import('../pages/class/attendance').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/courseSetting',
          name: '课程设置',
          component: (resolve) => {
            import('../pages/class/courseSetting').then((module) => {
              resolve(module)
            })
          }
        },
        // {
        //   path: '/orderClassOne',
        //   name: '上周未定课程统计',
        //   component: (resolve) => {
        //     import('../pages/class/orderClassOne').then((module) => {
        //       resolve(module)
        //     })
        //   }
        // },
        {
          path: '/orderClassList',
          name: '订课总览',
          component: (resolve) => {
            import('../pages/class/orderClassList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/classplan',
          name: '课程安排',
          component: (resolve) => {
            import('../pages/class/classPlan').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/classList',
          name: '排课信息',
          component: (resolve) => {
            import('../pages/class/classList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/classLevelList',
          name: '课程等级列表',
          component: (resolve) => {
            import('../pages/class/classLevelList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/studentLevelList',
          name: '学生等级列表',
          component: (resolve) => {
            import('../pages/class/studentLevelList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/alterSelectCourse',
          name: '代选课',
          component: (resolve) => {
            import('../pages/class/alterSelectCourse').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/studentBookList',
          name: '代退课',
          component: (resolve) => {
            import('../pages/class/studentBookList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/teacherList',
          name: '教师列表',
          component: (resolve) => {
            import('../pages/class/teacherList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/studentList',
          name: '学生列表',
          component: (resolve) => {
            import('../pages/class/studentList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/teachersArranging',
          name: '教师排班明细表',
          component: (resolve) => {
            import('../pages/class/teachersArranging').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/dropCourseList',
          name: '退课列表',
          component: (resolve) => {
            import('../pages/class/dropCourseList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/lessonList',
          name: '话题列表',
          component: (resolve) => {
            import('../pages/class/lessonList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/lessonOneList',
          name: '课程之话题列表',
          component: (resolve) => {
            import('../pages/class/lessonOne').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/roleList',
          name: '角色列表',
          component: (resolve) => {
            import('../pages/class/roleList').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/trackStudent',
          name: '角色列表',
          component: (resolve) => {
            import('../pages/class/trackStudent').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/studentClass',
          name: '学生课程',
          component: (resolve) => {
            import('../pages/class/studentClass').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/studentArranging',
          name: '学生待上课程',
          component: (resolve) => {
            import('../pages/class/studentArranging').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/dateArranging',
          name: '课程操作日志',
          component: (resolve) => {
            import('../pages/class/dateArranging').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/userArrangingCount',
          name: '学生上课统计（总览）',
          component: (resolve) => {
            import('../pages/class/statisticalUserArrangingCount').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/studentListMore',
          name: '学生上课统计',
          component: (resolve) => {
            import('../pages/class/studentListMore').then((module) => {
              resolve(module)
            })
          }
        },
        {
          path: '/userArrangingDetail',
          name: '学生上课统计(明细)',
          component: (resolve) => {
            import('../pages/class/statisticalUserArrangingDetail').then((module) => {
              resolve(module)
            })
          }
        }
      ]
    }
  ]
});
