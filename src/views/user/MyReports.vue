<template>
  <div class="w-full max-w-4xl mx-auto">
    <h1 class="font-display text-3xl font-bold text-white mb-2">我的上报</h1>
    <p class="text-gray-500 text-sm mb-8">查看工时上报记录</p>

    <!-- Filter by employee -->
    <div class="glass-card rounded-2xl p-5 mb-6">
      <label class="block text-gray-400 text-sm mb-3">筛选员工</label>
      <select
        v-model="filterEmpId"
        class="w-full sm:w-64 bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors"
      >
        <option value="">全部员工</option>
        <option v-for="e in employees" :key="e.id" :value="e.id">{{ e.name }}</option>
      </select>
    </div>

    <div v-if="filteredEntries.length === 0" class="glass-card rounded-2xl p-12 text-center text-gray-500">
      暂无上报记录
    </div>

    <div v-else class="glass-card rounded-2xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">员工</th>
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">任务</th>
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">工序</th>
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">工时</th>
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">备注</th>
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">日期</th>
            <th class="text-right text-xs text-gray-500 font-medium px-6 py-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in filteredEntries" :key="e.id" class="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
            <td class="px-6 py-4 text-white text-sm">{{ getEmpName(e.employeeId) }}</td>
            <td class="px-6 py-4 text-gray-400 text-sm">{{ getTaskName(e.taskId) }}</td>
            <td class="px-6 py-4 text-gray-400 text-sm">{{ getProcessName(e.taskId, e.processId) }}</td>
            <td class="px-6 py-4 text-neon-cyan text-sm font-semibold">{{ e.hours }}h</td>
            <td class="px-6 py-4 text-gray-500 text-sm max-w-[150px] truncate">{{ e.notes || '-' }}</td>
            <td class="px-6 py-4 text-gray-500 text-sm">{{ e.date || formatDate(e.createdAt) }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="handleDelete(e.id)" class="text-red-400 text-xs hover:underline">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary -->
    <div v-if="filteredEntries.length > 0" class="glass-card rounded-2xl p-5 mt-6">
      <div class="flex items-center justify-between">
        <span class="text-gray-400 text-sm">合计工时</span>
        <span class="text-neon-cyan font-bold text-xl">{{ totalHours }}h</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getEmployees, getTasks, getTimeEntries, deleteTimeEntry } from '../../store/index.js'

const employees = getEmployees()
const tasks = getTasks()

const filterEmpId = ref('')

const filteredEntries = computed(() => {
  let entries = [...getTimeEntries()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (filterEmpId.value) {
    entries = entries.filter((e) => e.employeeId === filterEmpId.value)
  }
  return entries
})

const totalHours = computed(() => {
  return filteredEntries.value.reduce((sum, e) => sum + e.hours, 0)
})

function getEmpName(id) {
  const e = employees.find((e) => e.id === id)
  return e ? e.name : '未知'
}

function getTaskName(id) {
  const t = tasks.find((t) => t.id === id)
  return t ? t.name : '未知'
}

function getProcessName(taskId, processId) {
  const t = tasks.find((t) => t.id === taskId)
  if (!t) return '未知'
  const p = t.processes.find((p) => p.id === processId)
  return p ? p.name : '未知'
}

function handleDelete(id) {
  if (confirm('确定删除该条记录？')) {
    deleteTimeEntry(id)
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('zh-CN')
}
</script>
