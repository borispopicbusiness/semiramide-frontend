<template>
  <v-card
    class="mx-auto"
    max-width="300"
  >
    <v-list density="comfortable">

      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        :value="item"
        color="primary"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <router-link :to="item.to">
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </router-link>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>

export default {
  data() {
    return {
      items: [
        {
          text: "Worklogs",
          icon: "mdi-note-multiple",
          to: "/worklogs"
        },
        {
          text: "Projects",
          icon: "mdi-list-box-outline",
          to: "/projects"
        },
        {
          text: "Leaves",
          icon: "mdi-calendar-account",
          to: "/leaves"
        },
        {
          text: "Employees",
          icon: "mdi-account",
          to: "/employees"
        }
      ]
    }
  }
}

</script>

<style scoped>

a {
  text-decoration: none;
  color: black;
}

</style>
