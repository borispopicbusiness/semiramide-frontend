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
    <my-leave-table-header/>
    <tbody>
    <my-leave-table-row v-for="leave in ownLeaves" :key="leave.id" :allEmployees="allEmployees" :leave="leave"
                        @show-delete-snackbar="showDeleteSnackbar"
    />
    </tbody>
  </v-table>
</template>

<script>
import MyLeaveTableHeader from "@/components/leave/my-leaves/MyLeaveTableHeader.vue";
import MyLeaveTableRow from "@/components/leave/my-leaves/MyLeaveTableRow.vue";

export default {
  name: "MyLeaveTable",
  components: {MyLeaveTableRow, MyLeaveTableHeader},
  data() {
    return {
      showDeleteDialog: false,
      showSnackbar: false,
      snackbarText: "",
      snackbarButtonColor: "black",
      snackbarColor: "green-lighten-2",
      leave: Object
    }
  },
  props: {
    ownLeaves: Array,
    allEmployees: Array
  },
  methods: {
    showDeleteSnackbar() {
      console.log("ulazi emit")
      this.snackbarColor = "green-lighten-2";
      this.snackbarButtonColor = "black";
      this.snackbarText = "Leave has been deleted successfully."
      this.showSnackbar = true;
    }
  }
}
</script>

<style scoped>

</style>
