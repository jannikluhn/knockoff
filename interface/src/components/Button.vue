<template>
  <button
    class="w-full sm:w-72 mt-2 sm:px-10 py-0.5 rounded-full uppercase border-2 border-black font-bold transform hover:-translate-y-0.5"
    :class="isPrimary ? ['bg-black', 'text-white'] : 'bg-none'"
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
