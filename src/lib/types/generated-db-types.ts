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
      draft_expressions: {
        Row: {
          contract: string | null
          contract_expression: string | null
          created_at: string | null
          id: string
          interpreter: string
          name: string
          notes: string
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
          public?: boolean
          raw_expression?: string
          saved_context?: Json | null
          sharable_slug?: string
          tags?: string[] | null
          user_id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string
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
      wallets: {
        Row: {
          address: string
          id: string
          linked_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          id: string
          linked_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          id?: string
          linked_at?: string | null
          user_id?: string | null
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
