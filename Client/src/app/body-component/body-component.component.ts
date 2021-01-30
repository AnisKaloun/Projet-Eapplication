import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JeuxDeMotService } from '../jeux-de-mot.service';
 
declare var $: any;
 
@Component({
  selector: 'app-body-component',
  templateUrl: './body-component.component.html',
  styleUrls: ['./body-component.component.css']
})
export class BodyComponentComponent implements OnInit {
 
  public showDefGenerale: boolean = false;
  public showRaffinements: boolean = false;
  public showrelationsTypes: boolean = false;
  
  public rafFound: boolean = true;

  public researchIsDone: boolean = false;
 
  public relationsTypeList: any;
  public filtersList: any = [];
 
  public isRelEntrante: boolean = false;
  public isRelSortante: boolean = false;
 
  public raffinementsSem: any;
 
  public resultResearchList: any = [];
  public resultResearchListToPrint: any = [];
 
  public indexResultResearchList: any = 0;
 
  public searchWord = "Chat";
 
  public wordDef = "";
 
  constructor(private modalService: NgbModal, private JDMservice :JeuxDeMotService) { 
    
  }
 
 
  ngOnInit() {
  }
 
 
  search() {
    this.searchWord = $(".input_search").val();

    this.showDefGenerale = false;
    this.showRaffinements = false;
    this.showrelationsTypes = false;
    this.rafFound = true;
    this.researchIsDone = false;

    this.resultResearchList = [];
    this.relationsTypeList = [];
    this.filtersList = [];
    this.raffinementsSem = [];

    this.indexResultResearchList = 0;
 
    this.JDMservice.getDefinitions(this.searchWord).subscribe(res => {
      console.log(res);
      if (res[0].defGlobal.length == 0)
        this.wordDef = "Aucune description générale pour ce mot";
      else 
        this.wordDef = res[0].defGlobal;
 
      this.showDefGenerale = true;

      this.raffinementsSem = res.slice(1);
      
      if(res[0]["rafFound"]) {
        this.JDMservice.getDefinitionsRaff(this.searchWord).subscribe(res => {
          console.log(res);
          if(res.length > 1)
            this.raffinementsSem = res.slice(1);   
        });
      }
      else
        this.rafFound = false;

      this.showRaffinements = true;

      this.JDMservice.getTypeRelations(this.searchWord).subscribe(res => {
        this.relationsTypeList = res;
        this.showrelationsTypes = true;

        for (let relationType of this.relationsTypeList)
          relationType["isChecked"] = false;

        this.JDMservice.getRelations(this.searchWord).subscribe(res => {
          let arrayToAdd: any[] = new Array();
          
          for (let relation of res["Relations"][0]) {
            for (let relationType of this.relationsTypeList) {
              if (relation["idTypeRelation"] == relationType["id"]) {
                relation["relationType"] = relationType["name"];

                break;
              }
            }

            let isSource = false;
            let isTarget = false;

            for (let entitie of res["Entities"][0]) {
              if (relation["idSource"] == entitie["id"]) {
                relation["source"] = entitie["name"];

                isSource = true;
              }

              else if (relation["idTarget"] == entitie["id"]) {
                relation["target"] = entitie["name"];

                isTarget = true;
              }

              if (isSource && isTarget)
                break;
            }

            if (arrayToAdd.length == 0)
              arrayToAdd.push(relation);
            else {
              let isPushed = false;

              for (let i = 0 ; i < arrayToAdd.length ; i++) {
                //console.log(typeof(parseInt(arrayToAdd[i]["poids"], 10)))
                if (1 * arrayToAdd[i]["poids"] < 1 * relation["poids"]) {
                  arrayToAdd.splice(i, 0, relation);

                  isPushed = true;

                  break;
                }
              }

              if (!isPushed)
                arrayToAdd.push(relation);
            }  
          }

          //for (let element of arrayToAdd)
            //console.log(element);

          while (arrayToAdd.length)
            this.resultResearchList.push(arrayToAdd.splice(0, 25))
          
          this.resultResearchListToPrint = this.resultResearchList;

          this.researchIsDone = true; 
        });
      });
    });
  }
 
 
  openModal(raffinement: any, raffinementDef: any) {
      $("#raffinementModalTitle").text(raffinement);
      
      if (raffinementDef.length == 2)
        $("#raffinementModalText").text("Pas de description disponible pour ce raffinement :(");
      else
        $("#raffinementModalText").text(raffinementDef);
 
      $("#raffinement_modal").modal("show");
   }
 
 
  arrowClick(isNextArrow: boolean) {
    if (this.indexResultResearchList != -1) {
      if(isNextArrow) {
        if (this.indexResultResearchList == this.resultResearchListToPrint.length - 1)
          this.indexResultResearchList = 0;
        else
          this.indexResultResearchList += 1;
      }
      else {
        if (this.indexResultResearchList == 0)
          this.indexResultResearchList = this.resultResearchListToPrint.length - 1;
        else
          this.indexResultResearchList -= 1;
      }
    } 
  }
 
 
  triPoids() {
    console.log(this.resultResearchListToPrint);
    let localResultResearchListToPrint = this.resultResearchListToPrint;

    let firstIndex = 0;
    let secondIndex = 0;

    let greaterNb = -100000;

    let iToRemove = 0;
    let kToRemove = 0;

    let nbRelations = 0; 

    if (this.resultResearchListToPrint.length == 1)
      nbRelations = this.resultResearchListToPrint[0].length;
    else
      nbRelations = (this.resultResearchListToPrint.length - 1) * 25 + this.resultResearchListToPrint[this.resultResearchListToPrint.length - 1].length;
    
    for (let j = 0 ; j < nbRelations ; j++) {
      for (let i = 0; i < localResultResearchListToPrint.length ; i++) {
        for (let k = 0; k < localResultResearchListToPrint[i].length ; k++) {
          //console.log(localResultResearchListToPrint[i][k]);
          if (localResultResearchListToPrint[i][k]["poids"] > greaterNb) {
            greaterNb = localResultResearchListToPrint[i][k]["poids"];
  
            iToRemove = i;
            kToRemove = k;
          }
        }
      }
      //console.log(greaterNb);
      this.resultResearchListToPrint[firstIndex][secondIndex] = localResultResearchListToPrint[iToRemove][kToRemove];
      localResultResearchListToPrint[iToRemove].splice(kToRemove, 1);
      //console.log(localResultResearchListToPrint[iToRemove]);
      console.log("i : " + iToRemove, " - k : " + kToRemove);
  
      secondIndex += 1;
  
      if (secondIndex == 25) {
        secondIndex = 0;
        firstIndex += 1;
      }
    }
  }


