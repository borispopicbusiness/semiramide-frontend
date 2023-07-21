<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="6">
        <v-sheet class="ma-2 pa-2">
          <v-autocomplete
            v-model="selectedEmployeeId"
            :items="dropDownEntries"
            label="Employee"
            variant="underlined"
            @update:modelValue="employeeChanged">
          </v-autocomplete>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="6">
        <v-sheet class="ma-2 pa-2">
          <subordinates-part :employee-id="selectedEmployeeId"/>
        </v-sheet>
      </v-col>
      <v-divider class="divider" vertical/>
      <v-col>
        <v-sheet class="ma-2 pa-2">
          <superiors-part :employee-id="selectedEmployeeId"/>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SubordinatesPart from "@/components/employee/employee-hierarchy/SubordinatesPart.vue";
import SuperiorsPart from "@/components/employee/employee-hierarchy/SuperiorsPart.vue";
import employeeStore from "@/vuex/EmployeeStore";

export default {
  components: {SubordinatesPart, SuperiorsPart},
  data() {
    return {
      selectedEmployeeId: "",
      dropDownEntries: [],
      employees: employeeStore.getters.getAllEmployees,
    }
  },
  mounted() {
    this.initializeDropDownEntries();
  },
  methods: {
    initializeDropDownEntries() {
      this.employees = employeeStore.getters.getAllEmployees;
      this.dropDownEntries = []
      for (const element of this.employees) {
        let entry = element.firstName + " " + element.lastName + " (" + element.email + ")";
        this.dropDownEntries.push({
          value: element.id,
          title: entry,
        });
      }
    },
    employeeChanged() {
      console.log("eid: " + this.selectedEmployeeId);
    },
  },
}
</script>

<style scoped>
divider {
  height: 100%;
  border-width: 20px;
}

/* Change the color of the vertical divider */
divider::before {
  background-color: red;
}
</style>
