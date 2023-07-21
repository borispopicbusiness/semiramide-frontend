<template>
  <v-snackbar
    v-model="showSnackbar"
    :color="snackbarColor"
  >{{ snackbarText }}
    <template v-slot:actions>
      <v-btn
        :color="snackbarButtonColor"
        variant="text"
        @click="showSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <div v-if="employees.length > 0">
    <div class="table-wrapper">
      <v-table class="table">
        <template v-slot:default>
          <superiors-table-header/>
          <tbody>
          <superiors-table-row
            v-for="item in employees"
            :key="item.email"
            :employee="item" :selected-employee-id="employeeId" @superior-unassigned="superiorUnassigned"
            @superior-unassignment-error="superiorUnassignmentError"/>
          </tbody>
        </template>
      </v-table>
    </div>
  </div>
  <div v-else class="no-employees-div table-wrapper">
    <div v-if="employeeId !== ''"><p class="no-employees-text">No superiors</p></div>
    <div v-else><p class="no-employees-text">Please select employee</p></div>
  </div>
  <v-btn v-if="employeeId !== ''"
         variant="outlined" @click="showAssignSuperiorDialog">Assign superior
  </v-btn>
  <assign-subordinate-dialog
    :employee-id="employeeId"
    :show="showAssignDialog"
    :superior="true"
    @assign-subordinates-dialog-closed="assignSubordinatesDialogClosed"
    @selected-superiors-assigned="selectedSuperiorsAssigned"
    @superior-assigned="superiorAssigned"/>
</template>

<script>
import SuperiorsTableHeader from "@/components/employee/employee-hierarchy/SuperiorsTableHeader.vue";
import SuperiorsTableRow from "@/components/employee/employee-hierarchy/SuperiorsTableRow.vue";
import axios from "axios";
import AssignSubordinateDialog from "@/components/employee/employee-hierarchy/AssignSubordinatesDialog.vue";

export default {
  components: {SuperiorsTableRow, SuperiorsTableHeader, AssignSubordinateDialog},
  props: {
    employeeId: String,
  },
  data() {
    return {
      showAssignDialog: false,
      showSnackbar: false,
      snackbarColor: "red",
      snackbarText: "",
      snackbarButtonColor: "red",
      employees: [],
    };
  },
  watch: {
    employeeId(eid) {
      this.fetchImmediateSuperiors(eid);
    }
  },
  methods: {
    fetchImmediateSuperiors(eid) {
      console.log("EID: " + eid)
      axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + "/employee/superiors/immediate?employee-id=" + eid,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }).then((response) => {
        console.log(response.data)
        this.employees = response.data;
      });
    },
    assignSubordinatesDialogClosed() {
      this.showAssignDialog = false;
    },
    superiorAssigned(parentId) {
      this.fetchImmediateSuperiors(parentId);
    },
    superiorUnassigned(subordinateEmployeeId) {
      this.showSnackbar = true
      this.snackbarText = "Superior unassigned!"
      this.snackbarColor = "green-lighten-2"
      this.snackbarButtonColor = "black"
      this.fetchImmediateSuperiors(subordinateEmployeeId)
    },
    superiorUnassignmentError(error) {
      this.showSnackbar = true
      this.snackbarColor = "red"
      this.snackbarButtonColor = "white"
      this.snackbarText = error.errorMessage;
    },
    selectedSuperiorsAssigned() {
      this.showSnackbar = true;
      this.snackbarColor = "green-lighten-2"
      this.snackbarButtonColor = "black"
      this.snackbarText = "Successfully assigned superior(s)";
    },
    showAssignSuperiorDialog() {
      this.showAssignDialog = true;
    }
  },
};
</script>

<style scoped>
.table-wrapper {
  height: 320px;
  padding: 5px;
  margin-bottom: 30px;
  overflow-y: scroll;
}

/*.table {*/
/*  background-color: aqua;*/
/*}*/

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


