import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { uploadResume } from '../services/talentIQService'
import { PageHeader } from '../components/PageHeader'
import { DashboardSummary } from '../components/DashboardSummary'
import { WorkflowProgress } from '../components/WorkflowProgress'
import { ActivityFeed } from '../components/ActivityFeed'

export function ResumeUploadPage() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ type: 'info', message: 'Upload a CV or resume for TalentIQ screening.' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileSummary = useMemo(() => {
    if (!file) {
      return 'No file selected yet'
    }

    return `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`
  }, [file])

  const handleSubmit = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please choose a resume file before submitting.' })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: 'info', message: 'Uploading resume and extracting candidate content…' })

      const result = await uploadResume(file)
      setStatus({
        type: 'success',
        message: typeof result === 'string' ? result : 'Resume uploaded successfully.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'The resume upload failed. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box>
      <PageHeader
        eyebrow="Talent pipeline"
        title="Resume upload"
        description="Upload a candidate CV to begin the recruitment workflow. TalentIQ will process the document for structured screening and interview preparation."
      />

      <DashboardSummary />
      <WorkflowProgress completedSteps={[true, false, false]} activeStep={0} />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: file ? 'primary.main' : 'grey.300',
                    borderRadius: 4,
                    p: 4,
                    background: file ? 'rgba(47, 91, 255, 0.04)' : 'rgba(148, 163, 184, 0.02)',
                    textAlign: 'center',
                  }}
                >
                  <IconButton component="label" sx={{ background: 'rgba(47, 91, 255, 0.08)', p: 2.5, mb: 2 }}>
                    <CloudUploadIcon sx={{ fontSize: 42, color: 'primary.main' }} />
                    <input hidden accept=".pdf,.doc,.docx,.txt" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                  </IconButton>

                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {file ? 'Resume selected' : 'Choose a resume file'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Accepts PDF, Word, and text documents.
                  </Typography>

                  <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                    Select file
                    <input hidden accept=".pdf,.doc,.docx,.txt" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                  </Button>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Selected file
                  </Typography>
                  <PaperPreview fileSummary={fileSummary} />
                </Box>

                <Divider />

                <Alert severity={status.type === 'error' ? 'error' : status.type === 'success' ? 'success' : 'info'}>
                  {status.message}
                </Alert>

                {isSubmitting && <LinearProgress />}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !file}
                    startIcon={<CheckCircleOutlineOutlinedIcon />}
                  >
                    {isSubmitting ? 'Uploading…' : 'Upload resume'}
                  </Button>
                </Box>
              </Stack>
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

function PaperPreview({ fileSummary }) {
  return (
    <Box sx={{ border: '1px solid rgba(148,163,184,0.25)', borderRadius: 3, background: 'rgba(244,247,251,0.7)' }}>
      <List disablePadding>
        <ListItem>
          <ListItemIcon>
            <DescriptionIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={fileSummary} secondary="Ready for screening" />
        </ListItem>
      </List>
    </Box>
  )
}
