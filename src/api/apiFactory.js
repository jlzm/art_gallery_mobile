import {
  sendRequest,
  sendFormData
} from '../global/httpConfig'
export default {
  homeAPI: {
    // 登录接口
    login: async function login(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/applogin'
        })
        .then(data => data)
    },
    // 获取用户信息
    getUserInfo: async function getUserInfo(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/getWxUser'
        })
        .then(data => data)
    },
    /* 家长端 */

    /**
     * 获取活动课程列表
     * @param {*} obj 
     */
    getCourseByPage: async function getCourseByPage(obj) {
      return sendRequest({
        method: 'post',
        data: obj,
        url: '/getCourseByPage'
      })
    },

    // 首页获取学生信息
    // params: sid学生id
    wxAppGetStudent: async function wxAppGetStudent(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/wxAppGetStudent'
        })
        .then(data => data)
    },
    // 获取评论详情
    // params: crid 课程id
    // tid 老师id
    // type 1老师 2家长
    // sid 学生id
    wxEvaluationByStu: async function wxEvaluationByStu(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/wxEvaluationByStu'
        })
        .then(data => data)
    },
    // 家长评论老师插入
    insertParentEvaluation: async function insertParentEvaluation(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/insertParentEvaluation'
        })
        .then(data => data)
    },
    // 首页获取本周课程安排
    // params:
    // begindate,enddate一周开始与结束
    // tid(非必需)筛选老师信息
    getWxCourseByWeek: async function wxStudentCourse(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/wxCourseByWeek'
        })
        .then(data => data)
    },
    // paramas :
    // ctype: 1->获取历史上课记录 2->获取活动课程
    // sid -> 学生id
    wxStudentCourse: async function wxStudentCourse(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/wxStudentCourse'
        })
        .then(data => data)
    },
    /**老师端 */
    // 首页获取老师信息
    // params: tid 教师id
    wxAppGetTeacher: async function wxAppGetTeacher(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/wxAppGetTeacher'
        })
        .then(data => data)
    },
    // 获取老师历史上课记录
    // params: tid
    wxTeacherCourse: async function wxTeacherCourse(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/wxTeacherCourse'
        })
        .then(data => data)
    },

    // 获取课程签到信息
    // params: crid 课程id
    getSignData: async function getSignData(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/wxSignArrive'
        })
        .then(data => data)
    },
    // 签到 及消费一次课时
    // params: sid 学生id集合
    // tid 教师id
    // crid 课程id 
    consumeStuPeriod: async function consumeStuPeriod(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/consumeStuPeriod'
        })
        .then(data => data)
    },
    // 获取该次课程评论信息
    // params crid 课程id
    // tid 教师id
    // type 1老师评价2家长评价
    getCommentData: async function wxEvaluationByTeacher(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/wxEvaluationByTeacher'
        })
        .then(data => data)
    },
    // 获取课程动态信息
    // params: ftype photo 照片 view 视频
    // crid 课程id
    getTrend: async function getTrend(obj) {
      return sendRequest({
          method: 'post',
          data: obj,
          url: '/getCourseDynamic'
        })
        .then(data => data)
    },

  },
  formAPI: {
    // 评论添加图片
    sendComment: async function login(obj) {
      return sendFormData({
          method: 'post',
          data: obj,
          url: '/insertTeEvaluation'
        })
        .then(data => data)
    },
    // 动态添加图片和视频
    // params: ftype photo 照片 view 视频
    // crid 课程id file
    uploadTrend: async function uploadTrend(obj) {
      return sendFormData({
          method: 'post',
          data: obj,
          url: '/insertCoursePhotoView'
        })
        .then(data => data)
    },
  }
}
