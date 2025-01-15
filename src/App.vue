<script setup>
  import Navigator from "@/components/Navigator.vue";
  import Groups from "@/components/GetGroups.vue";

</script>

<template>
  <Navigator />
  <div class="container">
    <Groups />
    <router-view />
  </div>
</template>

<style scoped>
.container {
  display: flex;
}
</style>