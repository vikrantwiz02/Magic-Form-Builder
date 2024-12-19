import { useState } from 'react'
import { FormField, Condition } from '../types/form'
import { ClipboardIcon } from '@heroicons/react/24/outline'

interface CodeGeneratorProps {
  fields: FormField[]
  conditions: Condition[]
}

export default function CodeGenerator({ fields, conditions }: CodeGeneratorProps) {
  const [language, setLanguage] = useState('react-tailwind')
  const [copied, setCopied] = useState(false)

  const generateCode = () => {
    switch (language) {
      case 'react-tailwind':
        return generateReactTailwindCode(fields, conditions)
      case 'typescript-tailwind':
        return generateTypeScriptTailwindCode(fields, conditions)
      case 'html-css':
        return generateHtmlCssCode(fields, conditions)
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Generate Code</h2>
      <div className="mb-4">
        <label className="block mb-2 text-white">Select Language/Framework:</label>
        <select
          className="w-full border p-2 rounded bg-gray-800 text-white border-gray-700"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="react-tailwind">React + Tailwind</option>
          <option value="typescript-tailwind">TypeScript + Tailwind</option>
          <option value="html-css">HTML + CSS</option>
        </select>
      </div>
      <div className="relative">
        <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 max-h-96">
          <code>{generateCode()}</code>
        </pre>
        <button
          className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          onClick={copyCode}
        >
          <ClipboardIcon className="h-5 w-5 text-white" />
        </button>
        {copied && (
          <span className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
            Copied!
          </span>
        )}
      </div>
    </div>
  )
}

function generateReactTailwindCode(fields: FormField[], conditions: Condition[]): string {
  const imports = `import React, { useState, useEffect } from 'react';`

  const formDataState = `const [formData, setFormData] = useState({});`

  const handleInputChange = `
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  `

  const conditionalLogic = `
  const [visibleFields, setVisibleFields] = useState(${JSON.stringify(fields.map(f => f.id))});

  useEffect(() => {
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
  }, [formData]);
  `

  const formFields = fields.map(field => `
    {visibleFields.includes('${field.id}') && (
      <div key="${field.id}" className="mb-4">
        <label className="block text-sm font-medium text-gray-700">${field.label}</label>
        ${renderReactField(field)}
      </div>
    )}
  `).join('\n')

  return `
${imports}

export default function Form() {
  ${formDataState}
  ${handleInputChange}
  ${conditionalLogic}

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      ${formFields}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        Submit
      </button>
    </form>
  );
}
  `
}

function generateTypeScriptTailwindCode(fields: FormField[], conditions: Condition[]): string {
  const imports = `import React, { useState, useEffect } from 'react';`

  const interfaces = `
interface FormData {
  ${fields.map(field => `${field.id}: ${getTypeScriptType(field.type)};`).join('\n  ')}
}

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  maxRating?: number;
}

interface Condition {
  fieldId: string;
  operator: string;
  value: string;
  action: 'show' | 'hide';
  targetFieldId: string;
}
  `

  const formDataState = `const [formData, setFormData] = useState<FormData>({});`

  const handleInputChange = `
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  `

  const conditionalLogic = `
  const [visibleFields, setVisibleFields] = useState<string[]>(${JSON.stringify(fields.map(f => f.id))});

  useEffect(() => {
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
  }, [formData]);
  `

  const formFields = fields.map(field => `
    {visibleFields.includes('${field.id}') && (
      <div key="${field.id}" className="mb-4">
        <label className="block text-sm font-medium text-gray-700">${field.label}</label>
        ${renderReactField(field)}
      </div>
    )}
  `).join('\n')

  return `
${imports}

${interfaces}

export default function Form() {
  ${formDataState}
  ${handleInputChange}
  ${conditionalLogic}

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      ${formFields}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        Submit
      </button>
    </form>
  );
}
  `
}

function generateHtmlCssCode(fields: FormField[], conditions: Condition[]): string {
  const htmlFields = fields.map(field => `
    <div class="form-group" id="${field.id}-container">
      <label for="${field.id}">${field.label}</label>
      ${renderHtmlField(field)}
    </div>
  `).join('\n')

  const cssStyles = `
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
      input[type="text"], input[type="email"], textarea, select {
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
  `

  const javaScript = `
    <script>
      const formData = {};
      const visibleFields = ${JSON.stringify(fields.map(f => f.id))};

      function handleInputChange(event) {
        const { name, value, type, checked } = event.target;
        formData[name] = type === 'checkbox' ? checked : value;
        updateVisibleFields();
      }

      function updateVisibleFields() {
        ${conditions.map(condition => `
        if (formData['${condition.fieldId}'] ${getOperatorString(condition.operator)} ${JSON.stringify(condition.value)}) {
          const container = document.getElementById('${condition.targetFieldId}-container');
          if ('${condition.action}' === 'show') {
            container.style.display = 'block';
          } else if ('${condition.action}' === 'hide') {
            container.style.display = 'none';
          }
        }
        `).join('\n')}
      }

      function handleSubmit(event) {
        event.preventDefault();
        console.log(formData);
        // Handle form submission
      }

      document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('change', handleInputChange);
      });

      document.querySelector('form').addEventListener('submit', handleSubmit);
    </script>
  `

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Form</title>
  ${cssStyles}
</head>
<body>
  <form>
    ${htmlFields}
    <button type="submit">Submit</button>
  </form>
  ${javaScript}
</body>
</html>
  `
}

function renderReactField(field: FormField): string {
  switch (field.type) {
    case 'Text':
      return `<input type="text" name="${field.id}" onChange={handleInputChange} required={${field.required}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />`
    case 'TextArea':
      return `<textarea name="${field.id}" onChange={handleInputChange} required={${field.required}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>`
    case 'Checkbox':
      return `<input type="checkbox" name="${field.id}" onChange={handleInputChange} required={${field.required}} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50" />`
    case 'Radio':
      return `
        <div className="mt-1 space-y-2">
          ${field.options?.map((option, index) => `
            <label key="${index}" className="inline-flex items-center">
              <input type="radio" name="${field.id}" value="${option}" onChange={handleInputChange} required={${field.required}} className="rounded-full border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
              <span className="ml-2">${option}</span>
            </label>
          `).join('\n')}
        </div>
      `
    case 'Select':
      return `
        <select name="${field.id}" onChange={handleInputChange} required={${field.required}} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="">Select an option</option>
          ${field.options?.map((option, index) => `<option key="${index}" value="${option}">${option}</option>`).join('\n')}
        </select>
      `
    case 'File':
      return `<input type="file" name="${field.id}" onChange={handleInputChange} required={${field.required}} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />`
    case 'Rating':
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
    default:
      return ''
  }
}

function renderHtmlField(field: FormField): string {
  switch (field.type) {
    case 'Text':
      return `<input type="text" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />`
    case 'TextArea':
      return `<textarea id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}></textarea>`
    case 'Checkbox':
      return `<input type="checkbox" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />`
    case 'Radio':
      return field.options?.map((option, index) => `
        <label>
          <input type="radio" id="${field.id}-${index}" name="${field.id}" value="${option}" ${field.required ? 'required' : ''} />
          ${option}
        </label>
      `).join('\n') || ''
    case 'Select':
      return `
        <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
          <option value="">Select an option</option>
          ${field.options?.map(option => `<option value="${option}">${option}</option>`).join('\n')}
        </select>
      `
    case 'File':
      return `<input type="file" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />`
    case 'Rating':
      return `
        <div class="rating">
          ${[...Array(field.maxRating || 5)].map((_, index) => `
            <input type="radio" id="${field.id}-${index + 1}" name="${field.id}" value="${index + 1}" ${field.required ? 'required' : ''} />
            <label for="${field.id}-${index + 1}">★</label>
          `).join('\n')}
        </div>
      `
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

function getTypeScriptType(fieldType: string): string {
  switch (fieldType) {
    case 'Text':
    case 'TextArea':
    case 'Radio':
    case 'Select':
      return 'string'
    case 'Checkbox':
      return 'boolean'
    case 'File':
      return 'File | null'
    case 'Rating':
      return 'number'
    default:
      return 'any'
  }
}

