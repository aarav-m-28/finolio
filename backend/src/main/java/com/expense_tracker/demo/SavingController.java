package com.expense_tracker.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/savings")
@CrossOrigin(origins = "*")
public class SavingController {
    @Autowired
    private SavingService savingService;

    @PostMapping
    public Savings addSaving(@RequestBody Savings saving) {
        return savingService.addSaving(saving);
    }

    @PutMapping("/{id}")
    public void updateSaving(@PathVariable Long id, @RequestBody Savings saving) {
        savingService.updateSaving(id, saving);
    }

    @DeleteMapping("/{id}")
    public void deleteSaving(@PathVariable Long id) {
        savingService.deleteSaving(id);
    }

    @GetMapping("/user/{userId}")
    public List<Savings> getSavingsByUser(@PathVariable Long userId) {
        return savingService.getSavingsByUser(userId);
    }
}
