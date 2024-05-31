<template>
    <div>
      <Navbar />
      <div class="container mx-auto mt-10">
        <h1 class="text-2xl mb-4">Car List</h1>
         
        <router-link to="/dashboard/cars/add" class="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded mb-4 inline-block">Add Car</router-link>
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Name</th>        
              <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Model</th>
              <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">License Plate</th>
              <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in cars" :key="car._id">
              <td class="px-6 py-4 font-semibold text-gray-600 whitespace-no-wrap border-b border-gray-200">{{ car.name }}</td>
              <td class="px-6 py-4 font-semibold text-gray-600 whitespace-no-wrap border-b border-gray-200">{{ car.model }}</td>
              <td class="px-6 py-4 font-semibold text-gray-600 whitespace-no-wrap border-b border-gray-200">{{ car.licensePlate }}</td>
              <td class="px-6 py-4 font-semibold  text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                <router-link :to="'/dashboard/cars/edit/' + car._id" class="hover:text-indigo-700 text-indigo-500 font-semibold py-1 px-2 rounded">Update Car</router-link>
                <router-link :to="'/dashboard/cars/location/' + car._id" class="hover:text-indigo-700 text-indigo-500 font-semibold py-1 px-2 rounded">Location History</router-link>
                <button @click="deleteCar(car._id)" class="bg-red-500 hover:bg-red-700 ml-2 text-white font-semibold py-1 px-2 rounded">Delete</button>                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Navbar from '../components/NavBar.vue';
  
  export default {
    components: { Navbar },
    data() {
      return {
        cars: [],
      };
    },
    async created() {
        this.fetchcars();
    },
    methods: {
        async fetchcars() {
            try {
                const response = await axios.get('http://localhost:5000/api/cars', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                this.cars = response.data;
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        },
      async deleteCar(id) {
        try {
          await axios.delete(`http://localhost:5000/api/cars/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          this.cars = this.cars.filter(car => car._id !== id);
        } catch (error) {
          console.error('Error deleting car:', error);
        }
      },
    },
  };
  </script>
  