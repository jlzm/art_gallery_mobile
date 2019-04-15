const router = [
  /** parent */
  {
    path: '/parent',
    name: 'parent',
    redirect: {
      path: 'parent/home'
    }
  },
  {
    path: '/parent/home',
    name: 'parentHome',
    component: resolve => require(['../page/parent/home'],resolve),
    meta: {
      title: '会员中心'
    },
  },
  {
    path: '/parent/courseDetail',
    name: 'parentCourseDetail',
    component: resolve => require(['../page/parent/course/detail'],resolve),
    meta: {
      title: '课程详情'
    },
  },
  {
    path: '/parent/sign',
    name: 'parentSign',
    component: resolve => require(['../page/common/sign/sign'],resolve),
    meta: {
      title: '签到详情',
      type: 'parent'
    },
  },
  {
    path: '/parent/trends',
    name: 'parentTrends',
    meta: {
      title: '课程动态',
      meta: 'parent',
      type: 'parent'
    },
    component: resolve => require(['../page/teacher/course/dynamic/dynamic'],resolve),
    children: [
      {
        path: 'photo',
        name: 'parentPhotoView',
        meta: {
          title: '课程动态',
          type: 'parent'
        },
        component: resolve => require(['../page/teacher/course/dynamic/uploadPhoto'],resolve),
      },
      {
        path: 'vedio',
        name: 'parentVideoView',
        meta: {
          title: '课程动态',
          type: 'parent'
        },
        component: resolve => require(['../page/teacher/course/dynamic/uploadVedio'],resolve),
      }
    ]
  },
  {
    // 老师评价学生详情
    path: '/parent/commentDetail/:id',
    name: 'viewCommentDetail',
    meta: {
      title: '老师评价学生',
      type: 'parent'
    },
    component: resolve => require(['../page/teacher/course/commentDetail/commentDetail'],resolve)
  },
  {
    // 家长评价老师/课程
    path: '/parent/parentComment/:courseId',
    name: 'parentCommentDetail',
    meta: {
      title: '家长评价老师/课程',
      type: 'parent'
    },
    component: resolve => require(['../page/parent/course/commentDetail/commentDetail'],resolve)
  },
  {
    // 家长请假
    path: '/parent/leave',
    name: 'parentLeave',
    meta: {
      title: '家长评价老师/课程',
      type: 'parent'
    },
    component: resolve => require(['../page/parent/course/Leave'],resolve)
  },
  {
    // 报名课程
    path: '/parent/enteredCourse',
    name: 'enteredCourse',
    meta: {
      title: '报名课程',
      type: 'parent'
    },
    component: resolve => require(['../page/parent/course/enter/enter'],resolve)
  },
  // 历史上课记录
  {
    path: '/parent/history',
    name: 'parentHistory',
    meta: {
      title: '上课历史记录',
      type: 'parent'
    },
    component: resolve => require(['../page/common/history/history'],resolve)
  },

  /**活动课程模块 start */
  
  /**活动课程列表 */
  {
    path: '/parent/activityCourse/list',
    name: 'activityCourseList',
    meta: {
      title: '活动课程列表',
      type: 'parent'
    },
    component: resolve => require(['../page/parent/activityCourse/List'],resolve)
  },

  /**活动课程详情 */
  {
    path: '/parent/activityCourse/desc',
    name: 'activityCourseDesc',
    meta: {
      title: '活动课程详情',
      type: 'parent'
    },
    component: resolve => require(['../page/parent/activityCourse/Desc'],resolve)
  },

  /**活动课程模块 end */
]
export default router
