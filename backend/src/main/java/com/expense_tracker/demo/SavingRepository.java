package com.expense_tracker.demo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavingRepository extends JpaRepository<Savings, Long> {
    List<Savings> findByUserId(Long userId);
}
