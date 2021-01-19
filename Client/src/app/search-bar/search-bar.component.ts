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

  constructor(private JDMservice :JeuxDeMotService) { }

  ngOnInit(): void {
    this.JDMservice.getRelations().subscribe( Response =>
      {
        this.ListRelation=Response;
      }
    );
  }

  ShowOrHide()
  {
   if(this.div1)
   {
     this.div1=false;
   }
   else
   {
     this.div1=true;
   }

  }

  
}
