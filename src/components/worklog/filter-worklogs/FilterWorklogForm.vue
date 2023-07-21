<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
  >{{ snackbar.text }}
    <template v-slot:actions>
      <v-btn
        :color="snackbar.buttonColor"
        variant="text"
        @click="snackbar.show = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedEmployeesIds"
            :items="formattedEmployees"
            chips
            item-title="formattedName"
            item-value="id"
            label="Select employees"
            multiple
            small-chips
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedProjectsIds"
            :items="projects"
            chips
            item-title="name"
            item-value="id"
            label="Select projects"
            multiple
            small-chips
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="startDate"
            :rules="[v => !!v || 'Start date is required']"
            label="From"
            required
            type="date"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="endDate"
            :rules="[v => !!v || 'End date is required']"
            label="To"
            required
            type="date"
          ></v-text-field>
        </v-col>
        <v-row>
          <v-col cols="12" md="1">
            <v-btn
              class="me-0"
              type="submit"
              variant="outlined"
              @click="filterWorklogs"
            >
              Filter
            </v-btn>
          </v-col>
          <v-col cols="12" md="1">
            <v-btn
              class="me-0"
              type="submit"
              variant="outlined"
              @click="exportWorklogs"
            >
              Export
            </v-btn>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import worklogsStore from "@/vuex/WorklogStore";

export default {
  name: "FilterWorklogForm",
  emits: ['fetchFilteredWorklogs'],
  data: () => ({
    selectedEmployeesIds: [],
    selectedProjectsIds: [],
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    snackbar: {
      show: false,
      text: '',
      color: 'green-lighten-2',
      buttonColor: "black"
    }
  }),
  props: {
    employees: Array,
    projects: Array
  },
  computed: {
    formattedEmployees() {
      return this.employees.map(employee => ({
        ...employee,
        formattedName: `${employee.firstName} ${employee.lastName}`
      }))
    },
    filteredWorklogs() {
      return worklogsStore.getters.getFilteredWorklogs
    },

  },
  methods: {
    filterWorklogs(e) {
      if (!this.startDate || !this.endDate) {
        this.snackbar.show = true;
        this.snackbar.text = "Dates required!";
        this.snackbar.color = "red";
        this.snackbar.buttonColor = "white"
        return
      }
      let url = import.meta.env.VITE_GATEWAY_ADDRESS + '/worklog/all?' +
        this.formattedEmployeeIds() +
        this.formattedProjectIds() +
        this.formattedDateRange()
      worklogsStore.dispatch('fetchFilteredWorklogs', url)
        .then(response => {
          this.$emit('fetchFilteredWorklogs', response.data)
        })
      e.preventDefault()
    },
    formattedEmployeeIds() {
      let ids = ''
      for (let employeeId of this.selectedEmployeesIds) {
        ids += "employeeId=" + employeeId + '&'
      }
      return ids
    },
    formattedProjectIds() {
      let ids = ''
      for (let projectId of this.selectedProjectsIds) {
        ids += "projectId=" + projectId + '&'
      }
      return ids
    },
    formattedDateRange() {
      return 'dateRange=' + this.startDate + '&dateRange=' + this.endDate
    },
    exportWorklogs(e) {
      e.preventDefault()
      let url = import.meta.env.VITE_GATEWAY_ADDRESS + '/export/worklogs?' +
        this.formattedEmployeeIds() +
        this.formattedProjectIds() +
        this.formattedDateRange()
      worklogsStore.dispatch('exportFilteredWorklogs', url).then(response => {

      }, error => {
        this.snackbar.show = true;
        this.snackbar.color = "red";
        this.snackbar.buttonColor = "white";
        this.snackbar.text = error.errorMessage;
      })
    }
  }
}
</script>

<style scoped>

</style>
