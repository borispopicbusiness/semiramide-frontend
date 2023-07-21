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
  <general-deletion-confirmation-dialog
    :main-text="dialog.text"
    :show-dialog="dialog.show"
    title="Are you sure?"
    @dialog-closed="dialogClosed"
    @table-row-deletion-confirmed="TableRowDeletionConfirmed"
  />
  <tr>
    <td style="white-space: nowrap">
      <v-text-field v-if="edit" v-model="name" type="text" variant="underlined"></v-text-field>
      <span v-else>{{ project.name }}</span>
    </td>
    <td>
      <v-text-field
        v-if="edit"
        v-model="description"
        type="text"
        variant="underlined"></v-text-field>
      <span v-else>{{ project.description }}</span>
    </td>
    <td v-if="isAdmin" style="gap: 50px; text-align: right; white-space: nowrap">
      <v-btn v-if="edit" class="ma-0" flat icon="mdi-check" @click="updateProject(project)"></v-btn>
      <v-btn v-else class="ma-0" flat icon="mdi-pencil-outline" @click="toggleEdit"></v-btn>
      <v-btn v-if="edit" class="ma-0" flat icon="mdi-close" @click="resetValues(project)"></v-btn>
      <v-btn v-else class="ma-0" flat icon="mdi-trash-can-outline" @click="showDeletionConfirmationDialog"></v-btn>
    </td>
  </tr>
</template>

<script>
import securityStore from "@/vuex/SecurityStore";
import projectStore from "@/vuex/ProjectStore";
import GeneralDeletionConfirmationDialog from "@/components/GeneralDeletionConfirmationDialog.vue";

export default {
  name: "ProjectTableRow",
  emits: ['showDeleteProjectSnackbar', 'showFailedDeletionProjectSnackbar'],
  components: {GeneralDeletionConfirmationDialog},
  data() {
    return {
      dialog: {
        show: false,
        text: "",
      },
      edit: false,
      id: this.project.id,
      name: this.project.name,
      description: this.project.description,
      snackbar: {
        show: false,
        text: '',
        color: 'green-lighten-2',
        buttonColor: "black"
      }
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
    resetValues(project) {
      this.name = project.name
      this.description = project.description
      this.toggleEdit()
    },
    toggleEdit() {
      this.edit = !this.edit;
    },
    dialogClosed() {
      this.dialog.show = false;
    },
    TableRowDeletionConfirmed() {
      this.dialog.show = false;
      //projectStore.dispatch('deleteProject', this.id)
      projectStore.dispatch('deleteProject', this.id).then(() => {
        this.$emit('showDeleteProjectSnackbar')
      }, error => {
        this.$emit('showFailedDeletionProjectSnackbar', error)
      })
    },
    showDeletionConfirmationDialog() {
      this.dialog.text = "Are you sure you want to delete project " + this.project.name + "?";
      this.dialog.show = true;
    },
    updateProject(project) {
      let updatedProject = {
        id: this.project.id,
        name: this.name,
        description: this.description
      }
      if (project.name === this.name && project.description === this.description) {
        this.toggleEdit()
        return;
      }
      projectStore.dispatch('updateProject', updatedProject).then(() => {
        this.snackbar.show = true;
        this.snackbar.text = "Project updated successfully.";
        this.snackbar.color = "green-lighten-2";
        this.snackbar.buttonColor = "black"
        project.name = updatedProject.name;
        project.description = updatedProject.description;
      }, error => {
        if (Object.prototype.hasOwnProperty.call(error.response.data, "errorCode")) {
          this.snackbar.show = true;
          this.snackbar.text = "Error: " + error.response.data.errorCode + "; " + error.response.data.errorMessage;
          this.snackbar.color = "red";
          this.snackbar.buttonColor = "white"
          this.name = project.name;
          this.description = project.description;
        }
      })
      this.toggleEdit();
    },
  },

  watch: {}
}
</script>

<style scoped>
.v-text-field {
  background-color: white;
  container: none;
}
</style>
