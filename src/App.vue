<template>
  <div class="relative min-h-screen overflow-hidden">

    <!-- Animated gradient background -->
    <div class="fixed inset-0 -z-10 bg-noir-base">
      <div
        class="absolute inset-0 animate-gradient-drift"
        style="
          background:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0, 244, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(217, 70, 239, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0, 244, 255, 0.03) 0%, transparent 50%);
          background-size: 200% 200%;
        "
      />
      <!-- Subtle grid overlay -->
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;"
      />
    </div>

    <!-- Frosted nav -->
    <nav class="frosted-nav sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
      <router-link
        to="/"
        class="font-display text-xl font-bold tracking-tight text-white hover:text-neon-cyan transition-colors duration-300"
      >
        <span class="text-neon-cyan">任务</span>追踪系统
      </router-link>

      <div class="flex gap-1">
        <router-link
          v-for="item in adminItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
        >{{ item.label }}</router-link>
        <span class="nav-sep"></span>
        <router-link
          v-for="item in userItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
        >{{ item.label }}</router-link>
      </div>
    </nav>

    <!-- Page content -->
    <main class="relative z-10 flex flex-col items-center px-5 py-16 sm:py-24 min-h-[calc(100vh-73px)]">
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 text-center py-8 text-sm text-gray-600">
      &copy; 2026 Demo. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
  { path: '/panorama', label: 'Panorama' },
]
const adminItems = [
  { path: '/admin', label: '后台' },
  { path: '/admin/departments', label: '部门' },
  { path: '/admin/employees', label: '员工' },
  { path: '/admin/tasks', label: '任务' },
  { path: '/admin/stats', label: '统计' },
]
const userItems = [
  { path: '/report', label: '工时上报' },
  { path: '/reports', label: '上报记录' },
]
</script>

<style scoped>
.nav-link {
  padding: 0.5rem 1.2rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #7a7a94;
  text-decoration: none;
  border-radius: 9999px;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
}
.nav-link:hover {
  color: #e8e8f0;
  background: rgba(255, 255, 255, 0.04);
}
.nav-link.router-link-exact-active {
  color: #00f4ff;
  background: rgba(0, 244, 255, 0.08);
}

.nav-sep {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.08);
  align-self: center;
  margin: 0 0.25rem;
}

.v-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.v-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.v-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.v-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
