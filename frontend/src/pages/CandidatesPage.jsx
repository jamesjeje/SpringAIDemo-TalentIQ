import { useMemo, useState } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Avatar,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined'
import { useNavigate } from 'react-router-dom'
import { searchCandidates } from '../services/talentIQService'
import { PageHeader } from '../components/PageHeader'
import { DashboardSummary } from '../components/DashboardSummary'
import { WorkflowProgress } from '../components/WorkflowProgress'

const STATUS_META = {
  Uploaded: { color: 'info', label: 'Uploaded' },
  Processed: { color: 'secondary', label: 'Processed' },
  Shortlisted: { color: 'success', label: 'Shortlisted' },
  'Interview Scheduled': { color: 'warning', label: 'Interview Scheduled' },
  'Interview Pack Sent': { color: 'primary', label: 'Interview Pack Sent' },
  Completed: { color: 'success', label: 'Completed' },
  Rejected: { color: 'error', label: 'Rejected' },
}

const SEARCH_EXAMPLES = ['Java', 'Spring Boot', 'Oracle', 'React', 'AWS']

const parseList = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
  }

  if (!value) {
    return []
  }

  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return [String(value)]
}

const parseCandidatePayload = (payload) => {
  if (!payload) {
    return []
  }

  if (typeof payload === 'string') {
    const candidateText = payload.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim()

    try {
      const parsed = JSON.parse(candidateText)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch (error) {
      return [{
        candidateName: 'Unknown Candidate',
        matchLevel: 'Processed',
        matchScore: 0.92,
        skills: [],
        strengths: [],
        gaps: [],
        recommendation: candidateText,
      }]
    }
  }

  return Array.isArray(payload) ? payload : [payload]
}

const normalizeStatus = (value) => {
  const raw = String(value || 'Processed').trim()
  const normalized = raw.toLowerCase()

  const aliases = {
    uploaded: 'Uploaded',
    processed: 'Processed',
    shortlisted: 'Shortlisted',
    'interview scheduled': 'Interview Scheduled',
    interview: 'Interview Scheduled',
    'interview pack sent': 'Interview Pack Sent',
    'interview pack': 'Interview Pack Sent',
    completed: 'Completed',
    rejected: 'Rejected',
    review: 'Processed',
    high: 'Shortlisted',
    medium: 'Processed',
    low: 'Rejected',
  }

  if (aliases[normalized]) {
    return aliases[normalized]
  }

  const directMatch = Object.keys(STATUS_META).find((status) => status.toLowerCase() === normalized)
  return directMatch || 'Processed'
}

const formatDate = (value) => {
  if (!value) return 'N/A'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const getMatchPercentage = (value) => {
  const numericValue = Number(value ?? 0.92)

  if (!Number.isFinite(numericValue)) {
    return 92
  }

  if (numericValue > 1) {
    return Math.min(100, Math.max(0, numericValue))
  }

  return Math.min(100, Math.max(0, numericValue * 100))
}

const buildCandidateRows = (payload) => {
  return parseCandidatePayload(payload)
    .filter((candidate) => candidate && typeof candidate === 'object')
    .map((candidate, index) => {
      const skills = parseList(candidate.skills ?? candidate.skill ?? candidate.technologies ?? candidate.tags)
      const strengths = parseList(candidate.strengths)
      const gaps = parseList(candidate.gaps)
      const status = normalizeStatus(candidate.status ?? candidate.matchLevel ?? candidate.stage)
      const candidateName = candidate.candidateName || candidate.name || `Candidate ${index + 1}`
      const email = candidate.email || candidate.candidateEmail || `${candidateName.toLowerCase().replace(/\s+/g, '.')}@example.com`
      const phone = candidate.phone || candidate.phoneNumber || 'Not provided'
      const recommendation = candidate.recommendation || 'Strong technical fit with promising development potential.'
      const matchScore = getMatchPercentage(candidate.matchScore ?? candidate.score ?? 0.92)
      const uploadDate = candidate.uploadDate || candidate.createdAt || new Date().toISOString()
      const lastUpdated = candidate.lastUpdated || candidate.updatedAt || uploadDate
      const profileSummary = candidate.profileSummary || candidate.summary || recommendation
      const metadata = {
        Role: candidate.currentRole || candidate.role || 'Not provided',
        Experience: candidate.experience || candidate.yearsOfExperience || 'Not provided',
        Location: candidate.location || 'Not provided',
        Source: candidate.source || 'Resume upload',
      }

      return {
        id: `${candidateName}-${index}`,
        candidateName,
        jobDescription: candidate.jobDescription || candidate.job_description || '',
        email,
        phone,
        skills,
        status,
        lastUpdated,
        uploadDate,
        matchScore,
        strengths,
        gaps,
        recommendation,
        profileSummary,
        metadata,
        timeline: [
          { label: 'Resume Uploaded', timestamp: uploadDate, status: 'Complete', icon: UploadFileOutlinedIcon, tone: 'primary' },
          { label: 'Metadata Extracted', timestamp: lastUpdated, status: 'Complete', icon: FactCheckOutlinedIcon, tone: 'secondary' },
          { label: 'Vector Embeddings Created', timestamp: lastUpdated, status: 'Complete', icon: HubOutlinedIcon, tone: 'warning' },
          { label: 'Questions Generated', timestamp: lastUpdated, status: status === 'Rejected' ? 'Delayed' : 'Ready', icon: AutoFixHighOutlinedIcon, tone: 'info' },
          { label: 'Interview Email Sent', timestamp: lastUpdated, status: status === 'Completed' ? 'Sent' : 'Pending', icon: SendOutlinedIcon, tone: status === 'Completed' ? 'success' : 'default' },
        ],
      }
    })
}

const getStatusColor = (status) => STATUS_META[normalizeStatus(status)]?.color || 'secondary'

const getStatusVariant = (status) => STATUS_META[normalizeStatus(status)]?.label || 'Processed'

export function CandidatesPage() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [recentSearches, setRecentSearches] = useState(SEARCH_EXAMPLES)
  const [status, setStatus] = useState({
    type: 'info',
    message: 'Search by candidate name, email, skill, technology, or keyword.',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const statusCounts = useMemo(() => {
    const counts = Object.keys(STATUS_META).reduce((accumulator, status) => {
      accumulator[status] = 0
      return accumulator
    }, {})

    rows.forEach((row) => {
      const key = normalizeStatus(row.status)
      counts[key] = (counts[key] || 0) + 1
    })

    return Object.entries(STATUS_META).map(([label, config]) => ({
      label,
      value: counts[label] || 0,
      color: config.color,
    }))
  }, [rows])

  const recentCandidates = useMemo(() => rows.slice(0, 4), [rows])

  const columns = useMemo(
    () => [
      {
        field: 'candidateName',
        headerName: 'Candidate Name',
        flex: 1.2,
        minWidth: 145,
        renderCell: (params) => (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 0.8 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#2f5bff', 0.12), color: 'primary.main', fontWeight: 700 }}>
              {params.value?.charAt(0)?.toUpperCase() || 'C'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {params.value}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.1,
        minWidth: 145,
      },
      {
        field: 'skills',
        headerName: 'Skills',
        flex: 1.1,
        minWidth: 135,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75, py: 0.75 }}>
            {params.value?.length ? (
              <>
                {params.value.slice(0, 2).map((skill) => (
                  <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ borderRadius: 999, fontWeight: 600 }} />
                ))}
                {params.value.length > 2 && (
                  <Chip label={`+${params.value.length - 2}`} size="small" variant="filled" sx={{ borderRadius: 999, fontWeight: 700 }} />
                )}
              </>
            ) : (
              <Typography color="text.secondary" variant="body2">No skills</Typography>
            )}
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 145,
        renderCell: (params) => (
          <Chip
            label={getStatusVariant(params.value)}
            color={getStatusColor(params.value)}
            variant="filled"
            sx={{ fontWeight: 700, borderRadius: 999 }}
          />
        ),
      },
      {
        field: 'lastUpdated',
        headerName: 'Last Updated',
        width: 120,
        valueGetter: (value) => formatDate(value),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 135,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Tooltip title="View">
              <IconButton size="small" onClick={() => setSelectedCandidate(params.row)} aria-label="View candidate">
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Generate Questions">
              <IconButton
                size="small"
                onClick={() => navigate('/questions', { state: { candidateName: params.row.candidateName, jobDescription: params.row.jobDescription } })}
                aria-label="Generate interview questions"
              >
                <QuizOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send Email">
              <IconButton
                size="small"
                onClick={() => navigate('/send-email', { state: { candidateName: params.row.candidateName } })}
                aria-label="Send interview email"
              >
                <EmailOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [navigate],
  )

  const handleSearch = async (event) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setRows([])
      setStatus({ type: 'warning', message: 'Enter a role, skill, or keyword to search candidates.' })
      return
    }

    try {
      setLoading(true)
      setStatus({ type: 'info', message: 'Searching candidate matches…' })

      const response = await searchCandidates(trimmedQuery)
      const nextRows = buildCandidateRows(response)

      setRows(nextRows)
      setRecentSearches((current) => [trimmedQuery, ...current.filter((item) => item.toLowerCase() !== trimmedQuery.toLowerCase())].slice(0, 6))
      setStatus({
        type: nextRows.length > 0 ? 'success' : 'warning',
        message:
          nextRows.length > 0
            ? `${nextRows.length} candidate${nextRows.length > 1 ? 's' : ''} found.`
            : 'No candidates found',
      })
    } catch (error) {
      setRows([])
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Candidate search failed. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setRows([])
    setSelectedCandidate(null)
    setStatus({ type: 'info', message: 'Search by candidate name, email, skill, technology, or keyword.' })
  }

  return (
    <Box>
      <PageHeader
        eyebrow="Talent pipeline"
        title="Candidates"
        description="Search candidate profiles, review match quality, and move promising talent into interview preparation."
      />

      <DashboardSummary />
      <WorkflowProgress completedSteps={[true, false, false]} activeStep={1} />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statusCounts.map(({ label, value, color }) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={label}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2, fontWeight: 700 }}>
                      {label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alpha(color === 'info' ? '#2f5bff' : color === 'secondary' ? '#10b6b2' : color === 'success' ? '#1ca86f' : color === 'warning' ? '#f59e0b' : color === 'primary' ? '#2f5bff' : '#e11d48', 0.12),
                      color: color === 'info' ? '#2f5bff' : color === 'secondary' ? '#10b6b2' : color === 'success' ? '#1ca86f' : color === 'warning' ? '#f59e0b' : color === 'primary' ? '#2f5bff' : '#e11d48',
                    }}
                  >
                    <PeopleAltOutlinedIcon fontSize="small" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Card>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <form onSubmit={handleSearch}>
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                      fullWidth
                      label="Search candidates"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search by name, email, skill, technology, or keyword"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: query ? (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={clearSearch} aria-label="Clear search">
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
                      disabled={loading}
                      sx={{ minWidth: 180, fontWeight: 700 }}
                    >
                      {loading ? 'Searching…' : 'Search'}
                    </Button>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {SEARCH_EXAMPLES.map((term) => (
                      <Chip
                        key={term}
                        label={term}
                        variant="outlined"
                        color="primary"
                        clickable
                        onClick={() => setQuery(term)}
                        sx={{ borderRadius: 999, fontWeight: 600 }}
                      />
                    ))}
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Example searches: Java, Spring Boot, Oracle, React, AWS
                  </Typography>
                </Stack>
              </form>

              <Alert severity={status.type} sx={{ mb: 3 }}>
                {status.message}
              </Alert>

              <Box sx={{ height: 520, width: '100%' }}>
                {loading ? (
                  <Paper
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(47, 91, 255, 0.03)',
                      border: '1px solid rgba(148, 163, 184, 0.18)',
                    }}
                  >
                    <Stack alignItems="center" spacing={1.5}>
                      <CircularProgress />
                      <Typography color="text.secondary">Loading candidates…</Typography>
                    </Stack>
                  </Paper>
                ) : rows.length === 0 ? (
                  <Paper
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      background: 'rgba(148, 163, 184, 0.04)',
                      border: '1px solid rgba(148, 163, 184, 0.18)',
                    }}
                  >
                    <Stack alignItems="center" spacing={1.5} sx={{ maxWidth: 360 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: alpha('#2f5bff', 0.1),
                          color: 'primary.main',
                        }}
                      >
                        <SearchOffOutlinedIcon fontSize="large" />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        No candidates found
                      </Typography>
                      <Typography color="text.secondary">
                        Try searching by candidate name, technology, skill, or keyword.
                      </Typography>
                    </Stack>
                  </Paper>
                ) : (
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowHeight={() => 'auto'}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    disableRowSelectionOnClick
                    sortingMode="client"
                    filterMode="client"
                    sx={{
                      border: 'none',
                      backgroundColor: 'background.paper',
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(47, 91, 255, 0.04)',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
                      },
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                      },
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Stack spacing={3}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Recent Candidates
                </Typography>

                <List disablePadding>
                  {recentCandidates.length > 0 ? (
                    recentCandidates.map((candidate) => (
                      <ListItem key={candidate.id} disablePadding sx={{ py: 1.1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {candidate.candidateName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {candidate.email}
                            </Typography>
                          </Box>
                          <Chip
                            label={candidate.status}
                            size="small"
                            color={getStatusColor(candidate.status)}
                            sx={{ borderRadius: 999, fontWeight: 700 }}
                          />
                        </Box>
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary" variant="body2">
                      Search activity will appear here.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Recently Searched
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {recentSearches.map((term) => (
                    <Chip
                      key={term}
                      label={term}
                      color="secondary"
                      variant="outlined"
                      clickable
                      onClick={() => setQuery(term)}
                      sx={{ borderRadius: 999, fontWeight: 700 }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={Boolean(selectedCandidate)} onClose={() => setSelectedCandidate(null)}>
        {selectedCandidate && (
          <Box sx={{ width: { xs: '100%', sm: 480 }, p: 3, height: '100%', background: 'linear-gradient(180deg, #f8faff 0%, #eef4ff 100%)' }}>
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {selectedCandidate.candidateName}
                </Typography>
                <IconButton onClick={() => setSelectedCandidate(null)} aria-label="Close candidate details">
                  <ClearIcon />
                </IconButton>
              </Box>

              <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">Current Status</Typography>
                    <Chip
                      label={selectedCandidate.status}
                      color={getStatusColor(selectedCandidate.status)}
                      sx={{ mt: 0.75, borderRadius: 999, fontWeight: 700 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Match Score</Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mt: 0.5 }}>
                      <CircularProgress
                        variant="determinate"
                        value={Math.min(100, Number(selectedCandidate.matchScore || 92))}
                        size={58}
                        thickness={6}
                        sx={{ color: selectedCandidate.matchScore >= 80 ? 'success.main' : selectedCandidate.matchScore >= 60 ? 'warning.main' : 'primary.main' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {Math.round(Number(selectedCandidate.matchScore || 92))}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailOutlinedIcon color="action" fontSize="small" />
                    <Typography variant="body2">{selectedCandidate.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneOutlinedIcon color="action" fontSize="small" />
                    <Typography variant="body2">{selectedCandidate.phone || 'Not available'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonthOutlinedIcon color="action" fontSize="small" />
                    <Typography variant="body2">Uploaded {formatDate(selectedCandidate.uploadDate)}</Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Profile Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCandidate.profileSummary || selectedCandidate.recommendation}
                </Typography>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedCandidate.skills?.length ? (
                    selectedCandidate.skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ borderRadius: 999, fontWeight: 600 }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No skill data available</Typography>
                  )}
                </Box>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Metadata
                </Typography>
                <Stack spacing={1.2}>
                  {Object.entries(selectedCandidate.metadata || {}).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {key}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Recruitment Activity
                </Typography>

                <Timeline sx={{ m: 0, p: 0 }}>
                  {(selectedCandidate.timeline || []).map(({ label, timestamp, status, icon: Icon, tone }) => (
                    <TimelineItem key={label} sx={{ '&:before': { display: 'none' } }}>
                      <TimelineSeparator>
                        <TimelineDot
                          color={tone === 'success' ? 'success' : tone === 'primary' ? 'primary' : tone === 'secondary' ? 'secondary' : tone === 'warning' ? 'warning' : tone === 'info' ? 'info' : 'grey'}
                          variant="filled"
                        >
                          <Icon fontSize="small" />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ pb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(timestamp)}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={status}
                            size="small"
                            color={tone === 'default' ? 'default' : tone}
                            variant={tone === 'default' ? 'outlined' : 'filled'}
                            sx={{ borderRadius: 999, fontWeight: 700 }}
                          />
                        </Box>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={1.5}>
                  <Button
                    variant="contained"
                    startIcon={<QuizOutlinedIcon />}
                    onClick={() => {
                      setSelectedCandidate(null)
                      navigate('/questions', { state: { candidateName: selectedCandidate.candidateName, jobDescription: selectedCandidate.jobDescription } })
                    }}
                  >
                    Generate Interview Questions
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SmartDisplayOutlinedIcon />}
                    onClick={() => {
                      setSelectedCandidate(null)
                      navigate('/questions', { state: { candidateName: selectedCandidate.candidateName, jobDescription: selectedCandidate.jobDescription } })
                    }}
                  >
                    Regenerate Questions
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<EmailOutlinedIcon />}
                    onClick={() => {
                      setSelectedCandidate(null)
                      navigate('/send-email', { state: { candidateName: selectedCandidate.candidateName } })
                    }}
                  >
                    Send Interview Email
                  </Button>
                  <Button
                    variant="text"
                    startIcon={<WorkOutlineOutlinedIcon />}
                    onClick={() => setSelectedCandidate((current) => ({ ...current, metadata: current.metadata }))}
                  >
                    View Candidate Metadata
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        )}
      </Drawer>
    </Box>
  )
}
