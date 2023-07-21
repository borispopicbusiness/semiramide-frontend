<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab v-if="isAdmin()" value="al">All leaves</v-tab>
      <v-tab v-if="isEmployee()" value="ml">My leaves</v-tab>
      <v-tab v-if="isEmployee()" value="sl">Subordinate leaves</v-tab>
      <v-tab value="cl">Leaves calendar</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">

        <v-window-item v-if="isAdmin()" value="al">
          <all-leaves/>
        </v-window-item>

        <v-window-item v-if="isEmployee()" value="ml">
          <my-leaves/>
        </v-window-item>

        <v-window-item v-if="isEmployee()" value="sl">
          <subordinates-leaves/>
        </v-window-item>

        <v-window-item value="cl">
          <leave-calendar/>
        </v-window-item>

      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>

import AllLeaves from "@/views/leave/AllLeaves.vue";
import MyLeaves from "@/views/leave/MyLeaves.vue";
import SubordinatesLeaves from "@/views/leave/SubordinatesLeaves.vue";
import securityStore from "@/vuex/SecurityStore";
import LeaveCalendar from "@/views/leave/LeaveCalendar.vue";

export default {
  components: {LeaveCalendar, SubordinatesLeaves, MyLeaves, AllLeaves},
  data() {
    return {
      tab: null
    }
  },
  methods: {
    isAdmin() {
      return securityStore.getters.isAdmin;
    },
    isEmployee() {
      return securityStore.getters.isEmployee;
    }
  }
}

</script>
