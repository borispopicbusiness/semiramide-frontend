<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app>
      <main-sidebar/>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Menu</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import MainSidebar from "@/components/MainSidebar.vue";
import employeeStore from "@/vuex/EmployeeStore";

export default {
  components: {MainSidebar},
  data() {
    return {
      drawer: null
    }
  },
  mounted() {
    employeeStore.dispatch('fetchSubordinates');
    employeeStore.dispatch('fetchAllEmployees');
  }
}
</script>
