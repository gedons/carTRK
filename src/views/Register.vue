<template>
    <div>
      <Navbar />
      <RegisterForm />
    </div>
  </template>
  
  <script>
  import Navbar from '../components/NavBar.vue';
  import RegisterForm from '../components/RegisterForm.vue';
  
  export default {
    components: {
      Navbar,
      RegisterForm,
    },
  };
  </script>
  