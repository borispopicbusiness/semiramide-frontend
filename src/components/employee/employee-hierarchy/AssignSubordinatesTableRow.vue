<template>
  <tr>
    <td class="d-flex align-center" style="padding-top: 23px">
      <v-checkbox :value="employee.id" class="align-center justify-center" density="compact"
                  @change="checkboxStateChanged"></v-checkbox>
    </td>
    <td>{{ employee.firstName }} {{ employee.lastName }}</td>
    <td>{{ employee.email }}</td>
  </tr>
</template>

<script>

export default {
  props: {
    employee: Object
  },
  methods: {
    checkboxStateChanged(event) {
      if (event.target.checked === true) {
        this.$emit("employeeChecked", event.target.value);
      } else {
        this.$emit("employeeUnChecked", event.target.value);
      }
    }
  }

}

</script>
