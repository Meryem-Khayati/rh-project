package ma.ensa.candidature_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class CandidatureServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CandidatureServiceApplication.class, args);
	}

}
