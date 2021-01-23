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
  ShowDefGenerale:boolean=false;
  ShowRaffinements: boolean=false;

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
    console.log(res.defGlobal);
    this.definition=res[0].defGlobal;
    this.ShowDefGenerale=true;
    if(res.length>1)
    {
      this.RaffArray=res;
      this.RaffArray=this.RaffArray.slice(1);
      this.RaffArray = this.RaffArray.map(function(o) {
        o.show = false;
        return o;
      })
      this.ShowRaffinements=true;
      this.JDMservice.getDefinitionsRaff(this.mot).subscribe(res =>{
      if(res.length>1)
      {
      console.log("j'ai les resultats");
      this.RaffArray=res;
      this.RaffArray=this.RaffArray.slice(1);    
      console.log(" "+res[1].definition);
      }
      });
    }
  });
  }

  showDef(def: { show: boolean; value: any; }){
    if(def.show===false){
        def.show=true;   
    }else{
        def.show=false;
    }
}


  

  
}
