<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
  >{{ snackbar.text }}
    <template v-slot:actions>
      <v-btn
        :color="snackbar.buttonColor"
        variant="text"
        @click="snackbar.show = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-table fixed-header>
    <project-table-header/>
    <tbody>
    <project-table-row
      v-for="project in allProjects" :key="project.id"
      :project="project"
      @show-delete-project-snackbar="showDeleteProjectSnackbar"
      @show-failed-deletion-project-snackbar="showFailedDeletionProjectSnackbar"/>
    </tbody>
  </v-table>
</template>

<script>

import ProjectTableHeader from "@/components/project/all-projects/ProjectTableHeader.vue";
import ProjectTableRow from "@/components/project/all-projects/ProjectTableRow.vue";

export default {
  name: "ProjectTable",
  components: {ProjectTableRow, ProjectTableHeader},
  props: {
    allProjects: Array
  },
  data() {
    return {
      snackbar: {
        show: false,
        text: "",
        buttonColor: "black",
        color: "green-lighten-2"
      }
    }
  },
  methods: {
    showDeleteProjectSnackbar() {
      this.snackbar.show = true;
      this.snackbar.text = "Project successfully deleted!";
      this.snackbar.color = "green-lighten-2";
      this.snackbar.buttonColor = "black"
    },
    showFailedDeletionProjectSnackbar(error) {
      this.snackbar.show = true;
      this.snackbar.text = error.response.data.errorMessage;
      this.snackbar.color = "red";
      this.snackbar.buttonColor = "white"
    }
  }
}
</script>

<style scoped>

</style>
