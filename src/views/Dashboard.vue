<template>
    <div>
      <Navbar />
      <div class="container mx-auto mt-10">
        <h1 class="text-2xl">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  </template>
  
  <script>
    import Navbar from '../components/NavBar.vue';
  
  export default {
    components: {
      Navbar,
    },
  };
  </script>
  