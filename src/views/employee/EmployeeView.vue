<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab v-if="isAdmin()" value="ae" @click="refreshAllEmployees">All employees</v-tab>
      <v-tab v-if="isEmployee()" value="ms" @click="refreshSubordinates">My subordinates</v-tab>
      <v-tab v-if="isAdmin()" value="ce">Create employee</v-tab>
      <v-tab v-if="isAdmin()" value="as" @click="refreshEmployeeHierarchyAutocomplete">Employee hierarchy</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">

        <v-window-item v-if="isAdmin()" value="ae">
          <all-employees ref="allEmployeesSubcomponent"/>
        </v-window-item>

        <v-window-item v-if="isEmployee()" value="ms">
          <my-subordinates ref="mySubordinatesSubcomponent"/>
        </v-window-item>

        <v-window-item v-if="isAdmin()" value="ce">
          <create-employee/>
        </v-window-item>

        <v-window-item v-if="isAdmin()" value="as">
          <employee-hierarchy ref="employeeHierarchySubcomponent"/>
        </v-window-item>

      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import AllEmployees from "@/views/employee/AllEmployees.vue";
import CreateEmployee from "@/views/employee/CreateEmployee.vue";
import MySubordinates from "@/views/employee/MySubordinates.vue";
import EmployeeHierarchy from "@/views/employee/EmployeeHierarchy.vue";
import securityStore from "@/vuex/SecurityStore";

export default {
  components: {EmployeeHierarchy, MySubordinates, CreateEmployee, AllEmployees},
  data() {
    return {
      tab: null
    }
  },
  methods: {
    refreshAllEmployees() {
      if (this.$refs.allEmployeesSubcomponent !== undefined) {
        this.$refs.allEmployeesSubcomponent.fetchAllEmployees();
      }
    },
    refreshSubordinates() {
      if (this.$refs.mySubordinatesSubcomponent !== undefined) {
        this.$refs.mySubordinatesSubcomponent.fetchSubordinates();
      }
    },
    refreshEmployeeHierarchyAutocomplete() {
      if (this.$refs.employeeHierarchySubcomponent !== undefined) {
        this.$refs.employeeHierarchySubcomponent.initializeDropDownEntries();
      }
    },
    isAdmin() {
      return securityStore.getters.isAdmin;
    },
    isEmployee() {
      return securityStore.getters.isEmployee;
    }
  },
}
</script>
