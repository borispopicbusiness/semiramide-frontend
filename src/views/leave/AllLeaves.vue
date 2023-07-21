<template>
  <leave-table v-if="allLeaves.length" :allEmployees="allEmployees" :allLeaves="allLeaves" :allStatus="allStatus"
               :allTypes="allTypes"/>
  <div v-else id="no-employees-div"><p class="no-employees-text">Nothing to show</p></div>
</template>

<script>
import LeaveTable from "@/components/leave/all-leaves/LeaveTable.vue";
import leaveStore from "@/vuex/LeaveStore";
import employeeStore from "@/vuex/EmployeeStore";
import securityStore from "@/vuex/SecurityStore";

export default {
  name: "AllLeaves",
  components: {LeaveTable},
  computed: {
    allLeaves() {
      return leaveStore.getters.getAllLeaves
    },
    allEmployees() {
      return employeeStore.getters.getAllEmployees
    },
    allStatus() {
      return leaveStore.getters.getLeaveStatus
    },
    allTypes() {
      return leaveStore.getters.getLeaveTypes
    }
  },
  mounted() {
    leaveStore.dispatch('findAllLeaves')
    leaveStore.dispatch('findLeaveTypes')
    leaveStore.dispatch('findLeaveStatus')
    employeeStore.dispatch('fetchAllEmployees')
    securityStore.dispatch('isAdmin')
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
