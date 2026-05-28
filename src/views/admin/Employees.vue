<template>
  <div class="w-full max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-3xl font-bold text-white mb-1">员工管理</h1>
        <p class="text-gray-500 text-sm">管理员工信息</p>
      </div>
      <button @click="openAdd" class="bg-neon-cyan text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-80 transition-opacity">
        + 新增员工
      </button>
    </div>

    <div v-if="employees.length === 0" class="glass-card rounded-2xl p-12 text-center text-gray-500">
      暂无员工，请先创建部门后再新增员工
    </div>

    <div v-else class="glass-card rounded-2xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">姓名</th>
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">所属部门</th>
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">创建时间</th>
            <th class="text-right text-xs text-gray-500 font-medium px-6 py-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in employees" :key="e.id" class="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
            <td class="px-6 py-4 text-white text-sm">{{ e.name }}</td>
            <td class="px-6 py-4 text-gray-400 text-sm">{{ getDeptName(e.departmentId) }}</td>
            <td class="px-6 py-4 text-gray-500 text-sm">{{ formatDate(e.createdAt) }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openEdit(e)" class="text-neon-cyan text-sm hover:underline mr-4">编辑</button>
              <button @click="handleDelete(e.id)" class="text-red-400 text-sm hover:underline">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showModal = false">
      <div class="glass-card rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 class="text-white font-semibold text-lg mb-5">{{ editingId ? '编辑员工' : '新增员工' }}</h2>

        <label class="block text-gray-400 text-sm mb-2">姓名</label>
        <input
          v-model="formName"
          class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors mb-4"
          placeholder="请输入员工姓名"
        />

        <label class="block text-gray-400 text-sm mb-2">所属部门</label>
        <select
          v-model="formDeptId"
          class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors"
        >
          <option value="" disabled>请选择部门</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
        <div v-if="departments.length === 0" class="text-gray-500 text-xs mt-2">暂无部门，请先创建部门</div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="showModal = false" class="text-gray-400 text-sm px-4 py-2 hover:text-white transition-colors">取消</button>
          <button @click="save" :disabled="departments.length === 0" class="bg-neon-cyan text-black font-semibold px-5 py-2 rounded-xl text-sm hover:opacity-80 transition-opacity disabled:opacity-30">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getEmployees, getDepartments, addEmployee, updateEmployee, deleteEmployee } from '../../store/index.js'

const employees = getEmployees()
const departments = getDepartments()

const showModal = ref(false)
const editingId = ref(null)
const formName = ref('')
const formDeptId = ref('')

function getDeptName(id) {
  const d = departments.find((d) => d.id === id)
  return d ? d.name : '未知'
}

function openAdd() {
  editingId.value = null
  formName.value = ''
  formDeptId.value = departments.length > 0 ? departments[0].id : ''
  showModal.value = true
}

function openEdit(e) {
  editingId.value = e.id
  formName.value = e.name
  formDeptId.value = e.departmentId
  showModal.value = true
}

function save() {
  const name = formName.value.trim()
  if (!name || !formDeptId.value) return
  if (editingId.value) {
    updateEmployee(editingId.value, name, formDeptId.value)
  } else {
    addEmployee(name, formDeptId.value)
  }
  showModal.value = false
}

function handleDelete(id) {
  if (confirm('确定删除该员工？')) {
    deleteEmployee(id)
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('zh-CN')
}
</script>
