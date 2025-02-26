import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, test, vi} from 'vitest'
import {WalletItem} from '../../../src/app/connect-wallet/WalletItem'
import {staticImageData} from '../../fixtures/data/image'

describe('WalletItem', () => {
  const defaultProps = {
    name: 'Test Wallet',
    icon: staticImageData,
    isInstalled: true,
    onClick: vi.fn(),
  }

  test('renders wallet name and icon', () => {
    render(<WalletItem {...defaultProps} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Test Wallet')).toBeInTheDocument()
    expect(screen.getByRole('img', {name: 'Test Wallet'})).toBeInTheDocument()
  })

  test('shows "Not installed" message when wallet is not installed', () => {
    render(<WalletItem {...defaultProps} isInstalled={false} />)

    expect(screen.getByText('Not installed')).toBeInTheDocument()
  })

  test('is clickable when enabled and installed', async () => {
    const onClick = vi.fn()
    render(<WalletItem {...defaultProps} onClick={onClick} />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(onClick).toHaveBeenCalled()
    expect(button).not.toBeDisabled()
  })

  test('is disabled when wallet is not installed', () => {
    render(<WalletItem {...defaultProps} isInstalled={false} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('is disabled when disabled prop is true', () => {
    render(<WalletItem {...defaultProps} disabled={true} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
