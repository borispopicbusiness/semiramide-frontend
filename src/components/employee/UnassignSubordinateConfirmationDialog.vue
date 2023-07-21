<template>
  <div class="text-center">
    <v-dialog v-model="dialog"
              persistent
              width="auto">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>
          {{ messageText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteButtonPressed">Unassign</v-btn>
          <v-btn text @click="cancelAction">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import employeeStore from "@/vuex/EmployeeStore";
import axios from "axios";

export default {
  emits: ['subordinateUnassigned', 'dialogClosed', 'subordinateUnassignmentError', 'superiorUnassigned', 'superiorUnassignmentError'],
  data() {
    return {
      superiorFullName: "",
      dialog: this.showDialog,
    }
  },
  props: {
    superior: Boolean,
    showDialog: Boolean,
    title: String,
    superiorEmployeeId: String,
    subordinateEmployeeId: String,
    subordinateFullName: String,
  },
  methods: {
    cancelAction() {
      this.dialog = false;
      this.$emit('dialogClosed');
    },
    getEmployeeById(eid) {
      let tmpEmployees = employeeStore.getters.getAllEmployees;
      let i = 0;
      while (i < tmpEmployees.length) {
        if (tmpEmployees[i].id === eid) {
          return tmpEmployees[i];
        }
        i++;
      }
    },
    deleteButtonPressed() {
      if (this.superior) {
        this.unAssignSuperior();
      } else {
        this.unAssignSubordinate();
      }
    },
    unAssignSubordinate() {
      axios.delete(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/subordinate' +
        '?parent-id=' + this.superiorEmployeeId + "&child-id=" + this.subordinateEmployeeId,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then(() => {
        this.cancelAction()
        this.$emit("subordinateUnassigned", this.superiorEmployeeId)
      }).catch((error) => {
        this.$emit("subordinateUnassignmentError", error.response.data)
        this.cancelAction()
      })
    },
    unAssignSuperior() {
      axios.delete(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/subordinate' +
        '?parent-id=' + this.superiorEmployeeId + "&child-id=" + this.subordinateEmployeeId,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then(() => {
        this.cancelAction()
        this.$emit("superiorUnassigned", this.subordinateEmployeeId)
      }).catch((error) => {
        this.$emit("superiorUnassignmentError", error.response.data)
        this.cancelAction()
      })
    }
  },
  computed: {
    messageText() {
      if (this.superior) {
        return this.superiorFullName + " will no longer be superior of " + this.subordinateFullName;
      }
      return this.subordinateFullName + " will no longer be subordinate of " + this.superiorFullName;
    }
  },
  watch: {
    showDialog(newval) {
      this.dialog = newval;
      if (newval === true) {
        let superiorEmployee = this.getEmployeeById(this.superiorEmployeeId);
        this.superiorFullName = superiorEmployee.firstName + " " + superiorEmployee.lastName;
      }
    }
  }
}
</script>
