<template>
  <div class="text-center">
    <v-dialog v-model="dialog"
              persistent
              width="auto">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>
          {{ mainText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteAction">Delete</v-btn>
          <v-btn text @click="cancelAction">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import employeeStore from "@/vuex/EmployeeStore";

export default {
  data() {
    return {
      dialog: this.showDialog,
    }
  },
  props: {
    showDialog: Boolean,
    title: String,
    mainText: String,
    employeeId: String
  },
  methods: {
    deleteAction() {
      employeeStore.dispatch('deleteEmployee', this.employeeId);
      this.dialog = false;
      this.$emit('dialogClosed');
    },
    cancelAction() {
      this.dialog = false;
      this.$emit('dialogClosed');
    }
  },
}
</script>
