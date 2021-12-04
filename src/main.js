import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from './includes/validation';
import { auth, onAuthStateChanged } from './includes/firebase';
import './assets/tailwind.css';
import './assets/main.css';

import AlertMessageComponent from './components/AlertMessageComponent.vue';

import Icon from './directives/icon';

let app;

onAuthStateChanged(auth(), () => {
  if (!app) {
    app = createApp(App);

    app.component('AlertMessageComponent', AlertMessageComponent);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);

    app.directive('icon', Icon);

    app.mount('#app');
  }
});
