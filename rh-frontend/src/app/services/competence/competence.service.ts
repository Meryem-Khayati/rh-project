import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { Competence } from '../../models/Competence';


@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  basURL = "http://localhost:8088/competence-service/competences";


  constructor(private  http : HttpClient) { }

  getCompetences():Observable<any>{
    return this.http.get(this.basURL);
  }

  getCompetenceById(id: number):Observable<any>{
    return this.http.get(this.basURL+"/"+id)
  }

  addCompetence(competence :Competence):Observable<any>{ 
     return this.http.post(this.basURL + "/add", competence);
   }
   
  updateCompetence(id:number,competence :Competence):Observable<any>{
    return this.http.put(this.basURL+"/"+id,competence);
  }

  deleteCompetence(id :any):Observable<any>{
    console.log(id)
    return this.http.delete(this.basURL+'/'+id);
  }




  //  """""""""" utiliser pour recupere les competences apartir list des id
  getCompetencesByIds(ids: any):Observable<any>{
    return this.http.post(this.basURL+"/by-ids",ids)
  }
 
}
