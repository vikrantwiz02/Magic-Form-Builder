'use client'

import { useState } from 'react'
import { FormField, Condition, ConditionOperator } from '../types/form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Conditional Logic</h2>
      <Card>
        <CardHeader>
          <CardTitle>Add New Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fieldId">If Field</Label>
              <Select
                value={newCondition.fieldId}
                onValueChange={(value) => setNewCondition({ ...newCondition, fieldId: value })}
              >
                <SelectTrigger id="fieldId">
                  <SelectValue placeholder="Select Field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="operator">Operator</Label>
              <Select
                value={newCondition.operator}
                onValueChange={(value) =>
                  setNewCondition({ ...newCondition, operator: value as ConditionOperator })
                }
              >
                <SelectTrigger id="operator">
                  <SelectValue placeholder="Select Operator" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ConditionOperator).map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={newCondition.value}
                onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                placeholder="Enter value"
              />
            </div>
            <div>
              <Label htmlFor="action">Action</Label>
              <Select
                value={newCondition.action}
                onValueChange={(value) => setNewCondition({ ...newCondition, action: value as 'show' | 'hide' })}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="show">Show</SelectItem>
                  <SelectItem value="hide">Hide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetFieldId">Target Field</Label>
              <Select
                value={newCondition.targetFieldId}
                onValueChange={(value) => setNewCondition({ ...newCondition, targetFieldId: value })}
              >
                <SelectTrigger id="targetFieldId">
                  <SelectValue placeholder="Select Target Field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddCondition} className="w-full">
              Add Condition
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {conditions.map((condition, index) => (
          <Card key={index}>
            <CardContent className="flex items-center justify-between py-4">
              <span className="text-sm">
                If {fields.find((f) => f.id === condition.fieldId)?.label} {condition.operator} {condition.value} {condition.action}{' '}
                {fields.find((f) => f.id === condition.targetFieldId)?.label}
              </span>
              <Button variant="destructive" size="sm" onClick={() => removeCondition(index)}>
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

