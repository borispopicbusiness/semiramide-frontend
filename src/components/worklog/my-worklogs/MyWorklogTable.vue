<template>
  <v-table fixed-header>
    <my-worklog-table-header/>
    <tbody>
    <my-worklog-table-row
      v-for="worklog in myWorklogs"
      :key="worklog.id"
      :allTypes="allTypes"
      :projects="projects"
      :worklog="worklog"
      @worklog-deleted-table="worklogDeletedTable"
      @worklog-deletion-error-table="worklogDeletionErrorTable"
      @worklog-updating-error="worklogUpdatingError"/>
    </tbody>
  </v-table>
</template>

<script>
import MyWorklogTableHeader from "@/components/worklog/my-worklogs/MyWorklogTableHeader";
import MyWorklogTableRow from "@/components/worklog/my-worklogs/MyWorklogTableRow";

export default {
  name: "MyWorklogTable",
  components: {MyWorklogTableHeader, MyWorklogTableRow},
  emits: ['showSnackbarWorklogDeleted', 'showSnackbarWorklogDeletionError', 'worklogUpdatingError'],
  props: {
    myWorklogs: Array,
    projects: Array,
    allTypes: Array
  },
  methods: {
    worklogDeletedTable() {
      this.$emit('showSnackbarWorklogDeleted');
    },
    worklogDeletionErrorTable(error) {
      this.$emit('showSnackbarWorklogDeletionError', error);
    },
    worklogUpdatingError(error) {
      this.$emit('worklogUpdatingError', error);
    }
  }
}
</script>

<style scoped>

</style>
