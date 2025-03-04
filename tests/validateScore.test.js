import { describe, it, expect, beforeEach } from 'vitest';
import { validateScore } from '../src/validateScore';

describe('validateScore', () => {
  let options;

  beforeEach(() => {
    options = {
      passingScore: 60,
      strictMode: false,
      bonusCategories: [],
    };
  });

  describe('Basisvalidierung', () => {
    it('sollte gültige Punktzahlen akzeptieren', () => {
      expect(validateScore(75, options).valid).toBe(true);
      expect(validateScore(0, options).valid).toBe(true);
      expect(validateScore(100, options).valid).toBe(true);
    });

    it('sollte ungültige Punktzahlen ablehnen', () => {
      expect(validateScore(undefined, options).valid).toBe(false);
      expect(validateScore(null, options).valid).toBe(false);
      expect(validateScore('abc', options).valid).toBe(false);
      expect(validateScore(-1, options).valid).toBe(false);
      expect(validateScore(101, options).valid).toBe(false);
    });
  });

  describe('Strikte Validierung', () => {
    it('sollte gültige Punktzahlen im Strict-Mode akzeptieren', () => {
      options.strictMode = true;
      expect(validateScore(75, options).valid).toBe(true);
    });

    it('sollte ungültige Punktzahlen im Strict-Mode ablehnen', () => {
      options.strictMode = true;
      expect(validateScore(75.5, options).valid).toBe(false);
      expect(validateScore(NaN, options).valid).toBe(false);
      expect(validateScore(Infinity, options).valid).toBe(false);
    });
  });

  describe('Bonuskategorien', () => {
    it('sollte Bonuspunkte hinzufügen', () => {
      options.bonusCategories = ['A', 'B'];
      expect(validateScore(70, options).score).toBe(74);
    });

    it('sollte maximal 10 Bonuspunkte hinzufügen', () => {
      options.bonusCategories = ['A', 'B', 'C', 'D', 'E', 'F'];
      expect(validateScore(70, options).score).toBe(80);
    });

    it('sollte die Punktzahl nicht über 100 erhöhen', () => {
      options.bonusCategories = ['A', 'B', 'C', 'D', 'E'];
      expect(validateScore(98, options).score).toBe(100);
    });
  });

  describe('Bestandsprüfung', () => {
    it('sollte bestehen, wenn die Punktzahl den Schwellenwert erreicht oder überschreitet', () => {
      expect(validateScore(60, options).passed).toBe(true);
      expect(validateScore(70, options).passed).toBe(true);
    });

    it('sollte nicht bestehen, wenn die Punktzahl unter dem Schwellenwert liegt', () => {
      expect(validateScore(59, options).passed).toBe(false);
    });

    it('sollte den Schwellenwert berücksichtigen', () => {
      options.passingScore = 70;
      expect(validateScore(65, options).passed).toBe(false);
      expect(validateScore(75, options).passed).toBe(true);
    });
  });

  describe('Notenberechnung', () => {
    it('sollte die richtige Note zuweisen', () => {
      expect(validateScore(95, options).grade).toBe('A');
      expect(validateScore(85, options).grade).toBe('B');
      expect(validateScore(75, options).grade).toBe('C');
      expect(validateScore(65, options).grade).toBe('D');
      expect(validateScore(55, options).grade).toBe('F');
    });
  });

  describe('Edge Cases', () => {
    it('sollte den minimalen und maximalen Score korrekt validieren', () => {
      expect(validateScore(0, options).valid).toBe(true);
      expect(validateScore(100, options).valid).toBe(true);
      expect(validateScore(-0.0001, options).valid).toBe(false);
      expect(validateScore(100.0001, options).valid).toBe(false);
    });

    it('sollte mit verschiedenen Schwellwerten umgehen können', () => {
      options.passingScore = 80;
      expect(validateScore(79, options).passed).toBe(false);
      expect(validateScore(80, options).passed).toBe(true);
    });
  });

  describe('Parametrisierte Tests', () => {
    it.each([
      [95, 'A'],
      [85, 'B'],
      [75, 'C'],
      [65, 'D'],
      [55, 'F'],
    ])('sollte Note %s die Note %s zuweisen', (score, grade) => {
      expect(validateScore(score, options).grade).toBe(grade);
    });
  });
});