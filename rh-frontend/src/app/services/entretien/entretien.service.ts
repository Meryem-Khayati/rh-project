import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Entretien } from '../../models/Entretien';

@Injectable({
  providedIn: 'root'
})
export class EntretienService {
  basURL = "http://localhost:8088/entretien-service/api/entretiens";


  constructor(private  http : HttpClient) { }

  getEntretiensByIdcandidature(id:any):Observable<any>{
    return this.http.get(this.basURL+"/candidature/"+id);
  }


  getEntretienById(id: number):Observable<any>{
    return this.http.get(this.basURL+"/"+id)
  }

  addEntretien(entretien :Entretien):Observable<any>{ 
     return this.http.post(this.basURL + "/add", entretien);
   }
   
  updateEntretien(id:number,entretien :Entretien):Observable<any>{
    return this.http.put(this.basURL+"/"+id,entretien);
  }

  deleteEntretien(id :any):Observable<any>{
    console.log(id)
    return this.http.delete(this.basURL+'/'+id);
  }
}
