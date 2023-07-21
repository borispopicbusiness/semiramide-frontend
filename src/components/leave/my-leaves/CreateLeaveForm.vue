<template>
  <v-snackbar
    v-model="showSnackbar"
    :color="snackbarColor"
  >{{ snackbarText }}
    <template v-slot:actions>
      <v-btn
        :color="snackbarButtonColor"
        variant="text"
        @click="showSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title
        class="font-weight-bold"
        style="font-size: 18px; color: rgba(0, 0, 0, 0.5); background-color: rgba(24, 102, 194, 0.2)">
        REQUEST LEAVE
      </v-expansion-panel-title>
      <v-expansion-panel-text style="background-color: rgba(220, 220, 255, 0.2)">
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="1">
                <v-text-field
                  v-model="fromDate"
                  :rules="nameRules"
                  bg-color="transparent"
                  label="From date"
                  required
                  type="date">
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="1">
                <v-text-field
                  v-model="toDate"
                  :rules="nameRules"
                  bg-color="transparent"
                  label="To date"
                  required
                  type="date">
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="8">
                <v-text-field
                  v-model="description"
                  bg-color="transparent"
                  label="Description"
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="1">
                <v-select
                  v-model="select"
                  :items="allTypes"
                  :rules="[v => !!v || 'Type is required']"
                  bg-color="transparent"
                  label="Type"
                  required
                ></v-select>
              </v-col>
              <v-col
                class="d-flex align-center justify-center"
                cols="12"
                md="1">
                <v-btn
                  class="me-0"
                  flat
                  type="submit"
                  variant="outlined"
                  @click="request">
                  Request
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>

import leaveStore from "@/vuex/LeaveStore";

export default {
  name: "CreateLeaveForm",
  data: () => ({
    showSnackbar: false,
    snackbarText: "",
    snackbarColor: "",
    snackbarButtonColor: "",
    valid: false,
    date: '',
    fromDate: '',
    toDate: '',
    description: '',
    select: null,
    nameRules: [
      value => {
        if (value) return true
        return 'Date is requred.'
      },
      value => {
        if (/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/i.test(value)) return true
        return 'yyyy-mm-dd'
      },
    ],

  }),
  props: {
    allTypes: Array,
    allStatus: Array,
  },
  methods: {
    request(e) {
      let leaveRequest = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        description: this.description,
        leaveType: this.select
      }
      leaveStore.dispatch('requestLeave', leaveRequest).then(response => {
        if (Object.prototype.hasOwnProperty.call(response.data, "errorCode")) {
          this.showSnackbar = true;
          this.snackbarColor = "red";
          this.snackbarButtonColor = "white";
          this.snackbarText = response.data.errorMessage;
        } else {
          this.showSnackbar = true;
          this.snackbarColor = "green-lighten-2";
          this.snackbarButtonColor = "black";
          this.snackbarText = "Leave requested!";
        }
      }, error => {
        if (Object.prototype.hasOwnProperty.call(error.response.data, "errorCode")) {
          this.showSnackbar = true;
          this.snackbarColor = "red";
          this.snackbarButtonColor = "white";
          this.snackbarText = error.response.data.errorMessage;
        } else {
          this.showSnackbar = true;
          this.snackbarColor = "red";
          this.snackbarButtonColor = "white";
          this.snackbarText = "Unknown error";
        }
      })
      this.fromDate = null;
      this.toDate = null;
      this.description = null;
      this.select = null;
      e.preventDefault();
    }
  },
}
</script>
<style scoped>

</style>
