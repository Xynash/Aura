package io.aura.inventory;

import java.util.HashMap;

public class InventoryService {

    private HashMap<String, Integer> stock = new HashMap<>();

    public InventoryService() {
        stock.put("item-001", 50);
        stock.put("item-002", 0);
    }

    public String checkStock(String itemId) {
        // BUG: stock.get() returns null for unknown itemId
        // Unboxing null Integer to int throws NullPointerException
        int quantity = stock.get(itemId);
        if (quantity == 0) return "OUT_OF_STOCK";
        return "IN_STOCK: " + quantity;
    }

    public void reserveItem(String itemId, int count) {
        // BUG: No existence check - stock.get() returns null
        stock.put(itemId, stock.get(itemId) - count);
        System.out.println("Reserved " + count + " of " + itemId);
    }
}