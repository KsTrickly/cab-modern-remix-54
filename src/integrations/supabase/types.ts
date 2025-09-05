export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      airport_trip_bookings: {
        Row: {
          airport_name: string
          booking_id: string
          created_at: string
          id: string
          pickup_city_id: string
          transfer_type: string
          updated_at: string
        }
        Insert: {
          airport_name: string
          booking_id: string
          created_at?: string
          id?: string
          pickup_city_id: string
          transfer_type: string
          updated_at?: string
        }
        Update: {
          airport_name?: string
          booking_id?: string
          created_at?: string
          id?: string
          pickup_city_id?: string
          transfer_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "airport_trip_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airport_trip_bookings_pickup_city_id_fkey"
            columns: ["pickup_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          additional_city_id: string | null
          advance_amount: number | null
          advance_paid: boolean | null
          airport_name: string | null
          booking_status: string | null
          created_at: string
          destination_address: string | null
          destination_city_id: string | null
          destination_name: string | null
          extra_per_km_rate: number | null
          id: string
          instructions: string | null
          number_of_days: number
          number_of_persons: number | null
          package_id: string | null
          payment_status: string | null
          pickup_address: string | null
          pickup_city_id: string | null
          pickup_date: string
          pickup_time: string
          return_date: string | null
          ticket_id: string | null
          total_amount: number
          total_km_override: number | null
          trip_type: string | null
          updated_at: string
          user_email: string | null
          user_name: string | null
          user_phone: string
          vehicle_id: string | null
        }
        Insert: {
          additional_city_id?: string | null
          advance_amount?: number | null
          advance_paid?: boolean | null
          airport_name?: string | null
          booking_status?: string | null
          created_at?: string
          destination_address?: string | null
          destination_city_id?: string | null
          destination_name?: string | null
          extra_per_km_rate?: number | null
          id?: string
          instructions?: string | null
          number_of_days: number
          number_of_persons?: number | null
          package_id?: string | null
          payment_status?: string | null
          pickup_address?: string | null
          pickup_city_id?: string | null
          pickup_date: string
          pickup_time: string
          return_date?: string | null
          ticket_id?: string | null
          total_amount: number
          total_km_override?: number | null
          trip_type?: string | null
          updated_at?: string
          user_email?: string | null
          user_name?: string | null
          user_phone: string
          vehicle_id?: string | null
        }
        Update: {
          additional_city_id?: string | null
          advance_amount?: number | null
          advance_paid?: boolean | null
          airport_name?: string | null
          booking_status?: string | null
          created_at?: string
          destination_address?: string | null
          destination_city_id?: string | null
          destination_name?: string | null
          extra_per_km_rate?: number | null
          id?: string
          instructions?: string | null
          number_of_days?: number
          number_of_persons?: number | null
          package_id?: string | null
          payment_status?: string | null
          pickup_address?: string | null
          pickup_city_id?: string | null
          pickup_date?: string
          pickup_time?: string
          return_date?: string | null
          ticket_id?: string | null
          total_amount?: number
          total_km_override?: number | null
          trip_type?: string | null
          updated_at?: string
          user_email?: string | null
          user_name?: string | null
          user_phone?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_additional_city_id_fkey"
            columns: ["additional_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_destination_city_id_fkey"
            columns: ["destination_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "local_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_pickup_city_id_fkey"
            columns: ["pickup_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_config: {
        Row: {
          completion_message: string
          created_at: string
          id: string
          is_enabled: boolean
          updated_at: string
          welcome_message: string
        }
        Insert: {
          completion_message?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          welcome_message?: string
        }
        Update: {
          completion_message?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          welcome_message?: string
        }
        Relationships: []
      }
      chatbot_questions: {
        Row: {
          choices: Json | null
          created_at: string
          id: string
          is_active: boolean
          question_text: string
          question_type: string
          sequence_order: number
          updated_at: string
        }
        Insert: {
          choices?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          question_text: string
          question_type?: string
          sequence_order: number
          updated_at?: string
        }
        Update: {
          choices?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          question_text?: string
          question_type?: string
          sequence_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      chatbot_responses: {
        Row: {
          answer_text: string
          answered_at: string
          created_at: string
          id: string
          question_id: string
          session_id: string
        }
        Insert: {
          answer_text: string
          answered_at?: string
          created_at?: string
          id?: string
          question_id: string
          session_id: string
        }
        Update: {
          answer_text?: string
          answered_at?: string
          created_at?: string
          id?: string
          question_id?: string
          session_id?: string
        }
        Relationships: []
      }
      chatbot_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          started_at: string
          status: string
          updated_at: string
          user_email: string | null
          user_phone: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_email?: string | null
          user_phone?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_email?: string | null
          user_phone?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          name: string
          state_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          state_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          state_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      common_rates: {
        Row: {
          base_fare: number | null
          created_at: string
          daily_km_limit: number
          day_driver_allowance: number
          extra_per_hour_charge: number
          extra_per_km_charge: number
          id: string
          is_active: boolean | null
          night_charge: number
          per_km_charges: number
          pickup_city_id: string
          trip_type: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          base_fare?: number | null
          created_at?: string
          daily_km_limit?: number
          day_driver_allowance?: number
          extra_per_hour_charge?: number
          extra_per_km_charge?: number
          id?: string
          is_active?: boolean | null
          night_charge?: number
          per_km_charges?: number
          pickup_city_id: string
          trip_type?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          base_fare?: number | null
          created_at?: string
          daily_km_limit?: number
          day_driver_allowance?: number
          extra_per_hour_charge?: number
          extra_per_km_charge?: number
          id?: string
          is_active?: boolean | null
          night_charge?: number
          per_km_charges?: number
          pickup_city_id?: string
          trip_type?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "common_rates_pickup_city_id_fkey"
            columns: ["pickup_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "common_rates_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_leads: {
        Row: {
          contacted_at: string | null
          converted_to_booking_id: string | null
          coupon_requested: boolean | null
          created_at: string
          destination_city_id: string | null
          id: string
          lead_source: string | null
          mobile_number: string
          notes: string | null
          pickup_city_id: string | null
          pickup_date: string | null
          return_date: string | null
          status: string | null
          trip_type: string | null
          updated_at: string
          vehicle_id: string | null
          vehicle_name: string
        }
        Insert: {
          contacted_at?: string | null
          converted_to_booking_id?: string | null
          coupon_requested?: boolean | null
          created_at?: string
          destination_city_id?: string | null
          id?: string
          lead_source?: string | null
          mobile_number: string
          notes?: string | null
          pickup_city_id?: string | null
          pickup_date?: string | null
          return_date?: string | null
          status?: string | null
          trip_type?: string | null
          updated_at?: string
          vehicle_id?: string | null
          vehicle_name: string
        }
        Update: {
          contacted_at?: string | null
          converted_to_booking_id?: string | null
          coupon_requested?: boolean | null
          created_at?: string
          destination_city_id?: string | null
          id?: string
          lead_source?: string | null
          mobile_number?: string
          notes?: string | null
          pickup_city_id?: string | null
          pickup_date?: string | null
          return_date?: string | null
          status?: string | null
          trip_type?: string | null
          updated_at?: string
          vehicle_id?: string | null
          vehicle_name?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          contacted_at: string | null
          converted_to_booking_id: string | null
          created_at: string
          destination_city_id: string | null
          id: string
          lead_source: string | null
          mobile_number: string
          notes: string | null
          pickup_city_id: string | null
          pickup_date: string | null
          return_date: string | null
          status: string | null
          trip_type: string | null
          updated_at: string
          vehicle_name: string
        }
        Insert: {
          contacted_at?: string | null
          converted_to_booking_id?: string | null
          created_at?: string
          destination_city_id?: string | null
          id?: string
          lead_source?: string | null
          mobile_number: string
          notes?: string | null
          pickup_city_id?: string | null
          pickup_date?: string | null
          return_date?: string | null
          status?: string | null
          trip_type?: string | null
          updated_at?: string
          vehicle_name: string
        }
        Update: {
          contacted_at?: string | null
          converted_to_booking_id?: string | null
          created_at?: string
          destination_city_id?: string | null
          id?: string
          lead_source?: string | null
          mobile_number?: string
          notes?: string | null
          pickup_city_id?: string | null
          pickup_date?: string | null
          return_date?: string | null
          status?: string | null
          trip_type?: string | null
          updated_at?: string
          vehicle_name?: string
        }
        Relationships: []
      }
      local_packages: {
        Row: {
          created_at: string
          hours: number
          id: string
          kilometers: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hours: number
          id: string
          kilometers: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hours?: number
          id?: string
          kilometers?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      local_trip_bookings: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          package_id: string
          pickup_city_id: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          package_id: string
          pickup_city_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          package_id?: string
          pickup_city_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "local_trip_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "local_trip_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "local_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "local_trip_bookings_pickup_city_id_fkey"
            columns: ["pickup_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      oneway_trip_bookings: {
        Row: {
          booking_id: string
          created_at: string
          destination_city_id: string
          id: string
          pickup_city_id: string
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          destination_city_id: string
          id?: string
          pickup_city_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          destination_city_id?: string
          id?: string
          pickup_city_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oneway_trip_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oneway_trip_bookings_destination_city_id_fkey"
            columns: ["destination_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oneway_trip_bookings_pickup_city_id_fkey"
            columns: ["pickup_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          is_approved: boolean
          is_featured: boolean
          rating: number
          review_text: string
          updated_at: string
          user_email: string | null
          user_name: string
          user_phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          rating: number
          review_text: string
          updated_at?: string
          user_email?: string | null
          user_name: string
          user_phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          rating?: number
          review_text?: string
          updated_at?: string
          user_email?: string | null
          user_name?: string
          user_phone?: string | null
        }
        Relationships: []
      }
      round_trip_bookings: {
        Row: {
          additional_city_id: string | null
          booking_id: string
          created_at: string
          destination_city_id: string
          id: string
          pickup_city_id: string
          return_date: string | null
          updated_at: string
        }
        Insert: {
          additional_city_id?: string | null
          booking_id: string
          created_at?: string
          destination_city_id: string
          id?: string
          pickup_city_id: string
          return_date?: string | null
          updated_at?: string
        }
        Update: {
          additional_city_id?: string | null
          booking_id?: string
          created_at?: string
          destination_city_id?: string
          id?: string
          pickup_city_id?: string
          return_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_trip_bookings_additional_city_id_fkey"
            columns: ["additional_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_trip_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_trip_bookings_destination_city_id_fkey"
            columns: ["destination_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_trip_bookings_pickup_city_id_fkey"
            columns: ["pickup_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          mobile_number: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          mobile_number: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          mobile_number?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          created_at: string
          id: string
          raman_coins: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          raman_coins?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          raman_coins?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_rates: {
        Row: {
          airport_name: string | null
          base_fare: number | null
          created_at: string
          daily_km_limit: number
          day_driver_allowance: number
          destination_city_id: string | null
          extra_per_hour_charge: number
          extra_per_km_charge: number
          id: string
          is_active: boolean | null
          night_charge: number
          package_id: string | null
          per_km_charges: number
          pickup_city_id: string | null
          total_running_km: number
          trip_type: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          airport_name?: string | null
          base_fare?: number | null
          created_at?: string
          daily_km_limit: number
          day_driver_allowance: number
          destination_city_id?: string | null
          extra_per_hour_charge?: number
          extra_per_km_charge: number
          id?: string
          is_active?: boolean | null
          night_charge: number
          package_id?: string | null
          per_km_charges: number
          pickup_city_id?: string | null
          total_running_km: number
          trip_type?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          airport_name?: string | null
          base_fare?: number | null
          created_at?: string
          daily_km_limit?: number
          day_driver_allowance?: number
          destination_city_id?: string | null
          extra_per_hour_charge?: number
          extra_per_km_charge?: number
          id?: string
          is_active?: boolean | null
          night_charge?: number
          package_id?: string | null
          per_km_charges?: number
          pickup_city_id?: string | null
          total_running_km?: number
          trip_type?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_rates_destination_city_id_fkey"
            columns: ["destination_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_rates_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "local_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_rates_pickup_city_id_fkey"
            columns: ["pickup_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_rates_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          model: string | null
          name: string
          seating_capacity: number | null
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          model?: string | null
          name: string
          seating_capacity?: number | null
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          model?: string | null
          name?: string
          seating_capacity?: number | null
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          admin_user_id: string | null
          amount: number
          created_at: string
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          admin_user_id?: string | null
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          admin_user_id?: string | null
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance_between_cities: {
        Args: { destination_city_name: string; pickup_city_name: string }
        Returns: number
      }
      generate_sequential_ticket_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_wallet_balance: {
        Args: {
          admin_id?: string
          amount: number
          description?: string
          target_user_id: string
          transaction_type: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
