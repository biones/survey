<template>
<div id="create">
    <br><br>
    <importCsv></importCsv>
   {{url}}
    <br><br>
    itemname	id type	val1	val2...のtidyなcsvをuploadしてください。対応しているtypeはtext,textarea,scale,likert(3or5)です。idはアンケートの仕様がかわってもユニークに質問を特定するためのものでUUID推奨。<br>
    使えるtype(text,textarea,bool,number,select,multiselect)
    ex）<br>
    iijima氏は伝説だと思いますか？,aegaewggea8wg23e23a34,likert,3

    <!--
         <span><a v-bind:href=url>{{url}}</a></span>
    <ul v-for="ql in questionlist" class="list-group">
        {{ql}}
    </ul>
    <md-field>
    <label>質問</label>
    <md-input v-model="itemname"></md-input>
    </md-field>
    <md-field>
    <label>選択</label>
    <md-select >
        <md-option v-for="tn in typenames" value=tn>{{tn}}</md-option>
    </md-select>
    </md-field>

    <md-button class="md-icon-button" disabled>
        <md-icon>+</md-icon>
    </md-button>
    <br>
    <md-button class="md-raised md-primary">Primary</md-button>
    -->
</div>
</template>

<script>
import importCsv from "@/components/importcsv";

/*
rb
chkbox
choice
kijutu
*/

export default {
    name:"create",
    components:{
        importCsv
    },
    created:function(){
        console.log("created")
    },
    data () {
        return {
            typenames:["text","testarea","select"],
            questionlist:[],
            itemname:null,
            type:null,
            url:null,
            ref:null
        }
    },
    methods:{
        loadTextFromFile(ev) {
            const file = ev.target.files[0];
            const reader = new FileReader();
            reader.onload = e => this.$emit("load", e.target.result);
            reader.readAsText(file);

            console.log(reader)
        }
    }
}
</script>