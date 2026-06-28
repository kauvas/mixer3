export function requiredFields(fields, payload) {
  const missing = fields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === '');
  if (missing.length) {
    throw new Error(`Campos obrigatórios ausentes: ${missing.join(', ')}`);
  }
}
