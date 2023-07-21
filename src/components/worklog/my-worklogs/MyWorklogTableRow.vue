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
    <td>
      <span>{{ projectName(worklog.projectId) }}</span>
    </td>
    <td>
      <span>{{ worklog.type }}</span>
    </td>
    <td>
      <span>{{ worklog.taskName }}</span>
    </td>
    <td>
      <span>{{ worklogTime }} h</span>
    </td>
    <td v-if="!isEdit" class="operations-cell">
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
          @click="edit">
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
    :worklog-types="allTypes"
    @worklog-dialog-closed="worklogDialogClosed"
    @worklog-updated="worklogUpdated"
    @worklog-updating-error="worklogUpdatingError"
  />
  <worklog-deletion-confirmation-dialog
    :show-dialog="showDeleteDialog"
    :worklog-id="this.worklog.id"
    @worklog-deleted="worklogDeleted"
    @worklog-deletion-error="worklogDeletionError"
    @worklog-deletion-confirmation-dialog-closed="worklogDeletionConfirmationDialogClosed"
  />
</template>

<script>
import securityStore from "@/vuex/SecurityStore";
import WorklogDialog from "@/components/worklog/my-worklogs/WorklogDialog";
import WorklogDeletionConfirmationDialog from "@/components/worklog/my-worklogs/WorklogDeletionConfirmationDialog";

export default {
  components: {WorklogDeletionConfirmationDialog, WorklogDialog},
  name: "MyWorklogTableRow",
  emits: ['worklogDeletedTable', 'worklogDeletionErrorTable', 'worklogUpdatingError'],
  data() {
    return {
      isEdit: false,
      showDeleteDialog: false,
      projectN: this.projectName(this.worklog.projectId),
      projectId: this.worklog.projectId,
      type: this.worklog.type,
      taskName: this.worklog.taskName,
      description: this.worklog.description,
      time: this.worklog.totalTime,
      date: this.worklog.creationDate,
      snackbar: {
        text: '',
        color: 'green-lighten-2',
        buttonColor: 'black',
        show: false
      },
      worklogDialog: {
        show: false,
        type: "DETAILS"
      }

    }
  },
  computed: {
    projectNames() {
      return this.projects.map(project => project.name);
    },
    securityStore() {
      return securityStore
    },
    dialogMainText() {
      return "Task: " + this.task + ", will be permanently removed.";
    },
    worklogTime() {
      return Number(this.worklog.totalTime).toFixed(2);
    }

  },
  props: {
    worklog: Object,
    projects: Array,
    allTypes: Array
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
    toggleEdit() {
      this.worklogDialog.show = true;
      this.worklogDialog.type = "EDIT";
    },
    edit() {
      this.toggleEdit();
    },
    showDetailsDialog() {
      this.worklogDialog.show = true;
      this.worklogDialog.type = "DETAILS";
    },
    deleteWorklog() {
      this.showDeleteDialog = true;
    },
    worklogDialogClosed() {
      this.worklogDialog.show = false;
    },
    worklogUpdated() {
      this.snackbar.show = true;
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black";
      this.snackbar.text = "Worklog updated successfully";
    },
    worklogUpdatingError(error) {
      this.$emit('worklogUpdatingError', error);
    },
    worklogDeleted() {
      this.showDeleteDialog = false;
      this.$emit('worklogDeletedTable')
    },
    worklogDeletionError(error) {
      this.$emit('worklogDeletionErrorTable', error);
      this.showDeleteDialog = false;
    },
    worklogDeletionConfirmationDialogClosed() {
      this.showDeleteDialog = false;
    }
  }
}
</script>

<style scoped>
.operations-cell {
  text-align: right;
}
</style>
