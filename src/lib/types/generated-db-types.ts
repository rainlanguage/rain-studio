export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clone_factories: {
        Row: {
          abi: Json
          clonable_version: string | null
          contract_meta: Json | null
          contract_meta_hash: string | null
          created_at: string | null
          id: string
          meta_bytes: string
          project: string | null
          slug: string
        }
        Insert: {
          abi: Json
          clonable_version?: string | null
          contract_meta?: Json | null
          contract_meta_hash?: string | null
          created_at?: string | null
          id: string
          meta_bytes: string
          project?: string | null
          slug: string
        }
        Update: {
          abi?: Json
          clonable_version?: string | null
          contract_meta?: Json | null
          contract_meta_hash?: string | null
          created_at?: string | null
          id?: string
          meta_bytes?: string
          project?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "clone_factories_project_fkey"
            columns: ["project"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      clone_factories_address: {
        Row: {
          address: string
          chain_id: number
          created_at: string | null
          factory: string
          id: string
          initial_deployer: string | null
        }
        Insert: {
          address: string
          chain_id: number
          created_at?: string | null
          factory: string
          id: string
          initial_deployer?: string | null
        }
        Update: {
          address?: string
          chain_id?: number
          created_at?: string | null
          factory?: string
          id?: string
          initial_deployer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clone_factories_address_factory_fkey"
            columns: ["factory"]
            referencedRelation: "clone_factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clone_factories_address_initial_deployer_fkey"
            columns: ["initial_deployer"]
            referencedRelation: "deployers_addresses"
            referencedColumns: ["id"]
          }
        ]
      }
      contract_addresses_new: {
        Row: {
          address: string
          chain_id: number
          contract: string
          created_at: string | null
          id: string
          implementation: string | null
          initial_deployer: string | null
          type: string
        }
        Insert: {
          address: string
          chain_id: number
          contract: string
          created_at?: string | null
          id: string
          implementation?: string | null
          initial_deployer?: string | null
          type: string
        }
        Update: {
          address?: string
          chain_id?: number
          contract?: string
          created_at?: string | null
          id?: string
          implementation?: string | null
          initial_deployer?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_addresses_new_contract_fkey"
            columns: ["contract"]
            referencedRelation: "contracts_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_addresses_new_implementation_fkey"
            columns: ["implementation"]
            referencedRelation: "contract_addresses_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_addresses_new_initial_deployer_fkey"
            columns: ["initial_deployer"]
            referencedRelation: "deployers_addresses"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "contracts_project_fkey"
            columns: ["project"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      contracts_new: {
        Row: {
          abi: Json
          clonable_version: string | null
          contract_meta: Json
          contract_meta_hash: string | null
          created_at: string
          id: string
          meta_bytes: string | null
          metadata: Json
          project: string | null
          slug: string
        }
        Insert: {
          abi: Json
          clonable_version?: string | null
          contract_meta: Json
          contract_meta_hash?: string | null
          created_at?: string
          id: string
          meta_bytes?: string | null
          metadata: Json
          project?: string | null
          slug: string
        }
        Update: {
          abi?: Json
          clonable_version?: string | null
          contract_meta?: Json
          contract_meta_hash?: string | null
          created_at?: string
          id?: string
          meta_bytes?: string | null
          metadata?: Json
          project?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_new_project_fkey"
            columns: ["project"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      deployers: {
        Row: {
          bytecode_hash: string
          created_at: string
          id: string
          opmeta: Json
          opmeta_bytes: string
          opmeta_hash: string | null
        }
        Insert: {
          bytecode_hash: string
          created_at?: string
          id: string
          opmeta: Json
          opmeta_bytes: string
          opmeta_hash?: string | null
        }
        Update: {
          bytecode_hash?: string
          created_at?: string
          id?: string
          opmeta?: Json
          opmeta_bytes?: string
          opmeta_hash?: string | null
        }
        Relationships: []
      }
      deployers_addresses: {
        Row: {
          address: string
          chain_id: number
          created_at: string
          deployer: string
          id: string
          interpreter_address: string | null
          store_address: string | null
        }
        Insert: {
          address: string
          chain_id: number
          created_at?: string
          deployer: string
          id: string
          interpreter_address?: string | null
          store_address?: string | null
        }
        Update: {
          address?: string
          chain_id?: number
          created_at?: string
          deployer?: string
          id?: string
          interpreter_address?: string | null
          store_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deployers_addresses_deployer_fkey"
            columns: ["deployer"]
            referencedRelation: "deployers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployers_addresses_interpreter_address_fkey"
            columns: ["interpreter_address"]
            referencedRelation: "rainterpreter_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployers_addresses_store_address_fkey"
            columns: ["store_address"]
            referencedRelation: "rainterpreter_store_addresses"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "draft_expressions_w_contract_fkey"
            columns: ["contract"]
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_expressions_w_interpreter_fkey"
            columns: ["interpreter"]
            referencedRelation: "interpreters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_expressions_w_org_id_fkey"
            columns: ["org_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draft_expressions_w_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "wallet_users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "org_member_org_id_fkey"
            columns: ["org_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_member_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "wallet_users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
      }
      rainterpreter_addresses: {
        Row: {
          address: string
          chain_id: number
          created_at: string
          id: string
          rainterpreter: string
        }
        Insert: {
          address: string
          chain_id: number
          created_at?: string
          id: string
          rainterpreter: string
        }
        Update: {
          address?: string
          chain_id?: number
          created_at?: string
          id?: string
          rainterpreter?: string
        }
        Relationships: [
          {
            foreignKeyName: "rainterpreter_addresses_rainterpreter_fkey"
            columns: ["rainterpreter"]
            referencedRelation: "rainterpreters"
            referencedColumns: ["id"]
          }
        ]
      }
      rainterpreter_store_addresses: {
        Row: {
          address: string
          chain_id: number
          created_at: string
          id: string
          rainterpreter_store: string
        }
        Insert: {
          address: string
          chain_id: number
          created_at?: string
          id: string
          rainterpreter_store: string
        }
        Update: {
          address?: string
          chain_id?: number
          created_at?: string
          id?: string
          rainterpreter_store?: string
        }
        Relationships: [
          {
            foreignKeyName: "rainterpreter_store_addresses_rainterpreter_store_fkey"
            columns: ["rainterpreter_store"]
            referencedRelation: "rainterpreter_stores"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "starred_foreign_key_fkey"
            columns: ["foreign_key"]
            referencedRelation: "draft_expressions_w"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starred_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "wallet_users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "wallets_linked_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "wallet_users"
            referencedColumns: ["id"]
          }
        ]
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
      get_combined_interpreters_by_filters: {
        Args: {
          search_value: string
          selected_networks: number[]
          selected_interpreters: string[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_combined_interpreters_by_filters_count: {
        Args: {
          search_value: string
          selected_networks: number[]
          selected_interpreters: string[]
        }
        Returns: number
      }
      get_combined_interpreters_by_filters_pagination: {
        Args: {
          search_value: string
          selected_networks: number[]
          selected_interpreters: string[]
          offset_: number
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_contracts_address_by_search_value_address_and_networks: {
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
          project: string
          created_at: string
          slug: string
          metadata: Json
          contract_addresses_new: Json
        }[]
      }
      get_contracts_with_addresses_by_filters_count: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: number
      }
      get_contracts_with_addresses_by_filters_pagination: {
        Args: {
          search_value: string
          selected_networks: number[]
          offset_: number
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
      get_deployers_address_by_address_and_networks: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_deployers_address_by_networks: {
        Args: {
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_deployers_address_no_filters: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_deployers_by_address: {
        Args: {
          search_value: string
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_deployers_with_addresses_by_filters: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_deployers_with_addresses_by_filters_count: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: number
      }
      get_deployers_with_addresses_by_filters_pagination: {
        Args: {
          search_value: string
          selected_networks: number[]
          offset_: number
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
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
      get_rainterpreter_stores_address_by_address_and_networks: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreter_stores_address_by_networks: {
        Args: {
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreter_stores_address_no_filters: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreter_stores_by_address: {
        Args: {
          search_value: string
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreter_stores_with_addresses_by_filters: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreter_stores_with_addresses_by_filters_count: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: number
      }
      get_rainterpreter_stores_with_addresses_by_filters_pagination: {
        Args: {
          search_value: string
          selected_networks: number[]
          offset_: number
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreters_address_by_address_and_networks: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreters_address_by_networks: {
        Args: {
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreters_address_no_filters: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreters_by_address: {
        Args: {
          search_value: string
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreters_with_addresses_by_filters: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
      }
      get_rainterpreters_with_addresses_by_filters_count: {
        Args: {
          search_value: string
          selected_networks: number[]
        }
        Returns: number
      }
      get_rainterpreters_with_addresses_by_filters_pagination: {
        Args: {
          search_value: string
          selected_networks: number[]
          offset_: number
        }
        Returns: {
          id: string
          slug: string
          created_at: string
          type: string
          addresses: Json
        }[]
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
