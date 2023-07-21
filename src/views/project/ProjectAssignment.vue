<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="4">
        <v-sheet class="ma-2 pa-2">
          <v-autocomplete
            v-model="selectedProjectId"
            :items="dropDownEntries"
            label="Project"
            variant="underlined"
            @update:modelValue="projectChanged">
          </v-autocomplete>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12"
             sm="12">
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color">{{ snackbar.text }}
          <template v-slot:actions>
            <v-btn
              :color="snackbar.buttonColor"
              variant="text"
              @click="snackbar.show = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
        <v-sheet class="ma-2 pa-2">
          <div v-if="assignedEmployees.length > 0">
            <div class="table-wrapper">
              <v-table class="table">
                <template v-slot:default>
                  <assigned-employee-table-header/>
                  <tbody>
                  <assigned-employee-table-row
                    v-for="employee in assignedEmployees"
                    :key="employee.id"
                    :employee="employee"
                    :project-id="selectedProjectId"
                    :selected-employee-id="selectedProjectId"
                    @employee-unassigned="employeeUnassigned"/>
                  </tbody>
                </template>
              </v-table>
            </div>
          </div>
          <div v-else class="no-employees-div table-wrapper">
            <div v-if="selectedProjectId !== null && selectedProjectId !== ''"><p class="no-employees-text">No
              assignees</p></div>
            <div v-else class="no-employees-div"><p class="no-employees-text">Please select project</p></div>
          </div>
          <v-btn
            v-if="selectedProjectId !== null && selectedProjectId !== ''"
            variant="outlined"
            @click="showAssignSubordinatesDialog">
            Assign employee
          </v-btn>
          <assign-employee-to-project-dialog
            :employee-id="selectedProjectId"
            :selected-project-id="selectedProjectId"
            :show="showAssignDialog"
            @selected-employees-assigned="selectedEmployeesAssigned"
            @assign-employees-dialog-closed="assignEmployeesDialogClosed"/>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import axios from "axios";
import AssignEmployeeToProjectDialog from "@/components/project/project-assignment/AssignEmployeeToProjectDialog.vue";
import AssignedEmployeeTableHeader from "@/components/project/project-assignment/AssignedEmployeeTableHeader.vue";
import AssignedEmployeeTableRow from "@/components/project/project-assignment/AssignedEmployeeTableRow.vue";
import projectStore from "@/vuex/ProjectStore";

export default {
  name: "ProjectAssignment",
  components: {
    AssignedEmployeeTableRow,
    AssignedEmployeeTableHeader, AssignEmployeeToProjectDialog
  },
  data() {
    return {
      select: null,
      selectedProjectId: "",
      dropDownEntries: [],
      ssb: false,
      esb: false,
      successText: "",
      errorText: "",
      showAssignDialog: false,
      assignedEmployees: [],
      snackbar: {
        show: false,
        color: "green-lighten-2",
        buttonColor: "black",
        text: ""
      }
    }
  },
  mounted() {
    this.initializeDropDownEntries();
  },
  computed: {
    allProjects() {
      return projectStore.getters.getAllProjects;
    }
  },
  methods: {
    initializeDropDownEntries() {
      for (const element of this.allProjects) {
        let entry = element.name;
        this.dropDownEntries.push({
          value: element.id,
          title: entry,
        });
      }
    },
    projectChanged() {
      if (this.selectedProjectId === null || this.selectedProjectId === "") {
        return;
      }
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/project-employees/assigned-employees/' + this.selectedProjectId,
        {
          headers: {
            'Access-Controll-Allow-Origin': '*',
            'Access-Controll-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then(response => {
        this.assignedEmployees = response.data
      }, () => {

      })
    },
    showAssignSubordinatesDialog() {
      this.showAssignDialog = true;
    },
    assignEmployeesDialogClosed() {
      this.showAssignDialog = false;
    },
    subordinateUnassigned(parentId) {
      console.log("subordinateUnassigned")
      this.fetchImmediateSubordinates(parentId)
    },
    selectedEmployeesAssigned() {
      this.projectChanged();
      this.snackbar.show = true;
      this.snackbar.text = "Successfully assigned employees(s)";
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black";
    },
    employeeUnassigned(employeeId) {
      let i = 0;
      while (i < this.assignedEmployees.length) {
        if (this.assignedEmployees[i].id === employeeId) {
          this.assignedEmployees.splice(i, 1);
          break;
        }
        i++;
      }
      this.snackbar.show = true;
      this.snackbar.text = "Employee unassigned";
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black";
    }
  }
}

</script>

<style scoped>
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
