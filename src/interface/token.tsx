export interface nativeBalanceProps {
  balance: string;
}

export interface tokenBalanceProps {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string | undefined;
  thumbnail?: string | undefined;
  decimals: string;
  balance: string;
}

export interface nftBalanceProps {
  status?: string | undefined;
  total?: number | undefined;
  page?: number | undefined;
  page_size?: number | undefined;
  cursor?: string | undefined;
  result?: nftResultProps[];
}

export interface nftResultProps {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of?: string;
  block_number?: string;
  block_number_minted?: string;
  token_uri?: string | undefined;
  metadata?: string | undefined;
  synced_at?: string | undefined;
  amount?: string | undefined;
  name: string;
  symbol: string;
}

export interface routeProps {
  label: string;
  route: string;
}

export interface allowanceProps {
  allowance: string;
}

export interface tokenMetadataProps {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  logo?: string | undefined;
  logo_hash?: string | undefined;
  thumbnail?: string | undefined;
  block_number?: string | undefined;
  validated?: string | undefined;
}
