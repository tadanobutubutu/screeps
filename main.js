// test_andom.js

 describe('random module', () => {
     test('should generate a random number', () => {
         const result = Math.random();
         expect(result).toBeDefined();
         expect(result).toBeGreaterThanOrEqual(0);
         expect(result).toBeLessThan(1);
     });

     test('should generate random integer in range', () => {
         const min = 1;
         const max = 10;
         const result = Math.floor(Math.random() * (max - min + 1)) + min;
         expect(result).toBeGreaterThanOrEqual(min);
         expect(result).toBeLessThanOrEqual(max);
     });
 });