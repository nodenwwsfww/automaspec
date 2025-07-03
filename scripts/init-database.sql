-- Initialize test database schema
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_groups (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    parent_id TEXT,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'frontend', 'backend', 'mobile', 'feature', 'component'
    icon TEXT,
    description TEXT,
    passed INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    status TEXT DEFAULT 'not_run', -- 'passed', 'failed', 'warning', 'not_run', 'healthy'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (parent_id) REFERENCES test_groups(id)
);

CREATE TABLE IF NOT EXISTS tests (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    framework TEXT NOT NULL, -- 'Playwright', 'VTest', 'JST'
    status TEXT DEFAULT 'not_run',
    requirements TEXT, -- JSON array of requirements
    playwright_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES test_groups(id)
);

CREATE TABLE IF NOT EXISTS test_runs (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    status TEXT NOT NULL,
    duration INTEGER, -- in milliseconds
    logs TEXT,
    screenshot_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id)
);

-- Insert sample data
INSERT OR REPLACE INTO projects (id, name, description) VALUES 
('main-project', 'E-commerce Platform', 'Main e-commerce application testing suite');

INSERT OR REPLACE INTO test_groups (id, project_id, parent_id, name, type, icon, passed, total, status) VALUES 
('frontend-group', 'main-project', NULL, 'Frontend Tests', 'frontend', 'Globe', 143, 145, 'healthy'),
('backend-group', 'main-project', NULL, 'Backend Tests', 'backend', 'Server', 234, 240, 'warning'),
('mobile-group', 'main-project', NULL, 'Mobile Tests', 'mobile', 'Smartphone', 45, 60, 'failed'),
('auth-group', 'main-project', 'frontend-group', 'Authentication', 'feature', 'User', 49, 50, 'warning'),
('cart-group', 'main-project', 'frontend-group', 'Shopping Cart', 'feature', 'Database', 67, 70, 'healthy');

INSERT OR REPLACE INTO tests (id, group_id, name, description, framework, status, requirements, playwright_code) VALUES 
('login-test', 'auth-group', 'Login Block', 'Login form validation and authentication flow', 'Playwright', 'passed', 
'["Отображается форма логина с полями email и password", "При вводе валидных данных происходит успешная авторизация"]',
'describe("Authentication", () => { describe("Login Block", () => { it("should login", async ({ page }) => { await page.goto("/login"); }); }); });');
