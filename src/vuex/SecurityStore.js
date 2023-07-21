import Vuex from 'vuex';
// Create a new store instance.
const securityStore = new Vuex.Store({
  state() {
    return {
      keycloak: null,
      isAdmin: false,
      isEmployee: false,
    }
  },
  mutations: {
    setEmployee(state, isEmployee) {
      state.isEmployee = isEmployee;
    },
    setKeycloak(state, kc) {
      state.keycloak = kc;
    },
    setAdmin(state, isAdmin) {
      state.isAdmin = isAdmin
    }
  },
  actions: {
    setKeycloak(context, keycloak) {
      context.commit('setKeycloak', keycloak)
    },
    isAdmin({commit}) {
      let jwt = localStorage.getItem("vue-token")
      let jwtData = jwt.split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      let roles = decodedJwtData.roles;
      commit('setAdmin', roles.includes("ROLE_ADMIN"))
    },
    isEmployee({commit}) {
      let jwt = localStorage.getItem("vue-token")
      let jwtData = jwt.split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      let roles = decodedJwtData.roles;
      commit('setEmployee', roles.includes("ROLE_EMPLOYEE"))
    }
  },
  getters: {
    isAdmin(state) {
      return state.isAdmin
    },
    isEmployee(state) {
      return state.isEmployee
    },
    getKeycloak(state) {
      return state.keycloak
    }
  }
})

export default securityStore;
