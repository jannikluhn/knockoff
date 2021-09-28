<template>
  <div class="text-center">
    <h2 class=" font-extrabold italic uppercase text-3xl leading-8 my-3">
      {{ title }}
    </h2>
    <span
      class="p-0.5 uppercase font-medium rounded-full px-3 border-2 border-black"
    >
      {{ label }}
    </span>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: ["isKnockOff", "serialNumber", "ancestorSerialNumbers", "title"],
  computed: {
    label() {
      if (this.isKnockOff) {
        let s = "knockoff";
        if (this.serialNumber || this.serialNumber === 0) {
          s += " #";
          for (const i of this.ancestorSerialNumbers || []) {
            s += i.toString() + ".";
          }
          s += this.serialNumber.toString();
        }
        return s;
      } else {
        return "original";
      }
    },
  },
};
</script>
