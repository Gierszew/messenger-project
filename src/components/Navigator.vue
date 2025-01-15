<script setup>

</script>

<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/register">Register</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/create-group">Create Group</router-link>
  </nav>
</template>

<style scoped>
  nav {
    display: flex;
    justify-content: space-around;
  }
</style>