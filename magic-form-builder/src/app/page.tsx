import FormBuilder from '../components/FormBuilder'

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <h1 className="form-builder-title">
        Magic Form Builder
      </h1>
      <div className="form-builder-container max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md">
        <FormBuilder />
      </div>
    </main>
  )
}

