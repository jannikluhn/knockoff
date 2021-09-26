<template>
  <div>
    <div class="opacity-0 sm:opacity-100 bg-white z-0 absolute top-0 left-o w-11/12 h-screen grid grid-cols-5 auto-rows-auto gap-0.5 items-center justify-items-center" style="z-index= -100;">
      <img src="https://lh3.googleusercontent.com/Fzc7-PJ-e1YCGPmyUqBpw15oQjHXUO4FoCTREDY94qBNcTucjU_IUEPPYc-EO87Uxfg5I83hu9qlGe-p0B2nndyldA=w600" alt="" class="w-28 justify-self-start">
      <img src="https://lh3.googleusercontent.com/IpGXfRmHP8QHQiiptG4v9n7A_rzX_VhBXb849In8gNZek_4gJYhu9B7a2KYmbz9GFn_RiLZYKWvrvSfqYJwumy99lTLtYF33iZafmI0=w600" alt="" class="w-72 justify-self-start self-end">
      <img src="https://lh3.googleusercontent.com/M7o9nXHrjg6pb2uU_IGvGTlsdMZmuM-xjemI1MIdV6VS8WfER84qFwWV63IbYATL9ay_bbyDFHiF84sUFWXqVfLJWo3AmFFtEjLL=w600" alt="" class="w-32">
      <img src="https://lh3.googleusercontent.com/iWGcRhz4hTxkxSh9XpCbxA_Cg23RqKWhikWzHw8es12nGLxtVGmRKOYSYJ7XkBkF9UaC3v1sX43w8qpq2d9VdtjA0C3Ynv3IIy0Rew=w600" alt="" class="w-24" style="grid-column: 3 / span 2; grid-row: 1 / span 1">
      <video src="https://assets.foundation.app/qv/Wg/QmWMvcCNVPCWR7CeWW4h8x8FptsQnRcrK2swxZQRRGqvWg/nft.mp4" loop="" autoplay="" muted="" playsinline="" class="w-48"></video>
      <img src="https://lh3.googleusercontent.com/HbcMKwsdj7VtoqsvEtvHvCrbvLVUAYrFaoDuwStZ_Q7sSd3c3DgcJVpDikjWoDagNPNxiD3XNLor7xwcQSvH6q3kN98lLcChC1p3=w600" alt="" class="w-32">
      <img src="https://lh3.googleusercontent.com/vfzL24t_lKa93g0MKnoLr1EUW8suycVL_9_cWSTYLrID3fwYxQS4UMfcXbtCQhlxYdtmAFSDoTKGSDrMnsTKydmNjZXn5v21QrxV=w600" alt="" class="w-28">
      <video src="https://assets.foundation.app/es/wD/Qmcg8f4F9cig2JWXunxJcdBe58Q5myYXPmGfuMn1TVeswD/nft.mp4" loop="" autoplay="" muted="" playsinline="" class="w-52"></video>
      <img src="https://lh3.googleusercontent.com/8MfYWURMjXAJwOC1ixWiz3SLOm1qnNf6lDyMIAyT_0UrxQgWA9evI8UP52WP9jkge879kyYnbOt1I-iFpx1S-SV105-ksAHU_RNShGE=w600" alt="" class="w-72 justify-self-start">
      <img src="https://lh3.googleusercontent.com/vMwz6RdoUWvtGaPNw2dJ28ByiWrWPiFC9rYR7_OM047RiRMYFcM9p8-58a_9WCvTZWr34t6BKhhM9Xd9ikdkLbK1mUcuY1ELHE0PsQ=w600" alt="" class="w-32">
      <img src="https://lh3.googleusercontent.com/6ZU65dNI0g58uimm04lj7lY8SI9zvCuDXCsUnXr0T96tBB-wIn3R0kfQ70vrCwfMuvNCtsvnhlYS9oQqU2T9PrMWVAh0i-_AK6trnQ=w600" alt="" class="w-52" style="grid-column: 4 / span 1; grid-row: 3 / span 2">
      <video src="https://assets.foundation.app/tc/8G/QmZCsrqZUb9HaprBQV6Cn615fivCGgtA9M8qEDuputtc8G/nft_q4.mp4" loop="" autoplay="" playsinline="" class="w-48"></video>
      <img src="https://f8n-ipfs-production.imgix.net/Qme9DzDKpwoY5JGXs6d9YwPrN5u6VbSgf31LC2YNfUX5hu/nft.png?q=100&w=1680&auto=compress&fit=fill&max-h=1680" alt="" class="w-32">
      <img src="https://f8n-ipfs-production.imgix.net/QmZeeGGBiAc851DNSTh72Xbkz7BxPcG36tCNTMyU9inww4/nft.png?q=100&w=1680&auto=compress&fit=fill&max-h=1680" alt="" class="w-32">
      <!-- <video src="https://assets.foundation.app/cD/qH/QmUugLvMYoL3aVikgeUio8AYMLcKhNbSve3EytewikcDqH/nft.mp4" poster="https://assets.foundation.app/cD/qH/QmUugLvMYoL3aVikgeUio8AYMLcKhNbSve3EytewikcDqH/nft.jpg" loop autoplay muted playsinline class="w-48"></video> -->
    </div>
      <div class="sm:mix-blend-difference sm:text-white relative md:w-2/3 mx-auto text-center">
        <h1 class="px-9 pt-20 text-3xl sm:text-6xl font-extrabold italic">
          Are you too poor for NFTs?
          <br>
          Make a Knockoff!
        </h1>
      </div>

      <div class=" relative pt-12">
        <SelectNFTForm @submit="nftTokenLocationID = $event" />
      </div>
    </div>
</template>

<script>
import SelectNFTForm from "../components/SelectNFTForm.vue";

export default {
  name: "LandingPage",
  components: {
    SelectNFTForm,
  },
};
</script>
