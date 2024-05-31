<template>
    <div>
      <Navbar />
      <LoginForm />
    </div>
  </template>
  
  <script>
  import Navbar from '../components/NavBar.vue';
  import LoginForm from '../components/LoginForm.vue';
  
  export default {
    components: {
      Navbar,
      LoginForm,
    },
  };
  </script>
  