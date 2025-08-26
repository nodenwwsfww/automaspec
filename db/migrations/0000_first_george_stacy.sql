-- Insert test categories
INSERT INTO test_category (name, title, description, parent_category_id, "order", created_at, updated_at) VALUES
('Shopping Cart', 'Shopping Cart', 'Shopping cart functionality', NULL, 1, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('Payment', 'Payment', 'Payment processing functionality', NULL, 2, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('Authentication', 'Authentication', 'User authentication functionality', NULL, 3, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('API Tests', 'API Tests', 'Backend API testing', NULL, 4, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test specs
INSERT INTO test_spec (name, title, description, test_category_id, created_at, updated_at) VALUES
('add-to-cart.spec.ts', 'Add to Cart Tests', 'Tests for adding items to cart', 1, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('cart-persistence.spec.ts', 'Cart Persistence Tests', 'Tests for cart data persistence', 1, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('payment-methods.spec.ts', 'Payment Method Tests', 'Tests for payment method selection', 2, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('payment-processing.spec.ts', 'Payment Processing Tests', 'Tests for payment processing flow', 2, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('login.spec.ts', 'Login Tests', 'User login functionality tests', 3, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('registration.spec.ts', 'Registration Tests', 'User registration tests', 3, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('users-api.spec.ts', 'Users API Tests', 'API tests for user management', 4, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('products-api.spec.ts', 'Products API Tests', 'API tests for product management', 4, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert test requirements
INSERT INTO test_requirement (text, description, "order", test_spec_id, created_at, updated_at) VALUES
('User should be able to add items to cart', 'Adding products to shopping cart', 1, 1, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('User should be able to remove items from cart', 'Removing products from shopping cart', 2, 1, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('User should be able to update item quantity', 'Changing product quantity in cart', 3, 1, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('Cart should persist across sessions', 'Cart items should be saved when user logs out and in', 1, 2, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('Cart should show correct total price', 'Total price calculation including taxes and discounts', 2, 2, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('User should be able to select payment method', 'Choose between credit card, PayPal, etc.', 1, 3, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('User should be able to enter payment details', 'Credit card form validation and processing', 2, 3, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('Payment should be processed successfully', 'Successful payment transaction flow', 1, 4, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('User should receive payment confirmation', 'Email and on-screen confirmation after payment', 2, 4, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('Failed payments should be handled gracefully', 'Error handling for declined cards or failed transactions', 3, 4, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('User should be able to login with email and password', 'Standard email/password authentication', 1, 5, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('User should be able to reset password', 'Password reset via email link', 2, 5, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('User session should expire after inactivity', 'Automatic logout after session timeout', 3, 5, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('User should be able to logout', 'Manual logout functionality', 4, 5, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('User should be able to register new account', 'User registration with email verification', 1, 6, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('Registration should validate email format', 'Email validation during registration', 2, 6, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('API should create new user', 'POST /api/users endpoint', 1, 7, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('API should retrieve user by ID', 'GET /api/users/:id endpoint', 2, 7, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('API should update user profile', 'PUT /api/users/:id endpoint', 3, 7, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('API should delete user account', 'DELETE /api/users/:id endpoint', 4, 7, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('API should list all products', 'GET /api/products endpoint', 1, 8, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('API should create new product', 'POST /api/products endpoint', 2, 8, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('API should update product details', 'PUT /api/products/:id endpoint', 3, 8, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),
('API should delete product', 'DELETE /api/products/:id endpoint', 4, 8, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);

-- Insert tests (one test per requirement, assuming requirement IDs are 1..24)
INSERT INTO test (status, framework, code, test_requirement_id, created_at, updated_at) VALUES
('passed', 'Vitest', 'test("should add item to cart", async ({ page }) => {
  await page.goto("/products");
  await page.click("[data-testid=add-to-cart-btn]");
  await expect(page.locator("[data-testid=cart-count]")).toHaveText("1");
});', 1, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('failed', 'Vitest', 'test("should remove item from cart", async ({ page }) => {
  await page.goto("/cart");
  await page.click("[data-testid=remove-item-btn]");
  await expect(page.locator("[data-testid=cart-empty]")).toBeVisible();
});', 2, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('pending', 'Vitest', 'test("should update item quantity", async ({ page }) => {
  // TODO: Implement quantity update test
});', 3, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("should persist cart across sessions", async ({ page }) => {
  await page.goto("/products");
  await page.click("[data-testid=add-to-cart-btn]");
  await page.reload();
  await expect(page.locator("[data-testid=cart-count]")).toHaveText("1");
});', 4, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("should show correct total price", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.locator("[data-testid=total-price]")).toContainText("$");
});', 5, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("should select payment method", async ({ page }) => {
  await page.goto("/checkout");
  await page.click("[data-testid=payment-method-card]");
  await expect(page.locator("[data-testid=payment-method-card]")).toBeChecked();
});', 6, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('failed', 'Vitest', 'test("should enter payment details", async ({ page }) => {
  await page.goto("/checkout");
  await page.fill("[data-testid=card-number]", "4111111111111111");
  // Test fails due to validation issues
});', 7, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('pending', 'Vitest', 'test("should process payment successfully", async ({ page }) => {
  // TODO: Implement payment processing test
});', 8, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("should receive payment confirmation", async ({ page }) => {
  await page.goto("/order-confirmation");
  await expect(page.locator("[data-testid=confirmation-message]")).toBeVisible();
});', 9, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('failed', 'Vitest', 'test("should handle failed payments", async ({ page }) => {
  await page.goto("/checkout");
  await page.fill("[data-testid=card-number]", "4000000000000002");
  await page.click("[data-testid=submit-payment]");
  await expect(page.locator("[data-testid=error-message]")).toBeVisible();
});', 10, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("should login with email and password", async ({ page }) => {
  await page.goto("/login");
  await page.fill("[data-testid=email]", "test@example.com");
  await page.fill("[data-testid=password]", "password123");
  await page.click("[data-testid=login-btn]");
  await expect(page).toHaveURL("/dashboard");
});', 11, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('pending', 'Vitest', 'test("should reset password", async ({ page }) => {
  // TODO: Implement password reset test
});', 12, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('failed', 'Vitest', 'test("should expire session after inactivity", async ({ page }) => {
  // Session timeout test - currently failing
});', 13, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("should logout user", async ({ page }) => {
  await page.goto("/dashboard");
  await page.click("[data-testid=logout-btn]");
  await expect(page).toHaveURL("/login");
});', 14, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("should register new account", async ({ page }) => {
  await page.goto("/register");
  await page.fill("[data-testid=email]", "new@example.com");
  await page.fill("[data-testid=password]", "newpassword123");
  await page.click("[data-testid=register-btn]");
  await expect(page.locator("[data-testid=success-message]")).toBeVisible();
});', 15, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('failed', 'Vitest', 'test("should validate email format", async ({ page }) => {
  await page.goto("/register");
  await page.fill("[data-testid=email]", "invalid-email");
  await expect(page.locator("[data-testid=error-message]")).toBeVisible();
});', 16, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("API should create new user", async ({ request }) => {
  const response = await request.post("/api/users", {
    data: { email: "test@example.com", name: "Test User" }
  });
  expect(response.status()).toBe(201);
});', 17, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("API should retrieve user by ID", async ({ request }) => {
  const response = await request.get("/api/users/1");
  expect(response.status()).toBe(200);
});', 18, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('failed', 'Vitest', 'test("API should update user profile", async ({ request }) => {
  const response = await request.put("/api/users/1", {
    data: { name: "Updated Name" }
  });
  expect(response.status()).toBe(200);
});', 19, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('pending', 'Vitest', 'test("API should delete user account", async ({ request }) => {
  // TODO: Implement user deletion test
});', 20, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("API should list all products", async ({ request }) => {
  const response = await request.get("/api/products");
  expect(response.status()).toBe(200);
});', 21, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('failed', 'Vitest', 'test("API should create new product", async ({ request }) => {
  const response = await request.post("/api/products", {
    data: { name: "New Product", price: 99.99 }
  });
  expect(response.status()).toBe(201);
});', 22, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('passed', 'Vitest', 'test("API should update product details", async ({ request }) => {
  const response = await request.put("/api/products/1", {
    data: { price: 89.99 }
  });
  expect(response.status()).toBe(200);
});', 23, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000),

('pending', 'Vitest', 'test("API should delete product", async ({ request }) => {
  // TODO: Implement product deletion test
});', 24, strftime('%s', 'now') * 1000, strftime('%s', 'now') * 1000);
