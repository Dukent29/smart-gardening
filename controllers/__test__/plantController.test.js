// plantController.test.js
const { createPlant } = require('../plantController');

test('création d\'une plante retourne un objet', () => {
  const plant = createPlant({ name: 'Ficus' });
  expect(plant).toHaveProperty('id');
  expect(plant.name).toBe('Ficus');
});