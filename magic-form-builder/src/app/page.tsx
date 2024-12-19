import FormBuilder from '../components/FormBuilder'

export default function Home() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="form-builder-title text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12">
        Magic Form Builder
      </h1>
      <div className="form-builder-container max-w-7xl mx-auto p-8">
        <FormBuilder />
      </div>
    </div>
  )
}

