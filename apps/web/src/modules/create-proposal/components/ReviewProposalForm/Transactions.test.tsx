import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { parseEther } from 'viem'
import { vi } from 'vitest'

import { TransactionType } from '../../constants/transactionType'
import { Transactions } from './Transactions'

vi.mock('next/router', () => ({ useRouter: vi.fn() }))

describe('List of transactions', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render a given list of transactions', () => {
    render(
      <Formik initialValues={{ daoAvatar: undefined }} onSubmit={vi.fn()}>
        <Transactions
          transactions={[
            {
              type: TransactionType.UPGRADE,
              transactions: [
                {
                  functionSignature: 'fnc',
                  calldata: '0x0000123',
                  value: '',
                  target: '0x123',
                },
              ],
            },
            {
              type: TransactionType.CUSTOM,
              transactions: [
                {
                  functionSignature: 'fnc',
                  calldata: '0x0000123',
                  value: '',
                  target: '0x123',
                },
              ],
            },
          ]}
          simulations={[]}
        />
      </Formik>
    )

    expect(screen.getByText(/Transactions/)).toBeInTheDocument()
    expect(screen.queryAllByTestId('review-card')).toHaveLength(2)
  })

  it('should render a given list of failed transactions', () => {
    render(
      <Formik initialValues={{ daoAvatar: undefined }} onSubmit={vi.fn()}>
        <Transactions
          transactions={[
            {
              type: TransactionType.UPGRADE,
              transactions: [
                {
                  functionSignature: 'fnc',
                  calldata: '0x0000123',
                  value: '',
                  target: '0x123',
                },
                {
                  functionSignature: 'fnc',
                  calldata: '0x0000123',
                  value: '',
                  target: '0x123',
                },
              ],
            },
          ]}
          simulations={[
            {
              index: 1,
              success: false,
              simulationId: 'id-1',
              simulationUrl: 'url-1',
              gasUsed: parseEther('0.1').toString(),
            },
          ]}
        />
      </Formik>
    )

    expect(screen.getByText(/Transactions/)).toBeInTheDocument()

    const reviewCards = screen.queryAllByTestId('review-card')
    expect(reviewCards).toHaveLength(1)

    // has one simulation error
    const firstReviewCard = reviewCards[0]
    expect(within(firstReviewCard).queryAllByText(/View details/)).toHaveLength(1)
  })

  it('should render a given list of failed transactions', () => {
    render(
      <Formik initialValues={{ daoAvatar: undefined }} onSubmit={vi.fn()}>
        <Transactions
          transactions={[
            {
              type: TransactionType.UPGRADE,
              transactions: [
                {
                  functionSignature: 'fnc',
                  calldata: '0x0000123',
                  value: '',
                  target: '0x123',
                },
                {
                  functionSignature: 'fnc',
                  calldata: '0x0000123',
                  value: '',
                  target: '0x123',
                },
              ],
            },
            {
              type: TransactionType.CUSTOM,
              transactions: [
                {
                  functionSignature: 'fnc',
                  calldata: '0x0000123',
                  value: '',
                  target: '0x123',
                },
              ],
            },
          ]}
          simulations={[
            {
              index: 0,
              success: false,
              simulationId: 'id-0',
              simulationUrl: 'url-0',
              gasUsed: parseEther('0.1').toString(),
            },
            {
              index: 1,
              success: false,
              simulationId: 'id-1',
              simulationUrl: 'url-1',
              gasUsed: parseEther('0.1').toString(),
            },
            {
              index: 2,
              success: false,
              simulationId: 'id-2',
              simulationUrl: 'url-3',
              gasUsed: parseEther('0.1').toString(),
            },
          ]}
        />
      </Formik>
    )

    expect(screen.getByText(/Transactions/)).toBeInTheDocument()
    const reviewCards = screen.queryAllByTestId('review-card')
    expect(reviewCards).toHaveLength(2)

    const firstReviewCard = reviewCards[0]
    expect(within(firstReviewCard).queryAllByText(/View details/)).toHaveLength(2)

    const secondReviewCard = reviewCards[1]
    expect(within(secondReviewCard).queryAllByText(/View details/)).toHaveLength(1)
  })
})
