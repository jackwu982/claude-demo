<template>
  <div class="w-full max-w-lg mx-auto">
    <h1 class="font-display text-3xl font-bold text-white mb-6 text-center">工时上报</h1>

    <!-- Step: Choose employee -->
    <div class="glass-card rounded-2xl p-5 mb-4">
      <label class="block text-gray-400 text-sm mb-3">选择员工</label>
      <select
        v-model="selectedEmpId"
        class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors"
      >
        <option value="" disabled>请选择员工</option>
        <option v-for="e in employees" :key="e.id" :value="e.id">{{ e.name }} ({{ getDeptName(e.departmentId) }})</option>
      </select>
      <div v-if="employees.length === 0" class="text-gray-500 text-xs mt-2">
        暂无员工数据，请联系管理员创建
      </div>
    </div>

    <!-- Step: Choose task -->
    <div class="glass-card rounded-2xl p-5 mb-4">
      <label class="block text-gray-400 text-sm mb-3">选择任务</label>
      <select
        v-model="selectedTaskId"
        class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors"
        @change="selectedProcessId = ''"
      >
        <option value="" disabled>请选择任务</option>
        <option v-for="t in tasks" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
    </div>

    <!-- Step: Choose process -->
    <div class="glass-card rounded-2xl p-5 mb-4" v-if="selectedTask">
      <label class="block text-gray-400 text-sm mb-3">选择工序</label>
      <div v-if="selectedTask.processes.length === 0" class="text-gray-500 text-sm">该任务暂无工序</div>
      <div v-else class="space-y-2">
        <button
          v-for="p in selectedTask.processes"
          :key="p.id"
          @click="selectedProcessId = p.id"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm',
            selectedProcessId === p.id
              ? 'border-neon-cyan bg-neon-cyan/10 text-white'
              : 'border-white/5 bg-noir-surface text-gray-400 hover:border-white/20'
          ]"
        >
          <div class="flex justify-between items-center">
            <span class="font-medium">{{ p.name }}</span>
            <span class="text-xs text-gray-500">难度 {{ p.difficulty }} · {{ p.totalHours }}h</span>
          </div>
          <div v-if="p.notes" class="text-gray-600 text-xs mt-1">{{ p.notes }}</div>
        </button>
      </div>
    </div>

    <!-- Step: Date picker -->
    <div class="glass-card rounded-2xl p-5 mb-4">
      <label class="block text-gray-400 text-sm mb-3">选择日期</label>
      <input
        v-model="formDate"
        type="date"
        class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors"
      />
    </div>

    <!-- Step: Hours input -->
    <div class="glass-card rounded-2xl p-5 mb-4">
      <label class="block text-gray-400 text-sm mb-3">填报工时 (小时)</label>
      <input
        v-model.number="formHours"
        type="number"
        step="0.5"
        min="0.5"
        class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-3 text-white text-lg outline-none focus:border-neon-cyan transition-colors"
        placeholder="0"
      />
    </div>

    <!-- Notes -->
    <div class="glass-card rounded-2xl p-5 mb-6">
      <label class="block text-gray-400 text-sm mb-3">备注（选填）</label>
      <textarea
        v-model="formNotes"
        rows="3"
        class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-neon-cyan transition-colors resize-none"
        placeholder="补充说明..."
      ></textarea>
    </div>

    <button
      @click="submit"
      :disabled="!canSubmit"
      class="w-full bg-neon-cyan text-black font-bold py-3.5 rounded-xl text-base hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
    >
      提交工时
    </button>

    <!-- Success toast -->
    <div v-if="showSuccess" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card rounded-2xl px-8 py-6 text-center z-50">
      <div class="text-4xl mb-3">✓</div>
      <div class="text-white font-semibold text-lg mb-1">上报成功</div>
      <div class="text-gray-500 text-sm">工时已记录</div>
      <button @click="reset" class="mt-4 text-neon-cyan text-sm hover:underline">继续上报</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getEmployees, getDepartments, getTasks, addTimeEntry } from '../../store/index.js'

const employees = getEmployees()
const tasks = getTasks()

const selectedEmpId = ref('')
const selectedTaskId = ref('')
const selectedProcessId = ref('')
const formDate = ref(new Date().toISOString().slice(0, 10))
const formHours = ref(null)
const formNotes = ref('')
const showSuccess = ref(false)

const selectedTask = computed(() => {
  return tasks.find((t) => t.id === selectedTaskId.value) || null
})

const canSubmit = computed(() => {
  return selectedEmpId.value && selectedTaskId.value && selectedProcessId.value && formHours.value > 0
})

function getDeptName(id) {
  const d = getDepartments().find((d) => d.id === id)
  return d ? d.name : '未知'
}

function submit() {
  if (!canSubmit.value) return
  addTimeEntry(selectedTaskId.value, selectedProcessId.value, selectedEmpId.value, formHours.value, formNotes.value, formDate.value)
  showSuccess.value = true
}

function reset() {
  showSuccess.value = false
  formDate.value = new Date().toISOString().slice(0, 10)
  formHours.value = null
  formNotes.value = ''
  selectedProcessId.value = ''
  selectedTaskId.value = ''
}
</script>
