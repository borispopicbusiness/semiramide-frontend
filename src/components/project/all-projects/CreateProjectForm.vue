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
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title
        class="font-weight-bold"
        style="font-size: 18px; color: rgba(0, 0, 0, 0.5); background-color: rgba(24, 102, 194, 0.2)">
        CREATE PROJECT
      </v-expansion-panel-title>
      <v-expansion-panel-text style="background-color: rgba(220, 220, 255, 0.2)">
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="3">
                <div class="text-field-wrapper">
                  <v-text-field
                    v-model="name"
                    bg-color="transparent"
                    label="Project name"
                    required
                  ></v-text-field>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="7">
                <v-text-field
                  v-model="description"
                  bg-color="transparent"
                  label="Description"
                  required
                ></v-text-field>
              </v-col>
              <v-col
                class="d-flex align-center justify-center"
                cols="12"
                md="2">
                <v-btn
                  :disabled="name === ''"
                  class="me-0"
                  flat
                  type="submit"
                  variant="outlined"
                  @click="createProject">
                  Create project
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
import projectStore from "@/vuex/ProjectStore";

export default {
  name: "CreateProjectForm",
  data() {
    return {
      valid: '',
      name: '',
      description: '',
      snackbar: {
        show: false,
        text: '',
        color: 'green-lighten-2',
        buttonColor: "black"
      }
    }
  },
  methods: {
    createProject(e) {
      console.log("creatProject")
      let projectRequest = {
        name: this.name,
        description: this.description,
      }
      projectStore.dispatch('createProject', projectRequest).then(() => {
        this.snackbar.show = true;
        this.snackbar.text = "Project created successfully.";
        this.snackbar.color = "green-lighten-2";
        this.snackbar.buttonColor = "black"
        this.name = '';
        this.description = '';
      }, error => {
        console.log(error.data + " res")
        if (Object.prototype.hasOwnProperty.call(error.response.data, "errorCode")) {
          this.snackbar.show = true;
          this.snackbar.text = "Error: " + error.response.data.errorCode + "; " + error.response.data.errorMessage;
          this.snackbar.color = "red";
          this.snackbar.buttonColor = "white"
        }
      })
      e.preventDefault();
    },
  }
}
</script>

<style scoped>

.text-field-wrapper {
  position: relative;
}

.error-message {
  color: red;
  font-size: 12px;
  padding-top: 8px;
  position: absolute;
  bottom: 0px;
  left: 0;
}

</style>
