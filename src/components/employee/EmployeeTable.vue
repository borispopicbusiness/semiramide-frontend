<template>

  <div>
    <v-table v-if="!this.employeesEmpty" fixed-header>
      <employee-table-header/>
      <tbody>
      <employee-table-row v-for="employee in employees" :key="employee.id" :employee="employee"/>
      </tbody>
    </v-table>
    <div v-else id="no-employees-div"><p class="no-employees-text">No employees added yet</p></div>
  </div>


</template>

<script>
import EmployeeTableHeader from "@/components/employee/EmployeeTableHeader.vue";
import EmployeeTableRow from "@/components/employee/EmployeeTableRow.vue";

export default {
  components: {EmployeeTableHeader, EmployeeTableRow},
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
  },
  mounted() {
    console.log("ENV: " + process.env.VUE_APP_GATEWAY_ADDRESS)
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
