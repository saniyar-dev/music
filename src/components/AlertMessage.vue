<template>
  <dev class="fixed px-3 py-2 shadow-lg text-white bg-opacity-80
   text-center font-bold bottom-5 right-3 z-50 text-1xl"
  :class="color">
    {{ message }}
  </dev>
</template>

<script>
export default {
  name: 'AlertMessage',
  props: {
    color: {
      required: true,
      type: String,
    },
    message: {
      required: true,
      type: String,
    },
  },
};
</script>
