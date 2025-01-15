<script setup>
import Chat from "@/components/Chat.vue";
import {ref, onMounted} from "vue";
import { getToken, authUser } from "@/utility/token.js";

const name = ref('');
const logged = ref(false);

onMounted(async () => {
  logged.value = await authUser();
  const decodedToken = await getToken();
  if (decodedToken && logged.value) {
    name.value = decodedToken.login;
  } else {
    name.value = "Guest";
  }
});

</script>

<template>
  <div>
    <h1>Home</h1>
    <p>Welcome, {{ name }}</p>
    <Chat />
  </div>
</template>

<style scoped>

</style>