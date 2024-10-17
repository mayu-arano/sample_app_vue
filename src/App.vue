<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <Header msg="店舗名" />
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
