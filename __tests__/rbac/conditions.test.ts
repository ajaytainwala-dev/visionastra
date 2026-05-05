import { describe, it, expect } from 'vitest'
import { evaluateCondition, evaluateConditions } from '@/lib/rbac/engine'
import type { Condition, ConditionGroup } from '@/lib/rbac/engine'

describe('RBAC Condition Evaluation', () => {
  describe('evaluateCondition - leaf conditions', () => {
    it('should evaluate EQ (equals) correctly', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'EQ',
        value: 'active',
      }
      expect(evaluateCondition(condition, { status: 'active' })).toBe(true)
      expect(evaluateCondition(condition, { status: 'inactive' })).toBe(false)
    })

    it('should evaluate NE (not equals) correctly', () => {
      const condition: Condition = {
        field: 'role',
        operator: 'NE',
        value: 'student',
      }
      expect(evaluateCondition(condition, { role: 'trainer' })).toBe(true)
      expect(evaluateCondition(condition, { role: 'student' })).toBe(false)
    })

    it('should evaluate GT (greater than) correctly', () => {
      const condition: Condition = {
        field: 'score',
        operator: 'GT',
        value: 80,
      }
      expect(evaluateCondition(condition, { score: 85 })).toBe(true)
      expect(evaluateCondition(condition, { score: 75 })).toBe(false)
    })

    it('should evaluate GTE (greater than or equal) correctly', () => {
      const condition: Condition = {
        field: 'score',
        operator: 'GTE',
        value: 80,
      }
      expect(evaluateCondition(condition, { score: 80 })).toBe(true)
      expect(evaluateCondition(condition, { score: 79 })).toBe(false)
    })

    it('should evaluate LT (less than) correctly', () => {
      const condition: Condition = {
        field: 'score',
        operator: 'LT',
        value: 80,
      }
      expect(evaluateCondition(condition, { score: 75 })).toBe(true)
      expect(evaluateCondition(condition, { score: 85 })).toBe(false)
    })

    it('should evaluate LTE (less than or equal) correctly', () => {
      const condition: Condition = {
        field: 'score',
        operator: 'LTE',
        value: 80,
      }
      expect(evaluateCondition(condition, { score: 80 })).toBe(true)
      expect(evaluateCondition(condition, { score: 81 })).toBe(false)
    })

    it('should evaluate IN (array membership) correctly', () => {
      const condition: Condition = {
        field: 'department',
        operator: 'IN',
        value: ['IT', 'HR', 'Finance'],
      }
      expect(evaluateCondition(condition, { department: 'IT' })).toBe(true)
      expect(evaluateCondition(condition, { department: 'Sales' })).toBe(false)
    })

    it('should evaluate CONTAINS (string contains) correctly', () => {
      const condition: Condition = {
        field: 'email',
        operator: 'CONTAINS',
        value: '@example.com',
      }
      expect(evaluateCondition(condition, { email: 'user@example.com' })).toBe(true)
      expect(evaluateCondition(condition, { email: 'user@other.com' })).toBe(false)
    })
  })

  describe('evaluateConditions - groups with AND/OR', () => {
    it('should evaluate AND group (all conditions must be true)', () => {
      const group: ConditionGroup = {
        operator: 'AND',
        conditions: [
          { field: 'role', operator: 'EQ', value: 'trainer' },
          { field: 'status', operator: 'EQ', value: 'active' },
        ],
      }
      expect(
        evaluateConditions(group, { role: 'trainer', status: 'active' })
      ).toBe(true)
      expect(
        evaluateConditions(group, { role: 'trainer', status: 'inactive' })
      ).toBe(false)
    })

    it('should evaluate OR group (at least one condition must be true)', () => {
      const group: ConditionGroup = {
        operator: 'OR',
        conditions: [
          { field: 'role', operator: 'EQ', value: 'trainer' },
          { field: 'role', operator: 'EQ', value: 'admin' },
        ],
      }
      expect(evaluateConditions(group, { role: 'trainer' })).toBe(true)
      expect(evaluateConditions(group, { role: 'admin' })).toBe(true)
      expect(evaluateConditions(group, { role: 'student' })).toBe(false)
    })

    it('should handle nested condition groups', () => {
      const group: ConditionGroup = {
        operator: 'AND',
        conditions: [
          { field: 'role', operator: 'EQ', value: 'trainer' },
          {
            operator: 'OR',
            conditions: [
              { field: 'status', operator: 'EQ', value: 'active' },
              { field: 'status', operator: 'EQ', value: 'on_leave' },
            ],
          } as any,
        ],
      }
      expect(
        evaluateConditions(group, { role: 'trainer', status: 'active' })
      ).toBe(true)
      expect(
        evaluateConditions(group, { role: 'trainer', status: 'on_leave' })
      ).toBe(true)
      expect(
        evaluateConditions(group, { role: 'student', status: 'active' })
      ).toBe(false)
    })

    it('should handle empty condition groups', () => {
      const group: ConditionGroup = {
        operator: 'AND',
        conditions: [],
      }
      expect(evaluateConditions(group, {})).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle null/undefined values gracefully', () => {
      const condition: Condition = {
        field: 'department',
        operator: 'EQ',
        value: 'IT',
      }
      expect(evaluateCondition(condition, { department: null })).toBe(false)
      expect(evaluateCondition(condition, {})).toBe(false)
    })

    it('should handle type coercion for numeric comparisons', () => {
      const condition: Condition = {
        field: 'score',
        operator: 'GT',
        value: 80,
      }
      expect(evaluateCondition(condition, { score: '85' })).toBe(true)
      expect(evaluateCondition(condition, { score: '75' })).toBe(false)
    })
  })
})
