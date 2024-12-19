import FormBuilder from '../components/FormBuilder'

export default function Home() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="form-builder-title text-center">
          Advanced Form Builder
        </h1>
        <div className="form-builder-container mt-8">
          <FormBuilder />
        </div>
      </div>
    </div>
  )
}

