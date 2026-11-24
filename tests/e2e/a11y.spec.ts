import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Gate 5 (docs/02 §8): no serious or critical axe issue on key pages. */
const PAGES = ['/', '/science', '/design-system', '/products', '/this-page-does-not-exist'];

for (const path of PAGES) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page } as unknown as ConstructorParameters<
      typeof AxeBuilder
    >[0])
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(
      blocking.map(
        (v) =>
          `${v.id}: ${v.help} (${v.nodes
            .map((n) => n.target.join(' '))
            .slice(0, 3)
            .join(', ')})`,
      ),
    ).toEqual([]);
  });
}
