import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
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
          path: '/classplan3',
          name: '课程安排',
          component: (resolve) => {
            import('../pages/class/plan3').then((module) => {
              resolve(module)
            })
          }
        }
      ]
    }
  ]
});
