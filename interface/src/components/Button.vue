<template>
  <button
    class="w-full sm:w-auto sm:px-10 py-0.5 rounded-full text-sm uppercase border-2 border-black font-bold"
    :class="isPrimary ? ['bg-black', 'text-white'] : 'bg-none'"
  >
    knock off
  </button>
</template>

<script>
export default {
  name: "Button",
  props: ["isPrimary"],
};
</script>
