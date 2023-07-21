<template>
  <v-table fixed-header>
    <filter-worklog-table-header/>
    <tbody>
    <filter-worklog-table-row
      v-for="worklog in worklogs"
      :key="worklog.id"
      :projects="projects"
      :worklog-prop="worklog"
      @worklog-deleted="worklogDeleted"
      @worklog-updating-error="worklogUpdatingError"
    />
    </tbody>
  </v-table>
</template>

<script>
import FilterWorklogTableHeader from "@/components/worklog/filter-worklogs/FilterWorklogTableHeader";
import FilterWorklogTableRow from "@/components/worklog/filter-worklogs/FilterWorklogTableRow";

export default {
  name: "FilterWorklogTable",
  emits: ['worklogDeleted', 'worklogUpdatingError'],
  components: {FilterWorklogTableRow, FilterWorklogTableHeader},
  data: () => ({
    worklogs: null
  }),
  props: {
    filteredWorklogs: Array,
    projects: Array
  },
  created() {
    this.worklogs = this.filteredWorklogs
  },
  watch: {
    filteredWorklogs(newValue) {
      this.worklogs = newValue
    }
  },
  methods: {
    worklogDeleted(worklogId) {
      this.$emit('worklogDeleted', worklogId);
    },
    worklogUpdatingError(error) {
      this.$emit('worklogUpdatingError', error);
    }
  }
}
</script>

<style scoped>

</style>
