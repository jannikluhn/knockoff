<template>
  <div
    class="w-full md:w-64 max-h-96 rounded overflow-hidden border-2 border-black"
  >
    <img
      class="w-full h-60 object-cover object-center"
      src="https://f8n-ipfs-production.imgix.net/QmaZC1Rp3tAW9zF7indbX79CMXfeu6tZRtg5oyP7umGWiR/nft.png?q=100&w=1680&auto=compress&fit=fill&max-h=1680"
      alt="NFT Artwork"
    />
    <div class="px-4 py-3 flex items-center justify-between">
      <div class="">
        <h2 class="font-extrabold italic uppercase text-xl mb-0.5">
          The Coldest Sunset
        </h2>
        <p class="font-medium text-sm">
          21-08-2021
        </p>
      </div>
      <div class="font-semi-bold italic text-3xl">#4</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
};
</script>
