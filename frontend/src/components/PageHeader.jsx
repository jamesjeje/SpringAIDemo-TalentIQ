import { Box, Typography } from '@mui/material'

export function PageHeader({ eyebrow, title, description }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.8 }}>
        {eyebrow}
      </Typography>
      <Typography
        variant="h2"
        component="h1"
        sx={{
          mt: 1,
          mb: 1.5,
          fontSize: { xs: '2rem', md: '2.8rem' },
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          fontWeight: 800,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.7 }}>
          {description}
        </Typography>
      )}
    </Box>
  )
}
