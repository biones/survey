<template>
    <div id=edit>
  <v-data-table
    :headers="headers"
    :items="datas"
    sort-by="id_number"
    class="elevation-1"
    :items-per-page="100"
  >
  
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title></v-toolbar-title>
       
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
         
        <v-col cols="12" sm="6" md="4">                      
          <v-text-field v-model="title" label="title"></v-text-field>
        </v-col>
        <v-btn color="primary" dark class="mb-2" @click="saveother">Save</v-btn>
        <v-dialog v-model="dialog"  max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
          
            <v-card-title>
              <span class="headline"></span>
            </v-card-title>
            <v-card-text>
              <v-container>
                                             
                  
                <!--
                    ここを編集
                    -->
                
                  <!--
                       <v-text-field v-model="editedItem.itemname" textarea rows="3" label="itemname"></v-text-field>
           
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.id_number" label="id_number"></v-text-field>
                    <v-text-area v-model="editedItem.itemname" label="itemname"></v-text-area>
                  </v-col>
                  -->
                  
                  <v-row> 
                    <textarea v-model="editedItem.itemname"  rows=5 cols=100 label="itemname"></textarea>   
            
                    
                  <v-col cols="12" sm="6" md="4">                      
                    <v-text-field v-model="editedItem.type" label="type"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">                      
                    <v-text-field v-model="editedItem.val_1" label="val_1"></v-text-field>                    
                  </v-col>
                  <v-col cols="12" sm="6" md="4">                      
                    <v-text-field v-model="editedItem.val_2" label="val_2"></v-text-field>                    
                  </v-col>
                  <v-col cols="12" sm="6" md="4">                      
                    <v-text-field v-model="editedItem.val_3" label="val_3"></v-text-field>                    
                  </v-col>
                  <v-col cols="12" sm="6" md="4">                      
                    <v-text-field v-model="editedItem.val_4" label="val_4"></v-text-field>                    
                  </v-col>
                  <v-col cols="12" sm="6" md="4">                      
                    <v-text-field v-model="editedItem.id_number" type="number" label="id_number"></v-text-field>
                  </v-col>
                </v-row>             
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
      </v-toolbar>
    </template>
    
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        edit
      </v-icon>
      <v-icon
        small
        @click="addBelow(item)"
      >
        addBelow
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        delete
      </v-icon>
    </template>
     
    <template v-slot:no-data>
      <v-btn color="primary" >Reset</v-btn>
    </template>
   
  </v-data-table>
  </div>
</template>

<script>
import firebase from 'firebase'
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export default {
  name: 'edit',
  props:["ownerid","docid"],
  data:function(){
      return {
          datas:[],
          dialog: false,
          editedIndex: -1,
          title:null,
          headers: [
            { text: 'Actions', value: 'action', sortable: false } ,
            {
                text: 'itemname',
                align: 'left',
                sortable: false,
                value: 'itemname',
            }, 
            {
                text: 'type',
                align: 'left',
                sortable: false,
                value: 'type',
            }                   
          ],
          editedItem:{
                itemname:'',
                type:null
            },
         defaultItem:{
                itemname:'',
                type:null
         }
      }
  },
  components: {

  },
  created:function(){
      let pms=this.$route.params 
      
      //pms.docid="cBDfbNLbYAaKEqv4c5Oo"
      this.pms=pms
      console.log(pms)
      this.getdata(pms)       
  },
  methods:{
      async getdata(params){
          let doc=await firebase.firestore().collection("users").doc(params.ownerid).collection("reserchs").doc(params.docid).collection("questions").orderBy("id_number").get()

          this.headers.push({text:"id_number",value:"id_number"})
          doc.forEach((d)=>{
              let tmp=d.data()
              let k=1
              console.log(tmp)
              if(tmp.val){
              tmp.val.forEach((d2)=>{
                  let key="val_"+k
                  tmp[key]=d2
                  
                  k++
              })
              }
              //console.log(tmp)
              
              this.datas.push(tmp)
              
          })


          Array(10).fill(0).map((s,e)=>{
              console.log(s,e)
              let valname="val_"+(e+1)
              let tmp={text:valname,value:valname}
              this.headers.push(tmp)
              console.log(e,tmp)
          })

        let rsdoc=await firebase.firestore().collection("users").doc(params.ownerid).collection("reserchs").doc(params.docid).get()
        this.title=rsdoc.data().title

        console.log(this.headers)
      },
      editItem (item) {
        this.editedIndex = this.datas.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.datas.indexOf(item)
        if(confirm('Are you sure you want to delete this item?')){
          this.datas.splice(index, 1)
          console.log(item)
          firebase.firestore().collection("users").doc(this.pms.ownerid).collection("reserchs").doc(this.pms.docid).collection("questions").doc(item.questionid).delete()
        }
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      addBelow(item){

        this.editedItem ={}
        Object.keys(item).forEach(itm=>{this.editedItem[itm]=null})
        this.editedItem.id_number=item.id_number+0.00001
        console.log(this.editedItem)

        this.datas.forEach(e=>{
          if(e.id_number>item.id_number){
            e.id_number+=1
          }
        })
        this.editedItem.questionid=null
        console.log(this.editedItem)
        this.dialog = true        
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.datas[this.editedIndex], this.editedItem)
        } else {
          this.datas.push(this.editedItem)
        }
        let val=[]
        Object.keys(this.editedItem).forEach(k=>{
          if(k.indexOf("val_")>=0){
            val.push(this.editedItem[k])
            delete this.editedItem[k]
          }
        })


        let data=this.editedItem

        data.val=val
        data.id_number=parseFloat(data.id_number)
        if(data.questionid){
          firebase.firestore().collection("users").doc(this.pms.ownerid).collection("reserchs").doc(this.pms.docid).collection("questions").doc(data.questionid).set(data)
        }else{
          //let ref=firebase.firestore().collection("users").doc(this.pms.ownerid).collection("reserchs").doc(this.pms.docid).collection("questions").doc(data.id).set(data)
          //shard_ref.update("count", firebase.firestore.FieldValue.increment(1))

          data.questionid=create_UUID()
          data.id=data.questionid
          console.log(data)
          
          firebase.firestore().collection("users").doc(this.pms.ownerid).collection("reserchs").doc(this.pms.docid).collection("questions").doc(data.questionid).set(data)
          

        }
        
        this.close()
      },
      saveother(){
        let params=this.pms
        console.log(this.title)
        firebase.firestore().collection("users").doc(params.ownerid).collection("reserchs").doc(params.docid).set({title:this.title},{ merge: true })        
      }
  }

}
</script>
