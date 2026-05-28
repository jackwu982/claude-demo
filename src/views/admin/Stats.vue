<template>
  <div class="w-full max-w-5xl mx-auto">
    <h1 class="font-display text-3xl font-bold text-white mb-6">工时统计</h1>

    <!-- Date filter -->
    <div class="glass-card rounded-2xl p-5 mb-6">
      <div class="flex flex-wrap items-end gap-4">
        <div>
          <label class="block text-gray-400 text-xs mb-1.5">开始日期</label>
          <input
            v-model="dateFrom"
            type="date"
            class="bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors"
          />
        </div>
        <div>
          <label class="block text-gray-400 text-xs mb-1.5">结束日期</label>
          <input
            v-model="dateTo"
            type="date"
            class="bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors"
          />
        </div>
        <button
          @click="clearFilter"
          class="text-gray-400 text-sm px-4 py-2.5 hover:text-white transition-colors"
        >
          清除筛选
        </button>
      </div>
    </div>

    <div v-if="filteredEntries.length === 0" class="glass-card rounded-2xl p-12 text-center text-gray-500">
      该时间范围内暂无工时上报记录
    </div>

    <template v-else>
      <!-- Summary cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="glass-card rounded-2xl p-5">
          <div class="text-gray-500 text-xs mb-1">总工时</div>
          <div class="text-neon-cyan text-2xl font-bold">{{ totalHours }}h</div>
        </div>
        <div class="glass-card rounded-2xl p-5">
          <div class="text-gray-500 text-xs mb-1">参与人数</div>
          <div class="text-white text-2xl font-bold">{{ uniqueEmployees.length }}</div>
        </div>
        <div class="glass-card rounded-2xl p-5">
          <div class="text-gray-500 text-xs mb-1">涉及任务</div>
          <div class="text-white text-2xl font-bold">{{ uniqueTasks.length }}</div>
        </div>
      </div>

      <!-- Cross table: user x task -->
      <div class="glass-card rounded-2xl overflow-hidden mb-6">
        <h2 class="text-white font-semibold px-6 py-4 border-b border-white/5">用户 × 任务 交叉统计</h2>
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">员工</th>
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">任务</th>
              <th class="text-right text-xs text-gray-500 font-medium px-6 py-3">工时</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="emp in uniqueEmployees" :key="emp.id">
              <tr
                v-for="(row, ri) in crossRows[emp.id]"
                :key="row.taskId"
                class="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td class="px-6 py-3 text-white text-sm" :class="{ 'pt-4': ri === 0 }">{{ ri === 0 ? emp.name : '' }}</td>
                <td class="px-6 py-3 text-gray-400 text-sm">{{ row.taskName }}</td>
                <td class="px-6 py-3 text-neon-cyan text-sm font-semibold text-right">{{ row.hours }}h</td>
              </tr>
              <tr v-if="crossRows[emp.id] && crossRows[emp.id].length > 0" class="border-b border-white/10 bg-white/[0.02]">
                <td class="px-6 py-3 text-gray-500 text-xs" colspan="2">小计</td>
                <td class="px-6 py-3 text-neon-cyan text-sm font-bold text-right">{{ empTotals[emp.id] }}h</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- By user -->
      <div class="glass-card rounded-2xl overflow-hidden mb-6">
        <h2 class="text-white font-semibold px-6 py-4 border-b border-white/5">按员工统计</h2>
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">员工</th>
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">部门</th>
              <th class="text-right text-xs text-gray-500 font-medium px-6 py-3">总工时</th>
              <th class="text-right text-xs text-gray-500 font-medium px-6 py-3">占比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in employeeStats" :key="emp.id" class="border-b border-white/5 last:border-0">
              <td class="px-6 py-3 text-white text-sm">{{ emp.name }}</td>
              <td class="px-6 py-3 text-gray-400 text-sm">{{ emp.deptName }}</td>
              <td class="px-6 py-3 text-neon-cyan text-sm font-semibold text-right">{{ emp.hours }}h</td>
              <td class="px-6 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-neon-cyan rounded-full" :style="{ width: emp.percent + '%' }"></div>
                  </div>
                  <span class="text-gray-500 text-xs w-10 text-right">{{ emp.percent }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- By task -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <h2 class="text-white font-semibold px-6 py-4 border-b border-white/5">按任务统计</h2>
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">任务</th>
              <th class="text-right text-xs text-gray-500 font-medium px-6 py-3">总工时</th>
              <th class="text-right text-xs text-gray-500 font-medium px-6 py-3">占比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in taskStats" :key="t.id" class="border-b border-white/5 last:border-0">
              <td class="px-6 py-3 text-white text-sm">{{ t.name }}</td>
              <td class="px-6 py-3 text-neon-cyan text-sm font-semibold text-right">{{ t.hours }}h</td>
              <td class="px-6 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-neon-cyan rounded-full" :style="{ width: t.percent + '%' }"></div>
                  </div>
                  <span class="text-gray-500 text-xs w-10 text-right">{{ t.percent }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getEmployees, getDepartments, getTasks, getTimeEntries } from '../../store/index.js'

const dateFrom = ref('')
const dateTo = ref('')
const refreshKey = ref(0)

function clearFilter() {
  dateFrom.value = ''
  dateTo.value = ''
}

function applyFilter() {
  refreshKey.value++
}

// Manually trigger filter on date change
watch([dateFrom, dateTo], () => {
  refreshKey.value++
})

const allEntries = computed(() => {
  refreshKey.value // track refreshKey
  return getTimeEntries()
})

const filteredEntries = computed(() => {
  let entries = allEntries.value
  if (dateFrom.value) {
    entries = entries.filter((e) => (e.date || e.createdAt.slice(0, 10)) >= dateFrom.value)
  }
  if (dateTo.value) {
    entries = entries.filter((e) => (e.date || e.createdAt.slice(0, 10)) <= dateTo.value)
  }
  return entries
})

const totalHours = computed(() => {
  return filteredEntries.value.reduce((sum, e) => sum + e.hours, 0)
})

const uniqueEmployees = computed(() => {
  const ids = [...new Set(filteredEntries.value.map((e) => e.employeeId))]
  return ids.map((id) => getEmployees().find((e) => e.id === id)).filter(Boolean)
})

const uniqueTasks = computed(() => {
  const ids = [...new Set(filteredEntries.value.map((e) => e.taskId))]
  return ids.map((id) => getTasks().find((t) => t.id === id)).filter(Boolean)
})

// Cross rows: { [empId]: [{ taskId, taskName, hours }] }
const crossRows = computed(() => {
  const map = {}
  const tasks = getTasks()
  for (const e of filteredEntries.value) {
    if (!map[e.employeeId]) map[e.employeeId] = {}
    if (!map[e.employeeId][e.taskId]) map[e.employeeId][e.taskId] = 0
    map[e.employeeId][e.taskId] += e.hours
  }
  const result = {}
  for (const empId of Object.keys(map)) {
    result[empId] = Object.entries(map[empId])
      .map(([taskId, hours]) => ({
        taskId,
        taskName: tasks.find((t) => t.id === taskId)?.name || '未知',
        hours,
      }))
      .sort((a, b) => b.hours - a.hours)
  }
  return result
})

const empTotals = computed(() => {
  const totals = {}
  for (const e of filteredEntries.value) {
    if (!totals[e.employeeId]) totals[e.employeeId] = 0
    totals[e.employeeId] += e.hours
  }
  return totals
})

const employeeStats = computed(() => {
  const depts = getDepartments()
  return uniqueEmployees.value.map((emp) => {
    const hours = empTotals.value[emp.id] || 0
    const dept = depts.find((d) => d.id === emp.departmentId)
    return {
      id: emp.id,
      name: emp.name,
      deptName: dept ? dept.name : '-',
      hours,
      percent: totalHours.value > 0 ? Math.round((hours / totalHours.value) * 100) : 0,
    }
  }).sort((a, b) => b.hours - a.hours)
})

const taskTotals = computed(() => {
  const totals = {}
  for (const e of filteredEntries.value) {
    if (!totals[e.taskId]) totals[e.taskId] = 0
    totals[e.taskId] += e.hours
  }
  return totals
})

const taskStats = computed(() => {
  return uniqueTasks.value.map((t) => {
    const hours = taskTotals.value[t.id] || 0
    return {
      id: t.id,
      name: t.name,
      hours,
      percent: totalHours.value > 0 ? Math.round((hours / totalHours.value) * 100) : 0,
    }
  }).sort((a, b) => b.hours - a.hours)
})
</script>
