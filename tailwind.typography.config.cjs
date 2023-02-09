module.exports = ({ theme }) => ({
  DEFAULT: {
    css: {
      ':is(h1, h2, h3) + *': {
        marginTop: '0',
      },
      '> :first-child': {
        marginTop: '0 !important',
      },
      '> :last-child': {
        marginBottom: '0 !important',
      },
      a: {
        color: theme('colors.blue.700'),
        textDecoration: 'underline',
      },
      code: {
        backgroundColor: theme('colors.slate.50'),
        borderRadius: theme('borderRadius.lg'),
        boxShadow: `inset 0 0 0 1px ${theme('colors.slate.200')}`,
        color: theme('colors.blue.900'),
        paddingBottom: theme('padding.1'),
        paddingLeft: theme('padding[1.5]'),
        paddingRight: theme('padding[1.5]'),
        paddingTop: theme('padding.1'),
      },
      color: theme('colors.slate.900'),
      fontFamily: theme('fontFamily.serif'),
      fontSize: theme('fontSize.sm')[0],
      h2: {
        color: 'var(--brand-color)',
        fontFamily: theme('fontFamily.sans'),
        fontSize: '1.8em',
        fontWeight: '700',
        marginBottom: '0.5em',
        marginTop: '1em',
      },
      'h2 code': {
        fontSize: theme('fontSize.xl'),
        fontWeight: 'inherit',
      },
      h3: {
        color: theme('colors.slate.800'),
        fontSize: '1.3em',
        fontStyle: 'italic',
        fontWeight: 600,
        letterSpacing: '-0.025em',
        lineHeight: '1.5em',
        marginBottom: '0.5em',
        marginTop: '1.5em',
        textAlign: 'center',
      },
      lineHeight: theme('lineHeight.7'),
      p: {
        fontSize: '1.15em',
        lineHeight: '1.5em',
        marginTop: theme('spacing.6'),
      },
      strong: {
        fontWeight: '600',
      },
    },
  },
})
