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
  <delete-leave-confirmation-dialog
    :leave="leave"
    :show-dialog=this.showDeleteDialog
    :title="'Are you sure?'"
    @dialog-closed="showDeleteDialog = false"
    @show-delete-snackbar-table-row="showDeleteSnackbarTableRow"
  />
  <tr>
    <td>{{ leave.startTime }}</td>
    <td>{{ leave.endTime }}</td>
    <td>{{ leave.leaveType }}</td>
    <td v-if="isOpen">{{ leave.leaveStatus }}</td>
    <td v-else-if="isDenied" style="color: red">{{ leave.leaveStatus }}</td>
    <td v-else style="color: green">{{ leave.leaveStatus }}</td>
    <td class="operations-cell">
      <v-btn
        class="ma-0"
        flat
        icon="mdi-check"
        @click="showDetailsDialog">
        <v-icon icon="mdi-eye-outline"/>
        <v-tooltip
          activator="parent"
          location="top">Details
        </v-tooltip>
      </v-btn>
      <v-btn v-if="isOpen"
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
      <v-btn v-else
             class="ma-0"
             disabled
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
        @click="deleteLeave">
        <v-icon icon="mdi-trash-can-outline"/>
        <v-tooltip
          activator="parent"
          location="top">Delete
        </v-tooltip>
      </v-btn>
    </td>
  </tr>
  <template>
    <div class="text-center">
      <leave-details-dialog
        :edit-dialog="editDialog"
        :leave="leave"
        :show-prop="dialog"
        @leave-details-dialog-closed="leaveDetailsDialogClosed"
        @leave-updated="leaveUpdated"
        @leave-update-failed="leaveUpdateFailed"/>
    </div>
  </template>
</template>

<script>
import LeaveDetailsDialog from "@/components/leave/LeaveDetailsDialog.vue";
import securityStore from "@/vuex/SecurityStore";
import DeleteLeaveConfirmationDialog from "@/components/leave/DeleteLeaveConfirmationDialog.vue";

export default {
  name: "MyLeaveTableRow",
  computed: {
    securityStore() {
      return securityStore
    }
  },
  components: {DeleteLeaveConfirmationDialog, LeaveDetailsDialog},
  emits: ['showDeleteSnackbar'],
  data() {
    return {
      showDeleteDialog: false,
      showSnackbar: false,
      snackbarText: "",
      snackbarButtonColor: "black",
      snackbarColor: "green-lighten-2",
      snackbar: {
        show: false,
        text: '',
        color: 'green-lighten-2',
        buttonColor: "black"
      },
      editDialog: false,
      dialog: false,
      isOpen: this.leave.leaveStatus === "OPEN",
      isDenied: this.leave.leaveStatus === "DENIED",
      isApproved: this.leave.leaveStatus === "APPROVED",
    }
  },
  props: {
    leave: Object,
    allEmployees: Array
  },
  methods: {
    leaveUpdated() {
      console.log("Boris")
      this.snackbar.show = true;
      this.snackbar.text = "Leave updated successfully."
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black"
    },
    leaveUpdateFailed(error) {
      this.showSnackbar = true;
      this.snackbarText = error.errorMessage;
      this.snackbarButtonColor = "white";
      this.snackbarColor = "red"
    },
    leaveDetailsDialogClosed() {
      this.editDialog = false;
      this.dialog = false;
    },
    employeeName(employeeId) {
      for (let i in this.allEmployees) {
        if (this.allEmployees[i].id === employeeId) {
          return this.allEmployees[i].firstName + " " + this.allEmployees[i].lastName;
        }
      }
      return '';
    },
    showDetailsDialog() {
      this.editDialog = false;
      this.dialog = true;
    },
    showEditDialog() {
      this.editDialog = true;
      this.dialog = true;
    },
    deleteLeave() {
      this.showDeleteDialog = true;
    },
    showDeleteSnackbarTableRow() {
      console.log("ulazi u row")
      this.$emit('showDeleteSnackbar')
    }

  }
}
</script>

<style scoped>

.operations-cell {
  text-align: right;
}
</style>
