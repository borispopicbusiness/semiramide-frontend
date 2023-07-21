<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      width="700px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Change Password</span><br/>
        </v-card-title>
        <div style="width: 670px; justify-content: center; margin: 0 auto;">
          <form @submit.prevent="submit">
            <v-text-field
              v-model="newPassword"
              :rules="newPasswordRule"
              bg-color="rgba(255, 0, 0, 0.0)"
              hide-details="auto"
              label="New Password"
              type="password"
              @update:modelValue="checkFormValidityAndEnableApplyButton"
            ></v-text-field>
            <v-divider/>
            <v-text-field
              v-model="newPasswordConfirm"
              :rules="newPasswordConfirmRule"
              bg-color="rgba(255, 0, 0, 0.0)"
              hide-details="auto"
              label="Confirm New Password"
              type="password"
              @update:modelValue="checkFormValidityAndEnableApplyButton"
            ></v-text-field>
          </form>
        </div>
        <v-card-actions>
          <span style="font-size: 13px; color: red; padding-left: 15px">You will automatically be logged out</span>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="applyDisabled"
            color="green-darken-1"
            variant="text"
            @click="changePassword">
            Apply
          </v-btn>
          <v-btn
            color="black"
            variant="text"
            @click="cancel">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import employeeStore from "@/vuex/EmployeeStore";
import securityStore from "@/vuex/SecurityStore";

export default {
  emits: ['changePasswordDialogShownValueChanged'],
  name: "ChangePasswordDialog",
  data() {
    return {
      dialog: false,
      applyDisabled: true,
      newPassword: "",
      newPasswordConfirm: "",
      newPasswordRule: [
        v => v.length >= 4 || 'Password must be at least 4 characters long',
      ],
      newPasswordConfirmRule: [
        v => v === this.newPassword || "Password mismatch"
      ]
    }
  },
  props: {
    showDialog: Boolean,
    employee: Object
  },
  watch: {
    showDialog(newValue) {
      this.dialog = newValue
    },
    dialog(newValue) {
      this.$emit('changePasswordDialogShownValueChanged', newValue);
    }
  },
  methods: {
    submit() {

    },
    cancel() {
      this.dialog = false;
      this.newPassword = null;
      this.newPasswordConfirm = null;
    },
    async changePassword() {
      const response = await employeeStore.dispatch('changePassword', this.newPassword)
      console.log(response)
      this.dialog = false;
      localStorage.removeItem('jwt');
      securityStore.getters.getKeycloak.logout();
    },
    checkFormValidityAndEnableApplyButton() {
      if (this.newPassword.length >= 4
        && this.newPassword === this.newPasswordConfirm) {
        this.applyDisabled = false;
      } else {
        this.applyDisabled = true;
      }
    }
  }
}

</script>
