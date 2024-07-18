import { Atoms, Box, Button, Flex, Stack, Text, theme } from '@zoralabs/zord'
import { Field, Formik, Form as FormikForm } from 'formik'
import React, { Fragment } from 'react'
import { useSWRConfig } from 'swr'
import {
  SendTransactionResult,
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from 'wagmi/actions'

import { ContractButton } from 'src/components/ContractButton'
import { Icon } from 'src/components/Icon'
import { IconType } from 'src/components/Icon/icons'
import AnimatedModal from 'src/components/Modal/AnimatedModal'
import { SuccessModalContent } from 'src/components/Modal/SuccessModalContent'
import SWR_KEYS from 'src/constants/swrKeys'
import { governorAbi } from 'src/data/contract/abis'
import { getProposal } from 'src/data/subgraph/requests/proposalQuery'
import { useDaoStore } from 'src/modules/dao'
import { useChainStore } from 'src/stores/useChainStore'
import {
  proposalFormTitle,
  voteModalFieldset,
  voteModalOption,
  voteModalOptionText,
  voteModalRadioInput,
  voteModalReason,
} from 'src/styles/Proposals.css'
import { BytesType } from 'src/typings'

enum Choice {
  AGAINST = '0',
  FOR = '1',
  ABSTAIN = '2',
}

interface FormValues {
  choice: Choice | undefined
  reason: string
}

const VoteModal: React.FC<{
  title: string
  proposalId: string
  votesAvailable: number
  showVoteModal: boolean
  setShowVoteModal: (show: boolean) => void
}> = ({ title, proposalId, votesAvailable, showVoteModal, setShowVoteModal }) => {
  const { addresses } = useDaoStore()
  const { mutate } = useSWRConfig()
  const chain = useChainStore((x) => x.chain)

  const [isCastVoteSuccess, setIsCastVoteSuccess] = React.useState<boolean>(false)

  const initialValues: FormValues = {
    choice: undefined,
    reason: '',
  }

  const handleSubmit = async (values: FormValues) => {
    if (!addresses.governor) return

    const governorContractParams = {
      address: addresses.governor,
      abi: governorAbi,
      chainId: chain.id,
    }

    let vote: Promise<SendTransactionResult>
    if (values.reason.length > 0) {
      const config = await prepareWriteContract({
        ...governorContractParams,
        functionName: 'castVoteWithReason',
        args: [proposalId as BytesType, BigInt(values.choice as Choice), values.reason],
      })
      vote = writeContract(config)
    } else {
      const config = await prepareWriteContract({
        ...governorContractParams,
        functionName: 'castVote',
        args: [proposalId as BytesType, BigInt(values.choice!)],
      })
      vote = writeContract(config)
    }

    const { hash } = await vote
    await waitForTransaction({ hash })

    await mutate(
      [SWR_KEYS.PROPOSAL, chain.id, proposalId],
      getProposal(chain.id, proposalId)
    )

    setIsCastVoteSuccess(true)
  }

  const voteOptions = [
    {
      text: `Cast ${votesAvailable} ${votesAvailable > 1 ? 'votes' : 'vote'} for`,
      value: Choice.FOR,
      icon: { id: 'check', fill: 'positive', activeBackground: '#1A8967' },
    },
    {
      text: `Cast ${votesAvailable} ${votesAvailable > 1 ? 'votes' : 'vote'} against`,
      value: Choice.AGAINST,
      icon: { id: 'cross', fill: 'negative', activeBackground: '#CD2D2D' },
    },
    {
      text: 'Abstain from voting',
      value: Choice.ABSTAIN,
      icon: { id: 'dash', fill: 'neutral', activeBackground: '#C4C4C4' },
    },
  ]

  return (
    <Fragment>
      {/* Vote Modal */}
      <AnimatedModal open={showVoteModal} size={isCastVoteSuccess ? 'small' : 'medium'}>
        {isCastVoteSuccess ? (
          <SuccessModalContent
            success={true}
            title={'Vote Submitted'}
            subtitle={`You’ve successfully voted on this proposal`}
          />
        ) : (
          <Box>
            <Flex justify={'space-between'}>
              <Box>
                <Text variant="heading-md" className={proposalFormTitle}>
                  {votesAvailable === 0 ? 'Submit Vote' : 'Submit Votes'}
                </Text>
                <Text variant="paragraph-sm" color="tertiary">
                  Proposal: {title}
                </Text>
              </Box>
              <Button
                variant="ghost"
                onClick={() => setShowVoteModal(false)}
                p={'x0'}
                size="xs"
                style={{
                  // prop padding does not change padding to 0
                  padding: 0,
                }}
              >
                <Icon id="cross" />
              </Button>
            </Flex>

            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ values, submitForm, isSubmitting, setFieldValue }) => (
                <FormikForm method="post">
                  <fieldset disabled={isSubmitting} className={voteModalFieldset}>
                    <Stack role="group" mt="x6" gap="x3">
                      {voteOptions.map(({ text, value, icon }) => {
                        const active = values.choice === value
                        return (
                          <label key={text}>
                            <Flex
                              backgroundColor="background2"
                              position="relative"
                              w="100%"
                              borderRadius="curved"
                              align="center"
                              justify="center"
                              borderColor="transparent"
                              p="x4"
                              h="x16"
                              className={voteModalOption}
                              data-is-active-negative={
                                value === Choice.AGAINST && values.choice === value
                              }
                              data-is-active-positive={
                                value === Choice.FOR && values.choice === value
                              }
                              data-is-active-neutral={
                                value === Choice.ABSTAIN && values.choice === value
                              }
                            >
                              <Field
                                type="radio"
                                name="choice"
                                value={value}
                                className={voteModalRadioInput}
                                position="absolute"
                                top={0}
                                left={0}
                              />
                              <Text
                                className={voteModalOptionText}
                                variant="paragraph-md"
                              >
                                {text}
                              </Text>
                              <Box position="absolute" top="x4" right="x4">
                                <Icon
                                  id={icon.id as IconType}
                                  borderRadius="round"
                                  p={'x1'}
                                  style={{
                                    backgroundColor: active
                                      ? icon.activeBackground
                                      : theme.colors.background1,
                                  }}
                                  fill={
                                    active ? 'onAccent' : (icon.fill as Atoms['color'])
                                  }
                                />
                              </Box>
                            </Flex>
                          </label>
                        )
                      })}
                    </Stack>

                    <Box mt="x5">
                      <Text variant="paragraph-md" className={voteModalOptionText}>
                        Reason
                      </Text>

                      <Box
                        as="textarea"
                        name="reason"
                        borderRadius="curved"
                        p="x4"
                        mt="x2"
                        backgroundColor="background2"
                        height="x32"
                        width="100%"
                        value={values.reason}
                        className={voteModalReason}
                        onChange={(e: React.FormEvent<HTMLTextAreaElement>) =>
                          setFieldValue('reason', e.currentTarget.value)
                        }
                      />

                      <Text color="tertiary" mt="x2" variant="paragraph-md">
                        Optional
                      </Text>
                    </Box>

                    <ContractButton
                      loading={isSubmitting}
                      handleClick={submitForm}
                      type="submit"
                      w="100%"
                      size="lg"
                      mt="x8"
                      borderRadius="curved"
                    >
                      Submit vote
                    </ContractButton>
                  </fieldset>
                </FormikForm>
              )}
            </Formik>
          </Box>
        )}
      </AnimatedModal>
    </Fragment>
  )
}

export default VoteModal
