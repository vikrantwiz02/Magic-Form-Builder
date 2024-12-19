'use client'

import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import FieldEditor from './FileEditor'
import FieldList from './FieldList'
import Preview from './Preview'
import CodeGenerator from './CodeGenerator'
import ConditionalLogic from './ConditionalLogic'
import { FormField, Condition } from '../types/form'

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'code' | 'logic'>('editor')
  const [conditions, setConditions] = useState<Condition[]>([])

  const addField = (field: FormField) => {
    setFields([...fields, field])
  }

  const updateField = (index: number, field: FormField) => {
    const newFields = [...fields]
    newFields[index] = field
    setFields(newFields)
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const newFields = [...fields]
    const draggedField = newFields[dragIndex]
    newFields.splice(dragIndex, 1)
    newFields.splice(hoverIndex, 0, draggedField)
    setFields(newFields)
  }

  const addCondition = (condition: Condition) => {
    setConditions([...conditions, condition])
  }

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index)
    setConditions(newConditions)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden border border-gray-200 border-opacity-20">
        <div className="flex border-b border-gray-200 border-opacity-20">
          <TabButton active={activeTab === 'editor'} onClick={() => setActiveTab('editor')}>
            Editor
          </TabButton>
          <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
            Preview
          </TabButton>
          <TabButton active={activeTab === 'logic'} onClick={() => setActiveTab('logic')}>
            Conditional Logic
          </TabButton>
          <TabButton active={activeTab === 'code'} onClick={() => setActiveTab('code')}>
            Generate Code
          </TabButton>
        </div>
        <div className="p-6">
          {activeTab === 'editor' && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <FieldEditor addField={addField} />
              </div>
              <div className="w-full md:w-2/3">
                <FieldList
                  fields={fields}
                  updateField={updateField}
                  removeField={removeField}
                  moveField={moveField}
                />
              </div>
            </div>
          )}
          {activeTab === 'preview' && <Preview fields={fields} conditions={conditions} />}
          {activeTab === 'logic' && (
            <ConditionalLogic
              fields={fields}
              conditions={conditions}
              addCondition={addCondition}
              removeCondition={removeCondition}
            />
          )}
          {activeTab === 'code' && <CodeGenerator fields={fields} conditions={conditions} />}
        </div>
      </div>
    </DndProvider>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className={`tab-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

