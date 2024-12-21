'use client'

import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { FormField } from '../types/form'
import { Button } from "@/components/ui/button"
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
        handlerId: monitor.getHandlerId() as string | null,
      }
    },
    hover(item: unknown, monitor) {
      if (!ref.current) {
        return
      }
      const dragItem = item as { index: number };
      const dragIndex = dragItem.index
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
      dragItem.index = hoverIndex
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
    <Card ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{field.type}</span>
          <Button variant="destructive" size="sm" onClick={() => removeField(index)}>
            Remove
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{field.label}</p>
        <p>{field.required ? 'Required' : 'Optional'}</p>
      </CardContent>
    </Card>
  )
}

