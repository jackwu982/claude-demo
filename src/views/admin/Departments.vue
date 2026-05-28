<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-3xl font-bold text-white mb-1">部门管理</h1>
        <p class="text-gray-500 text-sm">管理部门组织架构</p>
      </div>
      <button @click="openAdd" class="bg-neon-cyan text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-80 transition-opacity">
        + 新增部门
      </button>
    </div>

    <div v-if="departments.length === 0" class="glass-card rounded-2xl p-12 text-center text-gray-500">
      暂无部门，点击右上角新增
    </div>

    <div v-else class="glass-card rounded-2xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-white/5">
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">部门名称</th>
            <th class="text-left text-xs text-gray-500 font-medium px-6 py-4">创建时间</th>
            <th class="text-right text-xs text-gray-500 font-medium px-6 py-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in departments" :key="d.id" class="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
            <td class="px-6 py-4 text-white text-sm">{{ d.name }}</td>
            <td class="px-6 py-4 text-gray-500 text-sm">{{ formatDate(d.createdAt) }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openEdit(d)" class="text-neon-cyan text-sm hover:underline mr-4">编辑</button>
              <button @click="handleDelete(d.id)" class="text-red-400 text-sm hover:underline">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showModal = false">
      <div class="glass-card rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 class="text-white font-semibold text-lg mb-5">{{ editingId ? '编辑部门' : '新增部门' }}</h2>
        <label class="block text-gray-400 text-sm mb-2">部门名称</label>
        <input
          v-model="formName"
          class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors"
          placeholder="请输入部门名称"
          @keyup.enter="save"
        />
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showModal = false" class="text-gray-400 text-sm px-4 py-2 hover:text-white transition-colors">取消</button>
          <button @click="save" class="bg-neon-cyan text-black font-semibold px-5 py-2 rounded-xl text-sm hover:opacity-80 transition-opacity">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getDepartments, addDepartment, updateDepartment, deleteDepartment } from '../../store/index.js'

const departments = getDepartments()

const showModal = ref(false)
const editingId = ref(null)
const formName = ref('')

function openAdd() {
  editingId.value = null
  formName.value = ''
  showModal.value = true
}

function openEdit(d) {
  editingId.value = d.id
  formName.value = d.name
  showModal.value = true
}

function save() {
  const name = formName.value.trim()
  if (!name) return
  if (editingId.value) {
    updateDepartment(editingId.value, name)
  } else {
    addDepartment(name)
  }
  showModal.value = false
}

function handleDelete(id) {
  if (confirm('确定删除该部门？关联的员工将一并移除。')) {
    deleteDepartment(id)
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('zh-CN')
}
</script>
