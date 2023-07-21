<template>
  <my-project-table v-if="myProjects.length" :myProjects="myProjects"/>
  <div v-else class="no-employees-div"><p class="no-employees-text">Nothing to show</p></div>
</template>

<script>
import myProjectTable from "@/components/project/my-projects/MyProjectTable.vue";
import projectStore from "@/vuex/ProjectStore";

export default {
  name: "MyProjects",
  components: {myProjectTable},
  computed: {
    myProjects() {
      return projectStore.getters.getMyProjects
    },
    employeeProjects() {
      return projectStore.getters.getEmployeeProjects
    }
  },
  mounted() {
    projectStore.dispatch('findEmployeeProjects').then(() => {
      let size = projectStore.getters.getEmployeeProjects.length
      for (let i = 0; i < size; i++) {
        projectStore.dispatch('setMyProjects', []).then(()=>{
          projectStore.dispatch('findProjectById', this.employeeProjects[i].projectId)
        })
      }
    }, reject => {
      console.log(reject)
    });

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

.no-employees-div {
  text-align: center;
  padding: 20px;
}
</style>
