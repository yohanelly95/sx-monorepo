import { Interface } from '@ethersproject/abi';
import { parseUnits } from '@ethersproject/units';
import type {
  SendTokenTransaction,
  SendNftTransaction,
  ContractCallTransaction
} from '@/types';

const abis = {
  erc20: ['function transfer(address _to, uint256 _value) returns (bool)'],
  erc721: [
    'function safeTransferFrom(address from, address to, uint256 tokenId)'
  ],
  erc1155: [
    'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)'
  ]
};

export function createSendTokenTransaction({
  token,
  form
}): SendTokenTransaction {
  const baseAmount = parseUnits(
    form.amount.toString(),
    token.contract_decimals
  );

  const isEth =
    token.contract_address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

  let data = '0x';
  if (!isEth) {
    const iface = new Interface(abis.erc20);
    data = iface.encodeFunctionData('transfer', [form.to, baseAmount]);
  }

  return {
    _type: 'sendToken',
    _form: {
      recipient: form.to,
      token: {
        name: token.contract_name,
        decimals: token.contract_decimals,
        symbol: token.contract_ticker_symbol,
        address: token.contract_address
      },
      amount: baseAmount.toString()
    },
    to: isEth ? form.to : token.contract_address,
    data,
    value: isEth ? baseAmount.toString() : '0'
  };
}

export function createSendNftTransaction({
  nft,
  address,
  form
}): SendNftTransaction {
  let data = '';

  const baseAmount = parseUnits(
    form.amount.toString() || '1',
    nft.contract_decimals
  );

  if (nft.type === 'erc1155') {
    const iface = new Interface(abis.erc1155);

    data = iface.encodeFunctionData('safeTransferFrom', [
      address,
      form.to,
      nft.tokenId,
      baseAmount,
      0
    ]);
  } else if (nft.type === 'erc721') {
    const iface = new Interface(abis.erc721);

    data = iface.encodeFunctionData('safeTransferFrom', [
      address,
      form.to,
      nft.tokenId
    ]);
  } else {
    throw new Error('Unknown NFT type');
  }

  return {
    _type: 'sendNft',
    _form: {
      recipient: form.to,
      amount: baseAmount.toString(),
      nft: {
        address: nft.contract_address,
        id: nft.tokenId,
        name: nft.title,
        collection: nft.contract_name
      }
    },
    to: nft.contract_address,
    data,
    value: '0'
  };
}

export function createContractCallTransaction({
  form
}): ContractCallTransaction {
  const args = Object.values(form.args);

  const iface = new Interface(form.abi);
  const data = iface.encodeFunctionData(form.method, args);

  return {
    _type: 'contractCall',
    to: form.to,
    data,
    value: '0x',
    _form: {
      method: form.method,
      args
    }
  };
}
