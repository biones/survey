<template>
  <v-app>
    <v-app-bar app>      
        <v-toolbar-title class="headline text-uppercase">
           <span class="font-weight-light"><a href="/" style="text-decoration: none;">SURVEY</a></span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <a v-if=is_login href="/create" style="text-decoration: none;">アンケートを作る</a>
        <v-spacer></v-spacer>
        
        <div v-if=is_login>
          <v-btn icon>
          logoutする
          </v-btn>
        </div>
        <div v-else>       
          <v-icon @click="signin" small>  
          ログインする          
          </v-icon>
        </div>
        <v-spacer></v-spacer>
         
    </v-app-bar>
    <br><br><br><br>
    <router-view></router-view>
    <br><br>
    <b>
    
    </b>
  </v-app>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'App',
  components: {

  },
  data() {
   return {
     is_login:false,
     user:null,
     test:123,
     rating:1
    }
  },
  created:function(){
    console.log("created")
    console.log(this.is_login)
    console.log(this)
    let thistmp=this
    firebase.auth().onAuthStateChanged(function(luser) {
      console.log(luser)
      if (luser) {
        console.log("user")
        //console.log(this.test)
        thistmp.user=luser
        console.log(thistmp.$root)
        thistmp.$root.$data.user=luser
        thistmp.is_login=true
        //this.test=999999
        console.log(thistmp)
      } else {
        // No user is signed in.
      }
    })
  },
  methods:{
    signin:function(){
      var provider = new firebase.auth.GoogleAuthProvider();
      console.log("userr")
      firebase.auth().signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          var user = result.user;
          this.is_login=true
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
        })     
    },
    doLogout() {
      firebase.auth().signOut()
    }    
  }
};
</script>
