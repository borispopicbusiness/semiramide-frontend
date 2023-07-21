<template>
  <tr>
    <td>
      <span v-if="edit"><v-text-field v-model="name" type="text" variant="underlined"></v-text-field></span>
      <span v-else>{{ project.name }}</span>
    </td>
    <td>
      <span v-if="edit"><v-text-field v-model="description" type="text" variant="underlined"></v-text-field></span>
      <span v-else>{{ project.description }}</span>
    </td>
    <td v-if="isAdmin" style="gap: 50px; text-align: right">
      <v-btn v-if="edit" class="ma-0" flat icon="mdi-check" @click="updateProject(project)"></v-btn>
      <v-btn v-else class="ma-0" flat icon="mdi-pencil-outline" @click="toggleEdit"></v-btn>
      <v-btn v-if="edit" class="ma-0" flat icon="mdi-close" @click="toggleEdit"></v-btn>
      <v-btn v-else class="ma-0" flat icon="mdi-trash-can-outline" @click="deleteProject(project)"></v-btn>
    </td>
  </tr>
</template>

<script>
import securityStore from "@/vuex/SecurityStore";
import projectStore from "@/vuex/ProjectStore";

export default {
  name: "MyProjectRow",
  data() {
    return {
      edit: false,
      id: this.project.id,
      name: this.project.name,
      description: this.project.description
    }
  },
  computed: {
    isAdmin() {
      return securityStore.getters.isAdmin
    }
  },
  mounted() {
    securityStore.dispatch('isAdmin')
  },
  props: {
    project: Object
  },

  methods: {
    toggleEdit() {
      this.edit = !this.edit;
    },
    updateProject(project) {
      let updatedProject = {
        id: this.project.id,
        name: this.name,
        description: this.description
      }
      projectStore.dispatch('updateProject', updatedProject)
      project.name = updatedProject.name,
        project.description = updatedProject.description,
        this.toggleEdit()
    },
    deleteProject(project) {
      projectStore.dispatch('deleteProject', project.id)
    }
  },

  watch: {}
}
</script>

<style scoped>

</style>
