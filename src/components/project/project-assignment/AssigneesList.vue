<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="6">
        <v-autocomplete
          v-model="selectedProjectId"
          :items="projects"
          label="Project"
          variant="underlined"
          @update:modelValue="projectChanged">
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <single-list :assignedEmployeesList="assignedEmployeesList" :projectEmployeesList="projectEmployeesList"
                   :projectId="selectedProjectId"/>
    </v-row>
  </v-container>
</template>
<script>
import employeeStore from "@/vuex/EmployeeStore";
import SingleList from "@/components/project/project-assignment/SingleList.vue";
import projectStore from "@/vuex/ProjectStore";
import axios from "axios";

export default {
  name: "EmployeeList",
  components: {SingleList},
  data() {
    return {
      select: null,
      selectedProjectId: "",
      dropDownEntries: [],
      projects: this.allProjects.map(project => project.id),
      projectEmployeesList: [],
      assignedEmployeesList: employeeStore.getters.getAssignedEmployees
    }
  },
  computed: {
    assignedEmployees() {
      return employeeStore.getters.getAssignedEmployees
    },
    getProjectEmployees() {
      return projectStore.getters.getProjectEmployees
    }
  },
  mounted() {
    this.initializeDropDownEntries();
  },
  watch: {},
  props: {
    employee: Object,
    allEmployees: Array,
    allProjects: Array,
  },
  methods: {
    initializeDropDownEntries() {
      for (const element of this.assignedEmployees) {
        let entry = element.firstName + " " + element.lastName + " (" + element.email + ")";
        this.dropDownEntries.push({
          value: element.id,
          title: entry,
        });
      }
    },
    async projectChanged() {
      this.projectEmployeesList = []
      this.assignedEmployeesList = []
      console.log("eid: " + this.selectedProjectId);
      console.log(this.projectEmployeesList.length + " - number of employees assigned to selected project")
      const projectEmployees = await axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/project-employees/projectId/' + this.selectedProjectId,
        {
          headers: {
            'Access-Controll-Allow-Origin': '*',
            'Access-Controll-Allow-Methods': '*',
            Authorization: `Bearer ${localStorage.getItem("vue-token")}`
          }
        }
      ).then((response) => {
        this.projectEmployeesList = response.data
      });

      console.log(this.projectEmployeesList.length + " - number of employees assigned to selected project")
      for (let i = 0; i < this.projectEmployeesList.length; i++) {
        console.log("i: " + i);
        const employees = await
          axios.get(import.meta.env.VITE_GATEWAY_ADDRESS + '/employee/' + this.projectEmployeesList[i].employeesId,
            {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                Authorization: `Bearer ${localStorage.getItem("vue-token")}`
              }
            }).then((response) => {
            this.assignedEmployeesList.push(response.data)
          });
        console.log(employees)
        console.log(projectEmployees)
      }
    }
  }

}
</script>

<style scoped>

</style>
