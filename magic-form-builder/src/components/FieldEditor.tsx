'use client'

import { useState } from 'react'
import { FormField, FieldType } from '../types/form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    min: undefined,
    max: undefined,
    maxRating: 5,
  })

  const handleAddField = () => {
    if (newField.label) {
      addField({ ...newField, id: `field_${Date.now()}` })
      setNewField({
        id: '',
        type: FieldType.Text,
        label: '',
        required: false,
        options: [],
        min: undefined,
        max: undefined,
        maxRating: 5,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Field</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fieldType">Field Type</Label>
            <Select
              value={newField.type}
              onValueChange={(value) => setNewField({ ...newField, type: value as FieldType })}
            >
              <SelectTrigger id="fieldType">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FieldType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fieldLabel">Field Label</Label>
            <Input
              id="fieldLabel"
              type="text"
              placeholder="Field Label"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
          </div>
          {(newField.type === FieldType.Radio || newField.type === FieldType.Select) && (
            <div>
              <Label htmlFor="fieldOptions">Options (comma-separated)</Label>
              <Input
                id="fieldOptions"
                type="text"
                placeholder="Option 1, Option 2, Option 3"
                value={newField.options?.join(', ') || ''}
                onChange={(e) => setNewField({ ...newField, options: e.target.value.split(',').map(o => o.trim()) })}
              />
            </div>
          )}
          {newField.type === FieldType.Integer && (
            <>
              <div>
                <Label htmlFor="fieldMin">Minimum Value</Label>
                <Input
                  id="fieldMin"
                  type="number"
                  value={newField.min || ''}
                  onChange={(e) => setNewField({ ...newField, min: parseInt(e.target.value) || undefined })}
                />
              </div>
              <div>
                <Label htmlFor="fieldMax">Maximum Value</Label>
                <Input
                  id="fieldMax"
                  type="number"
                  value={newField.max || ''}
                  onChange={(e) => setNewField({ ...newField, max: parseInt(e.target.value) || undefined })}
                />
              </div>
            </>
          )}
          {newField.type === FieldType.Rating && (
            <div>
              <Label htmlFor="fieldMaxRating">Maximum Rating</Label>
              <Input
                id="fieldMaxRating"
                type="number"
                value={newField.maxRating || 5}
                onChange={(e) => setNewField({ ...newField, maxRating: parseInt(e.target.value) || 5 })}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={newField.required}
              onCheckedChange={(checked) =>
                setNewField({ ...newField, required: checked as boolean })
              }
            />
            <Label htmlFor="required">Required</Label>
          </div>
          <Button onClick={handleAddField} className="w-full">
            Add Field
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

