<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab v-if="isEmployee" value="my-worklogs">My worklogs</v-tab>
      <v-tab value="filter-worklogs">Filter worklogs</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">

        <v-window-item v-if="isEmployee" value="my-worklogs">
          <my-worklogs/>
        </v-window-item>

        <v-window-item value="filter-worklogs">
          <filter-worklogs/>
        </v-window-item>

      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>

import MyWorklogs from "@/views/worklog/MyWorklogs";
import FilterWorklogs from "@/views/worklog/FilterWorklogs";
import securityStore from "@/vuex/SecurityStore";

export default {
  components: {FilterWorklogs, MyWorklogs},
  data() {
    return {
      tab: null
    }
  },
  computed: {
    isAdmin() {
      return securityStore.getters.isAdmin
    },
    isEmployee() {
      return securityStore.getters.isEmployee;
    }
  },
}

</script>
