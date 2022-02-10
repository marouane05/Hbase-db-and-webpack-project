require('file-loader?name=[name].[ext]!./assets/images/favicon.ico')
import printMe from './print';
import {v1 as uuid} from "uuid"; 


$(document).on("click", ".modalD",function(){
  var key = $(this).data('id');
  printMe("after"+key)
  $("#ajouterNoteM").find("input[name=studentId]").val(key);
  $("#ajouterNoteM").find("input[name=studentId]").text(key);
})

$(document).on("click", ".buttonDel",function(){
  var key = $(this).data('id');
  printMe("after"+key)
 SupprimerEtudiant(key);
})


$(function () {
  /*renderGraph();
  search();
*/

  getEtudiants();
  

  $("#ajouterEt").submit(e=>{
    e.preventDefault();
    insererEtudiant();

  })

  $("#ajouterNoteM").submit(e=>{
    e.preventDefault();
    insererLaNote();
  })
});



function insererEtudiant(){
  
  var id = uuid();
  var encodedId= btoa(id);
  var nom = $('#ajouterEt').find("input[name=nom]").val();
  var fil = $('#ajouterEt').find("input[name=fil]").val();
  let encodedColumnNom = btoa("etudiant:nom");
  let encodedColumnFil =btoa("etudiant:fil")

  printMe("nom"+btoa(nom)+" "+btoa(fil));
  var encodedNom = btoa(nom);
  var encodedfil = btoa(fil);
  var requestObjectStudent = {
    "Row":[{
      key:encodedId,
      Cell:[{
        column:encodedColumnNom,$:encodedNom
      },{
        column:encodedColumnFil,$:encodedfil
      }]

    }]
  }
  axios.post("/api/maro1/"+id,requestObjectStudent).then(
    (res)=>{
     if (res.status==200){
       printMe("created successfully");
       getEtudiants();
     } else {
       printMe("error in creation")
     }
    }
  )
}



function getEtudiants(){
  
  const t = $("table#results tbody").empty();
  axios.get("/api/maro1/*").then((res)=>{
    //printMe(JSON.stringify(res.data))

      res.data.Row.map(elem=>{
      printMe("key"+atob(elem.key))
      
          $( '<tr>' + 
          `<td class='movie'>${atob(elem.Cell[1].$)}</td>` + 
          `<td>${atob(elem.Cell[0].$)}</td>` +
          `<td ><button type="button"  class="modalD btn btn-secondary" data-toggle="modal" data-target="#exampleModal" data-id='${atob(elem.key)}'>Ajouter </button></td>` + 
          `<td><button class="buttonDel btn btn-danger" data-id='${atob(elem.key)}'>supprimer </button></td>` +
        '</tr>').appendTo(t).click(function() {

                                        afficherLesNotes(atob(elem.key));
                                  });
      
      })

  }).catch((err)=>{
    printMe(err)
  })


}
// encode base 64 btoa 
// decode base 64 atob



function insererLaNote(){
  var id = $('#ajouterNoteM').find("input[name=studentId]").val();;
  var encodedId= btoa(id);
  var note = $('#ajouterNoteM').find("input[name=note]").val();
  var module = $('#ajouterNoteM').find("input[name=module]").val();
  let encodedColumnNote = btoa("notes:"+module);
  printMe("note"+btoa(note)+" "+btoa(module));
  var encodedNote = btoa(note);
  var encodedModule = btoa(module);
  var requestObjectStudent = {
    "Row":[{
      key:encodedId,
      Cell:[{
        column:encodedColumnNote,$:encodedNote
      }]

    }]
  }
  axios.post("/api/maro1/"+id,requestObjectStudent).then(
    (res)=>{
     if (res.status==200){
       printMe("created successfully");
      // getEtudiants();
     } else {
       printMe("error in creation")
     }
    }
  )
}


function afficherLesNotes(key){
  const t = $("table#resultsNotes tbody").empty();
axios.get("/api/maro1/"+key+"/notes").then(
  res=>{
    printMe(JSON.stringify(res.data.Row[0].Cell))
    res.data.Row[0].Cell.map(elem=>{
    $( '<tr>' + 
        `<td class='movie'>${atob(elem.column)}</td>` + 
        `<td>${atob(elem.$)}</td>` +
      '</tr>').appendTo(t)
    })
  }
).catch(err=>{
  printMe(err)
})

}


function SupprimerEtudiant(key){
  
  // requete pour supprimer l'étudiant
  axios.delete("/api/maro1/"+key).then(res=>{
    if(res.status==200){
      printMe("bien supprimé")
      getEtudiants();
    } else {
      printMe("il y a un problème")
      alert("il ya un prb")
    }
  }).catch(err=>{
    printMe(err)
    alert(err)
  })
}