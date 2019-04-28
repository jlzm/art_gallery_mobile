const router = [
  /** 主页 */
  {
    path: '/teacher',
    name: 'teacher',
    redirect: {
      path: 'teacher/home'
    }
  },
  {
    path: '/teacher/home',
    name: 'teacherHome',
    component: resolve => require(['../page/teacher/home'], resolve),
    meta: {
      title: '会员中心'
    },
  },
  {
    path: '/teacher/courseDetail',
    name: 'courseDetail',
    meta: {
      title: '课程详情'
    },
    component: resolve => require(['../page/teacher/course/Detail'], resolve)
  },
  {
    path: '/teacher/sign/:crid',
    name: 'sign',
    meta: {
      title: '课程签到',
      type: 'teacher'
    },
    component: resolve => require(['../page/common/sign/sign'], resolve),
  },
  {
    path: '/teacher/leaveList/:crid',
    name: 'teacherleaveList',
    meta: {
      title: '请假学生列表',
      type: 'teacher'
    },
    component: resolve => require(['../page/teacher/course/leave/LeaveList'], resolve)
  },
  {
    path: '/teacher/commentList',
    name: 'commentList',
    meta: {
      title: '老师评价学生'
    },
    component: resolve => require(['../page/teacher/course/commentList'], resolve)
  },

  {
    // 老师评价学生详情
    path: '/teacher/commentDetail/:id',
    name: 'commentDetail',
    meta: {
      title: '老师评价学生'
    },
    component: resolve => require(['../page/teacher/course/commentDetail/commentDetail'], resolve)
  },
  {
    path: '/teacher/attendence/:id',
    name: 'attendence',
    meta: {
      title: '考勤记录'
    },
    component: resolve => require(['../page/teacher/attendence/attendence'], resolve)
  },
  {
    path: '/teacher/trends',
    name: 'trends',
    meta: {
      title: '课程动态',
      type: 'teacher'
    },
    component: resolve => require(['../page/teacher/course/dynamic/dynamic'], resolve),
    children: [{
        path: 'photo',
        name: 'uploadPhoto',
        meta: {
          title: '课程动态',
          type: 'teacher'
        },
        component: resolve => require(['../page/teacher/course/dynamic/uploadPhoto'], resolve),
      },
      {
        path: 'vedio',
        name: 'uploadVedio',
        meta: {
          title: '课程动态',
          type: 'teacher'
        },
        component: resolve => require(['../page/teacher/course/dynamic/uploadVedio'], resolve),
      }
    ]
  },
  // 查看家长评论老师
  {
    // 家长评价老师/课程
    path: '/teacher/viewParentComment/:courseId',
    name: 'viewParentComment',
    meta: {
      title: '家长评价老师/课程',
      type: 'teacher'
    },
    component: resolve => require(['../page/teacher/course/commentDetail/viewParentComment/viewParentComment'], resolve)
  },
  // 历史上课记录
  {
    path: '/teacher/history',
    name: 'teacherHistory',
    meta: {
      title: '上课历史记录',
      type: 'teacher'
    },
    component: resolve => require(['../page/common/history/history'], resolve)
  },

  // 活动课程
  {
    path: '/teacher/activityCourse/list',
    name: 'teacherCourseList',
    meta: {
      title: '上课历史记录',
      type: 'teacher'
    },
    component: resolve => require(['../page/teacher/activityCourse/List'], resolve)
  },
    /**活动课程详情 */
    {
      path: '/teacher/activityCourse/desc',
      name: 'activityCourseDesc',
      meta: {
        title: '活动课程详情',
        type: 'teacher'
      },
      component: resolve => require(['../page/teacher/activityCourse/Desc'],resolve)
    },
]
export default router