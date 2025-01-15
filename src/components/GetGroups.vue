<script setup>
import {getToken, authUser} from "@/utility/token.js";
import {onMounted, ref} from "vue";
import {getGroups} from "@/utility/database.js";

const logged = ref(false);
const groups = ref([]);

onMounted(async () => {
  logged.value = await authUser();
  const decodedToken = await getToken();
  if (decodedToken) {
    groups.value = await getGroups(decodedToken.login, decodedToken.user_id);
  }
});

</script>

<template>
  <section>
    <div v-if="logged"> <!-- Sprawdzenie, czy użytkownik jest zalogowany -->
      <h1>Your Groups</h1>
      <ul>
        <li v-for="group in groups" :key="group.group_id">
          <router-link :to="`/group/${group.group_id}`">
            <strong>{{ group.group_name }}</strong>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Please log in to see your groups.</p>
    </div>
  </section>
</template>

<style scoped>

</style>