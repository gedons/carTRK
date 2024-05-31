<template>
    <div>
      <Navbar />
      <LoginForm />
    </div>
  </template>
  
  <script>
   import Navbar from '../components/Navbar.vue';
  import LoginForm from '../components/LoginForm.vue';
  
  export default {
    components: {
      Navbar,
      LoginForm,
    },
  };
  </script>
  