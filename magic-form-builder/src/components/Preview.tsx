import { useState, useEffect } from 'react'
import { FormField, FieldType, Condition } from '../types/form'

interface PreviewProps {
  fields: FormField[]
  conditions: Condition[]
}

export default function Preview({ fields, conditions }: PreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [visibleFields, setVisibleFields] = useState<string[]>(fields.map((f) => f.id))

  useEffect(() => {
    updateVisibleFields()
  }, [formData, conditions])

  const updateVisibleFields = () => {
    const newVisibleFields = fields.map((field) => field.id)
    conditions.forEach((condition) => {
      const fieldValue = formData[condition.fieldId]
      let conditionMet = false

      switch (condition.operator) {
        case 'equals':
          conditionMet = fieldValue === condition.value
          break
        case 'notEquals':
          conditionMet = fieldValue !== condition.value
          break
        case 'contains':
          conditionMet = fieldValue?.includes(condition.value)
          break
        case 'greaterThan':
          conditionMet = parseFloat(fieldValue) > parseFloat(condition.value)
          break
        case 'lessThan':
          conditionMet = parseFloat(fieldValue) < parseFloat(condition.value)
          break
      }

      if (conditionMet) {
        if (condition.action === 'show') {
          newVisibleFields.push(condition.targetFieldId)
        } else {
          const index = newVisibleFields.indexOf(condition.targetFieldId)
          if (index > -1) {
            newVisibleFields.splice(index, 1)
          }
        }
      }
    })

    setVisibleFields(newVisibleFields)
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value })
  }

  return (
    <div className="max-w-2xl mx-auto bg-white bg-opacity-10 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Form Preview</h2>
      <form className="space-y-6">
        {fields.map((field) => (
          visibleFields.includes(field.id) && (
            <div key={field.id} className="space-y-2">
              <label className="block font-medium text-white">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field, formData[field.id], (value) => handleInputChange(field.id, value))}
            </div>
          )
        ))}
        <button type="submit" className="bg-gradient-to-r from-cyan-400 to-pink-600 text-white px-4 py-2 rounded hover:from-cyan-500 hover:to-pink-700 transition-colors">
          Submit
        </button>
      </form>
    </div>
  )
}

function renderField(field: FormField, value: any, onChange: (value: any) => void) {
  switch (field.type) {
    case FieldType.Text:
      return (
        <input
          type="text"
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      )
    case FieldType.TextArea:
      return (
        <textarea
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        ></textarea>
      )
    case FieldType.Checkbox:
      return (
        <input
          type="checkbox"
          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          required={field.required}
        />
      )
    case FieldType.Radio:
      return (
        <div className="space-y-2">
          {field.options?.map((option, optionIndex) => (
            <label key={optionIndex} className="flex items-center text-white">
              <input
                type="radio"
                className="mr-2"
                name={`field-${field.id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                required={field.required}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )
    case FieldType.Select:
      return (
        <select
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        >
          <option value="">Select an option</option>
          {field.options?.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    case FieldType.File:
      return (
        <input
          type="file"
          className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          onChange={(e) => onChange(e.target.files?.[0])}
          required={field.required}
        />
      )
    case FieldType.Rating:
      return (
        <div className="flex items-center">
          {[...Array(field.maxRating || 5)].map((_, index) => (
            <button
              key={index}
              type="button"
              className={`text-2xl ${
                (value || 0) > index ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => onChange(index + 1)}
            >
              ★
            </button>
          ))}
        </div>
      )
    default:
      return null
  }
}

