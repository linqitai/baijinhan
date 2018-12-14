import http from './public'
export const host = 'http://bjh.chinaxywl.com/'
// const host = '/xywl'

export const ERR_OK = 201

// 登录接口
export const loginUrl = host + 'api/admin/auth/login';

// 课表列表
export const classListUrl = host + 'api/admin/arranging/list';

// 编辑课程表
export const editClassUrl = host + 'api/admin/arranging/edit';

// 教师列表
export const teacherListUrl = host + 'api/admin/teacher/list';

// 教师添加空闲时间
export const teacherFreeEditUrl = host + 'api/admin/teacher/free-edit';

// 单个教师的空闲时间
export const teacherFreeUrl = host + 'api/admin/teacher/myfrees';

// 校区教室
export const getRoomsUrl = host + '/api/admin/school/rooms';
// 教师的课程（包换话题）
export const getTeacherCourseUrl = host + '/api/admin/teacher/course';
// 课程列表
export const getCourseListUrl = host + 'api/admin/course/list';
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

export const host2 = 'https://test.dtc233.com'
// 课表列表
export const userListUrl = host2 + '/api/admin/user/list';



