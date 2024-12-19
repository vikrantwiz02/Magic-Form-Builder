import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { FormField, FieldType } from '../types/form'

interface FieldListProps {
  fields: FormField[]
  updateField: (index: number, field: FormField) => void
  removeField: (index: number) => void
  moveField: (dragIndex: number, hoverIndex: number) => void
}

export default function FieldList({ fields, updateField, removeField, moveField }: FieldListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Form Fields</h2>
      {fields.map((field, index) => (
        <DraggableField
          key={field.id}
          index={index}
          field={field}
          updateField={updateField}
          removeField={removeField}
          moveField={moveField}
        />
      ))}
    </div>
  )
}

interface DraggableFieldProps {
  index: number
  field: FormField
  updateField: (index: number, field: FormField) => void
  removeField: (index: number) => void
  moveField: (dragIndex: number, hoverIndex: number) => void
}

function DraggableField({ index, field, updateField, removeField, moveField }: DraggableFieldProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'field',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveField(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: () => {
      return { index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.4 : 1
  drag(drop(ref))

  return (
    <div ref={ref} className={`p-4 bg-white bg-opacity-10 rounded-lg shadow-sm ${isDragging ? 'opacity-50' : ''}`} data-handler-id={handlerId}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white">{field.type}</span>
        <button
          className="text-red-400 hover:text-red-600 transition-colors"
          onClick={() => removeField(index)}
        >
          Remove
        </button>
      </div>
      <input
        type="text"
        className="w-full border p-2 rounded mt-2 bg-gray-800 text-white border-gray-700"
        value={field.label}
        onChange={(e) =>
          updateField(index, { ...field, label: e.target.value })
        }
      />
      <label className="flex items-center mt-2 text-white">
        <input
          type="checkbox"
          className="mr-2"
          checked={field.required}
          onChange={(e) =>
            updateField(index, { ...field, required: e.target.checked })
          }
        />
        Required
      </label>
      {(field.type === FieldType.Radio || field.type === FieldType.Select) && (
        <input
          type="text"
          className="w-full border p-2 rounded mt-2 bg-gray-800 text-white border-gray-700"
          placeholder="Options (comma-separated)"
          value={field.options?.join(', ') || ''}
          onChange={(e) =>
            updateField(index, {
              ...field,
              options: e.target.value.split(',').map((opt) => opt.trim()),
            })
          }
        />
      )}
      {field.type === FieldType.Rating && (
        <input
          type="number"
          className="w-full border p-2 rounded mt-2 bg-gray-800 text-white border-gray-700"
          placeholder="Max Rating (1-10)"
          min="1"
          max="10"
          value={field.maxRating || ''}
          onChange={(e) =>
            updateField(index, {
              ...field,
              maxRating: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)),
            })
          }
        />
      )}
    </div>
  )
}

