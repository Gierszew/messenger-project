<script setup>
import {useRoute} from "vue-router";
import {checkGroup} from "@/utility/database.js";
import {authUser, getToken} from "@/utility/token.js";
import {onMounted, ref} from "vue";

const route = useRoute();
const group_id = route.params.group_id;
const logged = ref(false);
const userInGroup = ref(false);

onMounted(async () => {
  logged.value = await authUser();
  const decodedToken = await getToken();
  if (decodedToken) {
    userInGroup.value = await checkGroup(decodedToken.login, decodedToken.user_id, group_id);
  }
});

</script>

<template>
  <div v-if="logged && userInGroup">
    <div class="chat">
      <p>Yes you are here</p>
      <!--   load every message for every user WHERE group_id AND user_id order by created_at  -->
    </div>
    <input type="text" placeholder="Write a message">
  </div>
  <div v-else>
    <p>How the fuck are you there</p>
  </div>
</template>

<style scoped>

</style>