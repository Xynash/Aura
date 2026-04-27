package io.aura;

public class AuthService {
    public boolean validateToken(String token) {
        System.out.println("Validating token...");
        
        // BUG: Potential NullPointerException if token is null
        if (token.equals("secret-key")) { 
            return true;
        }
        return false;
    }
}