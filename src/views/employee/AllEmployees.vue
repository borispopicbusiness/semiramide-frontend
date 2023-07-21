<template>
  <v-snackbar
    v-model="ssbModel"
    color="green-lighten-2"
  >{{ successText }}
    <template v-slot:actions>
      <v-btn
        color="black"
        variant="text"
        @click="ssbModel = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar
    v-model="esbModel"
    color="red">{{ errorText }}
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="esbModel = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <employee-table :employees="allEmployees"/>
</template>

<script>
import EmployeeTable from "@/components/employee/EmployeeTable.vue";
import employeeStore from "@/vuex/EmployeeStore";
import EventBus from "@/vuex/EventBus";

export default {
  components: {EmployeeTable},
  data() {
    return {
      ssbModel: false,
      successText: "",
      esbModel: false,
      errorText: ""
    }
  },
  computed: {
    allEmployees() {
      return employeeStore.getters.getAllEmployees;
    }
  },
  methods: {
    fetchAllEmployees() {
      employeeStore.dispatch('fetchAllEmployees');
      // this.allEmployees = employeeStore.getters.getAllEmployees;
    },

  },
  mounted() {
    employeeStore.dispatch('fetchAllEmployees');
  },
  created() {
    EventBus.$on('employee-deleted-event', payload => {
      // Handle event
      console.log(payload);
      this.ssbModel = true;
      this.successText = "Employee deleted successfully";
    });
    EventBus.$on('employee-updated-event', payload => {
      // Handle event
      console.log(payload);
      this.ssbModel = true;
      this.successText = "Employee updated successfully";
    });
    EventBus.$on('employee-update-failed-event', payload => {
      // Handle event
      console.log(payload);
      this.esbModel = true;
      this.errorText = payload.errorMessage;
    });
  }
}
</script>
