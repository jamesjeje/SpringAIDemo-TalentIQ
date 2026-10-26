import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  TextField,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { sendInterviewEmail } from '../services/talentIQService'
import { PageHeader } from '../components/PageHeader'
import { DashboardSummary } from '../components/DashboardSummary'
import { WorkflowProgress } from '../components/WorkflowProgress'
import { ActivityFeed } from '../components/ActivityFeed'

export function SendEmailPage() {
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    jobDescription: '',
  })
  const [status, setStatus] = useState({ type: 'info', message: 'Send the interview brief to a candidate with a personalised email.' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.candidateName.trim() || !form.candidateEmail.trim() || !form.jobDescription.trim()) {
      setStatus({ type: 'error', message: 'Candidate name, email, and job description are required.' })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: 'info', message: 'Sending interview email…' })
      const result = await sendInterviewEmail(form)
      setStatus({
        type: 'success',
        message: typeof result === 'string' ? result : 'Interview questions sent successfully.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Email delivery failed. Please check the candidate address and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box>
      <PageHeader
        eyebrow="Candidate communication"
        title="Send interview questions"
        description="Deliver the final interview checklist to the candidate and keep the recruitment process moving efficiently."
      />

      <DashboardSummary />
      <WorkflowProgress completedSteps={[true, true, true]} activeStep={2} />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      <TextField label="Candidate name" name="candidateName" value={form.candidateName} onChange={handleChange} fullWidth />
                      <TextField label="Candidate email" name="candidateEmail" type="email" value={form.candidateEmail} onChange={handleChange} fullWidth />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Job description"
                      name="jobDescription"
                      value={form.jobDescription}
                      onChange={handleChange}
                      multiline
                      minRows={11}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Alert severity={status.type}>{status.message}</Alert>
                {isSubmitting && <LinearProgress sx={{ mt: 2 }} />}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button variant="contained" type="submit" size="large" startIcon={<SendIcon />} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send interview email'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <ActivityFeed />
        </Grid>
      </Grid>
    </Box>
  )
}
