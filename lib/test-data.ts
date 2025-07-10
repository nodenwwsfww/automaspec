import type { TestDataResponse } from '@/lib/types'

export const fetchTestData = async (): Promise<TestDataResponse> => {
    try {
        const response = await fetch('/api/tests')
        if (!response.ok) {
            throw new Error('Failed to fetch test data')
        }
        return await response.json()
    } catch (error) {
        console.error('Error fetching test data:', error)
        return { categories: [], groups: [], tests: [], requirements: [] }
    }
}

export const createSampleData = async (): Promise<TestDataResponse> => {
    try {
        // Create main category
        const categoryResponse = await fetch('/api/tests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'category',
                data: {
                    title: 'Authentication & User Management',
                    parentId: null,
                    order: 0
                }
            })
        })

        if (!categoryResponse.ok) return
        const category = await categoryResponse.json()

        // Create Login group
        const loginGroupResponse = await fetch('/api/tests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'group',
                data: {
                    title: 'Login Flow',
                    description: 'User login functionality tests',
                    testCategoriesId: category.id
                }
            })
        })

        if (!loginGroupResponse.ok) return
        const loginGroup = await loginGroupResponse.json()

        // Create Registration group
        const registrationGroupResponse = await fetch('/api/tests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'group',
                data: {
                    title: 'Registration Flow',
                    description: 'User registration functionality tests',
                    testCategoriesId: category.id
                }
            })
        })

        if (!registrationGroupResponse.ok) return
        const registrationGroup = await registrationGroupResponse.json()

        // Create Password Management group
        const passwordGroupResponse = await fetch('/api/tests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'group',
                data: {
                    title: 'Password Management',
                    description: 'Password reset and security tests',
                    testCategoriesId: category.id
                }
            })
        })

        if (!passwordGroupResponse.ok) return
        const passwordGroup = await passwordGroupResponse.json()

        // Define individual tests with focused functionality
        const tests = [
            // Login Flow Tests
            {
                title: 'Login Form Display',
                description: 'Verify login form elements are displayed correctly',
                status: 'passed',
                framework: 'Playwright',
                testGroupId: loginGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Login Form Display', () => {
  test('should display all login form elements', async ({ page }) => {
    await page.goto('/login');
    
    // Check form elements exist
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-btn')).toBeVisible();
    await expect(page.locator('#remember-me')).toBeVisible();
    
    // Check form labels
    await expect(page.locator('label[for="email"]')).toContainText('Email');
    await expect(page.locator('label[for="password"]')).toContainText('Password');
  });
});`,
                requirements: [
                    { text: 'Login form displays email input field', status: 'passed', order: 1 },
                    { text: 'Login form displays password input field', status: 'passed', order: 2 }
                ]
            },
            {
                title: 'Valid Login',
                description: 'Test successful login with valid credentials',
                status: 'passed',
                framework: 'Playwright',
                testGroupId: loginGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Valid Login', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'SecurePassword123');
    await page.click('#login-btn');
    
    // Check successful login
    await expect(page.locator('.dashboard')).toBeVisible();
    await expect(page.locator('.user-menu')).toContainText('user@example.com');
    
    // Check URL redirect
    await expect(page).toHaveURL(/.*dashboard/);
  });
});`,
                requirements: [
                    { text: 'User can login with valid email and password', status: 'passed', order: 1 },
                    { text: 'User is redirected to dashboard after successful login', status: 'passed', order: 2 }
                ]
            },
            {
                title: 'Invalid Login',
                description: 'Test login failure with invalid credentials',
                status: 'passed',
                framework: 'Playwright',
                testGroupId: loginGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Invalid Login', () => {
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Try invalid credentials
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#login-btn');
    
    // Check error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
    
    // Check user stays on login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('#email')).toBeVisible();
  });
});`,
                requirements: [{ text: 'Error message displays for invalid credentials', status: 'passed', order: 1 }]
            },
            {
                title: 'Remember Me Functionality',
                description: 'Test remember me checkbox functionality',
                status: 'failed',
                framework: 'Playwright',
                testGroupId: loginGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Remember Me', () => {
  test('should remember user when checkbox is checked', async ({ page }) => {
    await page.goto('/login');
    
    // Login with remember me checked
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'SecurePassword123');
    await page.check('#remember-me');
    await page.click('#login-btn');
    
    // Verify successful login
    await expect(page.locator('.dashboard')).toBeVisible();
    
    // Close browser and reopen - user should still be logged in
    await page.context().clearCookies();
    await page.reload();
    
    // This test currently fails - remember me not implemented
    await expect(page.locator('.dashboard')).toBeVisible();
  });
});`,
                requirements: [
                    { text: 'Remember me checkbox keeps user logged in across sessions', status: 'failed', order: 1 }
                ]
            },
            // Registration Flow Tests
            {
                title: 'Registration Form Display',
                description: 'Verify registration form elements',
                status: 'passed',
                framework: 'Playwright',
                testGroupId: registrationGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Registration Form', () => {
  test('should display all registration form elements', async ({ page }) => {
    await page.goto('/register');
    
    // Check form elements
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirm-password')).toBeVisible();
    await expect(page.locator('#first-name')).toBeVisible();
    await expect(page.locator('#last-name')).toBeVisible();
    await expect(page.locator('#register-btn')).toBeVisible();
    
    // Check validation messages containers
    await expect(page.locator('.password-strength')).toBeVisible();
  });
});`,
                requirements: [
                    { text: 'Registration form displays all required input fields', status: 'passed', order: 1 }
                ]
            },
            {
                title: 'Email Uniqueness Check',
                description: 'Test email uniqueness validation',
                status: 'passed',
                framework: 'Playwright',
                testGroupId: registrationGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Email Uniqueness', () => {
  test('should prevent registration with existing email', async ({ page }) => {
    await page.goto('/register');
    
    // Try to register with existing email
    await page.fill('#email', 'existing@example.com');
    await page.fill('#password', 'SecurePassword123');
    await page.fill('#confirm-password', 'SecurePassword123');
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    
    await page.click('#register-btn');
    
    // Check error message
    await expect(page.locator('.error-message')).toContainText('Email already exists');
    await expect(page).toHaveURL(/.*register/);
  });
});`,
                requirements: [
                    { text: 'System prevents registration with duplicate email addresses', status: 'passed', order: 1 }
                ]
            },
            {
                title: 'Password Strength Validation',
                description: 'Test password strength requirements',
                status: 'failed',
                framework: 'Playwright',
                testGroupId: registrationGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Password Strength', () => {
  test('should validate password strength requirements', async ({ page }) => {
    await page.goto('/register');
    
    // Test weak password
    await page.fill('#password', '123');
    await expect(page.locator('.password-weak')).toBeVisible();
    
    // Test medium password  
    await page.fill('#password', 'password123');
    await expect(page.locator('.password-medium')).toBeVisible();
    
    // Test strong password
    await page.fill('#password', 'SecurePass123!@#');
    await expect(page.locator('.password-strong')).toBeVisible();
    
    // Test registration with weak password fails
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', '123');
    await page.fill('#confirm-password', '123');
    await page.click('#register-btn');
    
    await expect(page.locator('.error-message')).toContainText('Password too weak');
  });
});`,
                requirements: [
                    { text: 'Password strength indicator shows real-time feedback', status: 'failed', order: 1 },
                    { text: 'Weak passwords are rejected during registration', status: 'failed', order: 2 }
                ]
            },
            {
                title: 'Password Confirmation',
                description: 'Test password confirmation matching',
                status: 'passed',
                framework: 'Playwright',
                testGroupId: registrationGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Password Confirmation', () => {
  test('should validate password confirmation matches', async ({ page }) => {
    await page.goto('/register');
    
    // Fill form with mismatched passwords
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'SecurePassword123');
    await page.fill('#confirm-password', 'DifferentPassword123');
    
    await page.click('#register-btn');
    
    // Check validation error
    await expect(page.locator('.error-message')).toContainText('Passwords do not match');
    
    // Test with matching passwords
    await page.fill('#confirm-password', 'SecurePassword123');
    await expect(page.locator('.password-match-success')).toBeVisible();
  });
});`,
                requirements: [
                    { text: 'Password confirmation field must match password field', status: 'passed', order: 1 }
                ]
            },
            // Password Management Tests
            {
                title: 'Password Reset Request',
                description: 'Test password reset request functionality',
                status: 'pending',
                framework: 'Playwright',
                testGroupId: passwordGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Password Reset Request', () => {
  test('should send password reset email', async ({ page }) => {
    await page.goto('/forgot-password');
    
    // Fill email and request reset
    await page.fill('#email', 'user@example.com');
    await page.click('#reset-btn');
    
    // Check success message
    await expect(page.locator('.success-message')).toContainText('Reset email sent');
    
    // Check email was sent (mock verification)
    await expect(page.locator('.email-status')).toContainText('Email sent to user@example.com');
  });
});`,
                requirements: [
                    { text: 'Password reset email is sent to valid email addresses', status: 'pending', order: 1 }
                ]
            },
            {
                title: 'Password Reset Security',
                description: 'Test password reset security measures',
                status: 'pending',
                framework: 'Playwright',
                testGroupId: passwordGroup.id,
                code: `import { test, expect } from '@playwright/test';

