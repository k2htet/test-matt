import { Ajv } from 'ajv';
import { expect, test } from 'vitest';
import contract from '../openapi.json';

test('todo creation accepts a title and rejects empty titles or client-chosen completion', () => {
  const validate = new Ajv().compile(contract.components.schemas.CreateTodo);
  expect(validate({ title: 'Buy milk' })).toBe(true);
  expect(validate({ title: '' })).toBe(false);
  expect(validate({ title: '   ' })).toBe(false);
  expect(validate({ title: 'Buy milk', completed: true })).toBe(false);
});
