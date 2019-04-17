const login = (state, payLoad) => {
  state.userInfo = Object.assign({}, payLoad);
  state.userLogin = true;
};
const saveCurrentCourse = (state, currentCourse) => {
  state.currentCourse = currentCourse;
};

const accountInfo = (state, account) => {
  state.userAccountInfo = Object.assign({}, account);
}
export {
  login,
  accountInfo,
  saveCurrentCourse
};
