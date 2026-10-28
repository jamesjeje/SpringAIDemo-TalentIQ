import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useLocation } from 'react-router-dom'
import { generateQuestions } from '../services/talentIQService'
import { PageHeader } from '../components/PageHeader'
import { DashboardSummary } from '../components/DashboardSummary'
import { WorkflowProgress } from '../components/WorkflowProgress'
import { ActivityFeed } from '../components/ActivityFeed'

const categoryStyles = {
  Technical: { background: 'rgba(47, 91, 255, 0.12)', color: '#2f5bff' },
  Behavioural: { background: 'rgba(16, 182, 178, 0.12)', color: '#0d7f7a' },
  Leadership: { background: 'rgba(139, 92, 246, 0.12)', color: '#7c3aed' },
  Culture: { background: 'rgba(28, 168, 111, 0.12)', color: '#0f8f60' },
  default: { background: 'rgba(148, 163, 184, 0.12)', color: '#475569' },
}

export function GenerateQuestionsPage() {
  const location = useLocation()
  const [form, setForm] = useState({
    candidateName: location.state?.candidateName || '',
    jobDescription: location.state?.jobDescription || '',
  })
  const [questions, setQuestions] = useState([])
  const [status, setStatus] = useState({ type: 'info', message: 'Provide the candidate name and role criteria to generate a tailored interview set.' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (location.state?.candidateName || location.state?.jobDescription) {
      setForm((current) => ({
        ...current,
        ...(location.state.candidateName ? { candidateName: location.state.candidateName } : {}),
        ...(location.state.jobDescription ? { jobDescription: location.state.jobDescription } : {}),
      }))
    }
  }, [location.state])

  const loadingSteps = useMemo(
    () => [
      { label: 'Planner Agent running...', active: isSubmitting },
      { label: 'Question Writer running...', active: isSubmitting },
      { label: 'Question Reviewer validating...', active: isSubmitting },
    ],
    [isSubmitting],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.jobDescription.trim()) {
      setStatus({ type: 'error', message: 'Please enter a job description before generating interview questions.' })
      return
    }

    if (!form.candidateName.trim()) {
      setStatus({ type: 'error', message: 'Please enter the candidate name before generating interview questions.' })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: 'info', message: 'Generating interview questions…' })

      const result = await generateQuestions({
        candidateName: form.candidateName,
        jobDescription: form.jobDescription,
      })
      const nextQuestions = result?.interviewQuestions ?? result?.interview_questions ?? []
      setQuestions(nextQuestions)

      if (nextQuestions.length > 0) {
        setStatus({
          type: 'success',
          message: `Interview questions generated for ${form.candidateName}.`,
        })
      } else {
        setStatus({ type: 'warning', message: 'No questions were returned. Please refine the job description and try again.' })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Question generation failed. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box>
      <PageHeader
        eyebrow="Interview prep"
        title="Generate interview questions"
        description="Use the candidate profile and role requirements to generate a structured, role-specific interview brief."
      />

      <DashboardSummary />
      <WorkflowProgress completedSteps={[true, true, false]} activeStep={1} />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Candidate name"
                    name="candidateName"
                    value={form.candidateName}
                    onChange={handleChange}
                    fullWidth
                  />

                  <TextField
                    label="Job description"
                    name="jobDescription"
                    value={form.jobDescription}
                    onChange={handleChange}
                    multiline
                    minRows={10}
                    fullWidth
                  />

                  <Button variant="contained" type="submit" size="large" startIcon={<AutoAwesomeIcon />} disabled={isSubmitting}>
                    {isSubmitting ? 'Generating…' : 'Generate questions'}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Candidate interview brief
              </Typography>

              <Alert severity={status.type}>{status.message}</Alert>

              {isSubmitting && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress sx={{ mb: 1.5 }} />
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {loadingSteps.map(({ label, active }) => (
                      <Chip
                        key={label}
                        label={label}
                        size="small"
                        color={active ? 'primary' : 'default'}
                        variant={active ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 700 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Stack spacing={2} sx={{ mt: 3 }}>
                {questions.length === 0 ? (
                  <Paper sx={{ p: 3, backgroundColor: 'rgba(148, 163, 184, 0.04)' }}>
                    <Typography color="text.secondary">
                      No interview questions yet. Generate a list once the job description is ready.
                    </Typography>
                  </Paper>
                ) : (
                  questions.map((question, index) => {
                    const category = question.category || 'default'
                    const categoryStyle = categoryStyles[category] || categoryStyles.default

                    return (
                      <Paper
                        key={`${question.category}-${index}`}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          background: 'linear-gradient(180deg, rgba(248,250,255,1), rgba(241,245,249,1))',
                          border: '1px solid rgba(148,163,184,0.18)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 18px 28px rgba(15, 23, 42, 0.08)' },
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Chip
                              label={question.category || 'Interview question'}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                background: categoryStyle.background,
                                color: categoryStyle.color,
                              }}
                            />
                            <Chip
                              label={question.difficulty || 'Standard'}
                              size="small"
                              variant="outlined"
                              color={question.difficulty === 'Advanced' ? 'warning' : 'secondary'}
                            />
                          </Box>

                          <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.5 }}>
                            {index + 1}. {question.question}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            <strong>Focus Area:</strong> {question.focusArea || 'General competence'}
                          </Typography>

                          <Accordion
                            disableGutters
                            elevation={0}
                            sx={{
                              mt: 0.5,
                              background: 'rgba(255,255,255,0.8)',
                              border: '1px solid rgba(148,163,184,0.12)',
                              borderRadius: 2,
                              '&:before': { display: 'none' },
                            }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`expected-answer-${index}`}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Show Expected Answer
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {question.expectedAnswer || 'Evaluate answer depth, clarity, and evidence-based reasoning.'}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        </Stack>
                      </Paper>
                    )
                  })
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <ActivityFeed />
        </Grid>
      </Grid>
    </Box>
  )
}
