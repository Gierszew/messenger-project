<script setup>
  import {authUser} from "@/utility/token.js";
  import {onMounted, ref} from "vue";

  const logged = ref(false);

  onMounted(async () => {
    logged.value = await authUser();
    console.log(logged.value);
  });

  async function login(e) {
    const login = e.target[0].value;
    const password = e.target[1].value;

    const formData = {
      login: login,
      password: password
    };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        sessionStorage.setItem("authToken", token);

        e.target[0].value = '';
        e.target[1].value = '';
        console.log("Login success");
      } else {
        console.error("Błąd logowania", response.status);
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>

<template>
  <form @submit.prevent="login">
    <input type="text" name="login" id="login" placeholder="Login" required />
    <input type="password" name="password" id="password" placeholder="Password" required />
    <input type="submit" value="SEND">
  </form>
</template>

<style scoped>

</style>