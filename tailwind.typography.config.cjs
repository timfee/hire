module.exports = ({ theme }) => ({
  DEFAULT: {
    css: {
      color: theme('colors.slate.900'),
      fontFamily: theme('fontFamily.serif'),
      fontSize: theme('fontSize.sm')[0],
      lineHeight: theme('lineHeight.7'),
      p: {
        marginTop: theme('spacing.6'),
        fontSize: '1.15em',
        lineHeight: '1.5em',
      },
      h2: {
        fontFamily: theme('fontFamily.sans'),
        color: 'var(--brand-color)',
        fontWeight: '700',
        fontSize: '1.8em',
        marginTop: '1em',
        marginBottom: '0.5em',
      },
      h3: {
        marginTop: '1.5em',
        marginBottom: '0.5em',
        textAlign: 'center',
        fontSize: '1.3em',
        fontWeight: 500,
        fontStyle: 'italic',
        lineHeight: '1.5em',
        letterSpacing: '-0.025em',
        color: theme('colors.slate.800'),
      },
      strong: {
        fontWeight: '600',
      },
      code: {
        color: theme('colors.blue.900'),
        borderRadius: theme('borderRadius.lg'),
        paddingTop: theme('padding.1'),
        paddingRight: theme('padding[1.5]'),
        paddingBottom: theme('padding.1'),
        paddingLeft: theme('padding[1.5]'),
        boxShadow: 'inset 0 0 0 1px ' + theme('colors.slate.200'),
        backgroundColor: theme('colors.slate.50'),
      },
      'h2 code': {
        fontSize: theme('fontSize.xl'),
        fontWeight: 'inherit',
      },
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
    },
  },
})
