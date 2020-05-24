import { join } from 'path';
import * as hbs from 'hbs';

export const setupTemplateEngine = () => {
  hbs.registerPartials(join(process.cwd(), 'views/partials'));
  hbs.registerHelper('inc', (value: string): number => parseInt(value, 10) + 1);
  hbs.registerHelper('ifeq', (a: string, b: string, options) =>
    a?.localeCompare(b) === 0 ? options.fn(this) : options.inverse(this),
  );
};
