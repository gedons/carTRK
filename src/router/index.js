import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import CarList from '../views/CarList.vue';
import AddCar from '../views/AddCar.vue';
import SimulateCar from '../views/SimulateCar.vue';
import EditCar from '../views/EditCar.vue';
import CarTracking from '../views/CarTracking.vue';
import UpdateLocation from '../views/UpdateLocation.vue';
import { isLoggedIn } from '../utils/auth';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/cars',
    component: CarList,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/cars/add',
    component: AddCar,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/cars/simulate',
    component: SimulateCar,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/cars/edit/:id',
    component: EditCar,
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/cars/location/:id',
    component: UpdateLocation,
    name: UpdateLocation,
    meta: { requiresAuth: true },
  },
  { path: '/track', name: 'CarTracking', component: CarTracking},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn()) {
      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
