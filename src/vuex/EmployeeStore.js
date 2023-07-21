import Vuex from 'vuex'
import axios from "axios";
import EventBus from "@/vuex/EventBus";

const employeeStore = new Vuex.Store({
  state() {
    return {
      successEmployeeCreationSnackbar: false,
      successEmployeeCreationText: "Employee created successfully!",
      errorEmployeeCreationSnackbar: false,
      errorEmployeeCreationText: "",
      allEmployees: [],
      subordinates: [],
      loggedUser: '',
      assignedEmployees: []
    }
  },
  mutations: {
    addEmployee(state, employee) {
      state.allEmployees.push(employee);
    },
    clearAssignedEmployees(state) {
      state.assignedEmployees = []
    },
    saveAssignedEmployees(state, assignedEmployees) {
      state.assignedEmployees = assignedEmployees
    },
    saveAssignedEmployee(state, assignedEmployee) {
      state.assignedEmployees.push(assignedEmployee)
    },
    addAllEmployees(state, employees) {
      state.allEmployees = employees;
    },
    addAllSubordinates(state, subs) {
      state.subordinates = subs;
    },
    showSuccessEmployeeCreationSnackbar(state, show) {
      state.successEmployeeCreationSnackbar = show;
    },
    showErrorEmployeeCreationSnackbar(state, show) {
      state.errorEmployeeCreationSnackbar = show;
    },
    setErrorEmployeeCreationText(state, text) {
      state.errorEmployeeCreationText = text;
    },
    setSuccessEmployeeCreationText(state, text) {
      state.successEmployeeCreationText = text
    },
    removeEmployeeById(state, employeeId) {
      let i = 0;
      while (i < state.allEmployees.length) {
        if (state.allEmployees[i].id === employeeId) {
          state.allEmployees.splice(i, 1);
          break;
        }
        i++;
      }
    },
    saveLoggedUser(state, loggedUser) {
      state.loggedUser = loggedUser
    },
    employeeUpdated(state, employee) {
      let i = 0;
      while (i < state.allEmployees.length) {
        if (state.allEmployees[i].id === employee.id) {
          state.allEmployees[i].firstName = employee.firstName;
          state.allEmployees[i].lastName = employee.lastName;
          state.allEmployees[i].email = employee.email;
          state.allEmployees[i].password = employee.password;
        }
        i++;
      }
    },
    employeeUpdateFailed() {

    }
  },
  actions: {
    getEmployeeById(_, id) {
      let i = 0;
      while (i < this.state.allEmployees.length) {
        if (this.state.allEmployees[i].id === id) {
          return this.state.allEmployees[i];
        }
        i++;
      }
    },
    fetchLoggedUser({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/me',
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit("saveLoggedUser", response.data)
      });
    },
    async findEmployeeId({commit}, employeeId) {
      await axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/' + employeeId,

        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit("saveAssignedEmployees", response.data)
      });
    },
    fetchAllEmployees({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + "/employee",
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit('addAllEmployees', response.data)
      });
    },
    fetchSubordinates({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + "/employee/subordinates",
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit('addAllSubordinates', response.data)
      });
    },
    createEmployeeOld2({commit}, employee) {
      axios.post(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee', {
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          password: employee.password,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then(response => {
        if (Object.prototype.hasOwnProperty.call(response.data, "errorCode")) {
          commit('setErrorEmployeeCreationText', "Error: " + response.data.errorCode + "; " + response.data.errorMessage);
          commit('showErrorEmployeeCreationSnackbar', true);
        } else {
          commit('addEmployee', response.data);
          commit('showSuccessEmployeeCreationSnackbar', true);
        }
      })
    },
    createEmployee({commit}, employee) {
      return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee', {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            password: employee.password,
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          console.log("Then store")
          commit('addEmployee', response.data)
          resolve(response)
        }, error => {
          console.log("Catch store")
          reject(error)
        })
      });
    },
    updateEmployee({commit}, employee) {
      axios.put(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee', {
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          password: employee.password,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then(response => {
        commit('employeeUpdated', response.data);
      }).catch((error) => {
        commit('employeeUpdateFailed', error.response.data);
      })
    },
    changePassword(_, newPassword) {
      return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/me/change-password', {
            newPassword: newPassword,
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          console.log(response)
          resolve(response)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
      })
    },
    deleteEmployee({commit}, employeeId) {
      axios.delete(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/' + employeeId,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then(response => {
        if (Object.prototype.hasOwnProperty.call(response.data, "errorCode")) {
          console.log("error happened during deletion")
        } else {
          commit('removeEmployeeById', employeeId);
        }
      })
    },
    isAdmin() {
      let jwt = localStorage.getItem("vue-token")
      let jwtData = jwt.split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      let roles = decodedJwtData.roles;
      return roles.includes("ROLE_ADMIN");
    }
  },
  getters: {
    getEmployeeById: (state) => (id) => {
      return state.allEmployees.find(e => e.id === id);
    },
    getAllEmployees(state) {
      return state.allEmployees;
    },
    getSubordinates(state) {
      return state.subordinates;
    },
    shouldShowSuccessEmployeeCreationSnackbar(state) {
      return state.successEmployeeCreationSnackbar;
    },
    shouldShowErrorEmployeeCreationSnackbar(state) {
      return state.successEmployeeCreationSnackbar;
    },
    successEmployeeCreationText(state) {
      return state.successEmployeeCreationText;
    },
    errorEmployeeCreationText(state) {
      return state.errorEmployeeCreationText;
    },
    getLoggedUser(state) {
      return state.loggedUser
    },
    getAssignedEmployees(state) {
      return state.assignedEmployees
    }
  }
})

employeeStore.subscribe((mutation) => {
  if (mutation.type === "removeEmployeeById") {
    EventBus.$emit('employee-deleted-event', mutation.payload);
  }
  if (mutation.type === "employeeUpdated") {
    EventBus.$emit('employee-updated-event', mutation.payload);
  }
  if (mutation.type === "employeeUpdateFailed") {
    EventBus.$emit('employee-update-failed-event', mutation.payload);
  }
})

export default employeeStore
