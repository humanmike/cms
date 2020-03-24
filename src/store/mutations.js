export const mutations = {
  // 记录用户token值
  getUsrToken(state, payload){
    return state.userMsg.token = payload.token
  }
}