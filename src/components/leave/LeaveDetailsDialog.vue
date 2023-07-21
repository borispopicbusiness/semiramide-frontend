<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      max-width="700px"
      persistent>
      <v-card>
        <v-card-title class="headline">Leave details</v-card-title>
        <v-card-text>
          <v-table>
            <tbody>
            <tr>
              <td class="fieldName" style="width: 100px">Employee</td>
              <td>{{ employeeName }}</td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Start time</td>
              <td v-if="!edit">{{ leave.startTime }}</td>
              <td v-else>
                <v-text-field
                  v-model="startTime"
                  bg-color="white"
                  density="compact"
                  hide-details="auto"
                  type="date"
                  variant="solo"></v-text-field>
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">End time</td>
              <td v-if="!edit">{{ leave.endTime }}</td>
              <td v-else>
                <v-text-field
                  v-model="endTime"
                  bg-color="white"
                  density="compact"
                  hide-details="auto"
                  type="date"
                  variant="solo"></v-text-field>
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Type</td>
              <td v-if="!edit">{{ leave.leaveType }}</td>
              <td v-else>
                <v-select
                  v-model="leaveType"
                  :items="allLeaveTypes"
                  bg-color="transparent"
                  density="compact"
                  hide-details="auto"
                  variant="solo"
                ></v-select>
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Status</td>
              <td>{{ leave.leaveStatus }}</td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Request date</td>
              <td>{{ leave.requestDate }}</td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Description</td>
              <td v-if="!edit">{{ leave.description }}</td>
              <td v-else>
                <v-textarea
                  v-model="description"
                  bg-color="white"
                  density="compact"
                  hide-details="auto"
                  variant="solo"></v-textarea>
              </td>
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Response</td>
              <td v-if="!edit || (!isOpen || (isOpen && !isSuperior))">{{ leave.responseComment }}</td>
              <td v-else>
                <v-textarea
                  v-model="responseComment"
                  bg-color="white"
                  density="compact"
                  hide-details="auto"
                  variant="solo"></v-textarea>
              </td>
              <!--              <td>{{ leave.responseComment }}</td>-->
            </tr>
            <tr>
              <td class="fieldName" style="width: 100px">Responder</td>
              <td>{{ responderName(leave.responderId) }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <section v-if="edit">
            <v-btn
              v-if="isSuperior && isOpen"
              style="color: green"
              text
              @click="approveLeave">Approve
            </v-btn>
            <v-btn
              v-if="isSuperior && isOpen"
              style="color: red"
              text
              @click="denyLeave">Deny
            </v-btn>
            <v-btn :disabled="!isDataChanged" text @click="updateLeave(leave)">Apply</v-btn>
            <v-btn text @click="closeDialog">Cancel</v-btn>
          </section>
          <section v-else>
            <v-btn text @click="closeDialog">Close</v-btn>
          </section>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import employeeStore from "@/vuex/EmployeeStore";
import leaveStore from "@/vuex/LeaveStore";

export default {
  emits: ['leaveDetailsDialogClosed', 'AllLeaves_leaveUpdated', 'leaveUpdated', 'leaveUpdateFailed', 'leaveApproved', 'leaveDenied', 'leaveApprovingError', 'leaveDenyingError'],
  props: {
    superior: Boolean,
    showProp: Boolean,
    leave: Object,
    editDialog: Boolean,
  },
  data() {
    return {
      allLeaveTypes: leaveStore.getters.getLeaveTypes,
      startTime: this.leave.startTime,
      endTime: this.leave.endTime,
      leaveType: this.leave.leaveType,
      description: this.leave.description,
      responseComment: this.leave.responseComment,
      show: this.showProp,
      edit: false,
      isSuperior: this.superior,
      isOpen: this.leave.leaveStatus === "OPEN",
    }
  },
  mounted() {
    employeeStore.dispatch("fetchLoggedUser")
    employeeStore.dispatch("fetchAllEmployees")
  },
  watch: {
    showProp(newValue) {
      this.show = newValue;
    },
    editDialog(newValue) {
      this.edit = newValue;
    },
    superior(newValue) {
      this.isSuperior = newValue;
    }
  },
  computed: {
    employeeName() {
      let allEmployees = employeeStore.getters.getAllEmployees;
      console.log("Djole: " + allEmployees.length);
      for (let i in allEmployees) {
        if (allEmployees[i].id === this.leave.employeeId) {
          return allEmployees[i].firstName + " " + allEmployees[i].lastName;
        }
      }
      return '';
    },
    isDataChanged() {
      return (
        this.startTime !== this.leave.startTime ||
        this.endTime !== this.leave.endTime ||
        this.leaveType !== this.leave.leaveType ||
        this.description !== this.leave.description ||
        this.responseComment !== this.leave.responseComment
      );
    }

  },
  methods: {
    responderName(responderId) {
      let allEmployees = employeeStore.getters.getAllEmployees;
      for (let i in allEmployees) {
        if (allEmployees[i].id === responderId) {
          return allEmployees[i].firstName + " " + allEmployees[i].lastName;
        }
      }
      return '';
    },
    approveLeave() {
      leaveStore.dispatch('approveLeave', {
        "startTime": this.leave.startTime,
        "endTime": this.leave.endTime,
        "description": this.leave.description,
        "leaveType": this.leave.leaveType,
        "id": this.leave.id,
        "employeeId": this.leave.employeeId,
        "leaveStatus": "APPROVED",
        "requestDate": this.leave.requestDate,
        "responseComment": this.responseComment,
        "responderId": employeeStore.getters.getLoggedUser.id
      }).then(() => {
        this.$emit("leaveApproved")

      }, error => {
        this.$emit("leaveApprovingError", error.response.data)
      });
      this.isOpen = false
      this.closeDialog();
    },
    denyLeave() {
      leaveStore.dispatch('denyLeave', {
        "startTime": this.leave.startTime,
        "endTime": this.leave.endTime,
        "description": this.leave.description,
        "leaveType": this.leave.leaveType,
        "id": this.leave.id,
        "employeeId": this.leave.employeeId,
        "leaveStatus": "DENIED",
        "requestDate": this.leave.requestDate,
        "responseComment": this.responseComment,
        "responderId": employeeStore.getters.getLoggedUser.id
      }).then(() => {
        this.$emit("leaveDenied")
      }, error => {
        this.$emit("leaveDenyingError", error.response.data)
      });
      this.isOpen = false
      this.closeDialog();
    },
    closeDialog() {
      this.show = false;
      this.edit = false;
      this.$emit("leaveDetailsDialogClosed");
    },
    updateLeave(leave) {
      console.log("Ulazi ovde")
      if (!this.isSomethingChanged(leave)) {
        this.closeDialog()
        return;
      }
      console.log("uslo i ovde")
      leaveStore.dispatch("updateLeave", {
        "startTime": this.startTime,
        "endTime": this.endTime,
        "description": this.description,
        "leaveType": this.leaveType,
        "id": this.leave.id,
        "employeeId": this.leave.employeeId,
        "leaveStatus": this.leave.leaveStatus,
        "requestDate": this.leave.requestDate,
        "responseComment": this.responseComment,
        "responderId": this.leave.responderId
      }).then(response => {
        this.$emit("leaveUpdated", response.data);
        this.$emit("AllLeaves_leaveUpdated", response.data);
      }, error => {
        this.$emit("leaveUpdateFailed", error.response.data);
      })
      this.closeDialog();
    },
    isSomethingChanged(leave) {
      if (
        leave.startTime === this.startTime && leave.endTime === this.endTime &&
        leave.leaveType === this.leaveType && leave.description === this.description &&
        leave.responseComment === this.responseComment
      ) {
        return false
      }
      return true
    }

  }

}
</script>

<style scoped>
.fieldName {
  text-align: right;
  white-space: nowrap;
  width: auto;
}

::v-deep .v-textarea ::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

::v-deep .v-textarea ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::v-deep .v-textarea ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(51, 102, 189, 0.5);
}

::v-deep .v-textarea ::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
