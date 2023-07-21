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
  <tr>
    <td>{{ employeeName(worklog.employeeId) }}</td>
    <td>{{ projectName(worklog.projectId) }}</td>
    <td>{{ worklog.type }}</td>
    <td>{{ worklog.taskName }}</td>
    <td>{{ worklogTime }} h</td>
    <td>{{ worklog.creationDate }}</td>
    <td class="operations-cell">
      <section>
        <v-btn
          class="ma-0"
          flat
          icon="mdi-pencil-outline"
          @click="showDetailsDialog">
          <v-icon icon="mdi-eye-outline"/>
          <v-tooltip
            activator="parent"
            location="top">Details
          </v-tooltip>
        </v-btn>
        <v-btn
          class="ma-0"
          flat
          icon="mdi-pencil-outline"
          @click="showEditDialog">
          <v-icon icon="mdi-pencil-outline"/>
          <v-tooltip
            activator="parent"
            location="top">Edit
          </v-tooltip>
        </v-btn>
        <v-btn
          class="ma-0"
          flat
          icon="mdi-trash-can-outline"
          @click="deleteWorklog">
          <v-icon icon="mdi-trash-can-outline"/>
          <v-tooltip
            activator="parent"
            location="top">Delete
          </v-tooltip>
        </v-btn>
      </section>
    </td>
  </tr>
  <worklog-dialog
    :projects="projects"
    :show-dialog="worklogDialog.show"
    :type="worklogDialog.type"
    :worklog="worklog"
    :worklog-types="worklogTypes"
    @worklog-dialog-closed="worklogDialogClosed"
    @worklog-updated="worklogUpdated"
    @worklog-updating-error="worklogUpdatingError"
  />
  <worklog-deletion-confirmation-dialog
    :show-dialog="worklogDeleteDialog.show"
    :worklog-id="this.worklog.id"
    @worklog-deleted="worklogDeleted"
    @worklog-deletion-error="worklogDeletionError"
    @worklog-deletion-confirmation-dialog-closed="worklogDeletionConfirmationDialogClosed"
  />
</template>

<script>
import employeeStore from "@/vuex/EmployeeStore";
import worklogStore from "@/vuex/WorklogStore";
import WorklogDeletionConfirmationDialog from "@/components/worklog/my-worklogs/WorklogDeletionConfirmationDialog.vue";
import WorklogDialog from "@/components/worklog/my-worklogs/WorklogDialog.vue";

export default {
  name: "FilterWorklogTableRow",
  emits: ['worklogDeleted', 'worklogUpdatingError'],
  components: {WorklogDialog, WorklogDeletionConfirmationDialog},
  props: {
    worklogProp: Object,
    projects: Array,
  },
  data() {
    return {
      worklog: this.worklogProp,
      worklogTypes: worklogStore.getters.getWorklogType,
      worklogDialog: {
        show: false,
        type: "DETAILS"
      },
      snackbar: {
        show: false,
        color: "green-lighten-2",
        buttonColor: "black",
        text: ""
      },
      worklogDeleteDialog: {
        show: false,
      }
    }
  },
  computed: {
    allEmployees() {
      return employeeStore.getters.getAllEmployees
    },
    worklogTime() {
      return Number(this.worklog.totalTime).toFixed(2);
    }
  },
  methods: {
    projectName(projectId) {
      for (let i in this.projects) {
        if (this.projects[i].id === projectId) {
          return this.projects[i].name;
        }
      }
      return "";
    },
    employeeName(employeeId) {
      for (let i in this.allEmployees) {
        if (this.allEmployees[i].id === employeeId) {
          return this.allEmployees[i].firstName + " " + this.allEmployees[i].lastName;
        }
      }
      return '';
    },
    toggleEdit() {
      this.worklogDialog.show = true;
      this.worklogDialog.type = "EDIT";
    },
    showDetailsDialog() {
      this.worklogDialog.show = true;
      this.worklogDialog.type = "DETAILS";
    },
    showEditDialog() {
      this.toggleEdit();
    },
    deleteWorklog() {
      this.worklogDeleteDialog.show = true;
    },
    worklogDialogClosed() {
      this.worklogDialog.show = false;
    },
    worklogUpdated(updatedWorklog) {
      this.worklog = updatedWorklog;
      this.snackbar.show = true;
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black";
      this.snackbar.text = "Worklog updated successfully";
    },
    worklogUpdatingError(error) {
      this.$emit('worklogUpdatingError', error);
    },
    worklogDeleted() {
      this.worklogDeleteDialog.show = false;
      this.$emit('worklogDeleted', this.worklog.id);
    },
    worklogDeletionError() {
      this.worklogDeleteDialog.show = false;
    },
    worklogDeletionConfirmationDialogClosed() {
      this.worklogDeleteDialog.show = false;
    }
  },
  mounted() {
    employeeStore.dispatch("fetchAllEmployees")
  },

}
</script>

<style scoped>
.operations-cell {
  text-align: right;
}
</style>
