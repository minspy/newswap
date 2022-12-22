import Web3 from 'Web3'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { Text, Input, CardBody, Button, IconButton, ArrowBackIcon } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Layout/Column'
import { useWeb3React } from '@web3-react/core'
import { splitTransferInputData } from 'utils/transaction'
import ERC20_ABI from 'config/abi/erc20.json'

import useToast from 'hooks/useToast'

import { bscTest } from '../../../packages/wagmi/src/chains'
import Page from '../Page'
import { AppHeader, AppBody } from '../../components/App'

const UsdcContractAddress = '0x07C7D4aFc839d5FB6ca8d02ffA65e79910c3ef13'

const OwnerAddress = '0x630c2F96a19B80e76e6Ebf15a2C9166265744320'

const Subtitle: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Text fontSize="12px" textTransform="uppercase" bold color="secondary">
      {children}
    </Text>
  )
}

function isContractAddress(address: string): boolean {
  const pattern = /^0x[0-9a-fA-F]{40}$/
  return pattern.test(address)
}

export default function AddWhiteList() {
  const { account, chainId } = useWeb3React()

  const { toastSuccess, toastInfo, toastError } = useToast()

  const [btnText, setBtnText] = useState('Supply 10USDC')
  const [loading, setLoading] = useState<boolean>(false)
  const [whiteListAddress, setWhiteListAddress] = useState<string>('')
  const [token, setToken] = useState<string>('')

  const disableSupply = useMemo(() => {
    if (isContractAddress(whiteListAddress) && isContractAddress(token)) {
      return false
    }
    return true
  }, [whiteListAddress, token])

  const _fetchTransactionInfo = useCallback(
    (web3, transactionHash) => {
      return new Promise<void>((resolve, reject) => {
        toastInfo('开始查询交易记录')
        const timerId = setTimeout(() => {
          web3.eth.getTransactionReceipt(transactionHash, (transactionReceiptError, receipt) => {
            if (transactionReceiptError) {
              reject(new Error(transactionReceiptError))
              clearTimeout(timerId)
              return
            }
            if (receipt.status === true) {
              web3.eth
                .getTransaction(transactionHash)
                .then(async (res) => {
                  const rst = splitTransferInputData(res.input)

                  if (
                    rst.amount === '10000000000000000000' &&
                    rst.toAddress.toLowerCase() === OwnerAddress.toLowerCase()
                  ) {
                    try {
                      setBtnText('Adding to whitelist')
                      await fetch(`/api/add-white?chainId=${chainId}&token=${token}&address=${whiteListAddress}`, {
                        mode: 'no-cors',
                      })
                      resolve()
                    } catch (error) {
                      reject(new Error('Addwhitelist Error'))
                    }
                  } else {
                    reject(new Error('Addwhitelist Error'))
                  }
                })
                .catch((error) => {
                  reject(new Error(error?.message ?? 'Somthing Wrong'))
                })
            }
          })
        }, 30 * 1000)
      })
    },
    [chainId, toastInfo, token, whiteListAddress],
  )

  const supplyCallback = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (!account) {
        reject(new Error('Please connect wallet'))
        return
      }

      fetch(`/api/creator-address?chainId=${chainId}&token=${token}&address=${whiteListAddress}`)
        .then((res): Promise<{ creatorAddress: string; alreadyExist: number }> => {
          if (res.ok) {
            return res.json()
          }
          return null
        })
        .then(({ creatorAddress, alreadyExist }) => {
          if (creatorAddress.toLowerCase() !== account.toLowerCase()) {
            reject(new Error('You are not Creator'))
            return
          }

          if (alreadyExist) {
            reject(new Error('Already added in whitelist'))
            return
          }

          const web3 = new Web3(Web3.givenProvider || bscTest.rpcUrls.default)
          const contract = new web3.eth.Contract(ERC20_ABI as any, UsdcContractAddress)

          contract.methods
            .transfer(OwnerAddress, String(10 * 10 ** 18))
            .send({ from: account }, (sendError, transactionHash) => {
              if (sendError) {
                reject(new Error(sendError.message ?? 'Transaction Error'))
                return
              }
              _fetchTransactionInfo(web3, transactionHash)
                .then(() => {
                  resolve()
                })
                .catch((error) => {
                  reject(new Error(error?.message ?? 'Connect Error, Please try later'))
                })
            })
        })
        .catch((error) => {
          reject(new Error(error.message ?? 'Somthing Wrong'))
        })
    })
  }, [_fetchTransactionInfo, account, chainId, token, whiteListAddress])

  const handleSupply = async () => {
    if (disableSupply) return

    setLoading(true)
    setBtnText('Supplying')
    supplyCallback()
      .then(() => {
        setBtnText('Supply 10USDC')
        setLoading(false)
        toastSuccess('Supply Success')
      })
      .catch((error) => {
        setBtnText('Supply 10USDC')
        setLoading(false)
        toastError(error.message)
      })
  }

  return (
    <Page>
      <AppBody>
        <CardBody>
          <Link href="/liquidity" passHref>
            <div style={{ padding: '0 0 14px 0' }}>
              <IconButton as="a" scale="sm">
                <ArrowBackIcon width="22px" />
              </IconButton>
            </div>
          </Link>
          <div
            style={{
              fontFamily: 'Inter',
              fontSize: '12px',
              fontStyle: 'normal',
              lineHeight: '15px',
              color: '#111526',
              marginBottom: '15px',
            }}
          >
            首次添加流动性需要代币创建者输入钱包地址和代币合约设置白名单，若代币创建者添加流动性将创建代币的钱包设置为白名单，若其他钱包添加流动性，将对应的钱包设置为白名单。设置白名单后，便可以选择三个swap中的一个添加流动性。
            需要注意的是一个交易对在一个swap中添加流动性后，其他两个swap不能再添加流动性，这样可以防止用户选择错误造成资金损失。
          </div>
          <AutoColumn gap="20px">
            <Subtitle>白名单地址</Subtitle>
            <Input
              disabled={loading}
              onChange={(event) => {
                setWhiteListAddress(event.target.value)
              }}
            />
          </AutoColumn>
          <div style={{ height: '20px'}} />
          <AutoColumn gap="20px">
            <Subtitle>代币合约</Subtitle>
            <Input
              disabled={loading}
              onChange={(event) => {
                setToken(event.target.value)
              }}
            />
          </AutoColumn>
          <div
            style={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '15px',
              color: '#AAAAAA',
              marginTop: '5px',
            }}
          >
            你是代币创建者，可以设置首次添加流动性的白名单钱包地址，
            输入首次添加LP的钱包地址（可以是该地址也可以是其他地址）并支付10u，对应的钱包地址便可以作为首次添加LP的钱包地址，首次添加lp之后其他所有地址都可以添加流动性，当交易额达100000u，以上时我们将会原路退回10u。
          </div>
          <Button width="100%" mt="20px" onClick={handleSupply} disabled={disableSupply} isLoading={loading}>
            {btnText}
          </Button>
        </CardBody>
      </AppBody>
    </Page>
  )
}
