package org.example.authservice.repository;

import org.example.authservice.enumeration.Role;
import org.example.authservice.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findFirstByRole(Role role);



}
