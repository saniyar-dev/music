<template>
<!-- Registration Form -->
<vee-form :validation-schema="schema"
  @submit="register">
  <div class="mb-3 text-white text-center font-bold p-5" v-if="regShowAlert"
  :class="regAlertVariant">
    {{ regAlertMessage  }}
  </div>
  <!-- Name -->
  <div class="mb-3">
    <label class="inline-block mb-2">Name</label>
    <vee-field type="text" name="name"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Enter Name" />
    <ErrorMessage class="text-red-600" name="name" />
  </div>
  <!-- Email -->
  <div class="mb-3">
    <label class="inline-block mb-2">Email</label>
    <vee-field type="email" name="email"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Enter Email" />
    <ErrorMessage class="text-red-600" name="email" />
  </div>
  <!-- Age -->
  <div class="mb-3">
    <label class="inline-block mb-2">Age</label>
    <vee-field type="number" name="age"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded" />
    <ErrorMessage class="text-red-600" name="age" />
  </div>
  <!-- Password -->
  <div class="mb-3">
    <label class="inline-block mb-2">Password</label>
    <vee-field name="password" :bails="false" v-slot="{ field, errors }">
      <input type="password" placeholder="Password"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
      duration-500 focus:outline-none focus:border-black rounded" v-bind="field">
      <div class="text-red-600" v-for="error in errors" :key="error">
        {{ error }}
      </div>
    </vee-field>
</div>
<!-- Confirm Password -->
  <div class="mb-3">
    <label class="inline-block mb-2">Confirm Password</label>
    <vee-field type="password" name="confirm_password"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Confirm Password" />
    <ErrorMessage class="text-red-600" name="confirm_password" />
  </div>
  <!-- Country -->
  <div class="mb-3">
    <label class="inline-block mb-2">Country</label>
    <vee-field as="select" name="country"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
        duration-500 focus:outline-none focus:border-black rounded bg-white">
      <option value="" selected disabled hidden>
        Select One Countrey</option>
      <option value="USA">USA</option>
      <option value="Mexico">Mexico</option>
      <option value="Germany">Germany</option>
      <option value="Antarctica">Antarctica</option>
    </vee-field>
    <ErrorMessage class="text-red-600" name="country" />
  </div>
  <!-- TOS -->
  <div class="mb-3 pl-6">
    <vee-field type="checkbox" class="w-4 h-4 float-left -ml-6 mt-1 rounded"
    value="1" name="tos" id="tos"/>
    <label class="inline-block" for="tos" >Accept terms of service</label>
  <ErrorMessage class="text-red-600 block" name="tos" />
  </div>
  <button type="submit" :disabled="regInSubmission"
    class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
      hover:bg-purple-700">
    Submit
  </button>
</vee-form>

</template>

<script>
export default {
  name: 'RegisterForm',
  methods: {
    async register(values) {
      this.regShowAlert = true;
      this.regInSubmission = true;
      this.regAlertVariant = 'bg-blue-500';
      this.regAlertMessage = "Please wait! you're account is being created.";

      try {
        await this.$store.dispatch('register', values);
      } catch (error) {
        console.log(error);
        this.regInSubmission = false;
        this.regAlertMessage = 'Something went wrong please try again later!';
        this.regAlertVariant = 'bg-red-500';

        setTimeout(() => {
          this.regShowAlert = false;
        }, 2000);

        return;
      }

      this.regAlertVariant = 'bg-green-500';
      this.regAlertMessage = "success! you're acount has been created.";

      setTimeout(() => {
        this.regShowAlert = false;
      }, 2000);
      window.location.reload();
    },
  },
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:8|max:28',
        confirm_password: 'confirmed:@password',
        country: 'required|not_supported_country:Antarctica',
        tos: 'tos',
      },
      regInSubmission: false,
      regShowAlert: false,
      regAlertVariant: 'bg-blue-500',
      regAlertMessage: "please wait! you're account is being created.",
    };
  },
};
</script>

<style>

</style>
