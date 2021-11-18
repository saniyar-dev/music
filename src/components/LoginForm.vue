<template>
<!-- Login Form -->
<vee-form :validation-schema="schema" @submit="login">
  <div class="mb-3 p-5 text-white text-center font-bold" v-if="showAlert"
    :class="alertVariant">
    {{ alertMessage }}
  </div>
  <!-- Email -->
  <div class="mb-3">
    <label class="inline-block mb-2">Email</label>
    <vee-field type="email" name="email"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Enter Email" />
    <ErrorMessage name="email" class="text-red-600" />
  </div>
  <!-- Password -->
  <div class="mb-3">
    <label class="inline-block mb-2">Password</label>
    <vee-field type="password" name="password"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Password" />
    <ErrorMessage name="password" class="text-red-600" />
  </div>
  <button type="submit" :disabled="submited"
    class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
      hover:bg-purple-700">
    Submit
  </button>
</vee-form>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      submited: false,
      showAlert: false,
      alertVariant: 'bg-green-600',
      alertMessage: "Success you're now loged in",
      schema: {
        email: 'required|email|min:3|max:100',
        password: 'required',
      },
    };
  },
  methods: {
    async login(values) {
      this.submited = true;
      this.showAlert = true;
      this.alertVariant = 'bg-blue-600';
      this.alertMessage = "Please wait! While you're geting logged in.";

      try {
        await this.$store.dispatch('login', values);
      } catch (error) {
        this.submited = false;
        this.alertVariant = 'bg-red-600';
        this.alertMessage = 'Invalid login details.';

        setTimeout(() => {
          this.showAlert = false;
        }, 2000);

        return;
      }

      this.alertVariant = 'bg-green-600';
      this.alertMessage = "Succes you're now loged in! close this menu.";
      setTimeout(() => {
        this.showAlert = false;
      }, 2000);
      window.location.reload();
    },
  },
};
</script>

<style>

</style>
