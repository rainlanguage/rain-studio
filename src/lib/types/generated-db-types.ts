export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contract_addresses_new: {
        Row: {
          address: string
          chain_id: number
          contract: string
          created_at: string | null
          id: string
          type: string
        }
        Insert: {
          address: string
          chain_id: number
          contract: string
          created_at?: string | null
          id: string
          type: string
        }
        Update: {
          address?: string
          chain_id?: number
          contract?: string
          created_at?: string | null
          id?: string
          type?: string
        }
      }
      contracts: {
        Row: {
          abi: Json | null
          created_at: string | null
          id: string
          metadata: Json | null
          project: string | null
          slug: string | null
        }
        Insert: {
          abi?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project?: string | null
          slug?: string | null
        }
        Update: {
          abi?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project?: string | null
          slug?: string | null
        }
      }
      contracts_new: {
        Row: {
          abi: Json
          contract_meta: Json
          created_at: string
          id: string
          metadata: Json
          project: string | null
          slug: string
        }
        Insert: {
          abi: Json
          contract_meta: Json
          created_at?: string
          id: string
          metadata: Json
          project?: string | null
          slug: string
        }
        Update: {
          abi?: Json
          contract_meta?: Json
          created_at?: string
          id?: string
          metadata?: Json
          project?: string | null
          slug?: string
        }
      }
      deployers: {
        Row: {
          bytecode_hash: string
          created_at: string
          id: string
          opmeta: Json
          opmeta_bytes: string
        }
        Insert: {
          bytecode_hash: string
          created_at?: string
          id: string
          opmeta: Json
          opmeta_bytes: string
        }
        Update: {
          bytecode_hash?: string
          created_at?: string
          id?: string
          opmeta?: Json
          opmeta_bytes?: string
        }
      }
      deployers_addresses: {
        Row: {
          address: string
          chainId: number
          created_at: string
          deployer: string
          id: string
        }
        Insert: {
          address: string
          chainId: number
          created_at?: string
          deployer: string
          id: string
        }
        Update: {
          address?: string
          chainId?: number
          created_at?: string
          deployer?: string
          id?: string
        }
      }
      draft_expressions_w: {
        Row: {
          contract: string | null
          contract_expression: string | null
          created_at: string | null
          id: string
          interpreter: string
          name: string
          notes: string
          org_id: string | null
          public: boolean
          raw_expression: string
          saved_context: Json | null
          sharable_slug: string
          tags: string[] | null
          user_id: string
        }
        Insert: {
          contract?: string | null
          contract_expression?: string | null
          created_at?: string | null
          id?: string
          interpreter: string
          name: string
          notes: string
          org_id?: string | null
          public?: boolean
          raw_expression: string
          saved_context?: Json | null
          sharable_slug?: string
          tags?: string[] | null
          user_id?: string
        }
        Update: {
          contract?: string | null
          contract_expression?: string | null
          created_at?: string | null
          id?: string
          interpreter?: string
          name?: string
          notes?: string
          org_id?: string | null
          public?: boolean
          raw_expression?: string
          saved_context?: Json | null
          sharable_slug?: string
          tags?: string[] | null
          user_id?: string
        }
      }
      interpreters: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json
        }
      }
      org_member: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: string
          user_id?: string
        }
      }
      organizations: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          nickname: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name: string
          nickname: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          nickname?: string
          website?: string | null
        }
      }
      projects: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string
          name?: string
        }
      }
      rainterpreter_addresses: {
        Row: {
          address: string
          chainId: number
          created_at: string
          id: string
          rainterpreter: string
        }
        Insert: {
          address: string
          chainId: number
          created_at?: string
          id: string
          rainterpreter: string
        }
        Update: {
          address?: string
          chainId?: number
          created_at?: string
          id?: string
          rainterpreter?: string
        }
      }
      rainterpreter_store_addresses: {
        Row: {
          address: string
          chainId: number
          created_at: string
          id: string
          rainterpreter_store: string
        }
        Insert: {
          address: string
          chainId: number
          created_at?: string
          id: string
          rainterpreter_store: string
        }
        Update: {
          address?: string
          chainId?: number
          created_at?: string
          id?: string
          rainterpreter_store?: string
        }
      }
      rainterpreter_stores: {
        Row: {
          bytecode_hash: string
          created_at: string | null
          id: string
        }
        Insert: {
          bytecode_hash: string
          created_at?: string | null
          id: string
        }
        Update: {
          bytecode_hash?: string
          created_at?: string | null
          id?: string
        }
      }
      rainterpreters: {
        Row: {
          bytecode_hash: string
          created_at: string
          id: string
        }
        Insert: {
          bytecode_hash: string
          created_at?: string
          id: string
        }
        Update: {
          bytecode_hash?: string
          created_at?: string
          id?: string
        }
      }
      starred: {
        Row: {
          address: string | null
          foreign_key: string | null
          id: string
          starred: string
          user_id: string
        }
        Insert: {
          address?: string | null
          foreign_key?: string | null
          id?: string
          starred: string
          user_id?: string
        }
        Update: {
          address?: string | null
          foreign_key?: string | null
          id?: string
          starred?: string
          user_id?: string
        }
      }
      wallet_users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          username?: string
          website?: string | null
        }
      }
      wallets_linked: {
        Row: {
          address: string
          id: string
          linked_at: string
          user_id: string
        }
        Insert: {
          address: string
          id?: string
          linked_at?: string
          user_id: string
        }
        Update: {
          address?: string
          id?: string
          linked_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization: {
        Args: {
          name_: string
          nickname_: string
        }
        Returns: undefined
      }
      get_contracts_address_by_search_value_address_and_networks: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          abi: Json
          contract_meta: Json
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_search_value_address_and_networks_0: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_search_value_address_filter: {
        Args: {
          search_value: string
        }
        Returns: {
          id: string
          abi: Json
          contract_meta: Json
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_search_value_address_filter_0: {
        Args: {
          search_value: string
        }
        Returns: {
          id: string
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_search_value_metadata_and_networks: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          abi: Json
          contract_meta: Json
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_search_value_metadata_and_networks_0: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_search_value_metadata_filter: {
        Args: {
          search_value: string
        }
        Returns: {
          id: string
          abi: Json
          contract_meta: Json
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_search_value_metadata_filter_0: {
        Args: {
          search_value: string
        }
        Returns: {
          id: string
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_selected_networks: {
        Args: {
          selected_networks: number[]
        }
        Returns: {
          id: string
          abi: Json
          contract_meta: Json
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_by_selected_networks_0: {
        Args: {
          selected_networks: number[]
        }
        Returns: {
          id: string
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_no_filters: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          abi: Json
          contract_meta: Json
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_address_no_filters_0: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_with_addresses_by_filters: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          abi: Json
          contract_meta: Json
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_with_addresses_by_filters_0: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_expression_by_slug_w: {
        Args: {
          slug: string
        }
        Returns: {
          contract: string | null
          contract_expression: string | null
          created_at: string | null
          id: string
          interpreter: string
          name: string
          notes: string
          org_id: string | null
          public: boolean
          raw_expression: string
          saved_context: Json | null
          sharable_slug: string
          tags: string[] | null
          user_id: string
        }[]
      }
      get_member_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_unique_tags_for_user_w: {
        Args: Record<PropertyKey, never>
        Returns: {
          tags: string
        }[]
      }
      get_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_context_org: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      match_contracts_by_address: {
        Args: {
          contracts_array: string[]
        }
        Returns: {
          id: string
          metadata: Json
          contract_address: string
          name: string
          logo_url: string
          project_id: string
        }[]
      }
      match_interpreters_by_address: {
        Args: {
          interpreters_array: string[]
        }
        Returns: {
          id: string
          metadata: Json
          interpreteraddress: string
        }[]
      }
      new_user_from_address: {
        Args: {
          address_: string
          username_: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      filter_contracts_output: {
        id: string
        abi: Json
        contract_meta: Json
        project: string
        created_at: string
        slug: string
        metadata: Json
        contract_addresses_new: Json
      }
    }
  }
}
