import { style } from '@vanilla-extract/css'
import { atoms } from '@zoralabs/zord'

import { skeletonAnimation } from './animations.css'

export const artworkSkeleton = style({
  animation: skeletonAnimation,
})

export const artworkSettingsBox = style({
  border: '2px solid #F2F2F2',
  borderRadius: '10px',
})

export const artworkSettingsBoxDropping = style({
  border: '2px solid #1CB687',
  borderRadius: '10px',
  background: '#1CB687',
})

export const artworkSettingsName = style({
  color: '#4D4D4D',
  fontWeight: 700,
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

export const artworkSettingsNameDropping = style({
  color: '#fff',
  fontWeight: 700,
  textAlign: 'center',
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

export const artworkSettingsPropertyName = style({
  height: 50,
  width: '100%',
  backgroundColor: '#F2F2F2',
  borderRadius: '15px',
  fontSize: 16,
  paddingLeft: 24,
  boxSizing: 'border-box',
  border: '2px solid #fff',
  color: '#808080',
  selectors: {
    '&:focus': {
      outline: 'none',
      backgroundColor: '#FFF',
      borderColor: '#E6E6E6',
    },
  },
})

export const artworkSettingsImageThumb = style({
  width: '100%',
})

export const artworkSettingsPropertyCount = style({
  height: 80,
  width: 80,
  borderRadius: '15px',
  fontSize: 16,
  border: '2px solid #fff',
  maxWidth: '100px',
  selectors: {
    '&:focus': {
      outline: 'none',
      backgroundColor: '#FFF',
      borderColor: '#E6E6E6',
    },
  },
})

export const layerSelectStyle = style([
  atoms({
    mb: 'x2',
    px: 'x4',
    pt: 'x3',
    width: '100%',
    alignItems: 'center',
  }),
  {
    minHeight: 62,
    background: '#F2F2F2',
    border: 0,
    borderRadius: '12px',
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
  },
])

export const previewHeadingStyle = style([
  atoms({
    mb: 'x6',
  }),
  {
    fontSize: 36,
    fontWeight: 400,
  },
])

export const selectTraitNameStyle = style([
  atoms({
    pointerEvents: 'none',
    pt: 'x1',
  }),
  {
    zIndex: 1,
    color: '#808080',
    opacity: 0.6,
    fontWeight: 400,
    // top: '28%',
  },
])

export const selectTraitNameWrapper = style({
  maxHeight: 400,
  overflow: 'hidden',
  overflowY: 'scroll',
})

export const previewGeneratedImageStyle = style({
  height: 182,
  width: 182,
  borderRadius: '16px',
  overflow: 'hidden',
  '@media': {
    'screen and (max-width: 768px)': {
      height: 120,
      width: 120,
    },
  },
})

export const previewModalWrapperStyle = style({
  borderRadius: '24px',
})

export const previewLayerSelectorWrapperStyle = style({
  minWidth: 245,
  maxWidth: 245,
  '@media': {
    'screen and (max-width: 1050px)': {
      minWidth: 200,
      maxWidth: 200,
    },
    'screen and (max-width: 768px)': {
      width: '100%',
      maxWidth: 'none',
    },
  },
})

export const previewWrapperInnerStyle = style({
  '@media': {
    'screen and (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
})

export const previewGridWrapperStyle = style({
  // width: 640,
  overflowY: 'scroll',
  maxHeight: 'calc(100vh - 400px)',
  '@media': {
    'screen and (max-width: 768px)': {
      width: '100%',
      maxHeight: 300,
    },
  },
})

export const imageGridWrapperStyle = style({
  width: 'max-content',
  gridTemplateColumns: 'repeat(3, 1fr)',
  '@media': {
    'screen and (max-width: 1050px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    'screen and (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      margin: '0 auto',
    },
  },
})
