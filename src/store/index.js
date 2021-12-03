import { createStore } from 'vuex';
import { Howl } from 'howler';
import helper from '../includes/helper';
import {
  auth, createUser, usersCollection, setDoc, doc, signIn, signOut,
} from '../includes/firebase';

export default createStore({
  state: {
    authModalShow: false,
    loggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleLoggedIn: (state) => {
      state.loggedIn = !state.loggedIn;
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());

      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
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
    async newSong({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      commit('newSong', payload);
      state.sound.play();

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ state, dispatch, commit }) {
      commit('updatePosition');

      if (state.sound.playing) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      // Document widht: 2000px,Timeline: 1000, click: 1000, Distance: 500,
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
});
