import * as Yup from 'yup'

import { auctionReservePriceValidationSchema } from 'src/modules/create-dao'
import { Duration } from 'src/typings'
import { addressValidationOptionalSchema, durationValidationSchema } from 'src/utils/yup'

export interface PreAuctionFormValues {
  auctionDuration: Duration
  auctionReservePrice: number
  auctionRewardRecipient?: string
  auctionRewardPercentage: number
}

export const preAuctionValidationSchema = Yup.object().shape({
  auctionDuration: durationValidationSchema(),
  auctionReservePrice: auctionReservePriceValidationSchema,
  auctionRewardRecipient: addressValidationOptionalSchema.when(
    'auctionRewardPercentage',
    (auctionRewardPercentage, schema) => {
      if (auctionRewardPercentage > 0) return schema.required('*') // Recipient is required if reward percentage is greater than 0
      return schema
    }
  ),
  auctionRewardPercentage: Yup.number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('*')
    .max(50, '<= 50%'),
})
