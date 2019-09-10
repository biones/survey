<template>
  <div id="ImportCsv">
    <input @change="fileRead" type="file" id="file_input_expense" name="file_input_expense" />
    <br />
    <!--
    <v-text-field v-model="urlname" label=アンケート名(既存と重複不可）>
      </v-text-field>
    -->
    <br />
    <v-btn small v-on:click="import_csv">importする</v-btn>
  </div>
</template>

<script>
/*
await firebase.auth().onAuthStateChanged((user) => {
         this.user=user
       })
       */

import firebase from "firebase";

function sleepByPromise(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

// async修飾子を使って非同期関数を宣言します。
async function wait(sec) {
  console.log("wait " + sec.toString() + " sec right now!");

  // await句を使って、Promiseの非同期処理が完了するまで待機します。
  await sleepByPromise(sec);

  console.log("wait " + sec.toString() + " sec done!");
}

export default {
  name: "ImportCsv",
  props: {
    uid: {
      default: null
    },
    docid: {
      default: null
    }
  },
  data: () => ({
    db: null,
    urlname: null
    //csvdatas:[]
  }),
  methods: {
    async adddatas() {

      console.log(this.csvdatas.length);
      let user = this.$root.$data.user;
      console.log(user);
      let ref = null;
      console.log(this.docid);
      if (this.docid) {
        await this.db
          .collection("users")
          .doc(user.uid)
          .collection("reserchs")
          .doc(this.docid)
          .collection("questions")
          .get()
          .then(ss => {
            console.log("removed",ss);
            ss.forEach(s => {
              s.ref.delete();
            });
          });

        ref = this.db
          .collection("users")
          .doc(user.uid)
          .collection("reserchs")
          .doc(this.docid);
      } else {
        ref = this.db
          .collection("users")
          .doc(user.uid)
          .collection("reserchs")
          .doc();
        console.log("else",ref)
      }
      ref.set({
        id: ref.id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      var batch = this.db.batch();
      for (var i = 0; i < this.csvdatas.length; i++) {
        let data = this.csvdatas[i];
        for (let k in data) {
          if (data[k] == undefined) {
            // /data[k]=null
            continue;
          }
        }
        let tmp=String(data.id)
        console.log(data.id)
        let ref2 = ref.collection("questions").doc(tmp);
        data.questionid=data.id
        console.log(data)
        batch.set(ref2, data);
      }
      batch.commit();
      console.log(ref);
      let id = ref.id;
      this.$parent.url = location.hostname + "/survey/" + id + "_" + user.uid;
    },
    fileRead(e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      const loadFunc = () => {
        var lines = reader.result.split("\n");

        let row1 = lines[0].split(",");
        console.log(row1);
        lines.shift();
        console.log(lines);
        this.csvdatas = [];
        let ll = row1.length;
        console.log(ll);
        console.log(row1);
        let k = 1;
        lines.slice(0).forEach(element => {
          console.log(element);
          var tmp = element.split(",").slice(0, ll);
          var d = {};
          d["val"] = [];
          for (var i = 0; i < ll; i++) {     
            if (row1[i].slice(0, 3) == "val") {
              if(tmp[i].trim().length==0)continue
              d["val"].push(tmp[i]);
            } else {
              if(row1[i].length>0)
                 d[row1[i]] = tmp[i];
            }
          }
          if (d.itemname.length != 0) {
            d.id_number = k;
            this.csvdatas.push(d);
            k++;
          }
        });
      };

      // onloadはreadAsBinaryStringでファイルを読み込んだ後に実行されます.
      reader.onload = loadFunc;
      //reader.readAsBinaryString(file)
      reader.readAsText(file);
      console.log(reader.result);
    },
    import_csv() {
      console.log(this.csvdatas);
      this.adddatas();
    }
  },
  created: function() {
    console.log("createdicsv");
    this.db = firebase.firestore();
    console.log(this.db);
  }
};
</script>

