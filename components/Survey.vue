<template>
<div id="survey">    
     <v-container> 

    <br><br>
    名前等含め、すべての項目は自由回答です。<br>
    下の金額の根拠となっている会計資料は<a href="https://www.wam.go.jp/content/wamnet/pcpub/top/">wam net</a>
    および、zipに含まれていた紙風のpdfを整理した
    <a href="https://drive.google.com/drive/u/0/folders/1K1dmrTFul0Batvu8pMl-jwNEP0iGGd6b">ドライブ</a>
    から確認をお願いします。<br>
    文中の「相談」とは占い的なものではなく、合理的な判断を要するトピックについてで、「当事者」とはネットで情報検索や申請ができる人を指します。<br>
    そうでない当事者の方へは、サービスの対象として偏った対象の言い分にされているとのお考えから、除外させてもらいました。申し訳ありません。<br>
    理由は、下にもかいてありますが「すべての当事者」からのサンプルに近くなるのが望ましいからです。ちなみに上のレベルのITスキルを得るのはトレーニング次第で誰でも可能だと思います。<br>
    
    <br><br><br>
    <div v-for="(item,index) in questionlist">
        {{index+1}}
        <div v-html=item.itemname></div>
        <div v-if="item.type=='text'">            
            <v-text-field v-model=answers[index]></v-text-field>
        </div>
        <div v-if="item.type=='number'">            
            <v-text-field v-model=answers[index]></v-text-field>
        </div>
        <div v-if="item.type=='textarea'">
            <v-text-field v-model=answers[index]></v-text-field>
        </div>

        <div v-if="item.type=='multiinput'">
            <v-row>

            <v-col cols="6" sm="6" md="6">
                <v-text-field  v-for="(ans,k) in answers[index]"  v-model=answers[index][k]></v-text-field>
            </v-col>
            </v-row>
        </div>
        <div v-if="item.type=='select'">
            <v-radio-group v-model="answers[index]"  row>
            <v-radio                
                v-for="content in item.val"
                 :label="content" 
                 :value="content"
                 color="warning"></v-radio>
            </v-radio-group>
        </div>
        <div v-if="item.type=='likert'">
            <v-radio-group v-model="answers[index]"  row>
            <v-radio                
                v-for="(content,index) in item.labels"
                 :label="content" 
                 :value="index+1"
                 color="warning"></v-radio>
            </v-radio-group>
        </div>
        <div v-if="item.type=='bool'">
            <v-radio-group v-model="answers[index]"  row>
            <v-radio                
                v-for="content in ['Yes','No']"
                 :label="content" 
                 :value="content"
                 color="warning"></v-radio>
            </v-radio-group>
        </div>
        <!--
        <div v-if="item.type==multi">
             <v-checkbox v-model="answers[index]" class="mx-2" value=item.val1></v-checkbox>
         </div>
        -->

        <div v-if="item.type=='select_drop'">
            <v-select  :items=item.val v-model=answers[index]></v-select>     
        </div>
        <div v-if="item.type=='scale'">
            <v-rating v-model=answers[index]></v-rating>
        </div>    
        <br><br>
    </div>
    
    <br><br>
    <v-btn v-if="!submited" color="error"　　dark large v-on:click="submit()">投稿する</v-btn>
    <div v-else>回答ありがとうございました</div>
    <br><br><br>
    作成者のコメント<br>
    ・アンケートはメンタル福祉useの変数がuserのspecの関数、つまりuserの能力レベルが使うかどうかを判定するという至極当然のバイアスが存在するので
    nonuserにも実施する必要がある<br><br>
    アンケート調査の設計、解析はのご依頼は安心と信頼の飯島ソフトウエア工業へ
    
    </v-container>
</div>

</template>

<script>

import firebase from 'firebase'
function urlAutolink(text){
    lt=text.length
    text=text.replace(/(http:\/\/[\x21-\x7e]+)/gi, "<a href='$1'>$1</a>")
    text=text.replace(/(https:\/\/[\x21-\x7e]+)/gi, "<a href='$1'>$1</a>")
    console.log(text)
    return text
}

