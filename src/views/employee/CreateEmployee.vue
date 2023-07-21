<template>
  <div>
    <v-snackbar
      v-model="ssbModel"
      color="green-lighten-2"
    >{{ state.successText }}
      <template v-slot:actions>
        <v-btn
          color="black"
          variant="text"
          @click="ssbModel = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="esbModel"
      color="red">{{ state.errorText }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="esbModel = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <form @submit.prevent="submit">
      <v-text-field
        v-model="firstName.value.value"
        :counter="10"
        :error-messages="firstName.errorMessage.value"
        label="First name"
      ></v-text-field>

      <v-text-field
        v-model="lastName.value.value"
        :counter="7"
        :error-messages="lastName.errorMessage.value"
        label="Last name"
      ></v-text-field>

      <v-text-field
        v-model="email.value.value"
        :error-messages="email.errorMessage.value"
        label="E-mail"
      ></v-text-field>

      <v-text-field
        v-model="password.value.value"
        :error-messages="password.errorMessage.value"
        label="Password"
        type="password"
      ></v-text-field>

      <v-btn
        class="me-4"
        type="submit"
        variant="outlined">
        submit
      </v-btn>
      <v-btn
        variant="outlined"
        @click="handleReset">
        clear
      </v-btn>
    </form>
  </div>
</template>

<script>
import {useField, useForm} from 'vee-validate'
import employeeStore from "@/vuex/EmployeeStore";
import {computed, reactive} from 'vue'

export default {

  setup() {

    const state = reactive({
      ssb: false,
      esb: false,
      successText: "Employee created!",
      errorText: ""
    });

    const ssbModel = computed({
      get() {
        return state.ssb;
      },
      set(value) {
        state.ssb = Boolean(value);
      }
    })

    const esbModel = computed({
      get() {
        return state.esb;
      },
      set(value) {
        state.esb = Boolean(value);
      }
    })

    const {handleSubmit, handleReset} = useForm({
      validationSchema: {
        firstName(value) {
          if (value?.length >= 2) return true
          return 'First name needs to be at least 2 characters.'
        },
        lastName(value) {
          if (value?.length >= 2) return true
          return 'Last name needs to be at least 2 characters.'
        },
        email(value) {
          if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
          return 'Must be a valid e-mail.'
        },
        password(value) {
          if (value?.length >= 4) return true
          return 'Password must be at least 4 characters long.'
        }
      },
    })

    const firstName = useField('firstName')
    const lastName = useField('lastName')
    const email = useField('email')
    const password = useField('password')

    const submit = handleSubmit(values => {
      let employee = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      }
      createEmployee(employee);
      handleReset();
    })

    function createEmployee(employee) {
      employeeStore.dispatch('createEmployee', employee).then(response => {
        if (Object.prototype.hasOwnProperty.call(response.data, "errorCode")) {
          state.esb = true;
          state.errorText = response.data.errorMessage;
        } else {
          state.ssb = true;
        }
      }, error => {
        if (Object.prototype.hasOwnProperty.call(error.response.data, "errorCode")) {
          state.esb = true;
          state.errorText = "Error: " + error.response.data.errorCode + "; " + error.response.data.errorMessage;
        } else {
          state.ssb = true;
        }
      })
    }

    return {firstName, lastName, email, password, submit, handleReset, esbModel, ssbModel, state}
  },

}

</script>
