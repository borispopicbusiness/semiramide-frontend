<template>
  <deletion-confirmation-dialog
    v-if="showDeleteDialog"
    :employee-id="employeeId"
    :main-text="dialogMainText"
    :show-dialog="showDeleteDialog"
    title="Are you sure?"
    @dialog-closed="showDeleteDialog = false"/>
  <tr>
    <td>
      <span v-if="!isEdit">{{ employee.firstName }}</span>
      <v-text-field v-else v-model="fName" bg-color="transparent" label="First name"></v-text-field>
    </td>
    <td>
      <span v-if="!isEdit">{{ employee.lastName }}</span>
      <v-text-field v-else v-model="lName" bg-color="transparent" label="Last name"></v-text-field>
    </td>
    <td>
      <span v-if="!isEdit">{{ employee.email }}</span>
      <v-text-field v-else v-model="eMail" bg-color="transparent" label="eMail"></v-text-field>
    </td>
    <td v-if="!isEdit" class="operations-cell">
      <section v-if="securityStore.getters.isAdmin">
        <v-btn
          class="ma-0"
          flat
          icon="mdi-pencil-outline"
          @click="edit">
          <v-icon icon="mdi-pencil-outline"/>
          <v-tooltip
            activator="parent"
            location="top">Edit
          </v-tooltip>
        </v-btn>

        <v-btn
          class="ma-0"
          flat
          icon="mdi-trash-can-outline"
          @click="deleteEmployee">
          <v-icon icon="mdi-trash-can-outline"/>
          <v-tooltip
            activator="parent"
            location="top">Delete
          </v-tooltip>
        </v-btn>
      </section>
    </td>
    <td v-else class="operations-cell">
      <section v-if="securityStore.getters.isAdmin">
        <v-btn
          class="ma-0"
          flat
          icon="mdi-check"
          @click="apply">
          <v-icon icon="mdi-check"/>
          <v-tooltip
            activator="parent"
            location="top">Apply
          </v-tooltip>
        </v-btn>

        <v-btn
          class="ma-0"
          flat
          icon="mdi-close"
          @click="edit">
          <v-icon icon="mdi-close"/>
          <v-tooltip
            activator="parent"
            location="top">Cancel
          </v-tooltip>
        </v-btn>
      </section>
    </td>
  </tr>
</template>

<script>
import DeletionConfirmationDialog from "@/components/employee/DeletionConfirmationDialog.vue";
import employeeStore from "@/vuex/EmployeeStore";
import securityStore from "@/vuex/SecurityStore";

export default {
  components: {DeletionConfirmationDialog},
  data() {
    return {
      isEdit: false,
      showDeleteDialog: false,
      employeeId: this.employee.id,
      fName: this.employee.firstName,
      lName: this.employee.lastName,
      eMail: this.employee.email,
    }
  },
  computed: {
    securityStore() {
      return securityStore
    },
    dialogMainText() {
      return "All of " + this.fName + " " + this.lName + "'s data will be permanently removed.";
    }
  },
  props: {
    employee: Object
  },
  methods: {
    toggleEdit() {
      this.isEdit = !this.isEdit;
      this.fName = this.employee.firstName;
      this.lName = this.employee.lastName;
      this.eMail = this.employee.email;
    },
    edit() {
      this.toggleEdit();
    },
    apply() {
      employeeStore.dispatch('updateEmployee', {
        id: this.employee.id,
        firstName: this.fName,
        lastName: this.lName,
        email: this.eMail,
        password: this.employee.password
      });
      this.toggleEdit();
    },
    deleteEmployee() {
      this.showDeleteDialog = !this.showDeleteDialog;
    }
  }
}
</script>

<style scoped>
.operations-cell {
  text-align: right;
}
</style>
