<template>
    <div>
      <Navbar />
      <div class="container mx-auto mt-10">
        <h1 class="text-2xl mb-4">Car Tracking</h1>
        <form @submit.prevent="trackCar">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="licensePlate">Enter License Plate</label>
            <input v-model="licensePlate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="licensePlate" type="text" required>
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Track Car</button>
          </div>
        </form>
  
        <div v-if="car">
            <h2 class="text-xl font-semibold mt-6">Car Details</h2>
            <table class="table-auto w-full mt-4">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Name</th>        
                  <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Model</th> 
                  <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">License Plate</th>            
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="px-6 py-4 font-semibold text-gray-600 whitespace-no-wrap border-b border-gray-200">{{ car.name }}</td>
                  <td class="px-6 py-4 font-semibold text-gray-600 whitespace-no-wrap border-b border-gray-200">{{ car.model }}</td>
                  <td class="px-6 py-4 font-semibold text-gray-600 whitespace-no-wrap border-b border-gray-200">{{ car.licensePlate }}</td>
                </tr>            
              </tbody>
            </table>

          <h2 class="text-xl font-semibold mt-8 mb-6">Simulate Route</h2>
          <form @submit.prevent="startSimulation">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="start">Start Point</label>
              <input v-model="start" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="start" type="text" placeholder="e.g., 37.7749,-122.4194" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="end">End Point</label>
              <input v-model="end" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="end" type="text" placeholder="e.g., 34.0522,-118.2437" required>
            </div>
            <div class="flex items-center justify-between">
              <button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Start Simulation</button>
            </div>
          </form>
          <div id="map" class="w-full h-64 mt-6"></div>
        </div>
      </div>
    </div>
  </template>


  <script>
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '../components/NavBar.vue';

