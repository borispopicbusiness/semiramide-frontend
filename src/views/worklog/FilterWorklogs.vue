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
  <filter-worklog-form :employees="searchableEmployees" :projects="allProjects"
                       @fetchFilteredWorklogs="fetchFilteredWorklogs"/>
  <filter-worklog-table v-if="filteredWorklogsData.length"
                        :filteredWorklogs="filteredWorklogsData"
                        :projects="allProjects"
                        @worklog-deleted="worklogDeleted"
                        @worklog-updating-error="worklogUpdatingError"
  />
  <div v-else id="no-employees-div"><p class="no-employees-text">Nothing to show</p></div>
</template>

<script>
import FilterWorklogForm from "@/components/worklog/filter-worklogs/FilterWorklogForm";
import FilterWorklogTable from "@/components/worklog/filter-worklogs/FilterWorklogTable";
import employeeStore from "@/vuex/EmployeeStore";
import projectStore from "@/vuex/ProjectStore";
import securityStore from "@/vuex/SecurityStore";

export default {
  name: "FilterWorklogs",
  components: {FilterWorklogTable, FilterWorklogForm},
  emits: ['showFilteredWorklogsEmptySnackbar'],
  data() {
    return {
      filteredWorklogsData: [],
      snackbar: {
        show: false,
        text: "",
        buttonColor: "black",
        color: "green-lighten-2"
      }
    }
  },
  computed: {
    searchableEmployees() {
      if (securityStore.getters.isAdmin) {
        return employeeStore.getters.getAllEmployees;
      }
      // TODO: We copy the array so that logged user doesn't get pushed to the store
      // This should be done more elegantly - perhaps maintain a list of searchable users in the store
      let se = employeeStore.getters.getSubordinates.slice();
      se.push(employeeStore.getters.getLoggedUser);
      return se;
    },
    allProjects() {
      return projectStore.getters.getAllProjects
    }
  },
  methods: {
    fetchData() {
      employeeStore.dispatch('fetchAllEmployees')
      projectStore.dispatch('findAllProjects')
    },
    fetchFilteredWorklogs(worklogsData) {
      if (worklogsData.length === 0) {
        this.showFilteredWorklogsEmptySnackbar()
      }
      this.filteredWorklogsData = worklogsData
    },
    showFilteredWorklogsEmptySnackbar() {
      this.snackbar.show = true;
      this.snackbar.text = "No worklogs found for the given criteria";
      this.snackbar.buttonColor = "black";
      this.snackbar.color = "green-lighten-2";
    },
    worklogDeleted(worklogId) {
      this.filteredWorklogsData = this.filteredWorklogsData.filter(e => e.id !== worklogId);
      this.snackbar.show = true;
      this.snackbar.text = "Worklog successfully deleted";
      this.snackbar.buttonColor = "black";
      this.snackbar.color = "green-lighten-2";
    },
    worklogUpdatingError(error) {
      this.snackbar.show = true;
      this.snackbar.text = error.response.data.errorMessage;
      this.snackbar.buttonColor = "white";
      this.snackbar.color = "red";
    }
  },
  mounted() {
    this.fetchData()
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

#no-employees-div {
  text-align: center;
  padding: 20px;
}

</style>
