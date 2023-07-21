<template>
  <unassign-subordinate-confirmation-dialog
    :show-dialog="showUnassignDialog"
    :subordinate-employee-id="selectedEmployeeId"
    :subordinate-full-name="subordinateFullName"
    :superior="true"
    :superior-employee-id="employee.id"
    :title="dialogTitle"
    @dialog-closed="showUnassignDialog = false"
    @superior-unassigned="superiorUnassigned"
    @superior-unassignment-error="superiorUnassignmentError"/>
  <tr>
    <td>{{ employee.firstName }} {{ employee.lastName }}</td>
    <td>{{ employee.email }}</td>
    <td class="operations-cell">
      <v-btn
        class="ma-0"
        flat
        @click="showDialog">
        <v-icon icon="mdi-trash-can-outline"/>
        <v-tooltip
          activator="parent"
          location="top">Unassign
        </v-tooltip>
      </v-btn>
    </td>
  </tr>
</template>

<script>
import employeeStore from "@/vuex/EmployeeStore";
import unassignSubordinateConfirmationDialog from "@/components/employee/UnassignSubordinateConfirmationDialog.vue";

export default {
  emits: ['superiorUnassigned', 'superiorUnassignmentError'],
  components: {unassignSubordinateConfirmationDialog},
  data() {
    return {
      showUnassignDialog: false,
      dialogTitle: "Are you sure?",
    }
  },
  props: {
    selectedEmployeeId: String,
    employee: Object
  },
  methods: {
    showDialog() {
      this.showUnassignDialog = !this.showUnassignDialog;
    },
    superiorUnassigned(subordinateEmployeeId) {
      this.$emit("superiorUnassigned", subordinateEmployeeId)
    },
    superiorUnassignmentError(error) {
      this.$emit("superiorUnassignmentError", error)
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
    }
  },
  computed: {
    subordinateFullName() {
      let r = this.getEmployeeById(this.selectedEmployeeId).firstName + " " + this.getEmployeeById(this.selectedEmployeeId).lastName
      console.log(r)
      return r
    },
    getAllEmployees() {
      return employeeStore.getters.getAllEmployees
    }
  },
}
</script>

<style scoped>
.operations-cell {
  text-align: right;
}
</style>
