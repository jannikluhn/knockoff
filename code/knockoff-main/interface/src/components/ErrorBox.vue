<template>
  <div class="p-3 max-w-screen-sm mx-auto rounded bg-red-300">
    <h1 class="mb-2 text-xl">{{ title ? title : "Error" }}</h1>
    <p><slot></slot></p>
  </div>
</template>

<script>
export default {
  name: "ErrorBox",
  props: ["title"],
};
</script>
