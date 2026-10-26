import { Card, CardContent, Stepper, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ArticleIcon from '@mui/icons-material/Article'
import InsightsIcon from '@mui/icons-material/Insights'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import StorageIcon from '@mui/icons-material/Storage'
import PsychologyIcon from '@mui/icons-material/Psychology'
import RateReviewIcon from '@mui/icons-material/RateReview'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EmailIcon from '@mui/icons-material/Email'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { PipelineStep } from './PipelineStep'

const pipelineStatusByMode = {
  resume: [
    { key: 'resumeUpload', title: 'Resume Upload', description: 'Candidate CV submitted for screening.', status: 'completed', icon: UploadFileIcon },
    { key: 'readDocument', title: 'MCP Tool: read_document', description: 'Resume is read and parsed for content extraction.', status: 'completed', icon: ArticleIcon },
    { key: 'metadata', title: 'Metadata Extraction', description: 'Skills, experience and education are identified.', status: 'completed', icon: InsightsIcon },
    { key: 'chunking', title: 'Chunking', description: 'Document is segmented into reusable content blocks.', status: 'completed', icon: AccountTreeIcon },
    { key: 'vectorStore', title: 'Vector Store', description: 'Candidate context is prepared for retrieval.', status: 'completed', icon: StorageIcon },
    { key: 'planner', title: 'Planner Agent', description: 'Recruitment strategy is mapped to key themes.', status: 'pending', icon: PsychologyIcon },
    { key: 'questionWriter', title: 'Question Writer Agent', description: 'Role-based interview prompts are created.', status: 'pending', icon: AutoAwesomeIcon },
    { key: 'questionReviewer', title: 'Question Reviewer Agent', description: 'Responses are refined for quality and depth.', status: 'pending', icon: RateReviewIcon },
    { key: 'sendEmailTool', title: 'MCP Tool: send_email', description: 'Candidate communication workflow is prepared.', status: 'pending', icon: EmailIcon },
    { key: 'candidateEmail', title: 'Candidate Email', description: 'Interview brief is delivered to the applicant.', status: 'pending', icon: CheckCircleIcon },
  ],
  questions: [
    { key: 'resumeUpload', title: 'Resume Upload', description: 'Candidate CV submitted for screening.', status: 'completed', icon: UploadFileIcon },
    { key: 'readDocument', title: 'MCP Tool: read_document', description: 'Resume is read and parsed for content extraction.', status: 'completed', icon: ArticleIcon },
    { key: 'metadata', title: 'Metadata Extraction', description: 'Skills, experience and education are identified.', status: 'completed', icon: InsightsIcon },
    { key: 'chunking', title: 'Chunking', description: 'Document is segmented into reusable content blocks.', status: 'completed', icon: AccountTreeIcon },
    { key: 'vectorStore', title: 'Vector Store', description: 'Candidate context is prepared for retrieval.', status: 'completed', icon: StorageIcon },
    { key: 'planner', title: 'Planner Agent', description: 'Recruitment strategy is mapped to key themes.', status: 'completed', icon: PsychologyIcon },
    { key: 'questionWriter', title: 'Question Writer Agent', description: 'Role-based interview prompts are created.', status: 'completed', icon: AutoAwesomeIcon },
    { key: 'questionReviewer', title: 'Question Reviewer Agent', description: 'Responses are refined for quality and depth.', status: 'active', icon: RateReviewIcon },
    { key: 'sendEmailTool', title: 'MCP Tool: send_email', description: 'Candidate communication workflow is prepared.', status: 'pending', icon: EmailIcon },
    { key: 'candidateEmail', title: 'Candidate Email', description: 'Interview brief is delivered to the applicant.', status: 'pending', icon: CheckCircleIcon },
  ],
  email: [
    { key: 'resumeUpload', title: 'Resume Upload', description: 'Candidate CV submitted for screening.', status: 'completed', icon: UploadFileIcon },
    { key: 'readDocument', title: 'MCP Tool: read_document', description: 'Resume is read and parsed for content extraction.', status: 'completed', icon: ArticleIcon },
    { key: 'metadata', title: 'Metadata Extraction', description: 'Skills, experience and education are identified.', status: 'completed', icon: InsightsIcon },
    { key: 'chunking', title: 'Chunking', description: 'Document is segmented into reusable content blocks.', status: 'completed', icon: AccountTreeIcon },
    { key: 'vectorStore', title: 'Vector Store', description: 'Candidate context is prepared for retrieval.', status: 'completed', icon: StorageIcon },
    { key: 'planner', title: 'Planner Agent', description: 'Recruitment strategy is mapped to key themes.', status: 'completed', icon: PsychologyIcon },
    { key: 'questionWriter', title: 'Question Writer Agent', description: 'Role-based interview prompts are created.', status: 'completed', icon: AutoAwesomeIcon },
    { key: 'questionReviewer', title: 'Question Reviewer Agent', description: 'Responses are refined for quality and depth.', status: 'completed', icon: RateReviewIcon },
    { key: 'sendEmailTool', title: 'MCP Tool: send_email', description: 'Candidate communication workflow is prepared.', status: 'completed', icon: EmailIcon },
    { key: 'candidateEmail', title: 'Candidate Email', description: 'Interview brief is delivered to the applicant.', status: 'completed', icon: CheckCircleIcon },
  ],
}

export function PipelineCard({ mode = 'resume' }) {
  const steps = pipelineStatusByMode[mode] ?? pipelineStatusByMode.resume

  return (
    <Card sx={{ mt: 4, borderRadius: 4, overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
          AI workflow
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, mb: 3, fontWeight: 800 }}>
          AI Recruitment Pipeline
        </Typography>

        <Stepper orientation="vertical" sx={{ '& .MuiStepLabel-root': { alignItems: 'flex-start' } }}>
          {steps.map((step) => (
            <PipelineStep key={step.key} {...step} />
          ))}
        </Stepper>
      </CardContent>
    </Card>
  )
}
