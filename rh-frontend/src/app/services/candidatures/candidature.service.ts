import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

  basURL = "http://localhost:8088/candidature-service/candidatures";


  constructor(private  http : HttpClient) { }

  getCandidaturesByOffreID( offreid: number):Observable<any>{
    return this.http.get(this.basURL+"/offres/"+offreid);
  }

  getCvByCandidatId(id: number):Observable<any>{
    return this.http.get(this.basURL+"/cv/candidat/"+id)
  }
  getStatistiqueRecruteur(id: number):Observable<any>{
    return this.http.get(this.basURL+"/recruteur/"+id)
  }

  accepterCandidature(id :any,formdata:any):Observable<any>{ 
     return this.http.post(this.basURL + "/"+id+"/accepter",formdata );
   }
   refuserCandidature(id :any,formdata:any):Observable<any>{ 
    return this.http.post(this.basURL + "/"+id+"/refuser",formdata );
   }
   addCandidature(candidature :any):Observable<any>{ 
    return this.http.post(this.basURL + "/add",candidature );
   }
   
 
}
