import { join } from 'path';
import * as expressHandlebars from 'express-handlebars';

export const templateEngineConfig = expressHandlebars({
  extname: 'hbs',
  defaultLayout: 'index',
  helpers: {
    inc: (value: string): number => parseInt(value, 10) + 1,
    ifeq: (a: string, b: string, options) =>
      a?.localeCompare(b) === 0 ? options.fn(this) : options.inverse(this),
  },
  layoutsDir: join(process.cwd(), 'views'),
  partialsDir: join(process.cwd(), 'views/partials'),
});