export default {
    name:"survey",
    created:async function(){
        console.log(window.location.pathname.split("/").slice(-1))
        let tmp=window.location.pathname.split("/").slice(-1)[0].split("_").slice(-2)
        let ownerid=tmp[1]
        console.log(ownerid)
        this.ownerid=ownerid
        //this.sid=this.$route.params.sid
        this.sid=tmp[0]
        //let rs=await this.db.collection("reserchs").doc(this.sid).collection("questions").orderBy("id").get()

        let rs=await this.db.collection("users").doc(ownerid).collection("reserchs").doc(this.sid).collection("questions").orderBy("id_number").get()

        rs.forEach(element => {
            let d=element.data()
            //let vali=d.indexOf("val1")      
            //console.log(d)      
            //d.vals=d.slice(vali,-1)
            if(d.val){
            if(d.type=="likert"){
                if(d.val[0]==5){
                    d.labels=["全くそう思わない","そう思う","どちらとも言えない","そう思う","非常にそう思う"]
                }else if(d.val[0]==3){
                    d.labels=["そう思う","どちらとも言えない","そう思う"]
                }
            }
            }
            d.questionid=d.id
            d.id=d.id_number
            this.questionlist.push(d)
            console.log(d.type)
            if(d.type!="multiinput"){
                this.answers.push(null)
            }else{
                this.answers.push([])
                for(let k=0;k<d.val[0];k++){                    
                    this.answers[this.answers.length-1].push(null)
                }
            }
        });
        console.log(this.questionlist)
        console.log(this.answers)
    },
    methods:{
        submit:function(){
            console.log(this.sid)
            //var batch = this.db.batch()
            let ref=firebase.firestore().collection("users").doc(this.ownerid).collection("reserchs").doc(this.sid).collection("answers").doc()
            //let ref=firebase.firestore().collection("answers").doc()
            
            //let ref=firebase.firestore().collection("users").doc(this.ownerid).collection("reserchs").doc(this.sid).collection("questions")            
            
            let answers_l=this.answers
            let ql=this.questionlist            
            let gsid=this.sid
            firebase.auth().onAuthStateChanged(async function(user) {
                let uid=null
                if(user){
                    uid=user.uid                    
                }
                let i=0
                //var batch = firebase.firestore().batch();
                console.log(ql)
                let data={
                    id: ref.id,
                    uid:uid,
                    questionid:gsid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }
                console.log(answers_l)
                answers_l.forEach((x)=>{
                    console.log(x)
                    console.log(i)   
                    console.log(ql[i])           
                    let itemname=ql[i].itemname
                    data[String(ql[i].questionid)]=x
                    //d["question"+"_"+String(x.id)]=this.questionlist[i-1].itemname                    

                    i++
                    //let data={id:ql[i].id,uid:uid,id_number:ql[i].id_number,itemname:itemname,value:x,createAt:firebase.firestore.FieldValue.serverTimestamp()} 
                    //let data={id:ql[i].id,uid:uid,id_number:ql[i].id_number,itemname:itemname,value:x,createAt:firebase.firestore.FieldValue.serverTimestamp()} 
                    
                    //let ref2=ref.collection("answer").doc()
                    //batch.set(ref2,data)
                })
                ref.set(data)
                //batch.commit()                 
            })
            this.submited=true
            
            /*
            
            let i=1
            //let d={id:i,data:x}
            let d={}
            this.answers.forEach((x)=>{
                //ref.doc(x.id)
                d[String(x.id)]=x    
                d["question"+"_"+String(i)]=this.questionlist[i-1].itemname                    
                //i++
            })

            d.createdAt=firebase.firestore.FieldValue.serverTimestamp()
            firebase.auth().onAuthStateChanged(async function(user) {
                if(user){
                    d.uid=user.uid
                    
                }else{
                    d.uid=null
                }
                ref.set(d)
                //batch.set(ref,d)
                //batch.commit()
                this.submited=true
            })
            */
        }
    },
    data () {
        return {
             questionlist:[],
             answers:[],
             db:firebase.firestore(),
             sid:null,
             bool:["はい","いいえ"],
             submited:false,
             rating:2,
             scale:[""]
        }
    }
}
</script>


<style>
.underline {
  width: 200px;
  height: 2px;
  background: skyBlue;
  transform-origin: center center;
  transform: scaleX(0);
  transition: transform 0.18s ease-out;
}

</style>