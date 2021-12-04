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
import i18n from './includes/i18n';

let app;

onAuthStateChanged(auth(), () => {
  if (!app) {
    app = createApp(App).use(i18n);

    app.component('AlertMessageComponent', AlertMessageComponent);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);

    app.directive('icon', Icon);

    app.mount('#app');
  }
});
