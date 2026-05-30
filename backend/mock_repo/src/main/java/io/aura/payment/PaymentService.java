package io.aura.payment;

public class PaymentService {

    private static double taxRate = 0.18;

    public double processPayment(String userId, double amount) {
        // BUG: No null check on userId - throws NullPointerException
        System.out.println("Processing for: " + userId.toUpperCase());

        // BUG: getCartItems returns 0 for guest users - ArithmeticException
        double perUnit = amount / getCartItems(userId);
        return perUnit * (1 + taxRate);
    }

    private int getCartItems(String userId) {
        if (userId.startsWith("guest")) return 0;
        return 3;
    }

    public void refund(String transactionId) {
        // BUG: No bounds check on split result
        String[] parts = transactionId.split("-");
        System.out.println("Refunding: " + parts[2]);
    }
}