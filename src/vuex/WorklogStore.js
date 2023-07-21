import Vuex from 'vuex';
import axios from "axios";
import employeeStore from "@/vuex/EmployeeStore";

const worklogsStore = new Vuex.Store({
  state() {
    return {
      worklogs: [],
      subordinatesWorklogs: [],
      filteredWorklogs: [],
      worklogTypes: [],
      numberOfWorklogs: "",
    }
  },
  mutations: {
    saveWorklogs(state, worklogs) {
      state.worklogs = worklogs
    },
    saveWorklogTypes(state, types) {
      state.worklogTypes = types
    },
    updateWorklogList(state, worklog) {
      state.worklogs.push(worklog)
    },
    saveFilteredWorklogs(state, worklogs) {
      state.filteredWorklogs = worklogs
    },
    deleteWorklog(state, worklogId) {
      let i = 0;
      while (i < state.worklogs.length) {
        if (state.worklogs[i].id === worklogId) {
          state.worklogs.splice(i, 1);
          break;
        }
        i++;
      }
    },
    updateWorklog(state, worklog) {
      let i = 0;
      while (i < state.worklogs.length) {
        if (state.worklogs[i].id === worklog.id) {
          state.worklogs[i].employeeId = worklog.employeeId;
          state.worklogs[i].projectId = worklog.projectId;
          state.worklogs[i].type = worklog.type;
          state.worklogs[i].taskName = worklog.taskName;
          state.worklogs[i].description = worklog.description;
          state.worklogs[i].totalTime = worklog.totalTime;
          state.worklogs[i].creationDate = worklog.creationDate;
        }
        i++;
      }
    }
    // numberOfWorklogs(state, number){
    //   return state.numberOfWorklogs = Number(number)
    // }
  },
  getters: {
    getWorklogs(state) {
      return state.worklogs
    },
    getWorklogType(state) {
      return state.worklogTypes
    },
    getFilteredWorklogs(state) {
      return state.filteredWorklogs
    }
    // getNumberOfWorklogs(state){
    //   return state.numberOfWorklogs
    // }
  },
  actions: {
    fetchOwnWorklogs({commit}, params) {
      let date = params.date
      let page = params.page - 1
      axios.get(
        import.meta.env.VITE_GATEWAY_ADDRESS + '/worklog/own?creation-date='
        + date + '&page='
        + page, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit('saveWorklogs', response.data)
      });
    },
    fetchWorklogTypes({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/worklog/types', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          Authorization: `Bearer ${localStorage.getItem("vue-token")}`
        }
      }).then((response) => {
        commit('saveWorklogTypes', response.data)
      });
    },
    createWorklog({commit}, worklogRequest) {
      return new Promise((resolve, reject) => {
        if (isNaN(worklogRequest.totalTime)) {
          alert("Total time must be a number. s")
          return
        }
        if (worklogRequest.taskName === "") {
          alert("Task name cannot be empty.")
          return
        }
        axios.post(import.meta.env.VITE_GATEWAY_ADDRESS + '/worklog',
          worklogRequest,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          if (employeeStore.getters.getLoggedUser.id === response.data.employeeId) {
            commit('updateWorklogList', response.data)
          }
          resolve(response.data);
        }, error => {
          reject(error)
        })
      });
    },
    fetchFilteredWorklogs({commit}, url) {
      return new Promise((resolve, reject) => {
        axios.get(url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
          commit('saveFilteredWorklogs', response.data)
          resolve(response)
        }, error => reject(error));
      })
    },
    exportFilteredWorklogs(_, url) {
      return new Promise((resolve, reject) => {
        axios.get(url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          },
          responseType: 'blob',
        }).then((response) => {
          if (response.status === 204) {
            console.log("enters 204");
            resolve(response);
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "export.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            resolve(response);
          }
        }).catch(async error => {
          console.log("enters error");
          console.log(error);
          reject(JSON.parse(await error.response.data.text()));
        });
      });
    },
    updateWorklog({commit}, worklog) {
      return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_GATEWAY_ADDRESS + '/worklog', worklog,
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          commit('updateWorklog', worklog);
          resolve(response);
        }, error => reject(error));
      })

    },
    deleteWorklog({commit}, worklogId) {
      axios.delete(import.meta.env.VITE_GATEWAY_ADDRESS + '/worklog/' + worklogId,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        commit('deleteWorklog', worklogId)
      })
    },

  }

})
export default worklogsStore;
