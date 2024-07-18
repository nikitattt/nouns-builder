import { Box, Flex, atoms } from '@zoralabs/zord'
import { FormikProps } from 'formik'
import { motion } from 'framer-motion'
import React, { ChangeEventHandler, ReactElement, WheelEvent } from 'react'
import useSWR from 'swr'
import { Address } from 'wagmi'

import { Icon } from 'src/components/Icon'
import SWR_KEYS from 'src/constants/swrKeys'
import { getEnsName } from 'src/utils/ens'
import { isEmpty } from 'src/utils/helpers'

import {
  defaultFieldsetStyle,
  defaultHelperTextStyle,
  defaultInputErrorMessageStyle,
  defaultInputLabelStyle,
  inputCheckIcon,
  inputStyleVariants,
  permaInputPlaceHolderStyle,
} from './styles.css'

interface SmartInputProps {
  id: string
  value: string | number
  type: string
  inputLabel?: string | ReactElement
  onChange: ChangeEventHandler
  onBlur: ChangeEventHandler
  formik?: FormikProps<any>
  errorMessage?: any
  helperText?: string
  autoSubmit?: boolean
  max?: number
  min?: number
  perma?: string
  placeholder?: string
  step?: number
  submitCallback?: (values: any) => void
  disabled?: boolean
  disableWheelEvent?: boolean
  isAddress?: boolean
}

const SmartInput: React.FC<SmartInputProps> = ({
  id,
  value,
  type,
  inputLabel,
  onChange,
  onBlur,
  autoSubmit,
  formik,
  errorMessage,
  helperText,
  max,
  perma,
  placeholder,
  step = 0.0001, // temp until protocol supports 0 ETH reserve price
  submitCallback,
  disabled = false,
  disableWheelEvent = type === 'number',
  isAddress,
}) => {
  const { data: ensName } = useSWR(
    isAddress ? [SWR_KEYS.ENS, value] : null,
    async () => await getEnsName(value as Address)
  )

  /*

  add autocomplete to refs (autocomplete not supported ref in types)

  */
  const input = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (input.current !== null) {
      input.current.setAttribute('autocomplete', 'off')
    }
  }, [input])

  /*

    handlers: blur, focus

    */
  const [isFocus, setIsFocus] = React.useState<boolean>(false)
  const handleBlur = () => {
    setIsFocus(false)
    if (autoSubmit && formik) {
      formik.submitForm()

      if (submitCallback && isEmpty(formik.errors)) {
        submitCallback(formik.values)
      }
    }
  }

  const handleFocus = () => {
    setIsFocus(true)
  }

  const helperVariants = {
    init: {
      height: 0,
      overflow: 'hidden',
    },
    open: {
      height: 'auto',
    },
  }

  return (
    <Box as="fieldset" mb={'x8'} p={'x0'} className={defaultFieldsetStyle}>
      {inputLabel && <label className={defaultInputLabelStyle}>{inputLabel}</label>}
      {errorMessage && (
        <Box
          position={'absolute'}
          right={'x2'}
          top={'x10'}
          fontSize={12}
          className={defaultInputErrorMessageStyle}
        >
          {errorMessage}
        </Box>
      )}
      <input
        id={id}
        type={type}
        onChange={onChange}
        onBlur={!!onBlur ? onBlur : handleBlur}
        onFocus={handleFocus}
        value={ensName ? ensName : typeof value === 'number' && isNaN(value) ? '' : value}
        className={`${inputStyleVariants[!!errorMessage ? 'error' : 'default']} ${
          isAddress ? atoms({ pr: 'x13' }) : ''
        }`}
        min={0}
        max={max}
        step={step}
        placeholder={perma || placeholder || ''}
        ref={input}
        disabled={disabled}
        onWheel={
          disableWheelEvent
            ? (e: WheelEvent<HTMLInputElement>) => e.currentTarget.blur()
            : undefined
        }
      />
      {isAddress && !!value.toString().length && !errorMessage && (
        <Flex
          align={'center'}
          justify={'center'}
          position={'absolute'}
          className={inputCheckIcon['default']}
        >
          <Icon fill="background1" id="check" />
        </Flex>
      )}
      {(typeof value === 'number' || value) && perma ? (
        <Box position={'absolute'} className={permaInputPlaceHolderStyle}>
          {perma}
        </Box>
      ) : null}
      <motion.div
        variants={helperVariants}
        initial={'init'}
        animate={isFocus ? 'open' : 'init'}
      >
        {!!helperText && helperText?.length > 0 ? (
          <Box className={defaultHelperTextStyle}>{helperText}</Box>
        ) : null}
      </motion.div>
    </Box>
  )
}

export default SmartInput
