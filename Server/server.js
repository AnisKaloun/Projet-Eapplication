const { response } = require('express');
const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
app.listen(8888);

console.log("Dans le serveur");


    //get la definition du mot et les raffinements
    app.get("/definition/:word",(req, res) => {
     let word =req.params.word;
     //console.log("je cherche la definition du mot "+word);

     if (fs.existsSync("./cache/definition/" + word)) {
        //console.log("la definition existe sur le cache : "+word);
        fs.readFile("./cache/definition/" + word,function read(err, data) {
            let result = data.toString("utf8");
            res.end(result);
          });
      }
      else
      {
        //console.log("la definition n'existes pas sur le cache :"+word);

        http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel="+word+"&rel=?gotermsubmit=Chercher&gotermrel="+word+"&rel=1",(response)=>
        {
          response.setEncoding('binary');
          //console.log("je fait une requete http vers JDM");
           let resp=''; 

           response.on('data', (Block) => {
            resp += Block;
          });

          response.on('end',()=>{
            const regexEid=/(\(eid=[0-9]+\))/gs;
            const regex =/(<def>|<DEF>).*(<\/def>|<\/DEF>)/gs;
            const regex2 = /(\<[(|\/)a-z|A-Z( )*]+\>)/gs;
            const regexRafinement = /([a-z|A-Z]*>[0-9]*')/gm;
            const regexRafinementFormated = /([a-z|A-Z]*>[a-z|A-Z|À-ÿ| ]*')/gm;

          
            //on cherche la definition principale
            let definition = resp.match(regex);
            let eid=resp.match(regexEid);
            console.log("eid = "+ eid);
            //eid=eid[0].replace('(eid=','');
            //eid=eid[0].replace(')','');
            eid=eid[0].substring(5,(eid[0].length-1));
            definition=definition[0].replace(regex2,'');
            let obj=[
              {
                "id":"",
                "defGlobal":""
              }
          ];

            obj[0].defGlobal=definition;
            obj[0].id=eid;

              //on cherche les raffinement
              let motRaf = resp.toString("utf8").match(regexRafinement);
              let formRaf=resp.toString("utf8").match(regexRafinementFormated);
              if(motRaf!=null && motRaf.length>0)
              {
              for (var i = 0; i < motRaf.length; i++) {
                let Rafin={
                  "formatedRaf":"",
                  "codeRaf":"",
                  "definition":"",
                  "show":false
                }
                motRaf[i] = motRaf[i].slice(0, -1);
                formRaf[i] = formRaf[i].slice(0, -1);
                //console.log("code rafinement : "+formRaf[i]);
                //console.log("rafinement : " + motRaf[i]);
                Rafin.formatedRaf=formRaf[i];
                Rafin.codeRaf=motRaf[i];
                obj.push(Rafin);
              }
            }
            fs.writeFile("./cache/definition/"+word, JSON.stringify(obj), {
                flag: 'w'
              }, (err) => {
                if (err) throw err;

                //console.log("on ecrit la definition et les rafinements de"+word+" sur le cache");
                res.end(JSON.stringify(obj));

              });


          });
  

        });

      }
    
    });

    //chercher la definition des raffinements
    app.get("/definitionRaf/:word",(req,res)=>
    {
      let word =req.params.word;
     //console.log("je cherche la definition du rafinement du mot "+word);

     if (fs.existsSync("./cache/definition/" + word)) {
       //console.log("chat présent");
        //console.log("la definition existe sur le cache : "+word);
        fs.readFile("./cache/definition/" + word,function read(err, data) {
            let result =JSON.parse(data.toString("utf8"));
            let compteur=1;
            ////console.log("on recupere le cache "+result);
            for( var i=1;i<result.length;i++)
            {
              if(result[i].definition=="")
              {
                //console.log("je rentre dans le if");
                //console.log("la relation : " +result[i].codeRaf);
                let recherche=result[i].codeRaf;
                recherche.replace(">","%3E");
                //console.log("i :"+i);
                //definition du raffinement pas encore fetch
                http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel="+recherche+"&rel=1",(response)=>
                {
                  response.setEncoding('binary');
                  let data = '';
  
                  response.on('data', (res) => {
                    data += res;
                  });
                  response.on('end', () => {
                    const regex =/(<def>|<DEF>).*(<\/def>|<\/DEF>)/gs;
                    const regex2 = /(\<[(|\/)a-z|A-Z( )*]+\>)/gs;

                    let definition = data.match(regex);
                    //console.log(definition);
                    definition=definition[0].replace(regex2,'');
                  //  console.log("i :"+i);
                    //console.log("definition "+definition+ "pour la relation "+recherche);
                    let findelement=result.findIndex(el=>el.codeRaf==recherche);
                    result[findelement].definition=definition;
                  // console.log(result[findelement].codeRaf+" ****"+ result[findelement].definition);
                    //result[i].definition=definition;
                    compteur++;
                    //console.log("compteur : "+compteur+" result length "+result.length);
                    if(compteur==(result.length))
                  {
                    ////console.log("je rentre içi");
                    //console.log("resultat "+JSON.stringify(result));
                  fs.writeFile("./cache/definition/"+word, JSON.stringify(result), {
                    flag: 'w'
                  }, (err) => {
                    if (err) throw err;
      
                   // res.end(JSON.stringify(obj));
                    fs.readFile("./cache/definition/" + word,function read(err, data) {
                    let resultat = data.toString("utf8");
                    //console.log("envoie des resultats");
                    res.end(resultat);
                  });
                  
                  });
                } 
                  });
                  
                });

              }
              
            }
                      
          });
      }
    });

    // avoir les types de relations associees à un mot
    app.get("/getTypeRelation/:word", (req, res) => {

      //console.log("on recupere les types de relations");
      //check si dans le cache
      
      let word = escape(req.params.word);
      
      //on vérifie le cache içi
      if (fs.existsSync("./cache/TypeRelation/" + word)) {
        //console.log("les types de relation existe sur le cache : "+word);
        fs.readFile("./cache/TypeRelation/" + word,function read(err, data) {
            let result = data.toString("utf8");
            res.end(result);
          });
      }
      else{
  
        http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
          word + "&rel=36?gotermsubmit=Chercher&gotermrel=" + word +
          "&rel=", (resp) => {
            resp.setEncoding('binary');
            let data = '';
            resp.on('data', (chunk) => {
              data += chunk;
            });
            resp.on('end', () => {
            const regex = /(rt;[0-9]+;.*)/gm;
            //console.log(data.match(regex));
            var relationstypes = data.match(regex);
            var RelationsTypesArray = new Array();
            for(var s of relationstypes){
              //console.log("type de relation : "+s+"\n");
              var relationtype = {
                id    :s.split(";")[1],
                name  :s.split(";")[3].replace(/'/g,''),
                description   :s.split(";")[4],
                clicked : false     
             };
              var rez = s.split(";")[1]+" "+s.split(";")[3];
              //console.log(rez);
              RelationsTypesArray.push(relationtype);
          }
          
          fs.writeFile("./cache/TypeRelation/"+word, JSON.stringify(RelationsTypesArray), {
            flag: 'w'
          }, (err) => {
            if (err) throw err;

            //console.log("on ecrit la les types de relation de "+word+" sur le cache");
            res.end(JSON.stringify(RelationsTypesArray));
          });

        });
      });
    }
  });
  
    // avoir toutes les relations et les noeuds associées  à ce mot 
    app.get("/getRelations/:word/", (req, res) => {

    let word= req.params.word;

    console.log("on cherche les relations du mots:"+word);
    
     if (fs.existsSync("./cache/Relation/" + word)) {
        console.log("la relation du mot suivant existe sur le cache : "+word);
        fs.readFile("./cache/Relation/" + word,function read(err, data) {
            let result = data.toString("utf8");
            res.end(result);
          });
      }
      else{
  
        http.get("http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=" +
        word + "&rel=?gotermsubmit=Chercher&gotermrel=" + word +
        "&rel=", (resp) => {
          resp.setEncoding('binary');
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });
          resp.on('end', () => {
            //objet à envoyé
            var resASend = {              
              Entities: [], 
              Relations: []
            }; 
            //expression régulieres pour les noeuds associées
            const regexEntities = /(e;[0-9]+;.*)/gm;
            var entitiesNodes = data.match(regexEntities);
            var nodesEntitiesArray = new Array();

            //expression régulieres pour les relations associées
            const regexRelations = /(r;[0-9]+;.*)/gm;
            var relationNodes = data.match(regexRelations);
            var nodesRelationsArray = new Array();

          //extractions des relations
          for(var s of relationNodes){ 
           // console.log(s+"\n");

            var node = {
              idSource : s.split(";")[2],
              idTarget : s.split(";")[3],
              idTypeRelation : s.split(";")[4],
              poids : s.split(";")[5],
              }
              
              nodesRelationsArray.push(node);
          } 

          for(var s of entitiesNodes){
           
            var node = {
              id : s.split(";")[1],
              name : s.split(";")[2].replace(/'/g,'')
              }
  
              nodesEntitiesArray.push(node);
          } 
          resASend.Entities.push(nodesEntitiesArray);
          resASend.Relations.push(nodesRelationsArray);
  
          fs.writeFile("./cache/Relation/"+word, JSON.stringify(resASend), {
            flag: 'w'
          }, (err) => {
            if (err) throw err;

            res.end(JSON.stringify(resASend));
          });
      });
    });      
  }
  });


  

  