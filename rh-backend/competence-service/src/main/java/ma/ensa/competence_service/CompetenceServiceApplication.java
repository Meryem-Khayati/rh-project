package ma.ensa.competence_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class CompetenceServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CompetenceServiceApplication.class, args);
	}

}
