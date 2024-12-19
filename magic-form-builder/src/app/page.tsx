import FormBuilder from '../components/FormBuilder'

export default function Home() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <h1 className="form-builder-title mb-8">
        Advanced Form Builder
      </h1>
      <div className="form-builder-container w-full max-w-7xl">
        <FormBuilder />
      </div>
    </div>
  )
}

