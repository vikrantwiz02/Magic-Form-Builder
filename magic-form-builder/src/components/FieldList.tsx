import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { FormField, FieldType } from '../types/form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FieldListProps {
  fields: FormField[]
  updateField: (index: number, field: FormField) => void
  removeField: (index: number) => void
  moveField: (dragIndex: number, hoverIndex: number) => void
}

export default function FieldList({ fields, updateField, removeField, moveField }: FieldListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Form Fields</h2>
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
    <Card ref={ref} className={`${isDragging ? 'opacity-50' : ''}`} data-handler-id={handlerId}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{field.type}</span>
          <Button variant="destructive" size="sm" onClick={() => removeField(index)}>
            Remove
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`field-label-${field.id}`}>Label</Label>
            <Input
              id={`field-label-${field.id}`}
              value={field.label}
              onChange={(e) =>
                updateField(index, { ...field, label: e.target.value })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`field-required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) =>
                updateField(index, { ...field, required: checked as boolean })
              }
            />
            <Label htmlFor={`field-required-${field.id}`}>Required</Label>
          </div>
          {(field.type === FieldType.Radio || field.type === FieldType.Select) && (
            <div>
              <Label htmlFor={`field-options-${field.id}`}>Options (comma-separated)</Label>
              <Input
                id={`field-options-${field.id}`}
                value={field.options?.join(', ') || ''}
                onChange={(e) =>
                  updateField(index, {
                    ...field,
                    options: e.target.value.split(',').map((opt) => opt.trim()),
                  })
                }
              />
            </div>
          )}
          {field.type === FieldType.Rating && (
            <div>
              <Label htmlFor={`field-max-rating-${field.id}`}>Max Rating (1-10)</Label>
              <Input
                id={`field-max-rating-${field.id}`}
                type="number"
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

