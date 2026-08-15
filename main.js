const { add, subtract, multiply, divide } = require('../src/calculator');

describe('Calculator Functions', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
    });
    
    it('should handle negative numbers', () => {
      expect(add(-1, -1)).toBe(-2);
    });
  });
  
  describe('subtract', () => {
    it('should subtract two numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
    });
  });
  
  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(3, 4)).toBe(12);
    });
  });
  
  describe('divide', () => {
    it('should divide two numbers correctly', () => {
      expect(divide(10, 2)).toBe(5);
    });
    
    it('should handle division by zero', () => {
      expect(divide(5, 0)).toBe(Infinity);
    });
  });
});