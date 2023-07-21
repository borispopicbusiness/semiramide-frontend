<template>
  <v-snackbar
    v-model="ssb"
    color="green-lighten-2"
  >{{ successText }}
    <template v-slot:actions>
      <v-btn
        color="black"
        variant="text"
        @click="ssb = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar
    v-model="esb"
    color="red">{{ errorText }}
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="esb = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <div v-if="assignedEmployeesList.length > 0">
    <div class="table-wrapper">
      <v-table class="table">
        <template v-slot:default>
          <subordinates-table-header/>
          <tbody>
          <subordinates-table-row
            v-for="employee in assignedEmployeesList"
            :key="employee.id"
            :employee="employee"
            :selected-employee-id="projectId"
            @subordinate-unassigned="subordinateUnassigned"/>
          </tbody>
        </template>
      </v-table>
    </div>
  </div>
  <div v-else class="no-employees-div table-wrapper">
    <div v-if="projectId !== ''"><p class="no-employees-text">No subordinates</p></div>
    <div v-else><p class="no-employees-text">Please select project</p></div>
  </div>
  <v-btn v-if="projectId !== ''" variant="outlined" @click="showAssignSubordinatesDialog">Assign subordinate</v-btn>
  <assign-employee-to-project-dialog
    :assignedEmployees="assignedEmployeesList"
    :employee-id="projectId"
    :show="showAssignDialog"
    @selectedSubordinatesAssigned="selectedSubordinatesAssigned"
    @assign-subordinates-dialog-closed="assignSubordinatesDialogClosed"
    @subordinate-assigned="subordinateAssigned"/>
</template>

<script>
import SubordinatesTableHeader from "@/components/employee/employee-hierarchy/SubordinatesTableHeader.vue";
import SubordinatesTableRow from "@/components/employee/employee-hierarchy/SubordinatesTableRow.vue";
import employeeStore from "@/vuex/EmployeeStore";
import projectStore from "@/vuex/ProjectStore";
import AssignEmployeeToProjectDialog from "@/components/project/project-assignment/AssignEmployeeToProjectDialog.vue";

export default {
  components: {AssignEmployeeToProjectDialog, SubordinatesTableRow, SubordinatesTableHeader},
  props: {
    projectId: String,
    assignedEmployeesList: Array,
    projectEmployeesList: Array,
  },
  data() {
    return {
      ssb: false,
      esb: false,
      successText: "",
      errorText: "",
      showAssignDialog: false,
      AEL: this.assignedEmployeesList,
      employees: []
    };
  },
  computed: {
    allProjects() {
      return projectStore.getters.getAllProjects
    },
    assignedEmployees() {
      return employeeStore.getters.getAssignedEmployees
    },
    getProjectEmployees() {
      return projectStore.getters.getProjectEmployees
    }
  },
  mounted() {
    projectStore.dispatch('findAllProjects')
  },
  watch: {
    projectId(eid) {
      this.fetchImmediateSubordinates(eid);
      this.$emit('projectChanged')
    },

  },
  methods: {
    fetchImmediateSubordinates: async function (eid) {
      console.log("Ulazi ovde")
      // console.log("eid: " + eid);
      // console.log(this.projectEmployeesList.length + " - number of employees assigned to selected project")
      // const projectEmployees = await axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/project-employees/projectId/' + eid,
      //   {
      //     headers: {
      //       'Access-Controll-Allow-Origin': '*',
      //       'Access-Controll-Allow-Methods': '*',
      //       Authorization: `Bearer ${localStorage.getItem("vue-token")}`
      //     }
      //   }
      // ).then((response) => {
      //   // eslint-disable-next-line vue/no-mutating-props
      //   this.projectEmployeesList = response.data
      // });
      //
      // console.log(this.projectEmployeesList.length + " - number of employees assigned to selected project")
      // for (let i = 0; i < this.projectEmployeesList.length; i++) {
      //   console.log("i: " + i);
      //   const employees = await
      //     axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/' + this.projectEmployeesList[i].employeesId,
      //       {
      //         headers: {
      //           'Access-Control-Allow-Origin': '*',
      //           'Access-Control-Allow-Methods': '*',
      //           Authorization: `Bearer ${localStorage.getItem("vue-token")}`
      //         }
      //       }).then((response) => {
      //       // eslint-disable-next-line vue/no-mutating-props
      //       this.assignedEmployeesList.push(response.data)
      //     });
      //   console.log(employees)
      //   console.log(projectEmployees)
      // }
    },
    showAssignSubordinatesDialog() {
      this.showAssignDialog = true;
    },
    assignSubordinatesDialogClosed() {
      this.showAssignDialog = false;
    },
    subordinateAssigned(parentId) {
      this.fetchImmediateSubordinates(parentId);
    },
    subordinateUnassigned(parentId) {
      console.log("subordinateUnassigned")
      this.fetchImmediateSubordinates(parentId)
    },
    selectedSubordinatesAssigned() {
      this.ssb = true;
      this.successText = "Successfully assigned subordinate(s)";
    }

  }
};
</script>

<style scoped>
.table-wrapper {
  height: 320px;
  padding: 5px;
  margin-bottom: 30px;
  overflow-y: scroll;
}

.table-wrapper::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.table-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(51, 102, 189, 0.5);
}

.no-employees-text {
  font-size: 36px;
  font-weight: bold;
  color: #AAA;
  line-height: 1.5;
}

.no-employees-div {
  text-align: center;
  padding: 20px;
}

</style>
