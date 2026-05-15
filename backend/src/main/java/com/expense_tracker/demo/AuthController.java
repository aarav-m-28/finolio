package com.expense_tracker.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public void signup(@RequestBody User user) {
        authService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return authService.login(user.getName(), user.getPassword());
    }
}
