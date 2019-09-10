 <template>
    <div id=result>
  <v-data-table
    v-bind:headers="headers"
    :items="datas"
    sort-by=""
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

        <v-dialog v-model="dialog"  max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" @click="csvExport">exportcsv</v-btn>
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline"></span>
            </v-card-title>
           
            <v-card-text>
              <v-container>
                  
                <v-row>
                  
                  {{editedItem}}
                  <v-col v-for="(val,key,index) in editedItem" cols="12" >
                    {{headers_dict[key]}}
                    <v-text-field v-model=editedItem[key] ></v-text-field>
                    
                  </v-col>
                   <!--
                     
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
                  -->
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

export default {
  name: 'edit',
  props:["ownerid","docid","test"],
  data:function(){
      return {
          datas:[],
          datas_csv:[],
          headers_dict:{},
          pms:null,
          dialog: false,
          editedIndex: -1,
          headers: [
             { text: 'Actions', value: 'action', sortable: false }       
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
      this.pms=this.$route.params 

      // pms.uid="S4iaIxF7sedJDtbOfm4pwxPujYh1"
      // pms.docid="8nfdizLFPtnoZSQPBHmf"
      // pms.ansid="NCnQVXWOZbkW3fZyVXiY"

      this.getdata(this.pms)       
  },
  methods:{
      async getdata(params){
        console.log(params)
        let dd=await firebase.firestore().collection("users").doc(params.ownerid).collection("reserchs").doc(params.docid).collection("questions").orderBy("id_number").get()
          this.headers_dict={}
          dd.forEach(ss=>{
              let st=ss.data()
              let idx="Q"+st.id_number+"_"+st.itemname
              let hdata={text:idx,value:st.id,width:"200px"}
              this.headers.push(hdata)
              this.headers_dict[st.id]=idx         
          }) 
          let doc=await firebase.firestore().collection("users").doc(params.ownerid).collection("reserchs").doc(params.docid).collection("answers").get()         
          //let doc=await firebase.firestore().collection("answers").where("questionid","==",params.docid).get()         
          console.log(this.headers_dict)
          doc.forEach(async(d)=>{
              let row=d.data()
              console.log(row)
              //row.forEach(r=>r.itemname=this.headers_dict[r.id]) 
              let newrow={}
              for(let hd in this.headers_dict){
                newrow[hd]=row[hd]
              }
              newrow["id"]=d.id
              console.log(newrow)
              this.datas.push(newrow)  
              /*
              let ans=await d.ref.collection("answer").get()

              keys=Object.keys(tmp)
              if(st.indexOf("question")>=0){                
                this.headers.push({text:dd[st],value:st})
              }else{
              
              }

              l
              ans.forEach(a=>{
                  let d=a.data()
                  let idx="Q"+d.id_number+"_"+d.itemname
                  //console.log(idx)
                  //console.log(d)
                  if(d.value!=null){
                      row[idx]=d.value             
                  }else{
                      row[idx]=null
                  }
              })
              */

          })
          console.log(params.uid)

          

          console.log(this.headers)
          
      },
      csvExport() {
          this.header=[]
          this.headers.forEach(h=>{
              let tmp={}
              tmp[h.value]=[]
              if(h.value!='action')
              this.header.push(h.text)
          })
          
          let ids=this.headers.map(x=>{
            return x.value
          })
          let itemnames=this.headers.map(x=>{
            return x.text
          })
          this.datas.forEach(d=>{
            //console.log(d)
            let row=new Array(ids.length)
            Object.keys(d).forEach(sd=>{
              console.log(sd)
              console.log(d[sd])
              //console.log(this.datas_csv)
              let k=ids.indexOf(sd)
              console.log(k)
              if(k>=0)row[k+1]=d[sd]
              //this.datas_csv[sd].push(d[sd])
            }) 

            this.datas_csv.push(row)      
          })
          console.log(this.datas_csv)
          console.log(ids)
          console.log(this.header)
         let arrData=this.datas_csv
         let csvContent = "data:text/csv;charset=utf-8,";
         
          console.log(this.header)
         csvContent += [
            this.header.join(","),
            ...arrData.map(item => Object.values(item).join(","))
         ].join("\n")
          .replace(/(^\[)|(\]$)/gm, "");

        const data = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", data);
        link.setAttribute("download", "export.csv");
        link.click();
    
      },
      editItem (item) {
        this.editedIndex = this.datas.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        console.log(item)                  
      },
      deleteItem (item) {
        const index = this.datas.indexOf(item)
        if(confirm('Are you sure you want to delete this item?') ){
           this.datas.splice(index, 1)

              firebase.firestore().collection("users").doc(this.pms.ownerid).collection("reserchs").doc(this.pms.docid).collection("answers").doc(item.id).delete().then(d=>{
                console.log(d)
            })
        }
 
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.datas[this.editedIndex], this.editedItem)
        } else {
          this.datas.push(this.editedItem)
        }
        console.log(this.editedItem)
        //console.log(this.datas[this.editedIndex])
        
        firebase.firestore().collection("users").doc(this.pms.ownerid).collection("reserchs").doc(this.pms.docid).collection("answers").doc(this.editedItem.id).set(this.editedItem).then(d=>{
          console.log(d)
        })
        this.close()
      }
  }

}
</script>
<style>

  table.v-table tbody td,
   table.v-table tbody td {
      width: 200px;
    }
</style>