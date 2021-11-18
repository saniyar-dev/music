import { createStore } from 'vuex';
import {
  auth, createUser, usersCollection, setDoc, doc, signIn, signOut,
} from '../includes/firebase';

export default createStore({
  state: {
    authModalShow: false,
    loggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleLoggedIn: (state) => {
      state.loggedIn = !state.loggedIn;
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
  actions: {
    async register({ commit }, payload) {
      const userCred = await createUser(
        auth(), payload.email, payload.password,
      );

      await setDoc(doc(usersCollection, userCred.user.uid), {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      commit('toggleLoggedIn');
      setTimeout(() => {
        commit('toggleAuthModal');
      }, 1000);
    },
    async login({ commit }, payload) {
      await signIn(auth(), payload.email, payload.password);

      commit('toggleLoggedIn');
      setTimeout(() => {
        commit('toggleAuthModal');
      }, 1000);
    },
    async signOut({ commit }) {
      await signOut(auth());

      commit('toggleLoggedIn');
    },
    init_login({ commit }) {
      const user = auth().currentUser;

      if (user) {
        console.log(1);
        commit('toggleLoggedIn');
      }
    },
  },
});
