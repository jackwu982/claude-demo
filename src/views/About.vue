<template>
  <div class="flex flex-col items-center text-center max-w-5xl w-full">
    <p class="font-body text-xs tracking-[0.25em] uppercase text-neon-fuchsia/60 mb-6 animate-fade-up">
      — About —
    </p>

    <h1 class="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-fade-up stagger-1">
      <span class="text-white">About</span>
      <span class="text-glow-fuchsia text-neon-fuchsia"> Us</span>
    </h1>

    <p class="font-body text-base sm:text-lg leading-relaxed text-gray-400 max-w-xl mb-16 animate-fade-up stagger-2">
      Dedicated to crafting clean, efficient product experiences.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl animate-fade-up stagger-3">
      <div
        v-for="(card, i) in cards"
        :key="card.title"
        class="glass-card group rounded-2xl p-8 text-center transition-all duration-500"
        :class="[i === 1 ? 'sm:-translate-y-4' : '', 'hover:-translate-y-2']"
        style="border-color: rgba(255,255,255,0.06);"
      >
        <div class="relative w-14 h-14 mx-auto mb-5 rounded-xl flex items-center justify-center"
             :class="i === 0 ? 'bg-cyan-500/10 text-neon-cyan' : i === 1 ? 'bg-fuchsia-500/10 text-neon-fuchsia' : 'bg-cyan-500/10 text-neon-cyan'">
          <span class="text-2xl font-display font-bold">{{ card.icon }}</span>
          <div v-if="i === 0" class="absolute inset-0 rounded-xl glow-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div v-else-if="i === 1" class="absolute inset-0 rounded-xl glow-fuchsia opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div v-else class="absolute inset-0 rounded-xl glow-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        </div>
        <h3 class="font-display text-lg font-semibold mb-3 text-white">{{ card.title }}</h3>
        <p class="font-body text-sm leading-relaxed text-gray-500">{{ card.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const cards = [
  { icon: 'M', title: 'Mission', desc: 'Create real value with clean design and reliable technology.' },
  { icon: 'V', title: 'Vision', desc: 'Become a trusted product where every interaction feels natural.' },
  { icon: 'V2', title: 'Values', desc: 'User first, simplicity, continuous innovation, open collaboration.' },
]
</script>
