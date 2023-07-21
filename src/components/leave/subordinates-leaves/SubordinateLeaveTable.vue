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
  <v-table v-if="this.allSubordinatesLeaves" fixed-header>
    <subordinate-leave-table-header/>
    <tbody>
    <subordinate-leave-table-row v-for="leave in allSubordinatesLeaves" :key="leave.id" :allEmployees="allEmployees"
                                 :allLeaveStatus="allLeaveStatus"
                                 :allLeaveTypes="allLeaveTypes" :leave="leave"
                                 @subordinate-leave-updated="subordinateLeaveUpdated"
    />
    </tbody>
  </v-table>
  <div v-else id="no-leaves-div"><p class="no-leaves-text">No subordinates leaves added yet</p></div>
</template>

<script>
import SubordinateLeaveTableRow from "@/components/leave/subordinates-leaves/SubordinateLeaveTableRow.vue";
import SubordinateLeaveTableHeader from "@/components/leave/subordinates-leaves/SubordinateLeaveTableHeader.vue";

export default {
  name: "SubordinateLeaveTable",
  components: {SubordinateLeaveTableHeader, SubordinateLeaveTableRow},
  data() {
    return {
      snackbar: {
        show: false,
        text: '',
        color: '',
        buttonColor: ''
      },
    }
  },
  props: {
    allSubordinatesLeaves: Array,
    allEmployees: Array,
    allLeaveTypes: Array,
    allLeaveStatus: Array,
  },
  methods: {
    subordinateLeaveUpdated() {
      this.snackbar.show = true;
      this.snackbar.text = "Subordinate leave updated successfully";
      this.snackbar.color = "red";
      this.snackbar.buttonColor = "white"
    }
  }
}
</script>

<style scoped>
.no-leaves-text {
  font-size: 36px;
  font-weight: bold;
  color: #AAA;
  line-height: 1.5;
}

#no-leaves-div {
  text-align: center;
  padding: 20px;
}
</style>
