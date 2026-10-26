import { Box, Card, CardContent, Step, StepLabel, Stepper, Typography } from '@mui/material'

const steps = ['Resume Uploaded', 'Questions Generated', 'Email Sent']

export function WorkflowProgress({ completedSteps = [false, false, false], activeStep = 0 }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Recruitment workflow
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={completedSteps[index]}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  )
}
