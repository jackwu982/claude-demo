import { reactive, watch } from 'vue'

const STORAGE_KEY = 'pm-system-data'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { departments: [], employees: [], tasks: [], timeEntries: [] }
}

const state = reactive(load())

watch(
  () => [state.departments, state.employees, state.tasks, state.timeEntries],
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        departments: state.departments,
        employees: state.employees,
        tasks: state.tasks,
        timeEntries: state.timeEntries,
      })
    )
  },
  { deep: true }
)

let nextId = 1
function id() {
  return String(nextId++)
}

// --- Departments ---

export function getDepartments() {
  return state.departments
}

export function addDepartment(name) {
  state.departments.push({ id: id(), name, createdAt: new Date().toISOString() })
}

export function updateDepartment(id, name) {
  const d = state.departments.find((d) => d.id === id)
  if (d) d.name = name
}

export function deleteDepartment(id) {
  state.departments = state.departments.filter((d) => d.id !== id)
  state.employees = state.employees.filter((e) => e.departmentId !== id)
}

// --- Employees ---

export function getEmployees() {
  return state.employees
}

export function addEmployee(name, departmentId) {
  state.employees.push({ id: id(), name, departmentId, createdAt: new Date().toISOString() })
}

export function updateEmployee(id, name, departmentId) {
  const e = state.employees.find((e) => e.id === id)
  if (e) {
    e.name = name
    e.departmentId = departmentId
  }
}

export function deleteEmployee(id) {
  state.employees = state.employees.filter((e) => e.id !== id)
}

// --- Tasks ---

export function getTasks() {
  return state.tasks
}

export function addTask(name, processes) {
  state.tasks.push({
    id: id(),
    name,
    processes: processes.map((p) => ({ id: id(), ...p })),
    createdAt: new Date().toISOString(),
  })
}

export function updateTask(id, name, processes) {
  const t = state.tasks.find((t) => t.id === id)
  if (!t) return
  t.name = name
  const existingIds = new Set(processes.filter((p) => p.id).map((p) => p.id))
  t.processes = t.processes.filter((p) => existingIds.has(p.id))
  for (const p of processes) {
    if (p.id) {
      const existing = t.processes.find((ep) => ep.id === p.id)
      if (existing) {
        existing.name = p.name
        existing.difficulty = p.difficulty
        existing.notes = p.notes
        existing.totalHours = p.totalHours
      }
    } else {
      t.processes.push({ id: id(), name: p.name, difficulty: p.difficulty, notes: p.notes, totalHours: p.totalHours })
    }
  }
}

export function deleteTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id)
  state.timeEntries = state.timeEntries.filter((e) => e.taskId !== id)
}

// --- Time Entries ---

export function getTimeEntries() {
  return state.timeEntries
}

export function addTimeEntry(taskId, processId, employeeId, hours, notes, date) {
  state.timeEntries.push({
    id: id(),
    taskId,
    processId,
    employeeId,
    hours,
    notes: notes || '',
    date: date || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  })
}

export function deleteTimeEntry(id) {
  state.timeEntries = state.timeEntries.filter((e) => e.id !== id)
}
