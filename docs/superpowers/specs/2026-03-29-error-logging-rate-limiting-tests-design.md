# #659 Error Logging & Rate Limiting Test Coverage Design

## Overview

Comprehensive test coverage for error logging with context tracking and rate limiting enforcement across all contract operations. Tests only — no implementation changes.

## Scope

- **Chioma contract**: Extend `tests_errors.rs` (+8 tests) and `tests_rate_limit.rs` (+23 tests)
- **Payment/Escrow/Dispute Resolution contracts**: New `tests_rate_limit.rs` per contract (+5 tests each)
- **Total**: 46 new tests across 5 files (56 total including 10 existing, with existing 3 in `tests_errors.rs` and 7 in chioma's `tests_rate_limit.rs`)

## Approach

- Extend existing test files in chioma contract (follows project convention of feature-split test files)
- Create new `tests_rate_limit.rs` for payment, escrow, and dispute_resolution
- Other contracts only expose `check_rate_limit` + `get_rate_limit_config`, so they get a smaller focused test set
- Other contracts lack `set_rate_limit_config`, so tests use direct storage seeding (`env.as_contract`) to inject `RateLimitConfig` — matches existing pattern in `payment/src/tests.rs`

## Files Modified

| File | Action | Tests Added |
|------|--------|-------------|
| `contract/contracts/chioma/src/tests_errors.rs` | Extend | 8 |
| `contract/contracts/chioma/src/tests_rate_limit.rs` | Extend | 23 |
| `contract/contracts/payment/src/tests_rate_limit.rs` | Create | 5 |
| `contract/contracts/escrow/src/tests_rate_limit.rs` | Create | 5 |
| `contract/contracts/dispute_resolution/src/tests_rate_limit.rs` | Create | 5 |
| `contract/contracts/payment/src/lib.rs` | Modify | Add `mod tests_rate_limit;` |
| `contract/contracts/escrow/src/lib.rs` | Modify | Add `mod tests_rate_limit;` |
| `contract/contracts/dispute_resolution/src/lib.rs` | Modify | Add `mod tests_rate_limit;` |

## Section 1: Error Logging Tests (`chioma/src/tests_errors.rs`)

8 new tests added to the existing 3.

### test_error_log_context_fields

Log an error with specific operation and details. Retrieve via `get_error_logs`. Assert all 5 `ErrorContext` fields are populated correctly: `error_code`, `error_message`, `details`, `timestamp`, `operation`.

### test_error_log_timestamp

Set ledger timestamp to a known value via `env.ledger().with_mut()`. Log an error. Retrieve and verify `timestamp` matches the ledger timestamp exactly.

### test_error_log_operation_name

Log two errors with different operations: "create_agreement" and "make_payment". Retrieve all logs. Verify each log has the correct operation string stored and they are distinguishable.

### test_error_log_details_completeness

Log an error with a long detail string (~200 chars). Retrieve and verify the detail string is stored completely without truncation by comparing against the original.

### test_error_log_persistence

Log an error. Perform an unrelated contract operation (e.g., `set_rate_limit_config`). Retrieve error logs. Verify the original error is still present — confirms persistence across contract calls.

### test_error_log_various_types

Log errors from different error ranges:
- `AgreementNotFound` (code 13, core)
- `PaymentInsufficientFunds` (code 201, payment)
- `EscrowNotFound` (code 401, escrow)
- `RateLimitExceeded` (code 801, rate limiting)

Retrieve all logs. Verify each has the correct `error_code` and `error_message`.

### test_error_log_ordering

Log 5 errors with distinct operations ("op1" through "op5"). Retrieve all. Verify they are returned in chronological order (op1 first, op5 last).

### test_error_log_limit_returns_most_recent

Log 15 errors with incrementing detail strings ("error_0" through "error_14"). Retrieve with limit=5. Verify exactly 5 returned. Verify they are the most recent (indices 10-14, details "error_10" through "error_14").

## Section 2: Rate Limiting Tests (`chioma/src/tests_rate_limit.rs`)

23 new tests added to the existing 7. Uses existing `create_contract()` and `make_input()` helpers.

### Configuration & Querying

#### test_get_rate_limit_config_default

Call `get_rate_limit_config` before setting any config. Verify defaults: `max_calls_per_block=10`, `max_calls_per_user_per_day=100`, `cooldown_blocks=0`.

#### test_get_block_call_count

Set config with high limits. Make 3 calls via `create_agreement` (with different tenants to avoid daily limit). Call `get_block_call_count` for "create_agreement". Verify it returns 3.

### Boundary & Exact Limit

#### test_rate_limit_exact_boundary

Set `max_calls_per_user_per_day=5`, `max_calls_per_block=100`, `cooldown_blocks=0`. Make exactly 5 calls (different agreement IDs, same tenant). Verify all 5 succeed. Make 6th call. Verify it fails with `RateLimitExceeded`.

#### test_rate_limit_single_call

Set `max_calls_per_user_per_day=1`. Make 1 call. Verify success. Make 2nd call. Verify failure.

#### test_rate_limit_zero_daily_limit

Set `max_calls_per_user_per_day=0`. Attempt first call. Verify it fails immediately.

### Per-Function Independence

#### test_rate_limit_per_function

Set `max_calls_per_user_per_day=2`. Make 2 calls to `create_agreement`. Verify 3rd `create_agreement` fails. Verify that `get_user_call_count` for a different function name returns None (independent tracking). This test verifies that rate limit keys include the function name.

### Multi-User

#### test_rate_limit_independent_users

Set `max_calls_per_user_per_day=2`. User A (as tenant) makes 2 calls. User A's 3rd call fails. User B (as tenant) makes 1 call. Verify User B succeeds — limits are per-user.

#### test_rate_limit_block_limit_multi_user

Set `max_calls_per_block=2`, `max_calls_per_user_per_day=100`. User A makes 1 call. User B makes 1 call. User C attempts call. Verify User C fails — block limit is shared across all users.

#### test_rate_limit_user_call_count_per_user

User A makes 3 calls, User B makes 1 call. Verify `get_user_call_count` for User A returns `daily_count=3`. Verify `get_user_call_count` for User B returns `daily_count=1`.

### Cooldown

#### test_rate_limit_cooldown_partial_wait

Set `cooldown_blocks=10`. Make first call (succeeds). Advance 5 blocks. Attempt call (fails — only partial cooldown). Advance 5 more blocks (total 10). Attempt call (succeeds — cooldown met).

#### test_rate_limit_cooldown_exact_boundary

Set `cooldown_blocks=10`. Make first call. Advance exactly 10 blocks. Attempt second call. Verify it succeeds (cooldown = exactly the configured value).

#### test_rate_limit_multiple_cooldowns

Set `cooldown_blocks=5`. Make call 1 (succeeds). Advance 5 blocks. Make call 2 (succeeds — cooldown met). Immediately make call 3 (fails — new cooldown started from call 2). Advance 5 blocks. Make call 3 again (succeeds).

### Daily Reset

#### test_rate_limit_reset_exact_boundary

Set `max_calls_per_user_per_day=1`. Make 1 call. Advance exactly 17280 blocks. Make another call. Verify it succeeds (daily counter reset).

#### test_rate_limit_reset_partial_day

Set `max_calls_per_user_per_day=1`. Make 1 call. Advance 17279 blocks (one short of a day). Attempt call. Verify it fails (counter not yet reset).

### Admin Reset

#### test_reset_user_rate_limit_counter_zero

Make calls to increment user's count. Call `reset_user_rate_limit`. Call `get_user_call_count`. Verify it returns `None` (key removed from storage entirely).

#### test_reset_user_rate_limit_independent

User A and User B both make calls. Admin resets User A's limit. Verify `get_user_call_count` for User A is None. Verify `get_user_call_count` for User B is unchanged.

### Integration

#### test_rate_limit_error_logged_on_exceed

Exceed rate limit via `create_agreement` (capture the error). Explicitly call `log_error` with the `RateLimitExceeded` error, operation "create_agreement", and details describing the failure. Call `get_error_logs`. Verify a log entry exists with `error_code=801` and the correct operation.

Note: `log_error` is an explicit contract method, not automatically triggered by rate limit failure.

#### test_rate_limit_across_blocks

Set `max_calls_per_block=2`. Make 2 calls (block limit hit). Advance 1 block. Make another call. Verify it succeeds (block counter is per-block, resets on new block).

#### test_rate_limit_with_pause_state

Set rate limit config. Make 1 call (succeeds, increments counter). Pause contract. Attempt call. Verify it fails with `ContractPaused` (not `RateLimitExceeded` — pause check happens before rate limit). Unpause contract. Attempt call. Verify rate limit counter is still intact from before pause.

#### test_rate_limit_cooldown_and_daily_combined

Set `cooldown_blocks=5` and `max_calls_per_user_per_day=3`. Make call 1 (succeeds). Immediately make call 2 (fails — cooldown). Advance 5 blocks. Make call 2 (succeeds). Advance 5 blocks. Make call 3 (succeeds). Advance 5 blocks. Make call 4 (fails — daily limit, even though cooldown is met). Verifies both constraints enforced together.

### Edge Cases

#### test_rate_limit_high_limit

Set `max_calls_per_user_per_day=1000`, `max_calls_per_block=1000`. Make 50 calls (different agreement IDs, advancing blocks as needed). Verify all succeed.

#### test_rate_limit_zero_block_limit

Set `max_calls_per_block=0`. Attempt first call. Verify it fails immediately.

#### test_rate_limit_config_update

Set config with `max_calls_per_user_per_day=5`. Make 3 calls. Update config to `max_calls_per_user_per_day=3`. Attempt 4th call. Verify it fails (new limit applies retroactively to existing counter).

## Section 3: Cross-Contract Rate Limit Tests

New `tests_rate_limit.rs` for payment, escrow, and dispute_resolution contracts. Each gets 5 tests.

These contracts only expose `check_rate_limit` and `get_rate_limit_config` (no `set_rate_limit_config`, `get_user_call_count`, etc.). Tests inject `RateLimitConfig` via direct storage seeding using `env.as_contract()`, matching the existing pattern in `payment/src/tests.rs`.

### Per-Contract Test Set (identical structure, contract-specific error types)

#### test_rate_limit_config_default

Call `get_rate_limit_config` without seeding. Verify defaults: `max_calls_per_block=10`, `max_calls_per_user_per_day=100`, `cooldown_blocks=0`.

#### test_check_rate_limit_within_limit

Seed config with `max_calls_per_user_per_day=5`. Make 3 calls to a contract function. Verify all succeed (no rate limit error).

#### test_check_rate_limit_exceed_block

Seed config with `max_calls_per_block=2`. Make 3 calls in the same block. Verify 3rd fails with contract-specific `RateLimitExceeded`.

#### test_check_rate_limit_exceed_daily

Seed config with `max_calls_per_user_per_day=2`. Make 3 calls (advancing blocks between calls to avoid block limit). Verify 3rd fails with `RateLimitExceeded`.

#### test_check_rate_limit_cooldown

Seed config with `cooldown_blocks=10`. Make first call (succeeds). Attempt second call without advancing (fails with `CooldownNotMet`). Advance 10 blocks. Attempt again (succeeds).

### Contract-Specific Details

**Payment** (`payment/src/tests_rate_limit.rs`):
- Error type: `PaymentError::RateLimitExceeded`, `PaymentError::CooldownNotMet`
- Tests call `crate::rate_limit::check_rate_limit()` directly (pub module function, accessible within same crate)
- Config injected via `env.as_contract()` storage seeding
- Uses existing test setup patterns from `tests.rs`

**Escrow** (`escrow/src/tests_rate_limit.rs`):
- Error type: `EscrowError::RateLimitExceeded`, `EscrowError::CooldownNotMet`
- Tests call `crate::rate_limit::check_rate_limit()` directly
- Config injected via `env.as_contract()` storage seeding
- Uses existing test setup patterns from `tests.rs`

**Dispute Resolution** (`dispute_resolution/src/tests_rate_limit.rs`):
- Error type: `DisputeError::RateLimitExceeded`, `DisputeError::CooldownNotMet`
- Tests call `crate::rate_limit::check_rate_limit()` directly
- Config injected via `env.as_contract()` storage seeding
- Uses existing test setup patterns from `tests.rs`

## Test Patterns

All tests follow the established Soroban testing conventions:

```rust
// Environment setup
let env = Env::default();
env.mock_all_auths();

// Contract registration
let contract_id = env.register(Contract, ());
let client = ContractClient::new(&env, &contract_id);

// Ledger manipulation for timing
env.ledger().with_mut(|li| {
    li.sequence_number += 17280; // advance 1 day
    li.timestamp = 12345;
});

// Error testing via try_ methods
let result = client.try_create_agreement(&input);
assert!(result.is_err());

// Direct storage seeding (cross-contract tests)
env.as_contract(&client.address, || {
    env.storage().persistent().set(&DataKey::RateLimitConfig, &config);
});
```

## Non-Goals

- No implementation code changes
- No tests for functions that don't exist in other contracts (set_rate_limit_config, get_user_call_count, etc. on payment/escrow/dispute)
- No concurrent/parallel execution tests (Soroban tests are single-threaded)
