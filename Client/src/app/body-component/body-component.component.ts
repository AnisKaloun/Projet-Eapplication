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

  public researchIsDone: boolean = false;

  public relationsTypeList: any;

  public isRelEntrante: boolean = false;
  public isRelSortante: boolean = false;

  public raffinementsSem: any;

  public resultResearchList: any = [];

  public indexResultResearchList: any = 0;

  public searchWord = "Chat";
    
  public wordDef = "";

  constructor(private modalService: NgbModal, private JDMservice :JeuxDeMotService) { 
    //this.relationsKeysList = Object.keys(this.relationsTypeList);
  }


  ngOnInit() {
  }


  search() {
    this.searchWord = $(".input_search").val();
    this.resultResearchList = [];
    
    this.JDMservice.getDefinitions(this.searchWord).subscribe(res => {
      this.wordDef = res[0].defGlobal;
      
      this.showDefGenerale = true;
      
      if(res.length > 1) {
        this.raffinementsSem = res.slice(1);
        this.showRaffinements = true;
        
        this.JDMservice.getDefinitionsRaff(this.searchWord).subscribe(res => {
          if(res.length > 1)
            this.raffinementsSem = res.slice(1);      
        });

        this.showRaffinements = true;

        this.JDMservice.getTypeRelations(this.searchWord).subscribe(res => {
          this.relationsTypeList = res;
          this.showrelationsTypes = true;

          for (let relationType of this.relationsTypeList)
            relationType["isSelected"] = false;

          console.log(this.relationsTypeList);

          this.JDMservice.getRelations(this.searchWord).subscribe(res => {
            let index = 0;
            let arrayToAdd: any[] = new Array();
      
            for (let relation of res["Relations"][0]) {
              if (index == 25) {
                this.resultResearchList.push(arrayToAdd);
                arrayToAdd = new Array();
      
                index = 0;
              }
              
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

              arrayToAdd.push(relation);
      
              index += 1;
            }
      
            
            console.log(res["Entities"])
            console.log(res["Relations"][0]);
      
            this.researchIsDone = true; 
          });
        });
      }
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
      if(isNextArrow) {
        if (this.indexResultResearchList == this.resultResearchList.length - 1)
          this.indexResultResearchList = 0;
        else
          this.indexResultResearchList += 1;
      }
      else {
        if (this.indexResultResearchList == 0)
          this.indexResultResearchList = this.resultResearchList.length - 1;
        else
          this.indexResultResearchList -= 1;
      }
   }


   triAlphabetique() {

   }


   triPoids() {

  }


  validateFilters() {
    $("#filtres_modal").modal("hide");
  }
}
