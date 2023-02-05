module.exports = ({ theme }) => ({
  DEFAULT: {
    css: {
      '--tw-prose-body': theme('colors.slate.900'),
      '--tw-prose-headings': theme('colors.slate.900'),
      '--tw-prose-links': theme('colors.emerald.500'),
      '--tw-prose-links-hover': theme('colors.emerald.600'),
      '--tw-prose-links-underline': theme('colors.emerald.500 / 0.3'),
      '--tw-prose-bold': theme('colors.slate.900'),

      '--tw-prose-captions': theme('colors.slate.500'),
      '--tw-prose-code': theme('colors.slate.900'),
      '--tw-prose-code-bg': theme('colors.slate.100'),
      '--tw-prose-code-ring': theme('colors.slate.300'),

      // Base
      color: 'var(--tw-prose-body)',
      fontSize: theme('fontSize.sm')[0],
      lineHeight: theme('lineHeight.7'),

      // Layout
      '> *': {
        maxWidth: theme('maxWidth.2xl'),
        marginLeft: 'auto',
        marginRight: 'auto',
        '@screen lg': {
          maxWidth: theme('maxWidth.3xl'),
          marginLeft: `calc(50% - min(50%, ${theme('maxWidth.lg')}))`,
          marginRight: `calc(50% - min(50%, ${theme('maxWidth.lg')}))`,
        },
      },

      // Text
      p: {
        marginTop: theme('spacing.5'),
        fontSize: theme('fontSize.base')[0],
        ...theme('fontSize.base')[1],
      },

      h2: {
        fontFamily: theme('fontFamily.sans'),
        color: 'var(--brand-color)',
        fontWeight: '700',
        fontSize: theme('fontSize.2xl')[0],
        ...theme('fontSize.lg')[1],
        marginTop: theme('spacing.2'),
        marginBottom: theme('spacing.2'),
      },

      'figure > *': {
        marginTop: '0',
        marginBottom: '0',
      },

      ':is(h1, h2, h3) a': {
        fontWeight: 'inherit',
      },
      strong: {
        color: 'var(--tw-prose-bold)',
        fontWeight: '600',
      },
      ':is(a, blockquote, thead th) strong': {
        color: 'inherit',
      },
      code: {
        color: 'var(--tw-prose-code)',
        borderRadius: theme('borderRadius.lg'),
        paddingTop: theme('padding.1'),
        paddingRight: theme('padding[1.5]'),
        paddingBottom: theme('padding.1'),
        paddingLeft: theme('padding[1.5]'),
        boxShadow: 'inset 0 0 0 1px var(--tw-prose-code-ring)',
        backgroundColor: 'var(--tw-prose-code-bg)',
        fontSize: theme('fontSize.2xs'),
      },
      ':is(a, h1, h2, h3, blockquote, thead th) code': {
        color: 'inherit',
      },
      'h2 code': {
        fontSize: theme('fontSize.xl'),
        fontWeight: 'inherit',
      },
      'h3 code': {
        fontSize: theme('fontSize.sm')[0],
        fontWeight: 'inherit',
      },

      // Overrides
      ':is(h1, h2, h3) + *': {
        // marginTop: '0',
      },
      '> :first-child': {
        marginTop: '0 !important',
      },
      '> :last-child': {
        marginBottom: '0 !important',
      },
    },
  },
})
