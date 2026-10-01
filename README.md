RH Microservices Platform
# Description du projet

Ce projet est une plateforme de gestion des ressources humaines basée sur une architecture microservices. Elle permet la gestion complète du cycle de recrutement :

* Offres d’emploi
* Candidatures
* Entretiens
* CV
* Compétences
* Candidats
* Recruteurs
* Administration des utilisateurs
# Objectif du projet

Ce projet vise à simuler un système réel de recrutement en entreprise avec une architecture moderne basée sur les microservices et une séparation claire entre backend et frontend.

# Fonctionnalités
## Recruteur
Créer et gérer des offres d’emploi
Consulter et gérer les candidatures
Planifier les entretiens
Gérer les CV des candidats
Évaluer les compétences
## Candidat
Créer un compte et gérer son profil
Parcourir les offres d’emploi
Postuler aux offres
Suivre les candidatures
Consulter les entretiens
## Administrateur
Gérer les utilisateurs (candidats / recruteurs)
Superviser la plateforme
# Architecture

## Le projet est basé sur une architecture microservices avec :

* service-config
* service-discovery
* service-proxy
* Service d’authentification
* Service utilisateur
* Service offres d’emploi
* Service candidatures
* Service entretiens
* Service compétences
* Service CV
## Sécurité
* Authentification via JWT (JSON Web Token)
* Sécurisation avec Spring Security
* Gestion des rôles (ADMIN / RECRUITER / CANDIDATE)
## Technologies utilisées
### Backend
* Java
* Spring Boot
* Spring Cloud
* Spring Security
* Hibernate / JPA
### Frontend
* Angular
* Tailwind CSS
### Base de données
* MySQL

## Outils
* IntelliJ IDEA
* Visual Studio Code
* Postman
* phpMyAdmin
* XAMPP
# Installation et exécution
## Cloner le projet
* git clone https://github.com/halimaEr/Microservices_RH_Project.git
* cd Microservices_RH_Project
### Backend (Spring Boot)
* chaque microservice dans IntelliJ IDEA
* Configurer la base de données MySQL dans application.properties
* Lancer les services un par un
### Frontend (Angular)
* cd frontend
* npm install
* ng serve

### Base de données
* Démarrer XAMPP
* Activer MySQL

