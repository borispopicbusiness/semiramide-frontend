<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab v-if="isAdmin" value="ap">All projects</v-tab>
      <v-tab v-if="isEmployee" value="mp">My projects</v-tab>
      <v-tab v-if="isAdmin" value="as">Project assignment</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">

        <v-window-item v-if="isAdmin" value="ap">
          <all-projects/>
        </v-window-item>

        <v-window-item v-if="isEmployee" value="mp">
          <my-projects/>
        </v-window-item>

        <v-window-item v-if="isAdmin" value="as">
          <project-assignment/>
        </v-window-item>

      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import AllProjects from "@/views/project/AllProjects.vue";
import MyProjects from "@/views/project/MyProjects.vue";
import securityStore from "@/vuex/SecurityStore";
import ProjectAssignment from "@/views/project/ProjectAssignment.vue";

export default {
  components: {MyProjects, AllProjects, ProjectAssignment},
  computed: {
    isAdmin() {
      return securityStore.getters.isAdmin
    },
    isEmployee() {
      return securityStore.getters.isEmployee
    }
  },
  data() {
    return {
      tab: null
    }
  },
  mounted() {
    securityStore.dispatch('isAdmin')
  }
}
</script>
