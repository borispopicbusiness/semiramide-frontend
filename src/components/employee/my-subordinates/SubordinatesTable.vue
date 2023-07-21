<template>

  <div>
    <v-table v-if="!this.employeesEmpty" fixed-header>
      <subordinates-table-header/>
      <tbody>
      <subordinates-table-row v-for="employee in employees" :key="employee.id" :employee="employee"/>
      </tbody>
    </v-table>
    <div v-else id="no-employees-div"><p class="no-employees-text">No assigned subordinates</p></div>
  </div>


</template>

<script>
import SubordinatesTableRow from "@/components/employee/my-subordinates/SubordinatesTableRow.vue";
import SubordinatesTableHeader from "@/components/employee/my-subordinates/SubordinatesTableHeader.vue";

export default {
  components: {SubordinatesTableRow, SubordinatesTableHeader},
  data() {
    return {}
  },
  props: {
    employees: Array
  },
  computed: {
    employeesEmpty() {
      return this.employees.length === 0;
    }
  }

}

</script>
<style scoped>

.no-employees-text {
  font-size: 36px;
  font-weight: bold;
  color: #AAA;
  line-height: 1.5;
}

#no-employees-div {
  text-align: center;
  padding: 20px;
}
</style>
