package ma.ensa.competence_service.services;


import jakarta.transaction.Transactional;
import ma.ensa.competence_service.entities.Competence;
import ma.ensa.competence_service.feignClient.OffreClient;
import ma.ensa.competence_service.repositories.CompetenceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class CompetenceService implements CompetenceServiceInterface {
    private CompetenceRepository competenceRepository;
    private OffreClient offreClient;

    CompetenceService(CompetenceRepository competenceRepository,OffreClient offreClient1){
        this.competenceRepository = competenceRepository;
        this.offreClient = offreClient1;
    }
    @Override
    public List<Competence> getAllCompetence(){
        return competenceRepository.findAll();
    }
    @Override
    public Competence getCompetanceById(Long id){
        return competenceRepository.findById(id).orElse(null);
    }
    @Override
    public boolean existCompetence(Competence competence){
        return competenceRepository.existsByNomAndNiveau(
                competence.getNom(),
                competence.getNiveau());
    }
    @Override
    public Competence createCompetence(Competence competence){
        return competenceRepository.save(competence);
    }

    @Override
    public Competence updateCompetence(Long id , Competence newcompetence){
        Competence existingCompetence = competenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compétence non trouvée avec l'ID : " + id));
        existingCompetence.setNom(newcompetence.getNom());
        existingCompetence.setNiveau(newcompetence.getNiveau());
        return competenceRepository.save(existingCompetence);
    }


    @Override
    public void deleteCompetence(Long id) {
        if (!competenceRepository.existsById(id)) {
            throw new RuntimeException("Compétence non trouvée avec l'ID : " + id);
        }
        boolean res= offreClient.isCompetenceUsed(id);
        if(res){
            throw new RuntimeException("On peut pas supprime cette Compétence car elle se trouve dans un offre " );
        }
        competenceRepository.deleteById(id);
    }
    @Override
    public String getCompetenceNomById(Long id) {
        Competence existingCompetence = competenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compétence non trouvée avec l'ID : " + id));
        return existingCompetence.getNom();
    }

    @Override
    public List<Competence> getCompetencesByIds(List<Long> ids) {
        return competenceRepository.findByIdIn(ids);
    }


}
