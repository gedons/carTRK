<template>
    <div>
      <Navbar />
      <div class="container mx-auto mt-10">
        <h1 class="text-2xl mb-4">Edit Car</h1>
        <form @submit.prevent="updateLocationHistory">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="latitude">Latitude</label>
              <input v-model="latitude" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="latitude" type="text" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="longitude">Longitude</label>
              <input v-model="longitude" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="longitude" type="text" required>
            </div>
            <div class="mb-4">
                <div id="map" class="w-full h-64"></div>
            </div>
            <div class="flex items-center justify-between">
              <button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Update Location History</button>
            </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRouter, useRoute } from 'vue-router';
  import Navbar from '../components/NavBar.vue';
  
  export default {
    components: { Navbar },
    data() {
      return {
        latitude: '',
        longitude: '',
        error: null,
        map: null,
      };
    },
    async created() {
      const id = this.route.params.id;
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const car = response.data;       
        this.latitude = car.location.coordinates[1];
        this.longitude = car.location.coordinates[0];
        this.initializeMap();
      } catch (error) {
        console.error('Error fetching car:', error);
        this.error = 'Failed to load car details';
      }
    },
    setup() {
      const router = useRouter();
      const route = useRoute();
      return { router, route };
    },
    methods: {
      async updateLocationHistory() {
        const id = this.route.params.id;
        try {
          await axios.put(
            `http://localhost:5000/api/cars/${id}/location`,
            {              
                latitude: this.latitude,
                longitude: this.longitude,
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
          this.router.push('/dashboard/cars');
        } catch (error) {
          console.error('Error updating location:', error);
          this.error = 'Failed to update location';
        }
      },
      initializeMap() {
        const map = new Microsoft.Maps.Map('#map', {
          center: new Microsoft.Maps.Location(this.latitude, this.longitude),
          zoom: 10,
        });
  
        Microsoft.Maps.Events.addHandler(map, 'click', (e) => {
          if (e.targetType === 'map') {
            const point = new Microsoft.Maps.Point(e.getX(), e.getY());
            const loc = e.target.tryPixelToLocation(point);
            this.latitude = loc.latitude;
            this.longitude = loc.longitude;
          }
        });
  
        this.map = map;
      },
    },
  };
  </script>
  
  <style scoped>
  #map {
    width: 50%;
    height: 400px;
  }
  </style>
  