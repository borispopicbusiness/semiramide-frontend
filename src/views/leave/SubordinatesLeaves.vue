<template>
  <subordinate-leave-table v-if="allSubordinatesLeaves.length" :allEmployees="allEmployees"
                           :allLeaveStatus="allLeaveStatus" :allLeaveTypes="allLeaveTypes"
                           :allSubordinatesLeaves="allSubordinatesLeaves"/>
  <div v-else id="no-employees-div"><p class="no-employees-text">Nothing to show</p></div>
</template>

<script>
import SubordinateLeaveTable from "@/components/leave/subordinates-leaves/SubordinateLeaveTable.vue";
import leaveStore from "@/vuex/LeaveStore";
import employeeStore from "@/vuex/EmployeeStore";
import allLeaves from "@/views/leave/AllLeaves.vue";

export default {
  name: "SubordinatesLeaves",
  components: {SubordinateLeaveTable},
  mounted() {
    leaveStore.dispatch('findSubordinatesLeaves')
    employeeStore.dispatch('fetchAllEmployees')
    employeeStore.dispatch('fetchLoggedUser')
  },
  computed: {
    allLeaves() {
      return allLeaves
    },
    allSubordinatesLeaves() {
      return leaveStore.getters.getSubordinatesLeaves
    },
    allEmployees() {
      return employeeStore.getters.getAllEmployees
    },
    allLeaveTypes() {
      return leaveStore.getters.getLeaveTypes
    },
    allLeaveStatus() {
      return leaveStore.getters.getLeaveStatus
    }
  },

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
