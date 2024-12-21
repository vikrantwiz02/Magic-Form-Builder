import { useState } from 'react'
import { FormField, Condition, FormSettings, FieldType } from '../types/form'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardIcon } from 'lucide-react'

interface CodeGeneratorProps {
  fields: FormField[]
  conditions: Condition[]
  formSettings: FormSettings
}

export default function CodeGenerator({ fields, conditions, formSettings }: CodeGeneratorProps) {
  const [language, setLanguage] = useState('react-tailwind')
  const [copied, setCopied] = useState(false)

  const generateCode = () => {
    switch (language) {
      case 'react-tailwind':
        return generateReactTailwindCode(fields, conditions, formSettings)
      case 'html-css':
        return generateHtmlCssCode(fields, conditions, formSettings)
      default:
        return 'Unsupported language'
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language/Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react-tailwind">React + Tailwind</SelectItem>
                <SelectItem value="html-css">HTML + CSS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 max-h-96">
              <code>{generateCode()}</code>
            </pre>
            <Button
              className="absolute top-2 right-2"
              size="icon"
              onClick={copyCode}
            >
              <ClipboardIcon className="h-4 w-4" />
            </Button>
          </div>
          {copied && <p className="text-green-500 text-sm">Copied to clipboard!</p>}
        </div>
      </CardContent>
    </Card>
  )
}

function generateReactTailwindCode(fields: FormField[], conditions: Condition[], formSettings: FormSettings): string {
  return `
import React, { useState, useEffect } from 'react';

export default function GeneratedForm() {
  const [formData, setFormData] = useState({});
  const [visibleFields, setVisibleFields] = useState(${JSON.stringify(fields.map(f => f.id))});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    updateVisibleFields();
  }, [formData]);

  const updateVisibleFields = () => {
    const newVisibleFields = [...visibleFields];
    ${conditions.map(condition => `
    if (formData['${condition.fieldId}'] ${getOperatorString(condition.operator)} ${JSON.stringify(condition.value)}) {
      const index = newVisibleFields.indexOf('${condition.targetFieldId}');
      if ('${condition.action}' === 'show' && index === -1) {
        newVisibleFields.push('${condition.targetFieldId}');
      } else if ('${condition.action}' === 'hide' && index > -1) {
        newVisibleFields.splice(index, 1);
      }
    }
    `).join('\n')}
    setVisibleFields(newVisibleFields);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return <div className="text-center">${formSettings.successMessage}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">${formSettings.title}</h2>
      ${formSettings.description ? `<p className="mb-6">${formSettings.description}</p>` : ''}
      ${fields.map(field => `
      {visibleFields.includes('${field.id}') && (
        <div key="${field.id}" className="space-y-2">
          <label htmlFor="${field.id}" className="block font-medium">
            ${field.label}
            ${field.required ? `<span className="text-red-500 ml-1">*</span>` : ''}
          </label>
          ${renderReactField(field)}
        </div>
      )}
      `).join('\n')}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        ${formSettings.submitButtonText}
      </button>
    </form>
  );
}
`
}

function generateHtmlCssCode(fields: FormField[], conditions: Condition[], formSettings: FormSettings): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formSettings.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }
    form {
      max-width: 500px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input[type="text"], input[type="email"], input[type="number"], input[type="date"], textarea, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <form id="generatedForm">
    <h2>${formSettings.title}</h2>
    ${formSettings.description ? `<p>${formSettings.description}</p>` : ''}
    ${fields.map(field => `
    <div class="form-group" id="${field.id}-container">
      <label for="${field.id}">${field.label}${field.required ? ' <span style="color: red;">*</span>' : ''}</label>
      ${renderHtmlField(field)}
    </div>
    `).join('\n')}
    <button type="submit">${formSettings.submitButtonText}</button>
  </form>
  <script>
    const form = document.getElementById('generatedForm');
    const formData = {};
    let visibleFields = ${JSON.stringify(fields.map(f => f.id))};

    function updateVisibleFields() {
      ${conditions.map(condition => `
      if (formData['${condition.fieldId}'] ${getOperatorString(condition.operator)} ${JSON.stringify(condition.value)}) {
        const container = document.getElementById('${condition.targetFieldId}-container');
        if ('${condition.action}' === 'show') {
          container.style.display = 'block';
          if (!visibleFields.includes('${condition.targetFieldId}')) {
            visibleFields.push('${condition.targetFieldId}');
          }
        } else if ('${condition.action}' === 'hide') {
          container.style.display = 'none';
          const index = visibleFields.indexOf('${condition.targetFieldId}');
          if (index > -1) {
            visibleFields.splice(index, 1);
          }
        }
      }
      `).join('\n')}
    }

    form.addEventListener('input', function(event) {
      const { name, value, type, checked } = event.target;
      formData[name] = type === 'checkbox' ? checked : value;
      updateVisibleFields();
    });

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      console.log(formData);
      form.innerHTML = '<div style="text-align: center;">${formSettings.successMessage}</div>';
    });

    // Initial visibility update
    updateVisibleFields();
  </script>
