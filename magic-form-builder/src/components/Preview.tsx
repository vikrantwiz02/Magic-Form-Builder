'use client'

import { useState, useEffect } from 'react'
import { FormField, FieldType, Condition, FormSettings } from '../types/form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'

interface PreviewProps {
  fields: FormField[]
  conditions: Condition[]
  formSettings: FormSettings
}

export default function Preview({ fields, conditions, formSettings }: PreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [visibleFields, setVisibleFields] = useState<string[]>(fields.map((f) => f.id))
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
  }

  const themeClass = formSettings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'

  if (submitted) {
    return (
      <Card className={themeClass}>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">{formSettings.successMessage}</h2>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={themeClass}>
      <CardHeader>
        <CardTitle>{formSettings.title}</CardTitle>
        {formSettings.description && <CardDescription>{formSettings.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            visibleFields.includes(field.id) && (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field, formData[field.id], (value) => handleInputChange(field.id, value))}
              </div>
            )
          ))}
          <Button type="submit">
            {formSettings.submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function renderField(field: FormField, value: any, onChange: (value: any) => void) {
  switch (field.type) {
    case FieldType.Text:
      return (
        <Input
          id={field.id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      )
    case FieldType.TextArea:
      return (
        <Textarea
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      )
    case FieldType.Checkbox:
      return (
        <Checkbox
          id={field.id}
          checked={value || false}
          onCheckedChange={(checked) => onChange(checked)}
          required={field.required}
        />
      )
    case FieldType.Radio:
      return (
        <RadioGroup
          value={value}
          onValueChange={onChange}
        >
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${field.id}-${index}`} />
              <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    case FieldType.Select:
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case FieldType.File:
      return (
        <Input
          id={field.id}
          type="file"
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
    case FieldType.Integer:
      return (
        <Input
          id={field.id}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseInt(e.target.value))}
          required={field.required}
          min={field.min}
          max={field.max}
        />
      )
    case FieldType.Date:
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!value && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )
    default:
      return null
  }
}

