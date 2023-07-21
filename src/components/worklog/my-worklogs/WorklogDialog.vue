<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      max-width="700px"
      persistent>
      <v-card>
        <v-card-title class="headline">Worklog details</v-card-title>
        <v-card-text>
          <v-table>
            <tbody>
            <tr>
              <td class="fieldName" style="width: 100px">Employee</td>
              <td v-if="dialogType === 'NEW' || dialogType === 'EDIT'">
                <v-autocomplete
                  v-model="employeeAutocomplete.selectedEmployeeId"
                  :items="employeeAutocomplete.dropDownEntries"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                />
              </td>
              <td v-else>
                {{ employeeFullName }}
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Project</td>
              <td v-if="dialogType === 'NEW' || dialogType === 'EDIT'">
                <v-select
                  v-model="worklogDetails.projectName"
                  :items="projectNames"
                  bg-color="transparent"
                  density="compact"
                  hide-details="auto"
                  reqired
                  variant="solo"
                ></v-select>
              </td>
              <td v-else>
                {{ projectName(worklog.projectId) }}
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Type</td>
              <td v-if="dialogType === 'NEW' || dialogType === 'EDIT'">
                <v-select
                  v-model="worklogDetails.type"
                  :items="worklogTypes"
                  bg-color="transparent"
                  density="compact"
                  hide-details="auto"
                  reqired
                  variant="solo"
                ></v-select>
              </td>
              <td v-else>
                {{ worklog.type }}
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Task</td>
              <td v-if="dialogType === 'NEW' || dialogType === 'EDIT'">
                <v-text-field
                  v-model="worklogDetails.taskName"
                  bg-color="white"
                  density="compact"
                  hide-details="auto"
                  variant="solo"></v-text-field>
              </td>
              <td v-else>
                {{ worklog.taskName }}
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Description</td>
              <td v-if="dialogType === 'NEW' || dialogType === 'EDIT'">
                <v-textarea
                  v-model="worklogDetails.description"
                  bg-color="white"
                  density="compact"
                  hide-details="auto"
                  variant="solo"></v-textarea>
              </td>
              <td v-else>
                {{ worklog.description }}
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Time</td>
              <td v-if="dialogType === 'NEW' || dialogType === 'EDIT'">
                <v-text-field
                  v-model="worklogDetails.totalTime"
                  bg-color="white"
                  density="compact"
                  hide-details="auto"
                  variant="solo"></v-text-field>
              </td>
              <td v-else>
                {{ Number(worklog.totalTime).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Date</td>
              <td v-if="dialogType === 'NEW' || dialogType === 'EDIT'">
                <v-text-field
                  v-model="worklogDetails.creationDate"
                  bg-color="white"
                  density="compact"
                  hide-details="auto"
                  type="date"
                  variant="solo"></v-text-field>
              </td>
              <td v-else>
                {{ worklog.creationDate }}
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <section v-if="type === 'NEW'">
            <v-btn
              text
              @click="addNewWorklog">Add
            </v-btn>
            <v-btn
              text
              @click="closeDialog">Cancel
            </v-btn>
          </section>
          <section v-if="type === 'EDIT'">
            <v-btn
              :disabled="!isWorklogModified"
              text
              @click="updateWorklog">Apply
            </v-btn>
            <v-btn
              text
              @click="closeDialog">Cancel
            </v-btn>
          </section>
          <section v-else-if="type === 'DETAILS'">
            <v-btn
              text
              @click="closeDialog">Close
            </v-btn>
          </section>
          <section v-else></section>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>

import worklogsStore from "@/vuex/WorklogStore";
import employeeStore from "@/vuex/EmployeeStore";

export default {
  name: "WorklogDialog",
  emits: ['worklogDialogClosed', 'worklogCreated', 'worklogCreationError', 'worklogUpdated', 'worklogUpdatingError'],
  data() {
    return {
      show: false,
      dialogType: this.type,
      worklogDetails: {
        id: this.worklog.id,
        employeeId: this.worklog.employeeId,
        projectName: this.projectName(this.worklog.projectId),
        projectId: this.worklog.projectId,
        type: this.worklog.type,
        taskName: this.worklog.taskName,
        description: this.worklog.description,
        totalTime: Number(this.worklog.totalTime).toFixed(2),
        creationDate: this.worklog.creationDate
      },
      employeeAutocomplete: {
        initialValue: "",
        initialTitle: "",
        selectedEmployeeId: "",
        dropDownEntries: []
      }
    }
  },
  props: {
    showDialog: Boolean,
    type: String,
    worklog: Object,
    projects: Array,
    worklogTypes: Array,
    selectedDate: String
  },
  watch: {
    showDialog(newValue) {
      this.show = newValue;
      if (newValue === true) {
        this.initializeDropDownEntries();
      }
    },
    type(newValue) {
      this.dialogType = newValue;
    },
    worklog(newValue) {
      this.worklogDetails.id = newValue.id;
      this.worklogDetails.employeeId = newValue.employeeId;
      this.worklogDetails.projectName = this.projectName(newValue.projectId);
      this.worklogDetails.projectId = newValue.projectId;
      this.worklogDetails.type = newValue.type;
      this.worklogDetails.taskName = newValue.taskName;
      this.worklogDetails.description = newValue.description;
      this.worklogDetails.totalTime = Number(newValue.totalTime).toFixed(2);
      this.worklogDetails.creationDate = newValue.creationDate;
    }
  },
  computed: {
    employeeFullName() {
      if (this.worklog !== undefined) {
        let e = employeeStore.getters.getEmployeeById(this.worklog.employeeId);
        return e.firstName + " " + e.lastName;
      }
      return undefined;
    },
    projectNames() {
      return this.projects.map(project => project.name);
    },
    isWorklogModified() {
      return (
        this.worklog.projectId !== this.worklogDetails.projectId ||
        this.worklog.type !== this.worklogDetails.type ||
        this.worklog.taskName !== this.worklogDetails.taskName ||
        this.worklog.description !== this.worklogDetails.description ||
        this.worklog.totalTime !== this.worklogDetails.totalTime ||
        this.worklog.creationDate !== this.worklogDetails.creationDate
      );
    }
  },
  updated() {
    for (let i in this.projects) {
      if (this.projects[i].id === this.worklog.projectId) {
        this.worklogDetails.projectName = this.projects[i].name;
      }
    }
  },
  methods: {
    initializeDropDownEntries() {
      this.employeeAutocomplete.dropDownEntries = [];
      for (const employee of employeeStore.getters.getSubordinates) {
        let fullName = employee.firstName + " " + employee.lastName;
        this.employeeAutocomplete.dropDownEntries.push({
          value: employee.id,
          title: fullName,
        });
      }
      this.employeeAutocomplete.dropDownEntries.push({
        value: employeeStore.getters.getLoggedUser.id,
        title: employeeStore.getters.getLoggedUser.firstName + " " + employeeStore.getters.getLoggedUser.lastName
      });
      if (this.dialogType === "NEW") {
        this.employeeAutocomplete.selectedEmployeeId = employeeStore.getters.getLoggedUser.id;
      } else {
        this.employeeAutocomplete.selectedEmployeeId = this.worklog.employeeId;
      }
    },
    projectName(projectId) {
      for (let i in this.projects) {
        if (this.projects[i].id === projectId) {
          return this.projects[i].name;
        }
      }
      return "";
    },
    closeDialog() {
      this.show = false;
      this.$emit("worklogDialogClosed");
    },
    updateWorklog() {
      let worklogRequest = {
        id: this.worklogDetails.id,
        employeeId: this.worklogDetails.employeeId,
        projectId: this.getProjectId(this.worklogDetails.projectName),
        type: this.worklogDetails.type,
        taskName: this.worklogDetails.taskName,
        description: this.worklogDetails.description,
        totalTime: this.worklogDetails.totalTime,
        creationDate: this.worklogDetails.creationDate
      }
      worklogsStore.dispatch('updateWorklog', worklogRequest)
        .then(resolve => {
          this.$emit('worklogUpdated', worklogRequest);
          this.closeDialog();
        }, reject => {
          this.$emit('worklogUpdatingError', reject)
          this.closeDialog();
        })
    },
    addNewWorklog() {
      let worklogRequest = {
        projectId: this.getProjectId(this.worklogDetails.projectName),
        type: this.worklogDetails.type,
        taskName: this.worklogDetails.taskName,
        description: this.worklogDetails.description,
        totalTime: this.worklogDetails.totalTime,
        creationDate: this.worklogDetails.creationDate,
        employeeId: this.employeeAutocomplete.selectedEmployeeId
      }
      worklogsStore.dispatch('createWorklog', worklogRequest)
        .then(resolve => {
          this.worklogDetails.type = '';
          this.worklogDetails.taskName = '';
          this.worklogDetails.description = '';
          this.worklogDetails.totalTime = '';
          this.$emit('worklogCreated');
          this.closeDialog();
        }, reject => {
          this.$emit('worklogCreationError', reject.response.data)
          this.closeDialog();
        })
    },
    getProjectId(projectName) {
      const project = this.projects.find(project => project.name === projectName);
      return project ? project.id : null;
    }

  },

}

</script>
