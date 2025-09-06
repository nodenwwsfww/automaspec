
-- Insert test categories (папки)
INSERT INTO test_category (id, name, description, parent_category_id, organization_id, "order", created_at, updated_at) VALUES 
('cat-1', 'Shopping Cart', 'Shopping cart functionality', NULL, 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-2', 'Payment', 'Payment processing functionality', NULL, 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-3', 'Authentication', 'User authentication functionality', NULL, 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-4', 'API Tests', 'Backend API testing', NULL, 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test specs (файлики) - конкретные тестовые файлы
INSERT INTO test_spec (id, name, file_name, description, status, test_category_id, organization_id, created_at, updated_at) VALUES 
('spec-1', 'add-to-cart.spec.ts', 'Add to Cart Tests', 'Tests for adding items to cart', 'active', 'cat-1', 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-2', 'cart-persistence.spec.ts', 'Cart Persistence Tests', 'Tests for cart data persistence', 'active', 'cat-1', 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-3', 'payment-methods.spec.ts', 'Payment Method Tests', 'Tests for payment method selection', 'active', 'cat-2', 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-4', 'payment-processing.spec.ts', 'Payment Processing Tests', 'Tests for payment processing flow', 'active', 'cat-2', 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-5', 'login.spec.ts', 'Login Tests', 'User login functionality tests', 'active', 'cat-3', 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-6', 'registration.spec.ts', 'Registration Tests', 'User registration tests', 'active', 'cat-3', 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-7', 'users-api.spec.ts', 'Users API Tests', 'API tests for user management', 'active', 'cat-4', 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-8', 'products-api.spec.ts', 'Products API Tests', 'API tests for product management', 'active', 'cat-4', 'NvmOabP4cDHC0JFKHsmJ2pG4zmrNcBhN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for add-to-cart.spec.ts
INSERT INTO test_requirement (id, name, description, "order", test_spec_id, created_at, updated_at) VALUES 
('req-1', 'User should be able to add items to cart', 'Adding products to shopping cart', 1, 'spec-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-2', 'User should be able to remove items from cart', 'Removing products from shopping cart', 2, 'spec-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-3', 'User should be able to update item quantity', 'Changing product quantity in cart', 3, 'spec-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for cart-persistence.spec.ts
INSERT INTO test_requirement (id, name, description, "order", test_spec_id, created_at, updated_at) VALUES 
('req-4', 'Cart should persist across sessions', 'Cart items should be saved when user logs out and in', 1, 'spec-2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-5', 'Cart should show correct total price', 'Total price calculation including taxes and discounts', 2, 'spec-2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for payment-methods.spec.ts
INSERT INTO test_requirement (id, name, description, "order", test_spec_id, created_at, updated_at) VALUES 
('req-6', 'User should be able to select payment method', 'Choose between credit card, PayPal, etc.', 1, 'spec-3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-7', 'User should be able to enter payment details', 'Credit card form validation and processing', 2, 'spec-3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for payment-processing.spec.ts
INSERT INTO test_requirement (id, name, description, "order", test_spec_id, created_at, updated_at) VALUES 
('req-8', 'Payment should be processed successfully', 'Successful payment transaction flow', 1, 'spec-4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-9', 'User should receive payment confirmation', 'Email and on-screen confirmation after payment', 2, 'spec-4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-10', 'Failed payments should be handled gracefully', 'Error handling for declined cards or failed transactions', 3, 'spec-4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for login.spec.ts
INSERT INTO test_requirement (id, name, description, "order", test_spec_id, created_at, updated_at) VALUES 
('req-11', 'User should be able to login with email and password', 'Standard email/password authentication', 1, 'spec-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-12', 'User should be able to reset password', 'Password reset via email link', 2, 'spec-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-13', 'User session should expire after inactivity', 'Automatic logout after session timeout', 3, 'spec-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-14', 'User should be able to logout', 'Manual logout functionality', 4, 'spec-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for registration.spec.ts
INSERT INTO test_requirement (id, name, description, "order", test_spec_id, created_at, updated_at) VALUES 
('req-15', 'User should be able to register new account', 'User registration with email verification', 1, 'spec-6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-16', 'Registration should validate email format', 'Email validation during registration', 2, 'spec-6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for users-api.spec.ts
INSERT INTO test_requirement (id, name, description, "order", test_spec_id, created_at, updated_at) VALUES 
('req-17', 'API should create new user', 'POST /api/users endpoint', 1, 'spec-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-18', 'API should retrieve user by ID', 'GET /api/users/:id endpoint', 2, 'spec-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-19', 'API should update user profile', 'PUT /api/users/:id endpoint', 3, 'spec-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-20', 'API should delete user account', 'DELETE /api/users/:id endpoint', 4, 'spec-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for products-api.spec.ts
INSERT INTO test_requirement (id, name, description, "order", test_spec_id, created_at, updated_at) VALUES 
('req-21', 'API should list all products', 'GET /api/products endpoint', 1, 'spec-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-22', 'API should create new product', 'POST /api/products endpoint', 2, 'spec-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-23', 'API should update product details', 'PUT /api/products/:id endpoint', 3, 'spec-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-24', 'API should delete product', 'DELETE /api/products/:id endpoint', 4, 'spec-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert tests (one test per requirement)
INSERT INTO test (id, status, framework, code, test_requirement_id, created_at, updated_at) VALUES 
('test-1', 'passed', 'vitest', 'test("should add item to cart", async ({ page }) => {
  await page.goto("/products");
  await page.click("[data-testid=add-to-cart-btn]");
  await expect(page.locator("[data-testid=cart-count]")).toHaveText("1");
});', 'req-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-2', 'failed', 'vitest', 'test("should remove item from cart", async ({ page }) => {
  await page.goto("/cart");
  await page.click("[data-testid=remove-item-btn]");
  await expect(page.locator("[data-testid=cart-empty]")).toBeVisible();
});', 'req-2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-3', 'pending', 'vitest', 'test("should update item quantity", async ({ page }) => {
  // TODO: Implement quantity update test
});', 'req-3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-4', 'passed', 'vitest', 'test("should persist cart across sessions", async ({ page }) => {
  await page.goto("/products");
  await page.click("[data-testid=add-to-cart-btn]");
  await page.reload();
  await expect(page.locator("[data-testid=cart-count]")).toHaveText("1");
});', 'req-4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-5', 'passed', 'vitest', 'test("should show correct total price", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.locator("[data-testid=total-price]")).toContainText("$");
});', 'req-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-6', 'passed', 'vitest', 'test("should select payment method", async ({ page }) => {
  await page.goto("/checkout");
  await page.click("[data-testid=payment-method-card]");
  await expect(page.locator("[data-testid=payment-method-card]")).toBeChecked();
});', 'req-6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-7', 'failed', 'vitest', 'test("should enter payment details", async ({ page }) => {
  await page.goto("/checkout");
  await page.fill("[data-testid=card-number]", "4111111111111111");
  // Test fails due to validation issues
});', 'req-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-8', 'pending', 'vitest', 'test("should process payment successfully", async ({ page }) => {
  // TODO: Implement payment processing test
});', 'req-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-9', 'passed', 'vitest', 'test("should receive payment confirmation", async ({ page }) => {
  await page.goto("/order-confirmation");
  await expect(page.locator("[data-testid=confirmation-message]")).toBeVisible();
});', 'req-9', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-10', 'failed', 'vitest', 'test("should handle failed payments", async ({ page }) => {
  await page.goto("/checkout");
  await page.fill("[data-testid=card-number]", "4000000000000002");
  await page.click("[data-testid=submit-payment]");
  await expect(page.locator("[data-testid=error-message]")).toBeVisible();
});', 'req-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-11', 'passed', 'vitest', 'test("should login with email and password", async ({ page }) => {
  await page.goto("/login");
  await page.fill("[data-testid=email]", "test@example.com");
  await page.fill("[data-testid=password]", "password123");
  await page.click("[data-testid=login-btn]");
  await expect(page).toHaveURL("/dashboard");
});', 'req-11', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-12', 'pending', 'vitest', 'test("should reset password", async ({ page }) => {
  // TODO: Implement password reset test
});', 'req-12', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-13', 'failed', 'vitest', 'test("should expire session after inactivity", async ({ page }) => {
  // Session timeout test - currently failing
});', 'req-13', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-14', 'passed', 'vitest', 'test("should logout user", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click("[data-testid=logout-btn]");
  await expect(page).toHaveURL("/login");
});', 'req-14', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-15', 'passed', 'vitest', 'test("should register new account", async ({ page }) => {
  await page.goto("/register");
  await page.fill("[data-testid=email]", "new@example.com");
  await page.fill("[data-testid=password]", "newpassword123");
  await page.click("[data-testid=register-btn]");
  await expect(page.locator("[data-testid=success-message]")).toBeVisible();
});', 'req-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-16', 'failed', 'vitest', 'test("should validate email format", async ({ page }) => {
  await page.goto("/register");
  await page.fill("[data-testid=email]", "invalid-email");
  await expect(page.locator("[data-testid=error-message]")).toBeVisible();
});', 'req-16', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-17', 'passed', 'vitest', 'test("API should create new user", async ({ request }) => {
  const response = await request.post("/api/users", {
    data: { email: "test@example.com", name: "Test User" }
  });
  expect(response.status()).toBe(201);
});', 'req-17', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-18', 'passed', 'vitest', 'test("API should retrieve user by ID", async ({ request }) => {
  const response = await request.get("/api/users/1");
  expect(response.status()).toBe(200);
});', 'req-18', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-19', 'failed', 'vitest', 'test("API should update user profile", async ({ request }) => {
  const response = await request.put("/api/users/1", {
    data: { name: "Updated Name" }
  });
  expect(response.status()).toBe(200);
});', 'req-19', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-20', 'pending', 'vitest', 'test("API should delete user account", async ({ request }) => {
  // TODO: Implement user deletion test
});', 'req-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-21', 'passed', 'vitest', 'test("API should list all products", async ({ request }) => {
  const response = await request.get("/api/products");
  expect(response.status()).toBe(200);
});', 'req-21', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-22', 'failed', 'vitest', 'test("API should create new product", async ({ request }) => {
  const response = await request.post("/api/products", {
    data: { name: "New Product", price: 99.99 }
  });
  expect(response.status()).toBe(201);
});', 'req-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-23', 'passed', 'vitest', 'test("API should update product details", async ({ request }) => {
  const response = await request.put("/api/products/1", {
    data: { price: 89.99 }
  });
  expect(response.status()).toBe(200);
});', 'req-23', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-24', 'pending', 'vitest', 'test("API should delete product", async ({ request }) => {
  // TODO: Implement product deletion test
});', 'req-24', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 