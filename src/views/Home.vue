<template>
  <div class="flex flex-col items-center text-center max-w-3xl w-full">
    <p class="font-body text-xs tracking-[0.25em] uppercase text-neon-cyan/60 mb-6 animate-fade-up">
      — Welcome to —
    </p>

    <h1 class="font-display text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-fade-up stagger-1">
      <span class="text-white">Step into the</span><br />
      <span class="text-glow-cyan text-neon-cyan">Night</span>
    </h1>

    <p class="font-body text-base sm:text-lg leading-relaxed text-gray-400 max-w-xl mb-12 animate-fade-up stagger-2">
      A minimalist demo built with Vue 3 & Tailwind CSS. Dark, sleek, and illuminated by neon.
    </p>

    <div class="flex flex-wrap gap-4 justify-center animate-fade-up stagger-3">
      <router-link
        to="/about"
        class="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-sm text-noir-base bg-neon-cyan transition-all duration-300 glow-cyan hover:-translate-y-0.5"
      >
        Explore
        <span class="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </router-link>

      <router-link
        to="/contact"
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-sm text-gray-300 border border-white/10 bg-white/5 transition-all duration-300 hover:border-neon-fuchsia/30 hover:bg-white/10 hover:-translate-y-0.5"
      >
        Get in touch
      </router-link>
    </div>

    <!-- Decorative bottom glow line -->
    <div class="mt-24 w-32 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
  </div>
</template>
