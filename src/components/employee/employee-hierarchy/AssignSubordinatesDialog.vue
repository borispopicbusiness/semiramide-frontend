<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      width="700px">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 700px;">
          <v-table height="700px">
            <tbody>
            <assign-subordinates-table-row
              v-for="employee in employees"
              :key="employee.id"
              :employee="employee"
              @employee-checked="addEmployeeForAssignment"
              @employee-un-checked="removeEmployeeForAssignment"/>
            </tbody>
          </v-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" text @click="assignSelectedEmployees">Assign</v-btn>
          <v-btn text @click="close">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import AssignSubordinatesTableRow from "@/components/employee/employee-hierarchy/AssignSubordinatesTableRow.vue";
import axios from "axios";

export default {
  components: {AssignSubordinatesTableRow},
  emits: ['assignSubordinatesDialogClosed', 'selectedSubordinatesAssigned', 'subordinateAssigned', 'selectedSuperiorsAssigned', 'superiorAssigned'],
  props: {
    superior: Boolean,
    employeeId: String,
    show: Boolean,
  },
  data() {
    return {
      dialog: false,
      selectedEmployees: [],
      employees: []
    }
  },
  watch: {
    show(show) {
      this.dialog = show;
      if (this.dialog) {
        this.fetchAvailableEmployees();
      }
    }
  },
  computed: {
    dialogTitle() {
      if (this.superior) {
        return "Assign superiors"
      } else {
        return "Assign subordinates"
      }
    }
  },
  methods: {
    close() {
      this.dialog = false;
      this.$emit('assignSubordinatesDialogClosed');
    },
    addEmployeeForAssignment(employeeId) {
      this.selectedEmployees.push(employeeId);
    },
    removeEmployeeForAssignment(employeeId) {
      let i = this.selectedEmployees.indexOf(employeeId);
      this.selectedEmployees.splice(i, 1);
    },
    fetchAvailableEmployees() {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + "/employee/available-connections?employee-id=" + this.employeeId,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        this.employees = response.data;
      });
    },
    assignSelectedEmployees() {
      for (let childId of this.selectedEmployees) {
        if (this.superior) {
          this.assignEmployee(childId, this.employeeId);
        } else {
          this.assignEmployee(this.employeeId, childId);
        }
      }
      if (this.superior) {
        this.$emit('selectedSuperiorsAssigned');
      } else {
        this.$emit('selectedSubordinatesAssigned');
      }
      this.selectedEmployees = [];
      this.close();
    },
    assignEmployee(parentId, childId) {
      axios.post(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/assign-subordinate', {
          parentId: parentId,
          childId: childId
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then(() => {
        if (this.superior) {
          this.$emit('superiorAssigned', childId);
        } else {
          this.$emit('subordinateAssigned', parentId);
        }
      })
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(51, 102, 189, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>
