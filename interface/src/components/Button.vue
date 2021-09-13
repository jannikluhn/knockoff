<template>
  <button
    class="px-4 py-0.5 rounded-full border-2 border-black uppercase font-bold"
    :class="isPrimary ? ['bg-black', 'text-white'] : 'bg-none'"
    @click="$emit('click')"
  >
    {{ message }}
  </button>
</template>

<script>
export default {
  name: "Button",
  props: ["isPrimary", "message"],
};
</script>
