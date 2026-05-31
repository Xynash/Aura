import pytest
from main import (
    find_file_recursively,
    get_method_context,
    get_service_file,
    extract_source_from_message,
    should_trigger,
    qa_validate_fix,
    REPO_BASE_PATH
)

# ── Source linking ────────────────────────────────────────────────────────────

def test_find_auth_service():
    path = find_file_recursively(REPO_BASE_PATH, "AuthService.java")
    assert path is not None
    assert "AuthService.java" in path

def test_find_payment_service():
    path = find_file_recursively(REPO_BASE_PATH, "PaymentService.java")
    assert path is not None

def test_find_inventory_service():
    path = find_file_recursively(REPO_BASE_PATH, "InventoryService.java")
    assert path is not None

def test_find_nonexistent_file():
    path = find_file_recursively(REPO_BASE_PATH, "NonExistent.java")
    assert path is None

# ── AST parsing ───────────────────────────────────────────────────────────────

def test_get_method_context_returns_code():
    path = find_file_recursively(REPO_BASE_PATH, "AuthService.java")
    code, method = get_method_context(path, 8)
    assert code != "AST_PARSING_FAILED"
    assert len(code) > 0

def test_get_method_context_returns_method_name():
    path = find_file_recursively(REPO_BASE_PATH, "AuthService.java")
    _, method = get_method_context(path, 8)
    assert method != "Unknown"

# ── Pod → service mapping ─────────────────────────────────────────────────────

def test_pod_maps_to_auth():
    file, line = get_service_file("auth-gateway")
    assert file == "AuthService.java"

def test_pod_maps_to_payment():
    file, line = get_service_file("payment-api")
    assert file == "PaymentService.java"

def test_pod_maps_to_inventory():
    file, line = get_service_file("inventory-node")
    assert file == "InventoryService.java"

def test_unknown_pod_fallback():
    file, _ = get_service_file("unknown-service-xyz")
    assert file == "AuthService.java"

def test_partial_match_works():
    file, _ = get_service_file("payment-api-v2-abc123")
    assert file == "PaymentService.java"

# ── Stack trace parsing ───────────────────────────────────────────────────────

def test_extract_from_real_stack_trace():
    message = "at io.aura.AuthService.validateToken(AuthService.java:124)"
    file, line = extract_source_from_message(message, "auth-gateway")
    assert file == "AuthService.java"
    assert line == 124

def test_extract_fallback_to_pod_map():
    message = "Back-off restarting failed container"
    file, line = extract_source_from_message(message, "payment-api")
    assert file == "PaymentService.java"

# ── Debounce ──────────────────────────────────────────────────────────────────

def test_debounce_first_trigger_passes():
    # Use unique pod name so it's not in seen_pods
    result = should_trigger("test-pod-unique-abc123")
    assert result is True

def test_debounce_second_trigger_blocked():
    pod = "test-pod-debounce-xyz"
    should_trigger(pod)           # first — passes
    result = should_trigger(pod)  # second — blocked
    assert result is False

# ── QA validator ──────────────────────────────────────────────────────────────

def test_qa_passes_clean_code():
    clean = """
    public boolean validateToken(String token) {
        if (token != null && token.equals("secret")) return true;
        return false;
    }
    """
    result = qa_validate_fix(clean)
    assert result["passed"] is True
    assert result["score"] == 100

def test_qa_blocks_system_exit():
    dangerous = """
    public void shutdown() {
        System.exit(1);
    }
    """
    result = qa_validate_fix(dangerous)
    assert result["passed"] is False
    assert "System.exit" in result["violations"]

def test_qa_blocks_runtime_exec():
    dangerous = 'Runtime.getRuntime().exec("rm -rf /")'
    result = qa_validate_fix(dangerous)
    assert result["passed"] is False

def test_qa_score_decreases_per_violation():
    dangerous = """
    System.exit(1);
    Runtime.getRuntime().exec("cmd");
    """
    result = qa_validate_fix(dangerous)
    assert result["score"] < 100