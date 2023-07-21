<template>
  <subordinates-table :employees="allEmployees"/>
</template>

<script>

import {defineComponent} from "vue";
import SubordinatesTable from "@/components/employee/my-subordinates/SubordinatesTable.vue";
import employeeStore from "@/vuex/EmployeeStore";

export default defineComponent({
  components: {SubordinatesTable},
  computed: {
    allEmployees() {
      return employeeStore.getters.getSubordinates;
    }
  },
  methods: {
    fetchSubordinates() {
      employeeStore.dispatch('fetchSubordinates');
    }
  },
  mounted() {
    employeeStore.dispatch('fetchSubordinates');
  },
})
</script>
