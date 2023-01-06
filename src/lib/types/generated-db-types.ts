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
      contracts: {
        Row: {
          id: string
          created_at: string | null
          metadata: Json | null
          project: string | null
          abi: Json | null
          slug: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          metadata?: Json | null
          project?: string | null
          abi?: Json | null
          slug?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          metadata?: Json | null
          project?: string | null
          abi?: Json | null
          slug?: string | null
        }
      }
      draft_expressions: {
        Row: {
          id: string
          created_at: string | null
          contract: string | null
          user_id: string
          raw_expression: string
          sharable_slug: string
          interpreter: string
          name: string
          notes: string
          contract_expression: string | null
          saved_context: Json | null
          tags: string[] | null
          public: boolean
        }
        Insert: {
          id?: string
          created_at?: string | null
          contract?: string | null
          user_id?: string
          raw_expression: string
          sharable_slug?: string
          interpreter: string
          name: string
          notes: string
          contract_expression?: string | null
          saved_context?: Json | null
          tags?: string[] | null
          public?: boolean
        }
        Update: {
          id?: string
          created_at?: string | null
          contract?: string | null
          user_id?: string
          raw_expression?: string
          sharable_slug?: string
          interpreter?: string
          name?: string
          notes?: string
          contract_expression?: string | null
          saved_context?: Json | null
          tags?: string[] | null
          public?: boolean
        }
      }
      draft_expressions_w: {
        Row: {
          id: string
          created_at: string | null
          contract: string | null
          user_id: string
          raw_expression: string
          sharable_slug: string
          interpreter: string
          name: string
          notes: string
          contract_expression: string | null
          saved_context: Json | null
          tags: string[] | null
          public: boolean
        }
        Insert: {
          id?: string
          created_at?: string | null
          contract?: string | null
          user_id?: string
          raw_expression: string
          sharable_slug?: string
          interpreter: string
          name: string
          notes: string
          contract_expression?: string | null
          saved_context?: Json | null
          tags?: string[] | null
          public?: boolean
        }
        Update: {
          id?: string
          created_at?: string | null
          contract?: string | null
          user_id?: string
          raw_expression?: string
          sharable_slug?: string
          interpreter?: string
          name?: string
          notes?: string
          contract_expression?: string | null
          saved_context?: Json | null
          tags?: string[] | null
          public?: boolean
        }
      }
      interpreters: {
        Row: {
          id: string
          created_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string | null
          metadata: Json
        }
        Update: {
          id?: string
          created_at?: string | null
          metadata?: Json
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string | null
          name: string
          logo_url: string
        }
        Insert: {
          id?: string
          created_at?: string | null
          name: string
          logo_url: string
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string
          logo_url?: string
        }
      }
      starred: {
        Row: {
          id: string
          user_id: string
          starred: string
          foreign_key: string | null
          address: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          starred: string
          foreign_key?: string | null
          address?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          starred?: string
          foreign_key?: string | null
          address?: string | null
        }
      }
      wallet_users: {
        Row: {
          id: string
          created_at: string | null
          username: string
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          username: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
      wallets: {
        Row: {
          id: string
          linked_at: string | null
          address: string
          user_id: string | null
        }
        Insert: {
          id: string
          linked_at?: string | null
          address: string
          user_id?: string | null
        }
        Update: {
          id?: string
          linked_at?: string | null
          address?: string
          user_id?: string | null
        }
      }
      wallets_linked: {
        Row: {
          id: string
          linked_at: string
          address: string
          user_id: string
        }
        Insert: {
          id?: string
          linked_at?: string
          address: string
          user_id: string
        }
        Update: {
          id?: string
          linked_at?: string
          address?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_expression_by_slug: {
        Args: { slug: string }
        Returns: unknown
      }
      get_expression_by_slug_w: {
        Args: { slug: string }
        Returns: unknown
      }
      get_unique_tags_for_user: {
        Args: Record<PropertyKey, never>
        Returns: { tags: string }[]
      }
      get_unique_tags_for_user_w: {
        Args: Record<PropertyKey, never>
        Returns: { tags: string }[]
      }
      get_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      match_contracts_by_address: {
        Args: { contracts_array: string[] }
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
        Args: { interpreters_array: string[] }
        Returns: { id: string; metadata: Json; interpreteraddress: string }[]
      }
      new_user_from_address: {
        Args: { address_: string; username_: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
