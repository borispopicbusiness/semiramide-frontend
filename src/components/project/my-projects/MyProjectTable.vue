<template>
  <v-table fixed-header>
    <my-project-header/>
    <tbody>
    <my-project-row v-for="project in myProjects" :key="project.id" :project="project"/>
    </tbody>
  </v-table>
</template>

<script>


import projectStore from "@/vuex/ProjectStore";
import myProjectRow from "@/components/project/my-projects/MyProjectRow.vue";
import myProjectHeader from "@/components/project/my-projects/MyProjectHeader.vue";

export default {
  name: "MyProjectTable",
  components: {myProjectRow, myProjectHeader},
  computed: {
    myProjects() {
      return projectStore.getters.getMyProjects
    }
  }
}
</script>

<style scoped>

</style>
