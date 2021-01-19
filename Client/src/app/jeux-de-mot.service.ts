import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JeuxDeMotService {

  private urlBase = "http://localhost:8888/";

  constructor(private http:HttpClient) { }

  public getRelations(): Observable<any> {
    return this.http.get(this.urlBase + 'relations');
  }
}