  clickRelEntranteFilter() {
    this.isRelEntrante = !this.isRelEntrante; 
 
    if (this.isRelSortante) 
      this.isRelSortante = !this.isRelSortante;
  }
 
 
  clickRelSortanteFilter() {
    this.isRelSortante = !this.isRelSortante; 
 
    if (this.isRelEntrante) 
      this.isRelEntrante = !this.isRelEntrante;
  }
 
 
  clickCheckboxFilter(name: String, isChecked: boolean) {
    console.log(name + " " + isChecked);
 
    if (isChecked)
      this.filtersList.push(name);
    else {
      for (let i = 0; i < this.filtersList.length ; i++)
        if (this.filtersList[i] == name)
          this.filtersList.splice(i, 1);
    }
  }
 
 
  validateFilters() {
    $("#filtres_modal").modal("hide");
 
    this.indexResultResearchList = 0;
 
    if (this.filtersList.length > 0 || this.isRelEntrante || this.isRelSortante) {
      this.resultResearchListToPrint = [];
 
      let index = 0;
      let arrayToAdd: any[] = new Array();
 
      for (let resultList of this.resultResearchList) { 
        for (let result of resultList) {
          if (index == 25) {
            this.resultResearchListToPrint.push(arrayToAdd);
            arrayToAdd = new Array();
 
            index = 0;
          } 
 
          if (!this.isRelEntrante && !this.isRelSortante) {
            for (let filter of this.filtersList) {
              if (filter == result["relationType"]) {
                arrayToAdd.push(result);
 
                index += 1;
 
                break;
              }  
            }
          } 
          else if(this.filtersList.length > 0 
            && ((this.isRelEntrante && result["source"] == this.searchWord)
            || (this.isRelSortante && result["target"] == this.searchWord))) {
              for (let filter of this.filtersList) {
                if (filter == result["relationType"]) {
                  arrayToAdd.push(result);
 
                  index += 1;
 
                  break;
                }  
              }
          }
          else if ((this.isRelEntrante && result["source"] == this.searchWord)
          || (this.isRelSortante && result["target"] == this.searchWord)) {
            arrayToAdd.push(result);
 
            index += 1;
          }
        } 
      }
 
      if (this.resultResearchListToPrint.length == 0)
        this.indexResultResearchList = -1;
    }
    else {
      this.resultResearchListToPrint = this.resultResearchList;
 
      this.indexResultResearchList = 0;
    } 
  }
}