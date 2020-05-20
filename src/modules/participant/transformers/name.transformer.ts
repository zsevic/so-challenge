import { ValueTransformer } from 'typeorm';

export class NameTransformer implements ValueTransformer {
  to(value: string): string {
    if (!value) return null;
    return value.trim();
  }

  from(value: string): string {
    return value;
  }
}
