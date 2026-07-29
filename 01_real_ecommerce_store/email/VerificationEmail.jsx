import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Hr,
  Img,
} from '@react-email/components';

export default function VerificationEmail({ username, otp }) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Your Blitz Store Verification Code</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>🔐 Your Blitz Store verification code is: {otp} — expires in 10 minutes.</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* ── HEADER ── */}
          <Section style={styles.header}>
            <Row>
              <Column align="center">
                {/* Logo wordmark */}
                <table cellPadding={0} cellSpacing={0} style={{ margin: '0 auto' }}>
                  <tr>
                    <td style={styles.logoIconWrap}>
                      <span style={styles.logoIconText}>⚡</span>
                    </td>
                    <td style={{ paddingLeft: '10px', verticalAlign: 'middle' }}>
                      <span style={styles.logoText}>BLITZ</span>
                    </td>
                  </tr>
                </table>
                <Text style={styles.logoSub}>eCommerce Store</Text>
              </Column>
            </Row>
          </Section>

          {/* ── BODY CARD ── */}
          <Section style={styles.card}>

            {/* Icon top */}
            <Row>
              <Column align="center" style={{ paddingBottom: '20px' }}>
                <div style={styles.shieldIcon}>🔐</div>
              </Column>
            </Row>

            {/* Greeting */}
            <Row>
              <Column>
                <Heading as="h1" style={styles.heading}>
                  Verify your email
                </Heading>
                <Text style={styles.subheading}>
                  Hi <strong style={{ color: '#111' }}>{username}</strong>, welcome to Blitz Store!
                </Text>
                <Text style={styles.bodyText}>
                  You're just one step away from accessing your account. Use the verification code below
                  to confirm your email address and complete your registration.
                </Text>
              </Column>
            </Row>

            {/* OTP Code Block */}
            <Row>
              <Column align="center" style={{ padding: '20px 0 28px' }}>
                <div style={styles.otpWrapper}>
                  <Text style={styles.otpLabel}>YOUR VERIFICATION CODE</Text>
                  <div style={styles.otpBox}>
                    <span style={styles.otpCode}>{otp}</span>
                  </div>
                  <Text style={styles.otpExpiry}>⏱ This code expires in <strong>10 minutes</strong></Text>
                </div>
              </Column>
            </Row>

            <Hr style={styles.divider} />

            {/* Security note */}
            <Row>
              <Column>
                <Text style={styles.securityNote}>
                  <strong>🔒 Security tip:</strong> Blitz Store will never ask for your OTP over the phone or email.
                  If you did not request this code, please ignore this email — your account remains safe.
                </Text>
              </Column>
            </Row>

          </Section>

          {/* ── FOOTER ── */}
          <Section style={styles.footer}>
            <Row>
              <Column align="center">
                <Text style={styles.footerBrand}>BLITZ eCommerce Store</Text>
                <Text style={styles.footerText}>
                  You're receiving this email because you created an account on Blitz Store.
                </Text>
                <Text style={styles.footerText}>
                  © {new Date().getFullYear()} Blitz Store. All rights reserved.
                </Text>
                <Hr style={styles.footerDivider} />
                <Text style={styles.footerDisclaimer}>
                  This is an automated email. Please do not reply to this message.
                </Text>
              </Column>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────

const styles = {
  body: {
    backgroundColor: '#f4f4f5',
    fontFamily: 'Inter, Arial, sans-serif',
    margin: '0',
    padding: '0',
  },

  container: {
    maxWidth: '560px',
    margin: '40px auto',
    padding: '0 0 40px',
  },

  // Header — dark branded bar
  header: {
    backgroundColor: '#0a0a0a',
    borderRadius: '16px 16px 0 0',
    padding: '28px 32px 20px',
    textAlign: 'center',
  },

  logoIconWrap: {
    backgroundColor: '#F59E0B',
    borderRadius: '10px',
    width: '36px',
    height: '36px',
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: '36px',
  },

  logoIconText: {
    fontSize: '18px',
    lineHeight: '36px',
    display: 'block',
  },

  logoText: {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '4px',
    verticalAlign: 'middle',
  },

  logoSub: {
    color: '#F59E0B',
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    margin: '4px 0 0',
    fontWeight: '600',
  },

  // White card body
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 40px 32px',
    borderLeft: '1px solid #e4e4e7',
    borderRight: '1px solid #e4e4e7',
  },

  shieldIcon: {
    fontSize: '40px',
    lineHeight: '1',
    display: 'block',
    textAlign: 'center',
  },

  heading: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0a0a0a',
    margin: '0 0 6px',
    letterSpacing: '-0.3px',
  },

  subheading: {
    fontSize: '15px',
    color: '#52525b',
    margin: '0 0 12px',
  },

  bodyText: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#71717a',
    margin: '0',
  },

  // OTP code container
  otpWrapper: {
    backgroundColor: '#fafafa',
    border: '1px solid #e4e4e7',
    borderRadius: '14px',
    padding: '24px 32px',
    textAlign: 'center',
    width: '100%',
  },

  otpLabel: {
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '3px',
    color: '#a1a1aa',
    margin: '0 0 14px',
    textTransform: 'uppercase',
  },

  otpBox: {
    backgroundColor: '#0a0a0a',
    borderRadius: '12px',
    padding: '18px 32px',
    display: 'inline-block',
    margin: '0 auto',
  },

  otpCode: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: '10px',
    fontFamily: 'monospace',
    display: 'block',
  },

  otpExpiry: {
    fontSize: '12px',
    color: '#a1a1aa',
    margin: '14px 0 0',
  },

  divider: {
    borderColor: '#f4f4f5',
    borderTopWidth: '1px',
    margin: '0 0 20px',
  },

  securityNote: {
    fontSize: '12px',
    lineHeight: '1.7',
    color: '#a1a1aa',
    backgroundColor: '#fafafa',
    border: '1px solid #f4f4f5',
    borderRadius: '8px',
    padding: '12px 16px',
    margin: '0',
  },

  // Footer
  footer: {
    backgroundColor: '#0a0a0a',
    borderRadius: '0 0 16px 16px',
    padding: '28px 32px',
    textAlign: 'center',
  },

  footerBrand: {
    color: '#F59E0B',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    margin: '0 0 8px',
  },

  footerText: {
    fontSize: '11px',
    color: '#52525b',
    margin: '0 0 4px',
    lineHeight: '1.6',
  },

  footerDivider: {
    borderColor: '#1f1f1f',
    borderTopWidth: '1px',
    margin: '16px 0',
  },

  footerDisclaimer: {
    fontSize: '10px',
    color: '#3f3f46',
    margin: '0',
    letterSpacing: '0.2px',
  },
};
