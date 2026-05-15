package com.expense_tracker.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SavingService {
    @Autowired
    private SavingRepository savingRepository;

    public List<Savings> getSavingsByUser(Long userId) {
        return savingRepository.findByUserId(userId);
    }

    public Savings addSaving(Savings saving) {
        return savingRepository.save(saving);
    }

    public void deleteSaving(Long id) {
        if (savingRepository.existsById(id)) {
            savingRepository.deleteById(id);
        }
    }

    public Savings updateSaving(Long id, Savings updatedSaving) {
        if (savingRepository.existsById(id)) {
            updatedSaving.setId(id);
            return savingRepository.save(updatedSaving);
        }
        return null;
    }
}
