<template>
  <create-project-form v-if="isLoggedUserAdmin"/>
  <project-table
    v-if="allProjects.length"
    :allProjects="allProjects"/>
  <div v-else class="no-employees-div"><p class="no-employees-text">Nothing to show</p></div>
</template>

<script>
import ProjectTable from "@/components/project/all-projects/ProjectTable.vue";
import projectStore from "@/vuex/ProjectStore";
import CreateProjectForm from "@/components/project/all-projects/CreateProjectForm.vue";
import securityStore from "@/vuex/SecurityStore";

export default {
  name: "AllProjects",
  components: {CreateProjectForm, ProjectTable},
  computed: {
    allProjects() {
      return projectStore.getters.getAllProjects
    },
    isLoggedUserAdmin() {
      return securityStore.getters.isAdmin
    }
  },
  mounted() {
    projectStore.dispatch("findAllProjects")
    securityStore.dispatch('isAdmin')
  },
  methods: {}
}
</script>

<style scoped>

.no-employees-text {
  font-size: 36px;
  font-weight: bold;
  color: #AAA;
  line-height: 1.5;
}

.no-employees-div {
  text-align: center;
  padding: 20px;
}

</style>
