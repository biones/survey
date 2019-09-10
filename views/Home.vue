<template>
  <div id="home">
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />

    <div v-for="(item,index) in items" v-model="user">
      {{item.title}}   
      <a :href="item.url">{{hostname}}{{item.url}}</a>
      {{item.createdAt}}
      <router-link :to="{name:'result',params:{ownerid:item.uid,docid:item.id}}">result</router-link>

       <router-link :to="{name:'edit',params:{ownerid:item.uid,docid:item.id}}"><v-btn>edit</v-btn></router-link>    

        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on }">
            <v-btn color="red lighten-2" dark v-on="on">update_by_csv</v-btn>
          </template>
            <v-card-title class="headline grey lighten-2" primary-title>同じURLでアンケートをアップデートする</v-card-title>            
            <importCsv v-bind:uid=item.uid v-bind:docid=item.id></importCsv>
            <v-card-actions>              
              <v-btn color="primary" text @click="dialog = false">close</v-btn>
            </v-card-actions>
        </v-dialog>

      <!--
        <router-link :to="{name:'edit' ,params:{uid:user.uid,docid:item.id}}">
          <v-icon left>mdi-pencil</v-icon>Edit
        </router-link>
        -->

      <span @click="remove(index)">X</span>
      <br><br>
    </div>
    アンケート調査の設計、解析はのご依頼は安心と信頼の飯島ソフトウエア工業へ
  </div>
</template>

<script>
import firebase from "firebase";
import importCsv from "@/components/importcsv";


export default {
  name: "home",
  components:{
    importCsv
  },
  data: () => {
    return {
      items: [],
      test: 234,
      hostname: null,
      user: null,
      dialog: false,
      docid:null   
    };
  },
  created: async function() {
    let thistmp = this;
    firebase.auth().onAuthStateChanged(async function(luser) {
      thistmp.user = luser;
      console.log(luser.uid);
      let d = await firebase
        .firestore()
        .collection("users")
        .doc(luser.uid)
        .collection("reserchs")
        .get();

      thistmp.hostname = location.hostname;
      console.log(d);
      d.forEach(element => {
        console.log(element);
        let id = element.id;
        //"https://"
        let ca = element.data().createdAt.toDate();
        console.log(ca);

        let tmp = {
          url: "/survey/" + id + "_" + thistmp.user.uid,
          createdAt: ca,
          id: id,
          uid:luser.uid,
          title:element.data().title
        };
        //this.docid=id

        console.log(tmp);
        thistmp.items.push(tmp);
        console.log(thistmp.items);
      });
    });
  },
  methods: {
    remove(index) {
      let docid = this.items[index].id;
      console.log(index);
      firebase
        .firestore()
        .collection("users")
        .doc(this.$root.$data.user.uid)
        .collection("reserchs")
        .doc(docid)
        .delete();
      this.items.splice(index, 1);
    }
  }
};
</script>
