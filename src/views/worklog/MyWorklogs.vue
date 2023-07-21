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
  <v-container class="mx-0">
    <v-row>
      <v-col cols="12" md="3">
        <v-table fixed-header>
          <tr>
            <td style="text-align: left">
              <v-btn
                class="align-center"
                type="submit"
                variant="outlined"
                @click="decreaseDate">
                Back
              </v-btn>
            </td>
            <td style="text-align: left">
              <v-text-field
                v-model="filterDate"
                bg-color="white"
                density="compact"
                hide-details="auto"
                required
                style="text-align: center"
                type="date"
              ></v-text-field>
            </td>
            <td style="text-align: right">
              <v-btn
                class="me-0"
                type="submit"
                variant="outlined"
                @click="increaseDate">
                Next
              </v-btn>
            </td>
          </tr>
        </v-table>
      </v-col>
      <v-col cols="12" md="7"></v-col>
      <v-col cols="12" md="2" style="text-align: right">
        <v-btn
          class="me-0"
          type="submit"
          variant="outlined"
          @click="showNewWorklogDialog">
          Add worklog
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <my-worklog-table
    v-if="myWorklogs.length"
    :allTypes="allWorklogTypes"
    :myWorklogs="myWorklogs"
    :projects="allProjects"
    @show-snackbar-worklog-deleted="showSnackbarWorklogDeleted"
    @show-snackbar-worklog-deletion-error="showSnackbarWorklogDeletionError"
    @worklog-updating-error="worklogUpdatingError"/>
  <div v-else id="no-employees-div"><p class="no-employees-text">No worklogs for selected date</p></div>

  <div v-if="myWorklogs.length" class="line-separator"></div>

  <div v-if="myWorklogs.length" :class="{ 'exceeded-time': parseFloat(calculatedTime) > 8.00 }" class="total-time">
    <p>Total time: {{ calculatedTime }} h</p>
  </div>

  <worklog-dialog
    :projects="allProjects"
    :selected-date="filterDate"
    :show-dialog="newWorklogDialogShown"
    :worklog="emptyWorklog"
    :worklog-types="allWorklogTypes"
    type="NEW"
    @worklog-dialog-closed="newWorklogDialogClosed"
    @worklog-created="worklogCreated"
    @worklog-creation-error="worklogCreationError"/>
</template>

<script>
import MyWorklogTable from "@/components/worklog/my-worklogs/MyWorklogTable";
import worklogsStore from "@/vuex/WorklogStore";
import projectStore from "@/vuex/ProjectStore";
import WorklogDialog from "@/components/worklog/my-worklogs/WorklogDialog";

export default {
  components: {WorklogDialog, MyWorklogTable},
  data: () => ({
    newWorklogDialogShown: false,
    filterDate: new Date().toISOString().substr(0, 10),
    snackbar: {
      show: false,
      color: "green-lighten-2",
      buttonColor: "black",
      text: "",
    }
  }),
  computed: {
    myWorklogs() {
      return worklogsStore.getters.getWorklogs;
    },
    allProjects() {
      return projectStore.getters.getAllProjects
    },
    allWorklogTypes() {
      return worklogsStore.getters.getWorklogType
    },
    emptyWorklog() {
      return {
        projectId: "",
        type: "",
        taskName: "",
        description: "",
        totalTime: "",
        creationDate: this.filterDate
      }
    },
    calculatedTime() {
      let totalTime = 0;
      this.myWorklogs.forEach(worklog => {
        totalTime += worklog.totalTime;
      });
      return Number(totalTime).toFixed(2);
    }
  },
  methods: {
    newWorklogDialogClosed() {
      this.newWorklogDialogShown = false;
    },
    showNewWorklogDialog() {
      this.newWorklogDialogShown = true;
    },
    increaseDate() {
      const currentDate = new Date(this.filterDate)
      currentDate.setDate(currentDate.getDate() + 1)
      this.filterDate = currentDate.toISOString().substr(0, 10)
    },
    decreaseDate() {
      const currentDate = new Date(this.filterDate)
      currentDate.setDate(currentDate.getDate() - 1)
      this.filterDate = currentDate.toISOString().substr(0, 10)
    },
    fetchData() {
      worklogsStore.dispatch('fetchOwnWorklogs', {date: this.filterDate, page: 1})
      worklogsStore.dispatch('fetchWorklogTypes')
      projectStore.dispatch('findAllProjects')
    },
    worklogCreated() {
      this.snackbar.show = true;
      this.snackbar.text = "Worklog created successfully";
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black";
    },
    worklogCreationError(error) {
      this.snackbar.show = true;
      this.snackbar.text = error.errorMessage;
      this.snackbar.color = "red";
      this.snackbar.buttonColor = "white";
    },
    worklogUpdatingError(error) {
      this.snackbar.show = true;
      this.snackbar.text = error.response.data.errorMessage;
      this.snackbar.color = "red";
      this.snackbar.buttonColor = "white";
    },
    showSnackbarWorklogDeleted() {
      this.snackbar.show = true;
      this.snackbar.text = "Worklog deleted successfully";
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black";
    },
    showSnackbarWorklogDeletionError(error) {
      this.snackbar.show = true;
      this.snackbar.text = error.response.data.errorMessage;
      this.snackbar.color = "red";
      this.snackbar.buttonColor = "white";
    }
  },
  watch: {
    filterDate() {
      this.fetchData()
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

.line-separator {
  margin: 20px 0;
  border-top: 1px solid #ccc;
}

.total-time {
  text-align: center;
  margin-bottom: 20px;
}

.exceeded-time {
  color: red;
}

</style>
