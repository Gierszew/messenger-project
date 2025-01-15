<script setup>
import {getToken, authUser} from "@/utility/token.js";
import {onMounted, ref} from "vue";

const logged = ref(false);

onMounted(async () => {
  logged.value = await authUser();
});

  async function createGroup(e) {
    if (logged.value) {
      const group = e.target[0].value;
      const decodedToken = await getToken();
      let user_login;
      let user_id;
      if (decodedToken) {
        user_login = decodedToken.login;
        user_id = decodedToken.user_id;
      }
      const formData = {
        user_id: user_id,
        user_login: user_login,
        group_name: group
      }

      try {
        const response = await fetch("http://localhost:3000/create-group", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          e.target[0].value = '';
        } else {
          console.error("cos sie zjebalo")
        }
      } catch (e) {

      }
    } else {
      alert("YOU MUST BE LOGGED IN!!!");
    }
  }
</script>

<template>
  <form @submit.prevent="createGroup">
    <input type="text" placeholder="Type name of group" required>
    <!--  zapraszanie przyjaciół  -->
    <input type="submit" value="SEND">
  </form>
</template>

<style scoped>

</style>