<template>
  <employee-profile-dialog :employee="loggedEmployee"
                           :showDialog="profileDialogShown" @dialog-value-changed="dialogValueChanged"/>
  <change-password-dialog :employee="loggedEmployee"
                          :show-dialog="changePasswordDialogShown"
                          @change-password-dialog-shown-value-changed="changePasswordDialogShownValueChanged"
  />
  <v-app-bar elevation="2" flat>
    <v-app-bar-nav-icon>
      <v-icon icon="mdi-cloud-outline"/>
    </v-app-bar-nav-icon>
    <v-app-bar-title>
      Operations Portal
    </v-app-bar-title>
    <span>
      {{ loggedEmployee.firstName }}
      {{ loggedEmployee.lastName }}
      {{ admin }}
    </span>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
      </template>

      <v-list>
        <v-list-item v-if="securityStore.getters.isEmployee" @click="showProfile">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="showChangePasswordDialog">
          <v-list-item-title>Change password</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>


import employeeStore from "@/vuex/EmployeeStore";
import securityStore from "@/vuex/SecurityStore";
import EmployeeProfileDialog from "@/components/employee/EmployeeProfileDialog.vue";
import ChangePasswordDialog from "@/components/employee/my-subordinates/ChangePasswordDialog.vue";

export default {
  components: {ChangePasswordDialog, EmployeeProfileDialog},
  computed: {
    loggedEmployee() {
      return {
        firstName: employeeStore.getters.getLoggedUser.firstName,
        lastName: employeeStore.getters.getLoggedUser.lastName,
        email: employeeStore.getters.getLoggedUser.email,
        id: employeeStore.getters.getLoggedUser.id,
      }
    },
    admin() {
      if (securityStore.getters.isAdmin) {
        return "(admin)";
      }
      return "";
    },
    securityStore() {
      return securityStore
    }
  },
  data() {
    return {
      profileDialogShown: false,
      changePasswordDialogShown: false,
    }
  },
  mounted() {
    employeeStore.dispatch('fetchLoggedUser');
  },
  methods: {
    logout() {
      localStorage.removeItem('jwt');
      securityStore.getters.getKeycloak.logout();
    },
    showProfile() {
      this.profileDialogShown = true;
    },
    showChangePasswordDialog() {
      this.changePasswordDialogShown = true
    },
    dialogValueChanged(newValue) {
      this.profileDialogShown = newValue
    },
    changePasswordDialogShownValueChanged(newValue) {
      this.changePasswordDialogShown = newValue;
    }
  },
}
</script>
