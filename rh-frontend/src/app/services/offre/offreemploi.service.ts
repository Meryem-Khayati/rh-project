import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { OffreEmploi } from '../../models/OffreEmploi';


@Injectable({
  providedIn: 'root'
})
export class OffreemploiService {
  basURL = "http://localhost:8088/offreemploi-service/offres";

  constructor(private  http : HttpClient) { }

  
  getOffres():Observable<any>{
    return this.http.get(this.basURL);
  }

  getOffreById(id: number):Observable<any>{
    return this.http.get(this.basURL+"/"+id)
  }
  getOffresDetails():Observable<any>{
    return this.http.get(this.basURL+"/details")
  }

  getOffreByRecruteurID(id: number):Observable<any>{
    return this.http.get(this.basURL+"/recruteur/"+id)
  }
  getContrat():Observable<any>{
    return this.http.get(this.basURL+"/contrat")
  }

  addOffre(offre :OffreEmploi):Observable<any>{ 
     return this.http.post(this.basURL + "/add", offre);
   }
   
  updateOffre(id:number,offre :OffreEmploi):Observable<any>{
    return this.http.put(this.basURL+"/"+id,offre);
  }

  deleteOffre(id :any):Observable<any>{
    console.log(id)
    return this.http.delete(this.basURL+'/'+id);
  }
  desactiverOffre(id :any):Observable<any>{
    console.log(id)
    return this.http.patch(this.basURL+'/desactiver/'+id,{});
  }


}
