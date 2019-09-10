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
  apiKey: "AIzaSyBxy6x_aCNmKfc-6NZ41VF1xjzMRu0m4TM",
  authDomain: "mental-aad2c.firebaseapp.com",
  databaseURL: "https://mental-aad2c.firebaseio.com",
  projectId: "mental-aad2c",
  storageBucket: "mental-aad2c.appspot.com",
  messagingSenderId: "224152456751",
  appId: "1:224152456751:web:26b72b0c0f6b4c35"
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

