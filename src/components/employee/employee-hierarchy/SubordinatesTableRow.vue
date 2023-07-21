<template>
  <unassign-subordinate-confirmation-dialog
    :show-dialog="showUnassignDialog"
    :subordinate-employee-id="employee.id"
    :subordinate-full-name="subordinateFullName"
    :superior-employee-id="selectedEmployeeId"
    :title="dialogTitle"
    @dialog-closed="showUnassignDialog = false"
    @subordinate-unassigned="subordinateUnassigned"
    @subordinate-unassignment-error="subordinateUnassignmentError"/>
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
import UnassignSubordinateConfirmationDialog from "@/components/employee/UnassignSubordinateConfirmationDialog.vue";
import employeeStore from "@/vuex/EmployeeStore";

export default {
  components: {UnassignSubordinateConfirmationDialog},
  emits: ['subordinateUnassigned', 'subordinateUnassignmentError'],
  props: {
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
      console.log(this.showUnassignDialog)
    },
    getEmployeeById(eid) {
      let i = 0;
      while (i < this.getAllEmployees.length) {
        if (this.getAllEmployees[i].id === eid) {
          return this.getAllEmployees[i];
        }
      }
    },
    subordinateUnassigned(superiorEmployeeId) {
      this.$emit("subordinateUnassigned", superiorEmployeeId)
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
