import { ValueTransformer } from 'typeorm';

export class NameTransformer implements ValueTransformer {
  to(value) {
    if (!value) return null;
    return value.trim();
  }

  from(value) {
    return value;
  }
}
