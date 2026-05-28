<template>
  <div class="w-full max-w-5xl mx-auto">
    <h1 class="font-display text-3xl font-bold text-white mb-2">管理后台</h1>
    <p class="text-gray-500 mb-10">项目管理系统</p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
      <router-link to="/admin/departments" class="glass-card rounded-2xl p-6 hover:border-neon-cyan/30 transition-all duration-300 group cursor-pointer">
        <div class="text-3xl mb-3">🏢</div>
        <div class="text-white font-semibold text-lg mb-1 group-hover:text-neon-cyan transition-colors">部门管理</div>
        <div class="text-gray-500 text-sm">管理组织架构，{{ stats.deptCount }} 个部门</div>
      </router-link>

      <router-link to="/admin/employees" class="glass-card rounded-2xl p-6 hover:border-neon-cyan/30 transition-all duration-300 group cursor-pointer">
        <div class="text-3xl mb-3">👥</div>
        <div class="text-white font-semibold text-lg mb-1 group-hover:text-neon-cyan transition-colors">员工管理</div>
        <div class="text-gray-500 text-sm">管理员工信息，{{ stats.empCount }} 名员工</div>
      </router-link>

      <router-link to="/admin/tasks" class="glass-card rounded-2xl p-6 hover:border-neon-cyan/30 transition-all duration-300 group cursor-pointer">
        <div class="text-3xl mb-3">📋</div>
        <div class="text-white font-semibold text-lg mb-1 group-hover:text-neon-cyan transition-colors">任务管理</div>
        <div class="text-gray-500 text-sm">管理任务与工序，{{ stats.taskCount }} 个任务</div>
      </router-link>
    </div>

    <div class="glass-card rounded-2xl p-6">
      <h2 class="text-white font-semibold text-lg mb-4">最近工时上报</h2>
      <div v-if="recentEntries.length === 0" class="text-gray-500 text-sm py-6 text-center">暂无数据</div>
      <div v-else class="space-y-3">
        <div
          v-for="entry in recentEntries"
          :key="entry.id"
          class="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
        >
          <div>
            <div class="text-white text-sm">{{ getEmployeeName(entry.employeeId) }}</div>
            <div class="text-gray-500 text-xs">{{ getTaskName(entry.taskId) }} · {{ getProcessName(entry.taskId, entry.processId) }}</div>
          </div>
          <div class="text-right">
            <div class="text-neon-cyan text-sm font-semibold">{{ entry.hours }}h</div>
            <div class="text-gray-600 text-xs">{{ entry.date || formatDate(entry.createdAt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDepartments, getEmployees, getTasks, getTimeEntries } from '../../store/index.js'

const stats = computed(() => ({
  deptCount: getDepartments().length,
  empCount: getEmployees().length,
  taskCount: getTasks().length,
}))

const recentEntries = computed(() => {
  return [...getTimeEntries()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10)
})

function getEmployeeName(id) {
  const e = getEmployees().find((e) => e.id === id)
  return e ? e.name : '未知'
}

function getTaskName(id) {
  const t = getTasks().find((t) => t.id === id)
  return t ? t.name : '未知'
}

function getProcessName(taskId, processId) {
  const t = getTasks().find((t) => t.id === taskId)
  if (!t) return '未知'
  const p = t.processes.find((p) => p.id === processId)
  return p ? p.name : '未知'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('zh-CN')
}
</script>
