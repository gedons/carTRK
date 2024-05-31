<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">    
      <form @submit.prevent="login">
          <div class="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-300 to-indigo-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
            </div>
            <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <div class="max-w-md mx-auto">
                <div>
                  <h1 class="text-2xl font-semibold">Login Form</h1>
                </div>
                <div class="divide-y divide-gray-200">
                  <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div class="mb-4 text-red-500 font-semibold" v-if="error">{{ error }}</div>
                    <div class="relative">
                      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                        Email
                      </label> 
                      <input v-model="email" autocomplete="off" id="email" name="email" type="text" class="font-semibold text-sm peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />                     
                    </div>
                    <div class="relative">
                      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                      </label>
                      <input v-model="password" autocomplete="off" id="password" name="password" type="password" class="font-semibold text-sm peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />                      
                    </div>
                    <div class="relative">
                      <button class="bg-indigo-500 text-white text-sm rounded-md px-2 py-2">Submit</button>
                    </div>                   
                  </div>
                  <span class="text-gray-500 font-semibold hover:text-indigo-500"><router-link to="/register">Click here to create account</router-link></span>
                </div>
              </div>
            </div>
          </div>   
      </form>
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { setToken } from '../utils/auth';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: null,
      };
    },

    setup() {
      const router = useRouter();
      return { router };
    },

    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: this.email,
            password: this.password,
          });
          
          setToken(response.data.token);
          this.$toast.success('Login successful.', {
		            timeout: 5000, 
		      });
          this.router.push('/dashboard');

        } catch (error) {
          console.error('Error logging in:', error);
          this.error = 'Invalid email or password';
        }
      },
    },
  };
  </script>
  