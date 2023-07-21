<template>
  <v-snackbar
    v-model="ssb"
    :color="snackbarColor"
  >{{ snackbarText }}
    <template v-slot:actions>
      <v-btn
        :color="snackbarButtonColor"
        variant="text"
        @click="ssb = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <div v-if="employees.length > 0">
    <div class="table-wrapper">
      <v-table class="table">
        <template v-slot:default>
          <subordinates-table-header/>
          <tbody>
          <subordinates-table-row
            v-for="item in employees"
            :key="item.email"
            :employee="item"
            :selected-employee-id="employeeId"
            @subordinate-unassigned="subordinateUnassigned"
            @subordinate-unassignment-error="subordinateUnassignmentError"
          />

          </tbody>
        </template>
      </v-table>
    </div>
  </div>
  <div v-else class="no-employees-div table-wrapper">
    <div v-if="employeeId !== ''"><p class="no-employees-text">No subordinates</p></div>
    <div v-else><p class="no-employees-text">Please select employee</p></div>
  </div>
  <v-btn v-if="employeeId !== ''" variant="outlined" @click="showAssignSubordinatesDialog">Assign subordinate</v-btn>
  <assign-subordinate-dialog
    :employee-id="employeeId"
    :show="showAssignDialog"
    :superior="false"
    @selectedSubordinatesAssigned="selectedSubordinatesAssigned"
    @assign-subordinates-dialog-closed="assignSubordinatesDialogClosed"
    @subordinate-assigned="subordinateAssigned"/>
</template>

<script>
import SubordinatesTableHeader from "@/components/employee/employee-hierarchy/SubordinatesTableHeader.vue";
import SubordinatesTableRow from "@/components/employee/employee-hierarchy/SubordinatesTableRow.vue";
import axios from "axios";
import AssignSubordinateDialog from "@/components/employee/employee-hierarchy/AssignSubordinatesDialog.vue";

export default {
  components: {AssignSubordinateDialog, SubordinatesTableRow, SubordinatesTableHeader},
  props: {
    employeeId: String,
  },
  data() {
    return {
      ssb: false,
      snackbarColor: "red",
      snackbarText: "",
      snackbarButtonColor: "white",
      errorText: "",
      showAssignDialog: false,
      employees: []
    };
  },
  watch: {
    employeeId(eid) {
      this.fetchImmediateSubordinates(eid);
    }
  },
  methods: {
    fetchImmediateSubordinates(eid) {
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + "/employee/subordinates/immediate?employee-id=" + eid,
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
    showAssignSubordinatesDialog() {
      this.showAssignDialog = true;
    },
    assignSubordinatesDialogClosed() {
      this.showAssignDialog = false;
    },
    subordinateAssigned(parentId) {
      this.fetchImmediateSubordinates(parentId);
    },
    subordinateUnassigned(parentId) {
      this.ssb = true
      this.snackbarText = "Subordinate unassigned!"
      this.snackbarColor = "green-lighten-2"
      this.snackbarButtonColor = "black"
      this.fetchImmediateSubordinates(parentId)
    },
    subordinateUnassignmentError(error) {
      this.ssb = true
      this.snackbarColor = "red"
      this.snackbarButtonColor = "white"
      this.snackbarText = error.errorMessage;
    },
    selectedSubordinatesAssigned() {
      this.ssb = true;
      this.snackbarColor = "green-lighten-2"
      this.snackbarButtonColor = "black"
      this.snackbarText = "Successfully assigned subordinate(s)";
    }

  }
};
</script>

<style scoped>
.table-wrapper {
  height: 320px;
  padding: 5px;
  margin-bottom: 30px;
  overflow-y: scroll;
}

.table-wrapper::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.table-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(51, 102, 189, 0.5);
}

.no-employees-text {
  font-size: 36px;
  font-weight: bold;
  color: #AAA;
  line-height: 1.5;
}

.no-employees-div {
  text-align: center;
  padding: 20px;
}

</style>


