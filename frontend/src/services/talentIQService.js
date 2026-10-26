import talentIQApi from './talentIQApi'

export const uploadResume = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await talentIQApi.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const generateQuestions = async ({ candidateName, jobDescription }) => {
  const response = await talentIQApi.post('/interviews/questions', {
    candidateName,
    jobDescription,
  })

  return response.data
}

export const sendInterviewEmail = async ({ candidateName, candidateEmail, jobDescription }) => {
  const response = await talentIQApi.post('/interviews/send-email', {
    candidateName,
    candidateEmail,
    jobDescription,
  })

  return response.data
}
