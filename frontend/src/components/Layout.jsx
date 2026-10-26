import { AppBar, Box, Chip, Container, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'
import DescriptionIcon from '@mui/icons-material/Description'
import QuizIcon from '@mui/icons-material/Quiz'
import EmailIcon from '@mui/icons-material/Email'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

const navItems = [
  { to: '/resume-upload', label: 'Resume Upload', icon: DescriptionIcon },
  { to: '/questions', label: 'Interview Questions', icon: QuizIcon },
  { to: '/send-email', label: 'Send Email', icon: EmailIcon },
]

export function Layout({ children }) {
  const { pathname } = useLocation()
  const currentLabel = navItems.find((item) => item.to === pathname)?.label ?? 'TalentIQ'

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8faff 0%, #eef4ff 100%)' }}>
      <AppBar position="sticky" color="transparent">
        <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1.5 }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.75 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #2f5bff 0%, #10b6b2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 12px 28px rgba(47, 91, 255, 0.25)',
              }}
            >
              <SmartToyOutlinedIcon fontSize="small" />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.15 }}>
                TalentIQ
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI-Powered Recruitment Assistant
              </Typography>
            </Box>
          </Box>

          <Chip
            label={currentLabel}
            variant="outlined"
            color="primary"
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              borderRadius: 999,
              fontWeight: 700,
              px: 1,
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr)' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Box
            component="aside"
            sx={{
              p: 1.5,
              borderRadius: 4,
              backgroundColor: 'background.paper',
              border: '1px solid rgba(148,163,184,0.18)',
              boxShadow: '0 14px 30px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ px: 2, pb: 1, display: 'block', letterSpacing: 1.4 }}>
              Navigation
            </Typography>

            <List disablePadding sx={{ mt: 0.5 }}>
              {navItems.map(({ to, label, icon: Icon }) => (
                <ListItemButton
                  key={to}
                  component={NavLink}
                  to={to}
                  selected={pathname === to}
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    px: 2,
                    py: 1.25,
                    color: 'text.primary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(47, 91, 255, 0.05)',
                    },
                    '&.active': {
                      background: 'linear-gradient(135deg, rgba(47, 91, 255, 0.12), rgba(16, 182, 178, 0.08))',
                      color: 'primary.main',
                      boxShadow: 'inset 0 0 0 1px rgba(47, 91, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: pathname === to ? 700 : 600,
                        fontSize: '0.96rem',
                      },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          <Box sx={{ width: '100%' }}>{children}</Box>
        </Box>
      </Container>
    </Box>
  )
}
