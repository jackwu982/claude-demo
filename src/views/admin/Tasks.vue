<template>
  <div class="w-full max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-3xl font-bold text-white mb-1">任务管理</h1>
        <p class="text-gray-500 text-sm">管理项目任务与工序</p>
      </div>
      <button @click="openAdd" class="bg-neon-cyan text-black font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-80 transition-opacity">
        + 新增任务
      </button>
    </div>

    <div v-if="tasks.length === 0" class="glass-card rounded-2xl p-12 text-center text-gray-500">
      暂无任务，点击右上角新增
    </div>

    <div v-else class="space-y-4">
      <div v-for="t in tasks" :key="t.id" class="glass-card rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <span class="text-white font-semibold">{{ t.name }}</span>
            <span class="text-gray-500 text-xs ml-3">{{ t.processes.length }} 道工序</span>
          </div>
          <div class="flex gap-2">
            <button @click="openEdit(t)" class="text-neon-cyan text-sm hover:underline">编辑</button>
            <button @click="handleDelete(t.id)" class="text-red-400 text-sm hover:underline">删除</button>
          </div>
        </div>
        <table v-if="t.processes.length > 0" class="w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">工序名称</th>
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">难度系数</th>
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">总工时(h)</th>
              <th class="text-left text-xs text-gray-500 font-medium px-6 py-3">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in t.processes" :key="p.id" class="border-b border-white/5 last:border-0">
              <td class="px-6 py-3 text-white text-sm">{{ p.name }}</td>
              <td class="px-6 py-3 text-gray-400 text-sm">{{ p.difficulty }}</td>
              <td class="px-6 py-3 text-gray-400 text-sm">{{ p.totalHours }}h</td>
              <td class="px-6 py-3 text-gray-500 text-sm max-w-[200px] truncate">{{ p.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="px-6 py-4 text-gray-500 text-sm">暂无工序</div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showModal = false">
        <div class="glass-card rounded-2xl p-6 w-full max-w-xl mx-4 max-h-[90vh] flex flex-col">
          <h2 class="text-white font-semibold text-lg mb-5 shrink-0">{{ editingId ? '编辑任务' : '新增任务' }}</h2>

          <label class="block text-gray-400 text-sm mb-2 shrink-0">任务名称</label>
          <input
            v-model="formName"
            class="w-full bg-noir-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-neon-cyan transition-colors mb-5 shrink-0"
            placeholder="请输入任务名称"
          />

          <div class="flex items-center justify-between mb-3 shrink-0">
            <span class="text-gray-400 text-sm">工序列表</span>
            <button @click="addProcess" class="text-neon-cyan text-sm hover:underline">+ 添加工序</button>
          </div>

          <div class="space-y-3 overflow-y-auto flex-1 min-h-0">
            <div v-for="(p, i) in formProcesses" :key="i" class="bg-noir-surface rounded-xl p-4 border border-white/5">
              <div class="flex justify-between items-start mb-3">
                <span class="text-gray-500 text-xs">工序 {{ i + 1 }}</span>
                <button @click="removeProcess(i)" class="text-red-400 text-xs hover:underline">删除</button>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-gray-500 text-xs mb-1">工序名称</label>
                  <input v-model="p.name" class="w-full bg-noir-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-neon-cyan transition-colors" placeholder="名称" />
                </div>
                <div>
                  <label class="block text-gray-500 text-xs mb-1">难度系数</label>
                  <input v-model.number="p.difficulty" type="number" step="0.1" class="w-full bg-noir-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-neon-cyan transition-colors" placeholder="1.0" />
                </div>
                <div>
                  <label class="block text-gray-500 text-xs mb-1">总工时(h)</label>
                  <input v-model.number="p.totalHours" type="number" step="0.5" class="w-full bg-noir-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-neon-cyan transition-colors" placeholder="8" />
                </div>
                <div>
                  <label class="block text-gray-500 text-xs mb-1">备注</label>
                  <input v-model="p.notes" class="w-full bg-noir-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-neon-cyan transition-colors" placeholder="备注" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6 shrink-0">
            <button @click="closeModal" class="text-gray-400 text-sm px-4 py-2 hover:text-white transition-colors">取消</button>
            <button @click="save" class="bg-neon-cyan text-black font-semibold px-5 py-2 rounded-xl text-sm hover:opacity-80 transition-opacity">保存</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getTasks, addTask, updateTask, deleteTask } from '../../store/index.js'

const tasks = getTasks()

const showModal = ref(false)
const editingId = ref(null)
const formName = ref('')
const formProcesses = ref([])

watch(showModal, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

function openAdd() {
  editingId.value = null
  formName.value = ''
  formProcesses.value = []
  showModal.value = true
}

function openEdit(t) {
  editingId.value = t.id
  formName.value = t.name
  formProcesses.value = t.processes.map((p) => ({ ...p }))
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function addProcess() {
  formProcesses.value.push({ name: '', difficulty: 1, totalHours: 0, notes: '' })
}

function removeProcess(i) {
  formProcesses.value.splice(i, 1)
}

function save() {
  const name = formName.value.trim()
  if (!name) return
  if (editingId.value) {
    updateTask(editingId.value, name, formProcesses.value)
  } else {
    addTask(name, formProcesses.value)
  }
  showModal.value = false
}

function handleDelete(id) {
  if (confirm('确定删除该任务？关联的工时上报记录也会删除。')) {
    deleteTask(id)
  }
}
</script>
