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
    <td>
      {{ employeeName(leave.employeeId) }}
    </td>
    <td>
      {{ leave.startTime }}
    </td>
    <td>
      {{ leave.endTime }}
    </td>
    <td>
      {{ leave.leaveType }}
    </td>
    <td v-if="isOpen">{{ leave.leaveStatus }}</td>
    <td v-else-if="isDenied" style="color: red">{{ leave.leaveStatus }}</td>
    <td v-else style="color: green">{{ leave.leaveStatus }}</td>
    <td class="operations-cell change-background-experiment">
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
      <!--    <v-btn v-if="isOpen"-->
      <!--      class="ma-0"-->
      <!--      flat-->
      <!--      icon="mdi-pencil-outline"-->
      <!--      @click="showEditDialog">-->
      <!--      <v-icon icon="mdi-pencil-outline"/>-->
      <!--      <v-tooltip-->
      <!--        activator="parent"-->
      <!--        location="top">Edit-->
      <!--      </v-tooltip>-->
      <!--    </v-btn>-->
      <!--    <v-btn v-else-->
      <!--           class="ma-0 edit-btn"-->
      <!--           disabled-->
      <!--           flat-->
      <!--           icon="mdi-pencil-outline"-->
      <!--           @click="showEditDialog">-->
      <!--      <v-icon icon="mdi-pencil-outline"/>-->
      <!--      <v-tooltip-->
      <!--        activator="parent"-->
      <!--        location="top">Edit-->
      <!--      </v-tooltip>-->
      <!--    </v-btn>-->
      <v-btn
        class="ma-0"
        flat
        icon="mdi-trash-can-outline"
        @click="deleteLeave(leave)">
        <v-icon icon="mdi-trash-can-outline"/>
        <v-tooltip
          activator="parent"
          location="top">Delete
        </v-tooltip>
      </v-btn>
    </td>
  </tr>
  <leave-details-dialog
    :edit-dialog="editDialog"
    :leave="leave"
    :show-prop="dialog"
    @AllLeaves_leaveUpdated="updateLeave"
    @leave-details-dialog-closed="leaveDetailsDialogClosed"
    @leave-update-failed="leaveUpdateFailed"/>
</template>

<script>
import securityStore from "@/vuex/SecurityStore";
import LeaveDetailsDialog from "@/components/leave/LeaveDetailsDialog.vue";
import leaveDetailsDialog from "@/components/leave/LeaveDetailsDialog.vue";
import DeleteLeaveConfirmationDialog from "@/components/leave/DeleteLeaveConfirmationDialog.vue";

export default {
  name: "LeaveTableRow",
  computed: {
    leaveDetailsDialog() {
      return leaveDetailsDialog
    }
  },
  components: {DeleteLeaveConfirmationDialog, LeaveDetailsDialog},
  data() {
    return {
      showDeleteDialog: false,
      dialog: false,
      editDialog: false,
      isAdmin: securityStore.getters.isAdmin,
      edit: false,
      select: '',
      employeeId: this.leave.employeeId,
      startTime: this.leave.startTime,
      endTime: this.leave.endTime,
      description: this.leave.description,
      leaveType: this.leave.leaveType,
      leaveStatus: this.leave.leaveStatus,
      requestDate: this.leave.requestDate,
      response: this.leave.responseComment,
      responderId: this.leave.responderId,
      date: null,
      trip: {
        name: '',
        location: null,
        start: null,
        end: null,
      },
      isOpen: this.leave.leaveStatus === "OPEN",
      isDenied: this.leave.leaveStatus === "DENIED",
      isApproved: this.leave.leaveStatus === "APPROVED",
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
      leaveForUpdate: this.leave
    }
  },
  watch: {
    startTime(newValue) {
      console.log('startTime() has been called, the value passed:', newValue)
    },
    leave() {
      this.isOpen = this.leave.leaveStatus === "OPEN";
      this.isDenied = this.leave.leaveStatus === "DENIED";
      this.isApproved = this.leave.leaveStatus === "APPROVED";
    }
  },
  props: {
    leave: Object,
    allStatus: Array,
    allTypes: Array,
    allEmployees: Array
  },
  methods: {
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
    updateLeave(updatedLeave) {
      this.startTime = updatedLeave.startTime;
      this.endTime = updatedLeave.endTime;
      this.description = updatedLeave.description;
      this.leaveType = updatedLeave.leaveType;
      this.leaveStatus = updatedLeave.leaveStatus;
      this.responseComment = updatedLeave.responseComment;

      this.snackbar.show = true;
      this.snackbar.text = "Leave updated successfully."
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black"
      this.toggleEdit()
      this.$emit("showUpdateSnackbar");
    },
    leaveUpdateFailed(error) {
      this.showSnackbar = true;
      this.snackbarText = error.errorMessage;
      this.snackbarButtonColor = "white";
      this.snackbarColor = "red"
    },
    // eslint-disable-next-line no-unused-vars
    deleteLeave(leave) {
      this.showDeleteDialog = true;
      //leaveStore.dispatch('deleteLeave', leave.id)
    },
    toggleEdit() {
      this.edit = !this.edit;
    },
    showDetailsDialog() {
      this.dialog = true;
      this.editDialog = false;
    },
    showEditDialog() {
      this.editDialog = true;
      this.dialog = true;
    },
    showDeleteSnackbarTableRow() {
      console.log("showDeleteSnackbarTableRow() has been called")
      this.$emit('showDeleteSnackbar')
    },
    showUpdateSnackbar() {
      console.log("showUpdateSnackbar() has been called")
      this.$emit("showUpdateSnackbar")
    }
  }
}
</script>

<style scoped>

.operations-cell {
  text-align: right;
  background-color: white;
}

/**
  Do not remove edit-btn class, this class makes the pen invisible if it has te be hidden.
*/
.edit-btn {
  background-color: #ffffff;
  color: #af5a10;
  mix-blend-mode: lighten;
}

</style>