export default {
  components: { Navbar },
  data() {
    return {
      licensePlate: '',
      car: null,
      start: '',
      end: '',
      latitude: null,
      longitude: null,
      map: null,
      tracking: false,
      socket: null,
    };
  },
  methods: {
    async trackCar() {
      try {
        const response = await axios.get(`https://cartrk-api.onrender.com/api/cars/track/${this.licensePlate}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        this.car = response.data;
        this.latitude = this.car.location.coordinates[1];
        this.longitude = this.car.location.coordinates[0];
        this.tracking = true;
        this.initializeMap();

        this.socket = io('https://cartrk-api.onrender.com'); // Ensure this matches your backend URL
        this.socket.on('locationUpdate', async (data) => {
          if (data.licensePlate === this.licensePlate) {
            this.latitude = data.latitude;
            this.longitude = data.longitude;
            this.updateMap();
          }
        });
      } catch (error) {
        console.error('Error tracking car:', error);
      }
    },
    async startSimulation() {
      const route = [
        this.start.split(',').map(Number),
        this.end.split(',').map(Number)
      ];

      try {
        const response = await axios.post(`https://cartrk-api.onrender.com/api/cars/${this.car._id}/simulate`, {
          route,
          interval: 1000 // Update interval in milliseconds
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        console.log(response.data); // Optionally handle the response
      } catch (error) {
        console.error('Error starting simulation:', error);
      }
    },
    initializeMap() {
      this.map = new Microsoft.Maps.Map('#map', {
        center: new Microsoft.Maps.Location(this.latitude, this.longitude),
        zoom: 10,
      });

      const location = new Microsoft.Maps.Location(this.latitude, this.longitude);
      const pin = new Microsoft.Maps.Pushpin(location, {
        icon: '<svg width="64px" height="64px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M766.976 508.736c80.576 0 152.448 32.128 199.232 82.176" fill="#AEBCC3"></path><path d="M64.704 684.992c10.816 19.2 32.064 32.192 56.576 32.192h784.64c35.84 0 64.832-27.648 64.832-61.76v-17.408h-36.608a15.744 15.744 0 0 1-16.064-15.296V550.912a277.568 277.568 0 0 0-150.144-44.16h1.6l-55.04-0.256c-53.632-115.2-157.504-210.752-294.208-210.752-136.512 0-251.008 89.728-282.176 210.688h-16.832c-35.456 0-56.128 27.392-56.128 61.184" fill="#E8447A"></path><path d="M64.704 654.464h13.76a39.168 39.168 0 0 0 40.064-38.272v-17.6c0-21.12-17.92-38.208-40.064-38.208h-13.376" fill="#F5BB1D"></path><path d="M160 684.992a101.632 96.832 0 1 0 203.264 0 101.632 96.832 0 1 0-203.264 0Z" fill="#455963"></path><path d="M218.88 684.992a42.752 40.768 0 1 0 85.504 0 42.752 40.768 0 1 0-85.504 0Z" fill="#AEBCC3"></path><path d="M652.032 684.992a101.568 96.832 0 1 0 203.136 0 101.568 96.832 0 1 0-203.136 0Z" fill="#455963"></path><path d="M710.912 684.992a42.752 40.768 0 1 0 85.504 0 42.752 40.768 0 1 0-85.504 0Z" fill="#AEBCC3"></path><path d="M966.272 591.104v-0.192a257.92 257.92 0 0 0-48.192-40V622.72c0 8.448 7.232 15.296 16.064 15.296h36.608v-42.304l-4.48-4.608z" fill="#F5BB1D"></path><path d="M405.568 335.616c-104.896 6.336-191.296 76.8-216.64 170.816h216.64V335.616zM445.696 506.432h216.64c-41.216-86.848-117.12-159.616-216.64-170.048v170.048z" fill="#631536"></path></g></svg>',
        anchor: new Microsoft.Maps.Point(12, 39) // Adjust this to center the icon
      });
      this.map.entities.push(pin);
    },
    updateMap() {
      this.map.setView({ center: new Microsoft.Maps.Location(this.latitude, this.longitude) });
      this.map.entities.clear();

      const location = new Microsoft.Maps.Location(this.latitude, this.longitude);
      const pin = new Microsoft.Maps.Pushpin(location, {
        icon: '<svg width="64px" height="64px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M766.976 508.736c80.576 0 152.448 32.128 199.232 82.176" fill="#AEBCC3"></path><path d="M64.704 684.992c10.816 19.2 32.064 32.192 56.576 32.192h784.64c35.84 0 64.832-27.648 64.832-61.76v-17.408h-36.608a15.744 15.744 0 0 1-16.064-15.296V550.912a277.568 277.568 0 0 0-150.144-44.16h1.6l-55.04-0.256c-53.632-115.2-157.504-210.752-294.208-210.752-136.512 0-251.008 89.728-282.176 210.688h-16.832c-35.456 0-56.128 27.392-56.128 61.184" fill="#E8447A"></path><path d="M64.704 654.464h13.76a39.168 39.168 0 0 0 40.064-38.272v-17.6c0-21.12-17.92-38.208-40.064-38.208h-13.376" fill="#F5BB1D"></path><path d="M160 684.992a101.632 96.832 0 1 0 203.264 0 101.632 96.832 0 1 0-203.264 0Z" fill="#455963"></path><path d="M218.88 684.992a42.752 40.768 0 1 0 85.504 0 42.752 40.768 0 1 0-85.504 0Z" fill="#AEBCC3"></path><path d="M652.032 684.992a101.568 96.832 0 1 0 203.136 0 101.568 96.832 0 1 0-203.136 0Z" fill="#455963"></path><path d="M710.912 684.992a42.752 40.768 0 1 0 85.504 0 42.752 40.768 0 1 0-85.504 0Z" fill="#AEBCC3"></path><path d="M966.272 591.104v-0.192a257.92 257.92 0 0 0-48.192-40V622.72c0 8.448 7.232 15.296 16.064 15.296h36.608v-42.304l-4.48-4.608z" fill="#F5BB1D"></path><path d="M405.568 335.616c-104.896 6.336-191.296 76.8-216.64 170.816h216.64V335.616zM445.696 506.432h216.64c-41.216-86.848-117.12-159.616-216.64-170.048v170.048z" fill="#631536"></path></g></svg>',
        anchor: new Microsoft.Maps.Point(12, 39) // Adjust this to center the icon
      });
      this.map.entities.push(pin);
    }
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 300px;
}
</style>
