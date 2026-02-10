import { test, expect } from '@playwright/test';

test('login and view dashboard sections', async ({ page, request }) => {
  const apiBase = process.env.E2E_API_URL || 'http://localhost:3000';
  const email = `e2e_${Date.now()}@test.com`;
  const password = 'TestPass123!';

  const registerResponse = await request.post(`${apiBase}/auth/register`, {
    data: {
      email,
      password,
      firstName: 'E2E',
      lastName: 'User',
    },
  });

  expect(registerResponse.ok()).toBeTruthy();

  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(
    page.getByRole('heading', { name: /Users Management|Gestión de usuarios/i })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /Payments|Pagos/i })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /Notifications|Notificaciones/i })
  ).toBeVisible();
});
