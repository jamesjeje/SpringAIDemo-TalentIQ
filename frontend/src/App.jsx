import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ResumeUploadPage } from './pages/ResumeUploadPage'
import { GenerateQuestionsPage } from './pages/GenerateQuestionsPage'
import { SendEmailPage } from './pages/SendEmailPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/resume-upload" replace />} />
        <Route path="/resume-upload" element={<ResumeUploadPage />} />
        <Route path="/questions" element={<GenerateQuestionsPage />} />
        <Route path="/send-email" element={<SendEmailPage />} />
      </Routes>
    </Layout>
  )
}

export default App
