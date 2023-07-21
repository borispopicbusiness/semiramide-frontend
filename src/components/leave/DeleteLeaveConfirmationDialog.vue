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
          <v-btn color="error" text @click="deleteButtonPressed">Delete</v-btn>
          <v-btn text @click="cancelAction">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import leaveStore from "@/vuex/LeaveStore";

export default {

  name: "DeleteLeaveConfirmationDialog",

  emits: ['showDeleteSnackbarTableRow'],

  data() {
    return {
      dialog: this.showDialog,
    }
  },
  props: {
    showDialog: Boolean,
    title: String,
    leave: Object
  },
  computed: {
    messageText() {
      return "Do you want to delete this leave?"
    }
  },
  watch: {
    showDialog(newval) {
      this.dialog = newval;
    }
  },
  methods: {
    deleteButtonPressed() {
      leaveStore.dispatch('deleteLeave', this.leave.id);
      this.$emit('showDeleteSnackbarTableRow')
    },
    cancelAction() {
      this.dialog = false;
      this.$emit('dialogClosed');
    },
  }
}
</script>

<style scoped>

</style>
