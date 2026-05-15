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
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }

    @PutMapping("/{id}")
    public void updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        expenseService.updateExpense(id, expense);
    }

    @GetMapping("/user/{userId}")
    public List<Expense> getExpenses(@PathVariable Long userId) {
        return expenseService.getExpensesByUser(userId);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public List<Expense> getExpensesByType(@PathVariable Long userId, @PathVariable String type) {
        return expenseService.getExpensesByUserAndType(userId, type);
    }

}
