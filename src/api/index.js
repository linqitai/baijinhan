// import http from './public'
export const host = 'http://bjh.chinaxywl.com/'
// const host = '/xywl'

export const ERR_OK = 201

// 登录接口
export const loginUrl = host + 'api/admin/auth/login';
// 退出登录
export const logoutUrl = host + 'api/admin/auth/logout';
// 教师课程到课率月统计
export const lastMonthSignUrl = host + 'api/admin/statistical/last-month-sign';
export const trackArranging = host + 'api/admin/statistical/track-arranging';
// 同意退课
export const agreeDropUrl = host + 'api/admin/arranging/agree';
// 教师编辑
export const teacherEditUrl = host + 'api/admin/teacher/edit';
// 教师删除
export const teacherDeleteUrl = host + 'api/admin/teacher/delete';
// 教室删除
export const roomDeleteUrl = host + 'api/admin/room/delete';

// 课程设置
export const courseSettingUrl = host + 'api/admin/course/setting';

// 校区教室
export const roomListUrl = host + 'api/admin/room/list';
// 教室编辑与新增
export const roomEditUrl = host + 'api/admin/room/edit';

// 角色列表
export const roleListUrl = host + 'api/admin/role/list';
// 创建修改角色
export const roleEditUrl = host + 'api/admin/role/edit';
// 用户绑定角色(更改绑定)
export const roleBindUrl = host + 'api/admin/role/bind';
// 校区列表
export const schoolListUrl = host + 'api/admin/school/list';
// 单个角色详情
export const roleOneUrl = host + 'api/admin/role/one';
// 查看单节课程详情
export const arrangingOneUrl = host + 'api/admin/arranging/one-user';
// 班主任列表
export const teacherTrackUrl = host + 'api/admin/teacher/track';
// 合同状态
export const contractTypeUrl = host + 'api/admin/contract/contract-type';
// 删除课表
export const arrangingDeleteUrl = host + 'api/admin/arranging/delete';

// 课表列表
export const classListUrl = host + 'api/admin/arranging/list';
// 编辑课程表
export const editClassUrl = host + 'api/admin/arranging/edit';
// 教师列表
export const teacherListUrl = host + 'api/admin/teacher/list';
export const teacherFreesUrl = host + 'api/admin/teacher/frees';
// 教师添加空闲时间
export const teacherFreeEditUrl = host + 'api/admin/teacher/free-edit';
// 单个教师的空闲时间
export const teacherFreeUrl = host + 'api/admin/teacher/myfrees';
// 校区教室
export const getRoomsUrl = host + 'api/admin/school/rooms';
// 教师的课程（包换话题）
export const getTeacherCourseUrl = host + 'api/admin/teacher/course';
// 课程列表
export const getCourseListUrl = host + 'api/admin/course/list';
// 话题列表列表
export const getLessonListUrl = host + 'api/admin/lesson/list';
// 话题列表列表
export const lessonSearchUrl = host + 'api/admin/lesson/search';
// 学生列表
export const getStudentListUrl = host + 'api/admin/user/list';
// 退课列表
export const dropsListUrl = host + 'api/admin/arranging/drops';
// 单日所有教师时间安排
export const teachersArrangingsListUrl = host + 'api/admin/teacher/teachers-arrangings';
// 学生订课情况
export const studentBookListUrl = host + 'api/admin/user/arrangings';
// 课程列表
export const courseListUrl = host + 'api/admin/course/list';
// 编辑学生信息（修改/新增）
export const editStudentInfoUrl = host + 'api/admin/user/edit';
// 话题列表
export const lessonListUrl = host + 'api/admin/lesson/list';
// 话题修改/添加
export const lessonEditUrl = host + 'api/admin/lesson/edit';
// 话题删除
export const lessonDeleteUrl = host + 'api/admin/lesson/delete';
// 教师批量排课
export const setClassMoreUrl = host + 'api/admin/arranging/batch-edit';
// 发布课表
export const arrangingReleaseUrl = host + 'api/admin/arranging/release';
// 代退课
export const dropArrangingUrl = host + 'api/admin/teacher/drop-arranging';
// 订课总览
export const bookCourseListUrl = host + 'api/admin/arranging/book-list';
// 编辑与新增课程
export const courseEditUrl = host + 'api/admin/course/edit';
// 课程等级列表
export const courseLevelListUrl = host + 'api/admin/course/level-list';
// 课程类型列表
export const courseTypeListUrl = host + 'api/admin/course/type-list';
// 教师类型列表
export const teacherTypeListUrl = host + 'api/admin/teacher/type-list';
// 导出教师们的单日课程excel
export const importTableUrl = host + 'api/admin/excel/dayarrangings-export';
// 删除与恢复
export const courseDeleteUrl = host + 'api/admin/course/delete';
// 代选课列表
export const alterSelectListUrl = host + 'api/admin/arranging/time-list';
// 代选课
export const alterSelectUrl = host + 'api/admin/teacher/help-choose';
// 用户权限
export const rolePermissionsUrl = host + 'api/admin/role/permissions';
// 同步角色权限
export const roleChooseUrl = host + 'api/admin/role/choose';
//结课动作
export const closeLessonUrl = host+'api/admin/user/close-lesson'
//个人可以结课列表
export const waitCloseLessonUrl = host+'api/admin/user/wait-close-lesson'
//个人已结课


