import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Allow-Headers": "Content-type",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  })
};

@Injectable({
  providedIn: 'root'
})
export class JeuxDeMotService {

  private urlBase = "http://localhost:8888";

  constructor(private http:HttpClient) { }

  public getRelations(word:any): Observable<any> {
    return this.http.get(this.urlBase + '/getRelations/'+word);
  }

  public getDefinitions( word: any): Observable<any> {
    return this.http.get(this.urlBase + '/definition/'+word);
  }

  public getDefinitionsRaff( word: any): Observable<any> {
    return this.http.get(this.urlBase + '/definitionRaf/'+word);
  }

  public getTypeRelations(word:any): Observable<any>
  {
    return this.http.get(this.urlBase+'/getTypeRelation/'+word);
  }

  public getAutocomplete(word:any): Observable<any>
  {
    return this.http.get(this.urlBase+'/autocomplete/'+word);
  }

}
