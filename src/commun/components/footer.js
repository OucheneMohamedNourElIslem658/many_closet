import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Instagram } from '@mui/icons-material';
import { Facebook } from '@mui/icons-material';
import { Mail } from '@mui/icons-material';
import { styled } from '@mui/material';

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  pt: { xs: 4, sm: 8 },
  width: '100%',
  borderTop: '1px solid',
  borderColor: theme.palette.divider,
  paddingTop: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: theme.spacing(1),
  }
}));

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
      }}
    >
      <ContentContainer>
        <div>
          <Link color="text.secondary" variant="body2" href="#">
            Privacy Policy
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            href="https://Instagram.com/mui"
            aria-label="Instagram"
            sx={{ alignSelf: 'center' }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://facebook.com/MaterialUI"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com/company/mui/"
            aria-label="Mail"
            sx={{ alignSelf: 'center' }}
          >
            <Mail />
          </IconButton>
        </Stack>
      </ContentContainer>
    </Container>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary" href="https://mui.com/">
        Sitemark
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}
