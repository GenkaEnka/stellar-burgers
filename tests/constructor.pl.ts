import { test, expect } from '@playwright/test';

const MOCK_ORDER_NUMBER = 54321;

test.describe('Конструктор бургера — интеграционные тесты', () => {
  test.beforeEach(async ({ page }) => {
    // Перехват запросов к api/ingredients из HAR-файла
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    // Навигация на главную страницу
    await page.goto('/');
    // Ожидание загрузки ингредиентов
    await page.waitForSelector('text=Краторная булка N-200i', {
      timeout: 15000
    });
  });

  test('добавление булки в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bunCard.locator('button', { hasText: 'Добавить' }).click();

    await expect(
      page.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();
    await expect(
      page.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();
  });

  test('добавление начинки (main) в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bunCard.locator('button', { hasText: 'Добавить' }).click();

    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .first();
    await mainCard.locator('button', { hasText: 'Добавить' }).click();

    await page.waitForTimeout(500);
    await expect(
      page
        .locator('.constructor-element__text')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    ).toBeVisible();
  });

  test('открытие модального окна ингредиента и закрытие по крестику', async ({
    page
  }) => {
    const bunLink = page
      .locator('a')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bunLink.click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    // Проверка, что отображаются данные именно этого ингредиента
    await expect(
      page.locator('#modals').filter({ hasText: 'Краторная булка N-200i' })
    ).toBeVisible();
    // Проверка nutritional values в модальном окне
    const modalContent = page.locator('#modals');
    await expect(modalContent.getByText('420')).toBeVisible();
    await expect(modalContent.getByText('80')).toBeVisible();
    await expect(modalContent.getByText('24')).toBeVisible();
    await expect(modalContent.getByText('53')).toBeVisible();

    // Закрытие по крестику
    const closeButton = page
      .locator('#modals button')
      .filter({ has: page.locator('svg') })
      .first();
    await closeButton.click();

    await page.waitForTimeout(500);
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    const bunLink = page
      .locator('a')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bunLink.click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    // Клик по оверлею (position: fixed, покрывает весь экран)
    await page.mouse.click(1, 1);

    await page.waitForTimeout(500);
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    // Перехват запросов к api/ingredients из HAR-файла
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    // Перехват запросов к api/auth/user из HAR-файла
    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/auth/user'
    });

    // Перехват запросов к api/orders из HAR-файла
    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders'
    });

    // Подставляем фейковые токены авторизации
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      document.cookie = 'accessToken=mock-access-token';
    });

    await page.goto('/');
    await page.waitForSelector('text=Краторная булка N-200i', {
      timeout: 15000
    });
  });

  test('создание заказа с проверкой номера и очистки конструктора', async ({
    page
  }) => {
    // Собираем бургер
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bunCard.locator('button', { hasText: 'Добавить' }).click();

    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .first();
    await mainCard.locator('button', { hasText: 'Добавить' }).click();

    const sauceCard = page
      .locator('li')
      .filter({ hasText: 'Соус Spicy-X' })
      .first();
    await sauceCard.locator('button', { hasText: 'Добавить' }).click();

    // Клик по кнопке "Оформить заказ"
    await page.getByText('Оформить заказ').click();

    // Ожидаем появления модального окна с номером заказа
    await page.waitForTimeout(1500);

    // Проверка номера заказа
    await expect(page.getByText(String(MOCK_ORDER_NUMBER))).toBeVisible();

    // Проверка очистки конструктора
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    // Закрытие модального окна
    const closeButton = page
      .locator('#modals button')
      .filter({ has: page.locator('svg') })
      .first();
    await closeButton.click();

    // Проверка закрытия
    await page.waitForTimeout(500);
    await expect(page.getByText(String(MOCK_ORDER_NUMBER))).not.toBeVisible();
  });
});
