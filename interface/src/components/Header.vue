<template>
  <div class="text-center p-5">
    <h3 class="font-semibold capitalize text-xl">Forest Rabbit</h3>
    <h2 class=" font-extrabold italic uppercase text-3xl leading-8 my-3">
      The last sunset and a green garden
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
  props: ["isKnockOff", "serial", "order"],
  computed: {
    label() {
      if (this.isKnockOff) {
        return `knock-off" ${this.serial.toString()} ${this.order.tostring()}`;
      } else {
        return "original";
      }
    },
  },
};
</script>