test.describe('Password Reset Security', () => {
  test('should implement rate limiting for reset requests', async ({ page }) => {
    await page.goto('/forgot-password');
    
    // Make multiple reset requests
    for (let i = 0; i < 5; i++) {
      await page.fill('#email', 'user@example.com');
      await page.click('#reset-btn');
      await page.waitForTimeout(1000);
    }
    
    // 6th request should be rate limited
    await page.fill('#email', 'user@example.com');
    await page.click('#reset-btn');
    
    await expect(page.locator('.error-message')).toContainText('Too many requests');
  });
});`,
                requirements: [
                    { text: 'Password reset requests are rate limited to prevent abuse', status: 'pending', order: 1 }
                ]
            }
        ]

        // Create all tests
        const createdTests = []
        for (const testData of tests) {
            const testResponse = await fetch('/api/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'test',
                    data: {
                        title: testData.title,
                        description: testData.description,
                        status: testData.status,
                        framework: testData.framework,
                        code: testData.code,
                        testGroupId: testData.testGroupId
                    }
                })
            })

            if (testResponse.ok) {
                const createdTest = await testResponse.json()
                createdTests.push({ ...createdTest, requirements: testData.requirements })
            }
        }

        // Create requirements for each test
        for (const test of createdTests) {
            for (const req of test.requirements) {
                await fetch('/api/tests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'requirement',
                        data: {
                            text: req.text,
                            status: req.status,
                            order: req.order,
                            testId: test.id
                        }
                    })
                })
            }
        }

        return await fetchTestData()
    } catch (error) {
        console.error('Failed to create sample data:', error)
        return { categories: [], groups: [], tests: [], requirements: [] }
    }
}
