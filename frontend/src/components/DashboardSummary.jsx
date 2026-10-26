import { alpha } from '@mui/material/styles'
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'

const metrics = [
  { label: 'Resumes Processed', value: '1', color: '#2f5bff', icon: DescriptionOutlinedIcon },
  { label: 'Questions Generated', value: '7', color: '#10b6b2', icon: QuizOutlinedIcon },
  { label: 'MCP Tools Used', value: '2', color: '#8b5cf6', icon: BuildCircleOutlinedIcon },
  { label: 'Emails Sent', value: '1', color: '#f59e0b', icon: EmailOutlinedIcon },
]

export function DashboardSummary() {
  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {metrics.map(({ label, value, color, icon: Icon }) => (
        <Grid item xs={12} sm={6} md={3} key={label}>
          <Card
            sx={{
              height: '100%',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 22px 44px rgba(15, 23, 42, 0.12)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2, fontWeight: 700 }}>
                    {label}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}>
                    {value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: alpha(color, 0.12),
                    color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon fontSize="medium" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
