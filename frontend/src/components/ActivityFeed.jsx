import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

const events = [
  { label: 'Resume uploaded', icon: DescriptionOutlinedIcon, tone: 'primary' },
  { label: 'Metadata extracted', icon: AutoFixHighOutlinedIcon, tone: 'secondary' },
  { label: 'Vector embeddings created', icon: PsychologyOutlinedIcon, tone: 'warning' },
  { label: 'Planner Agent completed', icon: CheckCircleOutlineOutlinedIcon, tone: 'success' },
  { label: 'Question Writer completed', icon: CheckCircleOutlineOutlinedIcon, tone: 'success' },
  { label: 'Question Reviewer completed', icon: RateReviewOutlinedIcon, tone: 'info' },
  { label: 'Interview email sent', icon: SendOutlinedIcon, tone: 'success' },
]

const toneMap = {
  primary: { bg: 'rgba(47, 91, 255, 0.1)', color: '#2f5bff' },
  secondary: { bg: 'rgba(16, 182, 178, 0.12)', color: '#0d7f7a' },
  warning: { bg: 'rgba(245, 158, 11, 0.12)', color: '#b45309' },
  success: { bg: 'rgba(28, 168, 111, 0.12)', color: '#0f8f60' },
  info: { bg: 'rgba(139, 92, 246, 0.12)', color: '#7c3aed' },
}

export function ActivityFeed() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            AI Activity Feed
          </Typography>
          <Chip label="Live" size="small" color="success" variant="outlined" />
        </Stack>

        <Stack spacing={2.25} sx={{ position: 'relative' }}>
          {events.map(({ label, icon: Icon, tone }, index) => (
            <Box
              key={label}
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
                position: 'relative',
                pl: 1,
                '&:not(:last-child)::after': {
                  content: '""',
                  position: 'absolute',
                  left: '17px',
                  top: '28px',
                  bottom: '-18px',
                  width: '2px',
                  background: 'rgba(148, 163, 184, 0.35)',
                },
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: toneMap[tone].bg,
                  color: toneMap[tone].color,
                  flexShrink: 0,
                  mt: 0.5,
                }}
              >
                <Icon fontSize="small" />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {label}
                </Typography>
                <Chip
                  label={index < 3 ? 'Completed' : 'Ready'}
                  size="small"
                  sx={{
                    mt: 0.75,
                    backgroundColor: toneMap[tone].bg,
                    color: toneMap[tone].color,
                    fontWeight: 700,
                    borderRadius: 999,
                    height: 24,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
