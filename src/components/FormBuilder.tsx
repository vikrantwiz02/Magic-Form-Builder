'use client'

import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FieldEditor from './FieldEditor'
import FieldList from './FieldList'
import Preview from './Preview'
import ConditionalLogic from './ConditionalLogic'
import FormSettings from './FormSettings'
import CodeGenerator from './CodeGenerator'
import { FormField, Condition, FormSettings as FormSettingsType } from '../types/form'

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [formSettings, setFormSettings] = useState<FormSettingsType>({
    title: 'Untitled Form',
    description: '',
    submitButtonText: 'Submit',
    successMessage: 'Thank you for your submission!',
    theme: 'light',
  })

  const addField = (field: FormField) => {
    setFields((prevFields) => [...prevFields, field])
  }

  const updateField = (index: number, field: FormField) => {
    setFields((prevFields) => {
      const newFields = [...prevFields]
      newFields[index] = field
      return newFields
    })
  }

  const removeField = (index: number) => {
    setFields((prevFields) => prevFields.filter((_, i) => i !== index))
  }

  const moveField = (dragIndex: number, hoverIndex: number) => {
    setFields((prevFields) => {
      const newFields = [...prevFields]
      const [draggedField] = newFields.splice(dragIndex, 1)
      newFields.splice(hoverIndex, 0, draggedField)
      return newFields
    })
  }

  const addCondition = (condition: Condition) => {
    setConditions((prevConditions) => [...prevConditions, condition])
  }

  const removeCondition = (index: number) => {
    setConditions((prevConditions) => prevConditions.filter((_, i) => i !== index))
  }

  const updateSettings = (newSettings: Partial<FormSettingsType>) => {
    setFormSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="logic">Conditional Logic</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FieldEditor addField={addField} />
            <FieldList
              fields={fields}
              updateField={updateField}
              removeField={removeField}
              moveField={moveField}
            />
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <Preview fields={fields} conditions={conditions} formSettings={formSettings} />
        </TabsContent>
        <TabsContent value="logic">
          <ConditionalLogic
            fields={fields}
            conditions={conditions}
            addCondition={addCondition}
            removeCondition={removeCondition}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FormSettings settings={formSettings} updateSettings={updateSettings} />
        </TabsContent>
        <TabsContent value="code">
          <CodeGenerator fields={fields} conditions={conditions} formSettings={formSettings} />
        </TabsContent>
      </Tabs>
    </DndProvider>
  )
}

