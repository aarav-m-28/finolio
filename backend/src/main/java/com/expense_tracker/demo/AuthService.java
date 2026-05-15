package com.expense_tracker.demo;

import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public void register(User user) {
        String hashed = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        user.setPassword(hashed);

        userRepository.save(user);
    }

    public User login(String name, String password) {
        Optional<User> userOpt = userRepository.findByName(name);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (BCrypt.checkpw(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

}
