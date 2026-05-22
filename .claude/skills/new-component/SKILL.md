---
name: new-component
description: Create a new Vue component following project patterns (script setup, Tailwind, route registration)
---

Create a new Vue view or component at the specified path. Follow these project conventions:

1. Use `<script setup>` with Composition API (no Options API)
2. Style with Tailwind utility classes
3. If adding a view/route, register it in `src/router.js`
4. Use `RouterLink` for internal navigation, not `<a>` tags
5. Use `reactive` from Vue for local form/state objects

Template structure:
```vue
<template>
  <div>
    <h1 class="text-6xl font-extrabold tracking-tight mb-4">
      Title here
    </h1>
    <p class="text-xl text-gray-500 max-w-lg leading-relaxed mb-10">
      Description here
    </p>
  </div>
</template>

<script setup>
// imports here
</script>
```

Ask for the component name and path before generating.
