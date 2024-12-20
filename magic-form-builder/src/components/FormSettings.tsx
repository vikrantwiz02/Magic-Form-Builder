'use client'

import { FormSettings as FormSettingsType } from '../types/form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FormSettingsProps {
  settings: FormSettingsType
  updateSettings: (newSettings: Partial<FormSettingsType>) => void
}

export default function FormSettings({ settings, updateSettings }: FormSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="formTitle">Form Title</Label>
            <Input
              id="formTitle"
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="formDescription">Form Description</Label>
            <Textarea
              id="formDescription"
              value={settings.description}
              onChange={(e) => updateSettings({ description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="submitButtonText">Submit Button Text</Label>
            <Input
              id="submitButtonText"
              value={settings.submitButtonText}
              onChange={(e) => updateSettings({ submitButtonText: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="successMessage">Success Message</Label>
            <Textarea
              id="successMessage"
              value={settings.successMessage}
              onChange={(e) => updateSettings({ successMessage: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => updateSettings({ theme: value as 'light' | 'dark' })}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

