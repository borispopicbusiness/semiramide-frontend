<template>
  <create-leave-form :allStatus="allStatus" :allTypes="allTypes"/>
  <v-divider/>
  <my-leave-table v-if="ownLeaves.length" :allEmployees="allEmployees" :ownLeaves="ownLeaves"/>
  <div v-else id="no-employees-div"><p class="no-employees-text">Nothing to show</p></div>
</template>

<script>
import MyLeaveTable from "@/components/leave/my-leaves/MyLeaveTable.vue";
import leaveStore from "@/vuex/LeaveStore";
import employeeStore from "@/vuex/EmployeeStore";
import CreateLeaveForm from "@/components/leave/my-leaves/CreateLeaveForm.vue";
import allLeaves from "@/views/leave/AllLeaves.vue";

export default {
  name: "MyLeaves",
  components: {CreateLeaveForm, MyLeaveTable},
  computed: {
    allLeaves() {
      return allLeaves
    },
    ownLeaves() {
      return leaveStore.getters.getOwnLeaves
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
    leaveStore.dispatch('findOwnLeaves')
    employeeStore.dispatch('fetchAllEmployees')
    leaveStore.dispatch('findLeaveTypes')
    leaveStore.dispatch('findLeaveStatus')
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
