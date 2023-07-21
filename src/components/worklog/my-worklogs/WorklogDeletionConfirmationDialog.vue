<template>
  <div class="text-center">
    <v-dialog v-model="dialogShown"
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
import worklogsStore from "@/vuex/WorklogStore";

export default {
  name: "WorklogDeletionConfirmationDialog",
  emits: ['worklogDeleted', 'worklogDeletionError', 'worklogDeletionConfirmationDialogClosed'],
  data() {
    return {
      dialogShown: false,
      title: 'Are you sure?',
      mainText: 'Selected worklog will be deleted!',
    }
  },
  props: {
    showDialog: Boolean,
    worklogId: String
  },
  watch: {
    showDialog(newValue) {
      this.dialogShown = newValue;
    }
  },
  methods: {
    deleteAction() {
      worklogsStore.dispatch('deleteWorklog', this.worklogId)
        .then(resolve => {
          this.dialogShown = false;
          this.$emit('worklogDeleted')
        }, reject => {
          this.dialogShown = false;
          this.$emit('worklogDeletionError', reject)
        })
    },
    cancelAction() {
      this.dialogShown = false;
      this.$emit('worklogDeletionConfirmationDialogClosed');
    }
  }
}
</script>

<style scoped>

</style>
