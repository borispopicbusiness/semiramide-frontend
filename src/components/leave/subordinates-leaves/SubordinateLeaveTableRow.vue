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
    <td style="text-align: right">
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
    </td>
  </tr>
  <leave-details-dialog
    :edit-dialog="editDialog"
    :leave="leave"
    :show-prop="dialog"
    :superior="true"
    @leave-details-dialog-closed="leaveDetailsDialogClosed"
    @leave-approved="leaveApproved"
    @leave-denied="leaveDenied"
    @leave-approving-error="leaveApprovingError"
    @leave-denying-error="leaveDenyingError"
    @leave-updated="leaveUpdated"
  />
</template>

<script>
import leaveStore from "@/vuex/LeaveStore";
import securityStore from "@/vuex/SecurityStore";
import LeaveDetailsDialog from "@/components/leave/LeaveDetailsDialog.vue";

export default {
  name: "SubordinateLeaveTableRow",
  components: {LeaveDetailsDialog},
  emits: ['subordinateLeaveUpdated'],
  data() {
    return {
      snackbar: {
        show: false,
        text: '',
        color: 'green-lighten-2',
        buttonColor: "black"
      },
      editDialog: false,
      dialog: false,
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
      isOpen: this.leave.leaveStatus === "OPEN",
      isDenied: this.leave.leaveStatus === "DENIED",
      isApproved: this.leave.leaveStatus === "APPROVED",
    }
  },
  watch: {
    leave() {
      this.isOpen = this.leave.leaveStatus === "OPEN";
      this.isDenied = this.leave.leaveStatus === "DENIED";
      this.isApproved = this.leave.leaveStatus === "APPROVED";
    }
  },
  props: {
    leave: Object,
    allEmployees: Array,
    allLeaveTypes: Array,
    allLeaveStatus: Array,
  },
  methods: {
    leaveApproved() {
      this.snackbar.text = "Leave approved!";
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black";
      this.snackbar.show = true;
    },
    leaveUpdated() {
      console.log("Pera")
      this.snackbar.show = true;
      this.snackbar.text = "Leave updated successfully."
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black"
    },
    leaveDenied() {
      this.snackbar.text = "Leave denied!";
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black";
      this.snackbar.show = true;
    },
    leaveApprovingError(error) {
      this.snackbar.text = error.errorMessage;
      this.snackbar.color = "red";
      this.snackbar.buttonColor = "white";
      this.snackbar.show = true;
    },
    leaveDenyingError(error) {
      this.snackbar.text = error.errorMessage;
      this.snackbar.color = "red";
      this.snackbar.buttonColor = "white";
      this.snackbar.show = true;
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
      this.dialog = true;
      this.editDialog = false;
    },
    showEditDialog() {
      this.editDialog = true;
      this.dialog = true;
    },
    leaveDetailsDialogClosed() {
      this.editDialog = false;
      this.dialog = false;
    },
    checkResponseComment() {
      if (this.leave.leaveStatus === 'OPEN') {
        return false;
      }
      return true;
    },
    approveLeave(leave) {
      leave.responseComment = this.response
      leaveStore.dispatch('approveLeave', leave)
    },
    denyLeave(leave) {
      leave.responseComment = this.response
      leaveStore.dispatch('denyLeave', leave)
    },
    updateLeave(leave) {
      let updatedLeave = {
        employeeId: this.employeeId,
        startTime: this.startTime,
        endTime: this.endTime,
        description: this.description,
        leaveType: this.leaveType,
        leaveStatus: this.leaveStatus,
        requestDate: this.requestDate,
        responseComment: this.response,
        responderId: this.responderId
      }
      leaveStore.dispatch('updateLeave', updatedLeave)
      leave.startTime = updatedLeave.startTime,
        leave.endTime = updatedLeave.endTime,
        leave.description = updatedLeave.description,
        leave.leaveType = updatedLeave.leaveType,
        leave.leaveStatus = updatedLeave.leaveStatus,
        leave.responseComment = updatedLeave.responseComment,
        this.$emit('subodinateLeaveUpdated')
      this.toggleEdit()
    },
    deleteLeave(leave) {
      leaveStore.dispatch('deleteLeave', leave.id)
    },
    toggleEdit() {
      this.edit = !this.edit;
    },
  }
}
</script>

<style scoped>
.description-input-text-field {
  padding-top: 15px;
  font-size: small;
  height: fit-content;
}
</style>
