<script setup>
  import {ref, onMounted, onBeforeMount} from "vue";
  import socket from "@/utility/socket.js";

  const messages = ref([]);
  const newMessage = ref("");

  const sendMessage = () => {
    if (newMessage.value.trim()) {
      socket.emit("chat message", newMessage.value);
      newMessage.value = "";
    }
  };

  onMounted(() => {
    socket.on("chat message", (msg) => {
      messages.value.push(msg);
    });
  });

  onBeforeMount(() => {
    socket.off("chat message");
  })
</script>

<template>
  <div>
    <h1>Czat na żywo</h1>
    <ul id="messages">
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Wpisz wiadomość..." />
    <button @click="sendMessage">Wyślij</button>
  </div>
</template>

<style scoped>

</style>