<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      width="700px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ employee.firstName }}
            {{ employee.lastName }}</span>
        </v-card-title>
        <v-table>
          <tbody>
          <tr>
            <td style="text-align: right">First Name:</td>
            <td>{{ employee.firstName }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Last Name:</td>
            <td>{{ employee.lastName }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Email:</td>
            <td>{{ employee.email }}</td>
          </tr>
          </tbody>
        </v-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            block
            color="blue"
            variant="text"
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  emits: ['dialogValueChanged'],
  name: "EmployeeProfileDialog",
  data() {
    return {
      dialog: false,
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
      this.$emit('dialogValueChanged', newValue);
    }
  }
}

</script>
