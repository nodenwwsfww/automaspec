-- Drop tables if they exist (to recreate clean structure)
DROP TABLE IF EXISTS test;
DROP TABLE IF EXISTS test_requirement;
DROP TABLE IF EXISTS test_spec;
DROP TABLE IF EXISTS test_category;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS test_category (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    description TEXT,
    parent_category_id TEXT,
    'order' INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS test_spec (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    description TEXT,
    test_category_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (test_category_id) REFERENCES test_category(id)
);

CREATE TABLE IF NOT EXISTS test_requirement (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    description TEXT,
    'order' INTEGER NOT NULL DEFAULT 0,
    test_spec_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (test_spec_id) REFERENCES test_spec(id)
);

CREATE TABLE IF NOT EXISTS test (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'pending',
    framework TEXT DEFAULT 'Vitest',
    code TEXT,
    test_requirement_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (test_requirement_id) REFERENCES test_requirement(id)
);

-- Clear existing data
DELETE FROM test;
DELETE FROM test_requirement;
DELETE FROM test_spec;
DELETE FROM test_category;

-- Insert test categories (папки)
INSERT INTO test_category (id, name, title, description, parent_category_id, 'order', created_at, updated_at) VALUES 
('cat-1', 'Shopping Cart', 'Shopping Cart', 'Shopping cart functionality', NULL, 1, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('cat-2', 'Payment', 'Payment', 'Payment processing functionality', NULL, 2, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('cat-3', 'Authentication', 'Authentication', 'User authentication functionality', NULL, 3, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('cat-4', 'API Tests', 'API Tests', 'Backend API testing', NULL, 4, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test specs (файлики) - конкретные тестовые файлы
INSERT INTO test_spec (id, name, title, description, test_category_id, created_at, updated_at) VALUES 
('spec-1', 'add-to-cart.spec.ts', 'Add to Cart Tests', 'Tests for adding items to cart', 'cat-1', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('spec-2', 'cart-persistence.spec.ts', 'Cart Persistence Tests', 'Tests for cart data persistence', 'cat-1', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('spec-3', 'payment-methods.spec.ts', 'Payment Method Tests', 'Tests for payment method selection', 'cat-2', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('spec-4', 'payment-processing.spec.ts', 'Payment Processing Tests', 'Tests for payment processing flow', 'cat-2', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('spec-5', 'login.spec.ts', 'Login Tests', 'User login functionality tests', 'cat-3', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('spec-6', 'registration.spec.ts', 'Registration Tests', 'User registration tests', 'cat-3', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('spec-7', 'users-api.spec.ts', 'Users API Tests', 'API tests for user management', 'cat-4', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('spec-8', 'products-api.spec.ts', 'Products API Tests', 'API tests for product management', 'cat-4', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements for add-to-cart.spec.ts
INSERT INTO test_requirement (id, text, description, 'order', test_spec_id, created_at, updated_at) VALUES 
('req-1', 'User should be able to add items to cart', 'Adding products to shopping cart', 1, 'spec-1', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-2', 'User should be able to remove items from cart', 'Removing products from shopping cart', 2, 'spec-1', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-3', 'User should be able to update item quantity', 'Changing product quantity in cart', 3, 'spec-1', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements for cart-persistence.spec.ts
INSERT INTO test_requirement (id, text, description, 'order', test_spec_id, created_at, updated_at) VALUES 
('req-4', 'Cart should persist across sessions', 'Cart items should be saved when user logs out and in', 1, 'spec-2', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-5', 'Cart should show correct total price', 'Total price calculation including taxes and discounts', 2, 'spec-2', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements for payment-methods.spec.ts
INSERT INTO test_requirement (id, text, description, 'order', test_spec_id, created_at, updated_at) VALUES 
('req-6', 'User should be able to select payment method', 'Choose between credit card, PayPal, etc.', 1, 'spec-3', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-7', 'User should be able to enter payment details', 'Credit card form validation and processing', 2, 'spec-3', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements for payment-processing.spec.ts
INSERT INTO test_requirement (id, text, description, 'order', test_spec_id, created_at, updated_at) VALUES 
('req-8', 'Payment should be processed successfully', 'Successful payment transaction flow', 1, 'spec-4', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-9', 'User should receive payment confirmation', 'Email and on-screen confirmation after payment', 2, 'spec-4', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-10', 'Failed payments should be handled gracefully', 'Error handling for declined cards or failed transactions', 3, 'spec-4', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements for login.spec.ts
INSERT INTO test_requirement (id, text, description, 'order', test_spec_id, created_at, updated_at) VALUES 
('req-11', 'User should be able to login with email and password', 'Standard email/password authentication', 1, 'spec-5', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-12', 'User should be able to reset password', 'Password reset via email link', 2, 'spec-5', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-13', 'User session should expire after inactivity', 'Automatic logout after session timeout', 3, 'spec-5', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-14', 'User should be able to logout', 'Manual logout functionality', 4, 'spec-5', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements for registration.spec.ts
INSERT INTO test_requirement (id, text, description, 'order', test_spec_id, created_at, updated_at) VALUES 
('req-15', 'User should be able to register new account', 'User registration with email verification', 1, 'spec-6', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-16', 'Registration should validate email format', 'Email validation during registration', 2, 'spec-6', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements for users-api.spec.ts
INSERT INTO test_requirement (id, text, description, 'order', test_spec_id, created_at, updated_at) VALUES 
('req-17', 'API should create new user', 'POST /api/users endpoint', 1, 'spec-7', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-18', 'API should retrieve user by ID', 'GET /api/users/:id endpoint', 2, 'spec-7', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-19', 'API should update user profile', 'PUT /api/users/:id endpoint', 3, 'spec-7', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-20', 'API should delete user account', 'DELETE /api/users/:id endpoint', 4, 'spec-7', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements for products-api.spec.ts
INSERT INTO test_requirement (id, text, description, 'order', test_spec_id, created_at, updated_at) VALUES 
('req-21', 'API should list all products', 'GET /api/products endpoint', 1, 'spec-8', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-22', 'API should create new product', 'POST /api/products endpoint', 2, 'spec-8', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-23', 'API should update product details', 'PUT /api/products/:id endpoint', 3, 'spec-8', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('req-24', 'API should delete product', 'DELETE /api/products/:id endpoint', 4, 'spec-8', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert tests (one test per requirement)
INSERT INTO test (id, status, framework, code, test_requirement_id, created_at, updated_at) VALUES 
('test-1', 'passed', 'Vitest', 'test("should add item to cart", async ({ page }) => {
  await page.goto("/products");
  await page.click("[data-testid=add-to-cart-btn]");
  await expect(page.locator("[data-testid=cart-count]")).toHaveText("1");
});', 'req-1', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-2', 'failed', 'Vitest', 'test("should remove item from cart", async ({ page }) => {
  await page.goto("/cart");
  await page.click("[data-testid=remove-item-btn]");
  await expect(page.locator("[data-testid=cart-empty]")).toBeVisible();
});', 'req-2', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-3', 'pending', 'Vitest', 'test("should update item quantity", async ({ page }) => {
  // TODO: Implement quantity update test
});', 'req-3', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-4', 'passed', 'Vitest', 'test("should persist cart across sessions", async ({ page }) => {
  await page.goto("/products");
  await page.click("[data-testid=add-to-cart-btn]");
  await page.reload();
  await expect(page.locator("[data-testid=cart-count]")).toHaveText("1");
});', 'req-4', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-5', 'passed', 'Vitest', 'test("should show correct total price", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.locator("[data-testid=total-price]")).toContainText("$");
});', 'req-5', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-6', 'passed', 'Vitest', 'test("should select payment method", async ({ page }) => {
  await page.goto("/checkout");
  await page.click("[data-testid=payment-method-card]");
  await expect(page.locator("[data-testid=payment-method-card]")).toBeChecked();
});', 'req-6', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-7', 'failed', 'Vitest', 'test("should enter payment details", async ({ page }) => {
  await page.goto("/checkout");
  await page.fill("[data-testid=card-number]", "4111111111111111");
  // Test fails due to validation issues
});', 'req-7', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-8', 'pending', 'Vitest', 'test("should process payment successfully", async ({ page }) => {
  // TODO: Implement payment processing test
});', 'req-8', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-9', 'passed', 'Vitest', 'test("should receive payment confirmation", async ({ page }) => {
  await page.goto("/order-confirmation");
  await expect(page.locator("[data-testid=confirmation-message]")).toBeVisible();
});', 'req-9', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-10', 'failed', 'Vitest', 'test("should handle failed payments", async ({ page }) => {
  await page.goto("/checkout");
  await page.fill("[data-testid=card-number]", "4000000000000002");
  await page.click("[data-testid=submit-payment]");
  await expect(page.locator("[data-testid=error-message]")).toBeVisible();
});', 'req-10', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-11', 'passed', 'Vitest', 'test("should login with email and password", async ({ page }) => {
  await page.goto("/login");
  await page.fill("[data-testid=email]", "test@example.com");
  await page.fill("[data-testid=password]", "password123");
  await page.click("[data-testid=login-btn]");
  await expect(page).toHaveURL("/dashboard");
});', 'req-11', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-12', 'pending', 'Vitest', 'test("should reset password", async ({ page }) => {
  // TODO: Implement password reset test
});', 'req-12', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-13', 'failed', 'Vitest', 'test("should expire session after inactivity", async ({ page }) => {
  // Session timeout test - currently failing
});', 'req-13', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-14', 'passed', 'Vitest', 'test("should logout user", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click("[data-testid=logout-btn]");
  await expect(page).toHaveURL("/login");
});', 'req-14', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-15', 'passed', 'Vitest', 'test("should register new account", async ({ page }) => {
  await page.goto("/register");
  await page.fill("[data-testid=email]", "new@example.com");
  await page.fill("[data-testid=password]", "newpassword123");
  await page.click("[data-testid=register-btn]");
  await expect(page.locator("[data-testid=success-message]")).toBeVisible();
});', 'req-15', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-16', 'failed', 'Vitest', 'test("should validate email format", async ({ page }) => {
  await page.goto("/register");
  await page.fill("[data-testid=email]", "invalid-email");
  await expect(page.locator("[data-testid=error-message]")).toBeVisible();
});', 'req-16', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-17', 'passed', 'Vitest', 'test("API should create new user", async ({ request }) => {
  const response = await request.post("/api/users", {
    data: { email: "test@example.com", name: "Test User" }
  });
  expect(response.status()).toBe(201);
});', 'req-17', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-18', 'passed', 'Vitest', 'test("API should retrieve user by ID", async ({ request }) => {
  const response = await request.get("/api/users/1");
  expect(response.status()).toBe(200);
});', 'req-18', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-19', 'failed', 'Vitest', 'test("API should update user profile", async ({ request }) => {
  const response = await request.put("/api/users/1", {
    data: { name: "Updated Name" }
  });
  expect(response.status()).toBe(200);
});', 'req-19', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-20', 'pending', 'Vitest', 'test("API should delete user account", async ({ request }) => {
  // TODO: Implement user deletion test
});', 'req-20', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-21', 'passed', 'Vitest', 'test("API should list all products", async ({ request }) => {
  const response = await request.get("/api/products");
  expect(response.status()).toBe(200);
});', 'req-21', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-22', 'failed', 'Vitest', 'test("API should create new product", async ({ request }) => {
  const response = await request.post("/api/products", {
    data: { name: "New Product", price: 99.99 }
  });
  expect(response.status()).toBe(201);
});', 'req-22', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-23', 'passed', 'Vitest', 'test("API should update product details", async ({ request }) => {
  const response = await request.put("/api/products/1", {
    data: { price: 89.99 }
  });
  expect(response.status()).toBe(200);
});', 'req-23', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('test-24', 'pending', 'Vitest', 'test("API should delete product", async ({ request }) => {
  // TODO: Implement product deletion test
});', 'req-24', strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000); 