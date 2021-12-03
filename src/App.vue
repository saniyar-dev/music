<template>
  <div>
    <app-header />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in"
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster">
        <component :is="Component"></component>
      </transition>
    </router-view>

    <app-player />

    <auth-modal />

  </div>
</template>

<script>
import 'animate.css';
import AuthModal from './components/Auth.vue';
import AppHeader from './components/Header.vue';
import AppPlayer from './components/Player.vue';

export default {
  components: {
    AuthModal,
    AppHeader,
    AppPlayer,
  },
  created() {
    this.$store.dispatch('init_login');
  },
};
</script>

<style>

</style>
