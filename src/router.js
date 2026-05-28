import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Contact from './views/Contact.vue'
import Panorama from './views/Panorama.vue'
import AdminDashboard from './views/admin/AdminDashboard.vue'
import Departments from './views/admin/Departments.vue'
import Employees from './views/admin/Employees.vue'
import Tasks from './views/admin/Tasks.vue'
import Stats from './views/admin/Stats.vue'
import ReportHours from './views/user/ReportHours.vue'
import MyReports from './views/user/MyReports.vue'

const routes = [
  { path: '/', redirect: '/admin' },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/panorama', name: 'Panorama', component: Panorama },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/admin/departments', name: 'Departments', component: Departments },
  { path: '/admin/employees', name: 'Employees', component: Employees },
  { path: '/admin/tasks', name: 'Tasks', component: Tasks },
  { path: '/admin/stats', name: 'Stats', component: Stats },
  { path: '/report', name: 'ReportHours', component: ReportHours },
  { path: '/reports', name: 'MyReports', component: MyReports },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
