<template>
  <div class="text-center">
    <v-dialog v-model="dialog"
              persistent
              width="auto">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>
          {{ messageText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteButtonPressed">Unassign</v-btn>
          <v-btn text @click="cancelAction">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import employeeStore from "@/vuex/EmployeeStore";
import projectStore from "@/vuex/ProjectStore";

export default {
  emits: ['employeeUnassigned', 'dialogClosed'],
  data() {
    return {
      dialog: this.showDialog,
    }
  },
  props: {
    projectId: String,
    assigneeName: String,
    assigneeId: String,
    showDialog: Boolean,
    title: String,
  },
  methods: {
    cancelAction() {
      this.dialog = false;
      this.$emit('dialogClosed');
    },
    getEmployeeById(eid) {
      let tmpEmployees = employeeStore.getters.getAllEmployees;
      let i = 0;
      while (i < tmpEmployees.length) {
        if (tmpEmployees[i].id === eid) {
          return tmpEmployees[i];
        }
        i++;
      }
    },
    deleteButtonPressed() {
      projectStore.dispatch('deleteProjectEmployee', {
        "projectId": this.projectId,
        "employeeId": this.assigneeId
      }).then(() => {
        this.$emit("employeeUnassigned", this.assigneeId);
      })
      this.cancelAction();
    },
  },
  computed: {
    messageText() {
      return this.assigneeName + " will no longer be assigned to " + this.selectedProjectName;
    },
    allProjects() {
      return projectStore.getters.getAllProjects;
    },
    selectedProjectName() {
      for (const element of this.allProjects) {
        if (element.id === this.projectId) {
          return element.name;
        }
      }
      return "";
    }
  },
  watch: {
    showDialog(newval) {
      this.dialog = newval;
    }
  }
}
</script>
