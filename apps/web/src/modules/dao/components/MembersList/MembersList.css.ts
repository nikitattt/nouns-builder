import { style } from '@vanilla-extract/css'

import { skeletonAnimation } from 'src/styles/animations.css'

export const row = style({
  width: '100%',
})

export const rowItem = style({
  width: '20%',
  '@media': {
    'screen and (max-width: 768px)': {
      width: '30%',
    },
  },
})
export const firstRowItem = style({
  width: '37%',
})
export const lastRowItem = style({
  width: '23%',
  '@media': {
    'screen and (max-width: 768px)': {
      width: '40%',
    },
  },
})
export const cardSkeleton = style({
  width: '100%',
  animation: skeletonAnimation,
  height: '32px',
  '@media': {
    'screen and (max-width: 768px)': {
      height: '67px',
    },
  },
})
