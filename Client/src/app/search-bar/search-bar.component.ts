import { Component, OnInit } from '@angular/core';
import { JeuxDeMotService } from '../jeux-de-mot.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  public  ListRelation=[];
  div1=true;
  mot :string="";
  public definition:string ="";
  public RaffArray: any[] = new Array();
  public RelTypeArray: any[] = new Array();

  ShowDefGenerale:boolean=false;
  ShowRaffinements: boolean=false;
  ShowTypeRelations: boolean=false;
  constructor(private JDMservice :JeuxDeMotService) { }

  ngOnInit(): void {
    
  }
  updateData(e :Event){

    const target = e.target as HTMLTextAreaElement;

    if(target.value!=null)
    {
    this.mot = target.value;
    console.log(this.mot);
    }
}
  chercherDef()
  {
  this.JDMservice.getDefinitions(this.mot).subscribe(res =>{
    
    this.definition=res[0].defGlobal;
    console.log(this.definition);
    this.ShowDefGenerale=true;
    if(res.length>1)
    {
      this.RaffArray=res;
      this.RaffArray=this.RaffArray.slice(1);
      this.ShowRaffinements=true;
      this.JDMservice.getDefinitionsRaff(this.mot).subscribe(res =>{
      console.log("je suis la");
      if(res.length>1)
      {
      this.RaffArray=res;
      this.RaffArray=this.RaffArray.slice(1);    
      console.log(" "+res[1].definition);
      }
      });
      this.JDMservice.getTypeRelations(this.mot).subscribe(res=>{
        this.RelTypeArray=res;
        this.ShowTypeRelations=true;
      });
    }
  });

  this.JDMservice.getRelations(this.mot).subscribe(res=>{

  });
  }

  showDef(def: { show: boolean; value: any; }){
    if(def.show===false){
        def.show=true;   
    }else{
        def.show=false;
    }
}

showType(type: { clicked: boolean; description: any; }){
  if(type.clicked===false){
    type.clicked=true;   
    console.log(type.description);
  }else{
    type.clicked=false;
  }
}



    
}
