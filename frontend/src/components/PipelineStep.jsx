import { Box, Chip, Step, StepLabel, Typography } from '@mui/material'

const statusStyle = {
  completed: {
    label: 'Completed',
    color: 'success',
    sx: { borderColor: 'rgba(28,168,111,0.25)', color: 'success.dark', backgroundColor: 'rgba(28,168,111,0.1)' },
  },
  active: {
    label: 'Active',
    color: 'primary',
    sx: { borderColor: 'rgba(47,91,255,0.25)', color: 'primary.main', backgroundColor: 'rgba(47,91,255,0.08)' },
  },
  pending: {
    label: 'Pending',
    color: 'default',
    sx: { borderColor: 'rgba(148,163,184,0.32)', color: 'text.secondary', backgroundColor: 'rgba(148,163,184,0.08)' },
  },
}

export function PipelineStep({ title, description, status, icon: Icon }) {
  const config = statusStyle[status] ?? statusStyle.pending

  return (
    <Step active={status === 'active'} completed={status === 'completed'} sx={{ '& .MuiStepLabel-labelContainer': { width: '100%' } }}>
      <StepLabel
        sx={{ alignItems: 'flex-start', '& .MuiStepLabel-label': { width: '100%' } }}
        StepIconComponent={() => (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: status === 'completed' ? 'rgba(28,168,111,0.12)' : status === 'active' ? 'rgba(47,91,255,0.12)' : 'rgba(148,163,184,0.12)',
              color: status === 'completed' ? 'success.main' : status === 'active' ? 'primary.main' : 'text.secondary',
              border: '1px solid',
              borderColor: status === 'completed' ? 'rgba(28,168,111,0.32)' : status === 'active' ? 'rgba(47,91,255,0.32)' : 'rgba(148,163,184,0.32)',
            }}
          >
            <Icon fontSize="small" />
          </Box>
        )}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5, width: '100%' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              {description}
            </Typography>
          </Box>

          <Chip
            label={config.label}
            size="small"
            color={config.color}
            sx={{
              ...config.sx,
              fontWeight: 700,
              border: '1px solid transparent',
            }}
          />
        </Box>
      </StepLabel>
    </Step>
  )
}
