<script setup>
  async function register(e) {
    const email = e.target[0].value;
    const password = e.target[1].value;
    const tel = e.target[2].value;
    const login = e.target[3].value;

    const formData = {
      email: email,
      password: password,
      tel: tel,
      login: login
    }
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Jeśli odpowiedź jest pozytywna
        console.log("Rejestracja zakończona sukcesem");
        // Możesz wyczyścić formularz
        e.target[0].value = '';
        e.target[1].value = '';
        e.target[2].value = '';
        e.target[3].value = '';
      } else {
        console.error("Błąd rejestracji", response.status);
      }

    } catch(e) {
      console.error(e);
    }
  }
</script>

<template>
  <form @submit.prevent="register">
    <input type="email" name="email" id="email" placeholder="Email" required />
    <input type="password" name="password" id="password" placeholder="Password" required />
    <input type="tel" name="tel" id="tel" placeholder="Phone" required />
    <input type="text" name="login" id="login" placeholder="Login" required />
    <input type="submit" value="SEND">
  </form>
</template>

<style scoped>

</style>