import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import firebase from 'firebase'
//import BootstrapVue from 'bootstrap-vue'


//Vue.use(BootstrapVue)
//Vue.use(vuetify);

Vue.config.productionTip = false

var firebaseConfig = {

};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
//const settings = { timestampsInSnapshots: true };
//firestore.settings(settings);



new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

