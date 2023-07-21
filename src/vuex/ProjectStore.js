import Vuex from 'vuex'
import axios from "axios";

const projectStore = new Vuex.Store({
  state() {
    return {
      allProjects: [],
      myProjects: [],
      employeeProjects: [],
      projectEmployees: []
    }
  },

  mutations: {
    setAllProjects(state, projects) {
      state.allProjects = projects
    },
    setEmployeeProjects(state, employeeProjects) {
      state.employeeProjects = employeeProjects
    },
    addEmployeeProjects(state, employeeProject) {
      state.employeeProjects.push(employeeProject)
    },
    saveMyProjects(state, myProject) {
      state.myProjects.push(myProject)
    },
    setMyProjects(state, myProjects) {
      state.myProjects = myProjects;
    },
    saveProject(state, project) {
      state.allProjects.push(project)
    },
    clearProjectEmployeesList(state) {
      state.projectEmployees = []
    },
    async deleteProject(state, projectId) {
      let i = 0;
      while (i < state.allProjects.length) {
        if (state.allProjects[i].id === projectId) {
          state.allProjects.splice(i, 1);
          break;
        }
        i++;
      }
      i = 0;
      while (i < state.myProjects.length) {
        if (state.myProjects[i].id === projectId) {
          state.myProjects.splice(i, 1);
          break;
        }
        i++;
      }
    },
    setProjectEmployeesByProjectId(state, projectEmployees) {
      state.projectEmployees = projectEmployees
    }
  },

  actions: {
    createProjectEmployees({commit}, projectEmployee) {
      return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_GATEWAY_ADDRESS + '/project-employees', {
            projectId: projectEmployee.projectId,
            employeesId: projectEmployee.childId
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then((response) => {
          commit('addEmployeeProjects', response.data)
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    async deleteProjectEmployee(_, projectEmployee) {
      return new Promise((resolve, reject) => {
          axios.delete(import.meta.env.VITE_GATEWAY_ADDRESS
            + '/project-employees?projectId=' + projectEmployee.projectId
            + '&'
            + 'employeeId=' + projectEmployee.employeeId, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
            resolve(response);
          }, error => {
            reject(error)
          })
        }
      )
    },
    async findByProjectId({commit}, projectId) {
      await axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/projectId/' + projectId,

        {
          headers: {
            'Access-Controll-Allow-Origin': '*',
            'Access-Controll-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }
      ).then((response) => {
        commit("setProjectEmployeesByProjectId", response.data)
      })
    },
    findAllProjects({commit}) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/project',
        {
          headers: {
            'Access-Controll-Allow-Origin': '*',
            'Access-Controll-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }
      ).then((response) => {
        commit("setAllProjects", response.data)
      })
    },
    findEmployeeProjects({commit}) {
      return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/project-employees/subordinates',
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }
        ).then((response) => {
          commit('setEmployeeProjects', response.data)
          resolve(response)
        }, error => reject(error))
      });

    },
    findProjectById({commit}, id) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/project/' + id, {

        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          Authorization: `Bearer ${localStorage.getItem("vue-token")}`
        }
      }).then((response) => {
        commit('saveMyProjects', response.data)
      });
    },
    async createProject({commit}, project) {
      return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_GATEWAY_ADDRESS + '/project',
          {
            name: project.name,
            description: project.description
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          commit('saveProject', response.data)
          resolve(response)
        }, error => {
          reject(error)
        });
      })
    },
    async deleteProject({commit}, projectId) {
      axios.delete(import.meta.env.VITE_GATEWAY_ADDRESS + '/project/' + projectId,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then(response => {
        commit('deleteProject', projectId);
      })
    },
    async updateProject(_, project) {
      return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_GATEWAY_ADDRESS + '/project', {
            id: project.id,
            name: project.name,
            description: project.description
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              Authorization: `Bearer ${localStorage.getItem("vue-token")}`
            }
          }).then(response => {
          resolve(response)
        }, error => {
          reject(error)
        });
      })
    },
    setMyProjects({commit}, myProjects) {
      commit('setMyProjects', myProjects)
    }
  },

  getters: {
    getAllProjects(state) {
      return state.allProjects
    },
    getMyProjects(state) {
      return state.myProjects
    },
    getEmployeeProjects(state) {
      return state.employeeProjects
    },
    getProjectEmployees(state) {
      return state.projectEmployees
    }
  }
})

export default projectStore
