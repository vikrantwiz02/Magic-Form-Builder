import { useState } from 'react'
import { FormField, Condition, ConditionOperator } from '../types/form'

interface ConditionalLogicProps {
  fields: FormField[]
  conditions: Condition[]
  addCondition: (condition: Condition) => void
  removeCondition: (index: number) => void
}

export default function ConditionalLogic({
  fields,
  conditions,
  addCondition,
  removeCondition,
}: ConditionalLogicProps) {
  const [newCondition, setNewCondition] = useState<Condition>({
    fieldId: '',
    operator: ConditionOperator.Equals,
    value: '',
    action: 'show',
    targetFieldId: '',
  })

  const handleAddCondition = () => {
    if (newCondition.fieldId && newCondition.targetFieldId) {
      addCondition(newCondition)
      setNewCondition({
        fieldId: '',
        operator: ConditionOperator.Equals,
        value: '',
        action: 'show',
        targetFieldId: '',
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Conditional Logic</h2>
      <div className="space-y-2 bg-white bg-opacity-10 p-4 rounded-lg">
        <select
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={newCondition.fieldId}
          onChange={(e) => setNewCondition({ ...newCondition, fieldId: e.target.value })}
        >
          <option value="">Select Field</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.label}
            </option>
          ))}
        </select>
        <select
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={newCondition.operator}
          onChange={(e) =>
            setNewCondition({ ...newCondition, operator: e.target.value as ConditionOperator })
          }
        >
          <option value={ConditionOperator.Equals}>Equals</option>
          <option value={ConditionOperator.NotEquals}>Not Equals</option>
          <option value={ConditionOperator.Contains}>Contains</option>
          <option value={ConditionOperator.GreaterThan}>Greater Than</option>
          <option value={ConditionOperator.LessThan}>Less Than</option>
        </select>
        <input
          type="text"
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          placeholder="Value"
          value={newCondition.value}
          onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
        />
        <select
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={newCondition.action}
          onChange={(e) => setNewCondition({ ...newCondition, action: e.target.value as 'show' | 'hide' })}
        >
          <option value="show">Show</option>
          <option value="hide">Hide</option>
        </select>
        <select
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={newCondition.targetFieldId}
          onChange={(e) => setNewCondition({ ...newCondition, targetFieldId: e.target.value })}
        >
          <option value="">Select Target Field</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.label}
            </option>
          ))}
        </select>
        <button
          className="w-full bg-gradient-to-r from-cyan-400 to-pink-600 text-white px-4 py-2 rounded hover:from-cyan-500 hover:to-pink-700 transition-colors"
          onClick={handleAddCondition}
        >
          Add Condition
        </button>
      </div>
      <div className="space-y-2">
        {conditions.map((condition, index) => (
          <div key={index} className="flex items-center justify-between bg-white bg-opacity-10 p-2 rounded-lg text-white">
            <span>
              {fields.find((f) => f.id === condition.fieldId)?.label} {condition.operator} {condition.value} {condition.action}{' '}
              {fields.find((f) => f.id === condition.targetFieldId)?.label}
            </span>
            <button
              className="text-red-400 hover:text-red-600 transition-colors"
              onClick={() => removeCondition(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

