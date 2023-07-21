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
  <v-table fixed-header>
    <leave-table-header/>
    <tbody>
    <leave-table-row v-for="leave in allLeaves" :key="leave.id" :allEmployees="allEmployees" :allStatus="allStatus"
                     :allTypes="allTypes" :leave="leave" @show-delete-snackbar="showDeleteSnackbar"
                     @show-update-snackbar="showUpdateSnackbar"
                     @show-update-failed-snackbar="showUpdateFailedSnackbar"/>
    </tbody>
  </v-table>
</template>

<script>
import LeaveTableHeader from "@/components/leave/all-leaves/LeaveTableHeader.vue";
import LeaveTableRow from "@/components/leave/all-leaves/LeaveTableRow.vue";


export default {
  name: "LeaveTable",
  components: {LeaveTableRow, LeaveTableHeader},
  props: {
    leave: Object,
    allLeaves: Array,
    allTypes: Array,
    allStatus: Array,
    allEmployees: Array
  },
  data() {
    return {
      showDeleteDialog: false,
      showSnackbar: false,
      snackbarText: "",
      snackbarButtonColor: "black",
      snackbarColor: "green-lighten-2",
    }
  },
  methods: {
    showDeleteSnackbar() {
      console.log("showDeleteSnackbar() has been called")
      this.snackbarColor = "green-lighten-2";
      this.snackbarButtonColor = "black";
      this.snackbarText = "Leave has been deleted successfully."
      this.showSnackbar = true;
    },
    showUpdateSnackbar() {
      console.log("showUpdateSnackbar() has been called")
      this.snackbarColor = "green-lighten-2";
      this.snackbarButtonColor = "black";
      this.snackbarText = "Leave has been updated successfully."
      this.showSnackbar = true;
    },
    showUpdateFailedSnackbar() {
      console.log("showUpdateFailedSnackbar() has been called")
      this.snackbarColor = "green-lighten-2";
      this.snackbarButtonColor = "black";
      this.snackbarText = "Leave updated failed."
      this.showSnackbar = true;
    }
  }
}
</script>

<style scoped>

</style>
