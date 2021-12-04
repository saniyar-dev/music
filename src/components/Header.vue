<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'Home' }" exact-active-class="not-active">
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'About' }">
              About
            </router-link>
          </li>
          <li v-if="!loggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
              Login / Register
            </a>
          </li>
          <template v-else>
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'Manage' }">Manage</router-link>
          </li>
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="logout">
              Logout
            </a>
          </li>
          </template>
        </ul>

        <ul class="flex flex-row ml-auto">
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="changeLocale">
              {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <alert-message-component :color="alertVariant" :message="alertMessage" v-if="alertShow" />

</template>

<script>
import { mapMutations, mapState } from 'vuex';
import AlertMessageComponent from './AlertMessageComponent.vue';

export default {
  components: { AlertMessageComponent },
  name: 'Header',
  data() {
    return {
      currentLocale: 'en',
      altLocale: 'fr',
      alertMessage: '',
      alertVariant: '',
      alertShow: '',
    };
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    async logout() {
      try {
        this.$store.dispatch('signOut');
      } catch (error) {
        console.log('something went wrong');
      }

      if (this.$route.meta.requiresAuth === true) {
        this.$router.push({ name: 'Home' });
      }
    },
    changeLocale() {
      try {
        this.$i18n.locale = this.altLocale;
        [this.currentLocale, this.altLocale] = [this.altLocale, this.currentLocale];
      } catch (error) {
        this.alertMessage = 'Changing language cannot be done now!';
        this.alertVariant = 'bg-red-600';
        this.alertShow = true;

        setTimeout(() => {
          this.alertMessage = '';
          this.alertVariant = '';
          this.alertShow = false;
        }, 3000);
        return;
      }
      this.alertMessage = `Language Changed to ${this.currentLocale}!`;
      this.alertVariant = 'bg-green-600';
      this.alertShow = true;

      setTimeout(() => {
        this.alertMessage = '';
        this.alertVariant = '';
        this.alertShow = false;
      }, 3000);
    },
  },
  computed: {
    ...mapState(['loggedIn']),
  },
};
</script>
