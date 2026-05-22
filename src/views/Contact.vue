<template>
  <div class="flex flex-col items-center text-center max-w-4xl w-full">
    <p class="font-body text-xs tracking-[0.25em] uppercase text-neon-cyan/60 mb-6 animate-fade-up">
      — Contact —
    </p>

    <h1 class="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-fade-up stagger-1">
      <span class="text-white">Get in</span>
      <span class="text-glow-cyan text-neon-cyan"> Touch</span>
    </h1>

    <p class="font-body text-base sm:text-lg leading-relaxed text-gray-400 max-w-xl mb-16 animate-fade-up stagger-2">
      Questions or ideas? We'd love to hear from you.
    </p>

    <div class="flex flex-col lg:flex-row gap-8 w-full max-w-3xl text-left animate-fade-up stagger-3">

      <!-- Info column -->
      <div class="flex-1 flex flex-col gap-2 pt-1">
        <div
          v-for="(item, i) in info"
          :key="item.label"
          class="glass-card rounded-xl px-5 py-4 transition-all duration-300 hover:border-neon-cyan/20 cursor-default"
          :style="{ 'animation-delay': `${0.4 + i * 0.1}s`, borderColor: 'rgba(255,255,255,0.06)' }"
        >
          <span class="font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-neon-cyan/50">{{ item.label }}</span>
          <p class="font-body text-sm text-gray-300 mt-1">{{ item.value }}</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex-[2] glass-card rounded-2xl px-6 py-8 flex flex-col gap-4"
            style="border-color: rgba(255,255,255,0.06);">
        <input
          v-model="form.name"
          type="text"
          placeholder="Your name"
          required
          class="w-full px-4 py-3 rounded-xl text-sm font-body bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 outline-none transition-all duration-300 focus:border-neon-cyan/40 focus:bg-white/[0.07]"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Your email"
          required
          class="w-full px-4 py-3 rounded-xl text-sm font-body bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 outline-none transition-all duration-300 focus:border-neon-cyan/40 focus:bg-white/[0.07]"
        />
        <textarea
          v-model="form.message"
          rows="5"
          placeholder="Your message"
          required
          class="w-full px-4 py-3 rounded-xl text-sm font-body bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 outline-none transition-all duration-300 focus:border-neon-cyan/40 focus:bg-white/[0.07] resize-none"
        ></textarea>
        <button
          type="submit"
          class="w-full py-3.5 rounded-xl font-body font-semibold text-sm text-noir-base bg-neon-cyan transition-all duration-300 glow-cyan hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          Send message
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const info = [
  { label: 'Email', value: 'hello@demo.com' },
  { label: 'Phone', value: '+86 400-888-8888' },
  { label: 'Address', value: '88 Science Park, Chaoyang, Beijing' },
]

function handleSubmit() {
  alert('Message sent! (Demo)')
}
</script>
