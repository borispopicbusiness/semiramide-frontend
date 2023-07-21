import Vuex from 'vuex'
import axios from "axios";

const compareLeaves = (a, b) => {
  const dateA = new Date(a.startTime);
  const dateB = new Date(b.startTime);
  return dateA - dateB;
};

const leaveStore = new Vuex.Store({
  state() {
    return {
      allLeaves: [],
      ownLeaves: [],
      allSubordinatesLeaves: [],
      leaveTypes: [],
      leaveStatus: [],
    }
  },
  mutations: {
    saveAllLeaves(state, allLeaves) {
      state.allLeaves = allLeaves
      state.allLeaves.sort(compareLeaves)
    },
    saveLeaveTypes(state, types) {
      state.leaveTypes = types
    },
    saveLeaveStatus(state, status) {
      state.leaveStatus = status
    },
    saveOwnLeaves(state, ownLeaves) {
      state.ownLeaves = ownLeaves
      state.ownLeaves.sort(compareLeaves)
    },
    saveOwnLeave(state, ownLeave) {
      state.ownLeaves.push(ownLeave)
      state.ownLeaves.sort(compareLeaves)
    },
    saveOwnLeaveInAllLeaves(state, ownLeave) {
      state.allLeaves.push(ownLeave)
      state.allLeaves.sort(compareLeaves)
    },
    saveSubordinatesLeaves(state, subordinatesLeaves) {
      state.allSubordinatesLeaves = subordinatesLeaves
      state.allSubordinatesLeaves.sort(compareLeaves)
    },
    deleteLeave(state, leaveId) {
      let i = 0;
      while (i < state.allLeaves.length) {
        if (state.allLeaves[i].id === leaveId) {
          state.allLeaves.splice(i, 1);
          state.allLeaves.sort(compareLeaves)
          break;
        }
        i++;
      }
      i = 0;
      while (i < state.ownLeaves.length) {
        if (state.ownLeaves[i].id === leaveId) {
          state.ownLeaves.splice(i, 1);
          state.ownLeaves.sort(compareLeaves)
          break;
        }
        i++;
      }
      i = 0;
      while (i < state.allSubordinatesLeaves.length) {
        if (state.allSubordinatesLeaves[i].id === leaveId) {
          state.allSubordinatesLeaves.splice(i, 1);
          state.allSubordinatesLeaves.sort(compareLeaves)
          break;
        }
        i++;
      }
    },
    updateLeave(state, leave) {
      let i = 0;
      while (i < state.allLeaves.length) {
        if (state.allLeaves[i].id === leave.id) {
          state.allLeaves.splice(i, 1);
          state.allLeaves.push(leave);
          state.allLeaves.sort(compareLeaves)
        }
        i++;
      }
      i = 0;
      while (i < state.ownLeaves.length) {
        if (state.ownLeaves[i].id === leave.id) {
          state.ownLeaves.splice(i, 1);
          state.ownLeaves.push(leave);
          state.ownLeaves.sort(compareLeaves)
        }
        i++;
      }
      i = 0;
      while (i < state.allSubordinatesLeaves.length) {
        if (state.allSubordinatesLeaves[i].id === leave.id) {
          state.allSubordinatesLeaves.splice(i, 1);
          state.allSubordinatesLeaves.push(leave);
          state.allSubordinatesLeaves.sort(compareLeaves)
        }
        i++;
      }
    }
  },
  actions: {
    findAllLeaves({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave',
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit("saveAllLeaves", response.data)
      });
    },
    findOwnLeaves({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave/own',
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit("saveOwnLeaves", response.data)
      });
    },
    findSubordinatesLeaves({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave/subordinates-leaves',
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit("saveSubordinatesLeaves", response.data)
      });
    },
    findLeaveTypes({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave/types',
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit("saveLeaveTypes", response.data)
      });
    },
    findLeaveStatus({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave/status',
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit("saveLeaveStatus", response.data)
      });
    },
    requestLeave({commit}, leaveRequest) {
      return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave', {
            startTime: leaveRequest.fromDate,
            endTime: leaveRequest.toDate,
            description: leaveRequest.description,
            leaveType: leaveRequest.leaveType,
            leaveStatus: 'OPEN',
            requestDate: new Date(),
            responseComment: null,
            responderId: null,
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          commit('saveOwnLeave', response.data)
          commit('saveOwnLeaveInAllLeaves', response.data)
          resolve(response);
        }).catch(function (error) {
          if (error.response) {
            console.log(error.response.data.errorMessage)
            reject(error);
          }
        });
      })
    },
    approveLeave({commit}, leave) {
      return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave/approve', leave,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          commit("updateLeave", leave)
          resolve(response)
        }, error => reject(error));
      })
    },
    denyLeave({commit}, leave) {
      return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave/approve', leave,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          commit("updateLeave", leave)
          resolve(response)
        }, error => reject(error));
      })
    },
    updateLeave({commit}, leaveRequest) {
      return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave', {
            id: leaveRequest.id,
            employeeId: leaveRequest.employeeId,
            startTime: leaveRequest.startTime,
            endTime: leaveRequest.endTime,
            description: leaveRequest.description,
            leaveType: leaveRequest.leaveType,
            leaveStatus: leaveRequest.leaveStatus,
            requestDate: leaveRequest.requestDate,
            responseComment: leaveRequest.responseComment,
            responderId: leaveRequest.responderId
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          commit("updateLeave", response.data)
          resolve(response)
        }, error => {
          reject(error)
        })
      })


    },
    deleteLeave({commit}, leaveId) {
      return new Promise((resolve, reject) => {
        axios.delete(import.meta.env.VITE_GATEWAY_ADDRESS + '/leave/' + leaveId,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then((response) => {
          commit('deleteLeave', leaveId)
          resolve(response)
        }, error => {
          reject(error)
        });
      })

    }

  },

  getters: {
    getAllLeaves(state) {
      return state.allLeaves
    },
    getLeaveTypes(state) {
      return state.leaveTypes
    },
    getLeaveStatus(state) {
      return state.leaveStatus
    },
    getOwnLeaves(state) {
      return state.ownLeaves
    },
    getSubordinatesLeaves(state) {
      return state.allSubordinatesLeaves
    }
  }


})

export default leaveStore