</body>
</html>
`
}

function renderReactField(field: FormField): string {
  switch (field.type) {
    case FieldType.Text:
      return `<input type="text" id="${field.id}" name="${field.id}" onChange={handleInputChange} required={${field.required}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />`
    case FieldType.TextArea:
      return `<textarea id="${field.id}" name="${field.id}" onChange={handleInputChange} required={${field.required}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>`
    case FieldType.Checkbox:
      return `<input type="checkbox" id="${field.id}" name="${field.id}" onChange={handleInputChange} required={${field.required}} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50" />`
    case FieldType.Radio:
      return `
        <div className="mt-1 space-y-2">
          ${field.options?.map((option, index) => `
            <label key="${index}" className="inline-flex items-center">
              <input type="radio" id="${field.id}-${index}" name="${field.id}" value="${option}" onChange={handleInputChange} required={${field.required}} className="rounded-full border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
              <span className="ml-2">${option}</span>
            </label>
          `).join('\n')}
        </div>
      `
    case FieldType.Select:
      return `
        <select id="${field.id}" name="${field.id}" onChange={handleInputChange} required={${field.required}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="">Select an option</option>
          ${field.options?.map((option, index) => `<option key="${index}" value="${option}">${option}</option>`).join('\n')}
        </select>
      `
    case FieldType.File:
      return `<input type="file" id="${field.id}" name="${field.id}" onChange={handleInputChange} required={${field.required}} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />`
    case FieldType.Rating:
      return `
        <div className="flex items-center mt-1">
          {[...Array(${field.maxRating || 5})].map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleInputChange({ target: { name: '${field.id}', value: index + 1 } })}
              className={\`text-2xl \${index < (formData['${field.id}'] || 0) ? 'text-yellow-400' : 'text-gray-300'}\`}
            >
              ★
            </button>
          ))}
        </div>
      `
    case FieldType.Integer:
      return `<input type="number" id="${field.id}" name="${field.id}" onChange={handleInputChange} required={${field.required}} min={${field.min}} max={${field.max}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />`
    case FieldType.Date:
      return `
        <input
          type="date"
          id="${field.id}"
          name="${field.id}"
          onChange={handleInputChange}
          required={${field.required}}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      `
    default:
      return ''
  }
}

function renderHtmlField(field: FormField): string {
  switch (field.type) {
    case FieldType.Text:
      return `<input type="text" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />`
    case FieldType.TextArea:
      return `<textarea id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}></textarea>`
    case FieldType.Checkbox:
      return `<input type="checkbox" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />`
    case FieldType.Radio:
      return field.options?.map((option, index) => `
        <label>
          <input type="radio" id="${field.id}-${index}" name="${field.id}" value="${option}" ${field.required ? 'required' : ''} />
          ${option}
        </label>
      `).join('\n') || ''
    case FieldType.Select:
      return `
        <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
          <option value="">Select an option</option>
          ${field.options?.map(option => `<option value="${option}">${option}</option>`).join('\n')}
        </select>
      `
    case FieldType.File:
      return `<input type="file" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />`
    case FieldType.Rating:
      return `
        <div class="rating">
          ${[...Array(field.maxRating || 5)].map((_, index) => `
            <input type="radio" id="${field.id}-${index + 1}" name="${field.id}" value="${index + 1}" ${field.required ? 'required' : ''} />
            <label for="${field.id}-${index + 1}">★</label>
          `).join('\n')}
        </div>
      `
    case FieldType.Integer:
      return `<input type="number" id="${field.id}" name="${field.id}" min="${field.min}" max="${field.max}" ${field.required ? 'required' : ''} />`
    case FieldType.Date:
      return `<input type="date" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />`
    default:
      return ''
  }
}

function getOperatorString(operator: string): string {
  switch (operator) {
    case 'equals':
      return '==='
    case 'notEquals':
      return '!=='
    case 'contains':
      return '.includes'
    case 'greaterThan':
      return '>'
    case 'lessThan':
      return '<'
    default:
      return '==='
  }
}

