const login = (state, payLoad) => {
  state.userInfo = Object.assign({}, payLoad)
  state.userLogin = true
}
const saveCurrentCourse = (state, currentCourse) => {
  state.currentCourse = currentCourse
}
export {
  login,
  saveCurrentCourse
}