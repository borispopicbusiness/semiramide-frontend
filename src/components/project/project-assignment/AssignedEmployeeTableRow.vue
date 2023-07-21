<template>
  <unassign-from-project-confirmation-dialog
    :assignee-id="employee.id"
    :assignee-name="subordinateFullName"
    :project-id="projectId"
    :show-dialog="showUnassignDialog"
    :title="dialogTitle"

    @dialog-closed="showUnassignDialog = false"
    @employee-unassigned="employeeUnassigned"
    @subordinate-unassignment-error="subordinateUnassignmentError"
  />
  <tr>
    <td>{{ employee.firstName }}</td>
    <td>{{ employee.lastName }}</td>
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
import UnassignFromProjectConfirmationDialog
  from "@/components/project/project-assignment/UnassignFromProjectConfirmationDialog.vue";

export default {
  components: {UnassignFromProjectConfirmationDialog},
  emits: ['employeeUnassigned', 'subordinateUnassignmentError'],
  props: {
    projectId: String,
    selectedEmployeeId: String,
    employee: Object
  },
  data() {
    return {
      dialogTitle: "Are you sure?",
      showUnassignDialog: false,
    }
  },
  computed: {
    subordinateFullName() {
      return this.employee.firstName + " " + this.employee.lastName;
    },
    getAllEmployees() {
      return employeeStore.getters.getAllEmployees
    }
  },
  methods: {
    showDialog() {
      this.showUnassignDialog = !this.showUnassignDialog;
    },
    getEmployeeById(eid) {
      let i = 0;
      while (i < this.getAllEmployees.length) {
        if (this.getAllEmployees[i].id === eid) {
          return this.getAllEmployees[i];
        }
      }
    },
    employeeUnassigned(employeeId) {
      this.$emit("employeeUnassigned", employeeId)
    },
    subordinateUnassignmentError(error) {
      this.$emit('subordinateUnassignmentError', error)
    },


  },
}
</script>

<style scoped>
.operations-cell {
  text-align: right;
}
</style>
