<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      width="700px">
      <v-card>
        <v-card-title>Assign employees</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 700px;">
          <v-table height="700px">
            <tbody>
            <assign-subordinates-table-row
              v-for="employee in unassignedEmployees"
              :key="employee.id"
              :employee="employee"
              @employee-checked="addEmployeeForAssignment"
              @employee-un-checked="removeEmployeeForAssignment"/>
            </tbody>
          </v-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" text @click="assignSelectedEmployees">Assign</v-btn>
          <v-btn text @click="close">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import AssignSubordinatesTableRow from "@/components/employee/employee-hierarchy/AssignSubordinatesTableRow.vue";
import axios from "axios";
import projectStore from "@/vuex/ProjectStore";

export default {
  name: "assignEmployeeToProjectDialog",
  components: {AssignSubordinatesTableRow},
  emits: ['assignEmployeesDialogClosed', 'selectedEmployeesAssigned'],
  props: {
    selectedProjectId: String,
    employeeId: String,
    show: Boolean,
  },
  data() {
    return {
      dialog: false,
      selectedEmployees: [],
      employees: [],
      unassignedEmployees: [],
    }
  },

  watch: {
    show(newValue) {
      this.dialog = newValue;
      this.fetchAvailableEmployees();
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$emit('assignEmployeesDialogClosed');
    },
    addEmployeeForAssignment(employeeId) {
      this.selectedEmployees.push(employeeId);
    },
    removeEmployeeForAssignment(employeeId) {
      let i = this.selectedEmployees.indexOf(employeeId);
      this.selectedEmployees.splice(i, 1);
    },
    fetchAvailableEmployees() {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + "/project-employees/non-assigned-employees/" + this.selectedProjectId,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        this.unassignedEmployees = response.data
      });
    },
    assignSelectedEmployees() {
      for (let childId of this.selectedEmployees) {
        this.assignEmployee(this.employeeId, childId);
      }
      this.selectedEmployees = []
      this.close();
    },
    assignEmployee(parentId, childId) {
      let employeeProject = {projectId: parentId, childId: childId}
      projectStore.dispatch('createProjectEmployees', employeeProject).then(() => {
        this.$emit('selectedEmployeesAssigned');
      })
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(51, 102, 189, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>
