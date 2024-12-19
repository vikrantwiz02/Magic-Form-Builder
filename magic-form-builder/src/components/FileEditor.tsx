import { useState } from 'react'
import { FormField, FieldType } from '../types/form'

interface FieldEditorProps {
  addField: (field: FormField) => void
}

export default function FieldEditor({ addField }: FieldEditorProps) {
  const [newField, setNewField] = useState<FormField>({
    id: '',
    type: FieldType.Text,
    label: '',
    required: false,
    options: [],
  })

  const handleAddField = () => {
    if (newField.label) {
      addField({ ...newField, id: `field_${Date.now()}` })
      setNewField({ id: '', type: FieldType.Text, label: '', required: false, options: [] })
    }
  }

  return (
    <div className="space-y-4 bg-white bg-opacity-10 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-white">Add New Field</h2>
      <div className="space-y-2">
        <select
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={newField.type}
          onChange={(e) =>
            setNewField({ ...newField, type: e.target.value as FieldType })
          }
        >
          {Object.values(FieldType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          placeholder="Field Label"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />
        <label className="flex items-center text-white">
          <input
            type="checkbox"
            className="mr-2"
            checked={newField.required}
            onChange={(e) =>
              setNewField({ ...newField, required: e.target.checked })
            }
          />
          Required
        </label>
        {(newField.type === FieldType.Radio || newField.type === FieldType.Select) && (
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
            placeholder="Options (comma-separated)"
            value={newField.options?.join(', ') || ''}
            onChange={(e) =>
              setNewField({
                ...newField,
                options: e.target.value.split(',').map((opt) => opt.trim()),
              })
            }
          />
        )}
        {newField.type === FieldType.Rating && (
          <input
            type="number"
            className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
            placeholder="Max Rating (1-10)"
            min="1"
            max="10"
            value={newField.maxRating || ''}
            onChange={(e) =>
              setNewField({
                ...newField,
                maxRating: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)),
              })
            }
          />
        )}
        <button
          className="w-full bg-gradient-to-r from-cyan-400 to-pink-600 text-white px-4 py-2 rounded hover:from-cyan-500 hover:to-pink-700 transition-colors"
          onClick={handleAddField}
        >
          Add Field
        </button>
      </div>
    </div>
  )
}

