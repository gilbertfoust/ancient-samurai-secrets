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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      acupressure_points: {
        Row: {
          cautions: string | null
          condition: string | null
          created_at: string
          evidence_label: Database["public"]["Enums"]["evidence_label"]
          id: string
          location_description: string | null
          point_name: string
          source_id: string | null
          steps: string | null
          updated_at: string
        }
        Insert: {
          cautions?: string | null
          condition?: string | null
          created_at?: string
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          location_description?: string | null
          point_name: string
          source_id?: string | null
          steps?: string | null
          updated_at?: string
        }
        Update: {
          cautions?: string | null
          condition?: string | null
          created_at?: string
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          location_description?: string | null
          point_name?: string
          source_id?: string | null
          steps?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acupressure_points_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      charts: {
        Row: {
          category: string
          created_at: string
          data: Json | null
          description: string | null
          effective_date: string | null
          id: string
          source_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          data?: Json | null
          description?: string | null
          effective_date?: string | null
          id?: string
          source_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          data?: Json | null
          description?: string | null
          effective_date?: string | null
          id?: string
          source_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charts_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_intake_guidelines: {
        Row: {
          created_at: string
          id: string
          metric: string
          notes: string | null
          recommended_range: string
          source_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metric: string
          notes?: string | null
          recommended_range: string
          source_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metric?: string
          notes?: string | null
          recommended_range?: string
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_intake_guidelines_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_blood_type: {
        Row: {
          blood_type: string
          category: string
          created_at: string
          foods_allowed: string | null
          foods_to_limit: string | null
          id: string
          notes: string | null
          source_id: string | null
        }
        Insert: {
          blood_type: string
          category: string
          created_at?: string
          foods_allowed?: string | null
          foods_to_limit?: string | null
          id?: string
          notes?: string | null
          source_id?: string | null
        }
        Update: {
          blood_type?: string
          category?: string
          created_at?: string
          foods_allowed?: string | null
          foods_to_limit?: string | null
          id?: string
          notes?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_blood_type_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_schedules: {
        Row: {
          age_range: string
          created_at: string
          exam_name: string
          frequency: string | null
          gender: string | null
          id: string
          notes: string | null
          source_id: string | null
        }
        Insert: {
          age_range: string
          created_at?: string
          exam_name: string
          frequency?: string | null
          gender?: string | null
          id?: string
          notes?: string | null
          source_id?: string | null
        }
        Update: {
          age_range?: string
          created_at?: string
          exam_name?: string
          frequency?: string | null
          gender?: string | null
          id?: string
          notes?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_schedules_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      first_aid_items: {
        Row: {
          created_at: string
          id: string
          item_name: string
          purpose: string | null
          source_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          purpose?: string | null
          source_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          purpose?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "first_aid_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      food_promotions: {
        Row: {
          condition: string
          created_at: string
          example_foods: string | null
          id: string
          notes: string | null
          nutrient_focus: string | null
          source_id: string | null
        }
        Insert: {
          condition: string
          created_at?: string
          example_foods?: string | null
          id?: string
          notes?: string | null
          nutrient_focus?: string | null
          source_id?: string | null
        }
        Update: {
          condition?: string
          created_at?: string
          example_foods?: string | null
          id?: string
          notes?: string | null
          nutrient_focus?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_promotions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      guidelines: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          source_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          source_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          source_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guidelines_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      herbs: {
        Row: {
          cautions: string | null
          chinese_name: string | null
          common_name: string
          created_at: string
          description: string | null
          evidence_label: Database["public"]["Enums"]["evidence_label"]
          id: string
          image_url: string | null
          latin_name: string | null
          source_id: string | null
          synonyms: string[] | null
          updated_at: string
          uses: string | null
        }
        Insert: {
          cautions?: string | null
          chinese_name?: string | null
          common_name: string
          created_at?: string
          description?: string | null
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          image_url?: string | null
          latin_name?: string | null
          source_id?: string | null
          synonyms?: string[] | null
          updated_at?: string
          uses?: string | null
        }
        Update: {
          cautions?: string | null
          chinese_name?: string | null
          common_name?: string
          created_at?: string
          description?: string | null
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          image_url?: string | null
          latin_name?: string | null
          source_id?: string | null
          synonyms?: string[] | null
          updated_at?: string
          uses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "herbs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          cautions: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          source_id: string | null
          typical_dose: string | null
          uses: string | null
        }
        Insert: {
          cautions?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          source_id?: string | null
          typical_dose?: string | null
          uses?: string | null
        }
        Update: {
          cautions?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          source_id?: string | null
          typical_dose?: string | null
          uses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      mnemonics: {
        Row: {
          created_at: string
          id: string
          lyrics: string | null
          source_id: string | null
          title: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lyrics?: string | null
          source_id?: string | null
          title: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lyrics?: string | null
          source_id?: string | null
          title?: string
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mnemonics_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      narratives: {
        Row: {
          content: string | null
          created_at: string
          evidence_label: Database["public"]["Enums"]["evidence_label"]
          id: string
          related_topic: string | null
          source_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          related_topic?: string | null
          source_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          related_topic?: string | null
          source_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "narratives_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      oils: {
        Row: {
          application_methods: string | null
          cautions: string | null
          condition: string | null
          created_at: string
          description: string | null
          dilutions: string | null
          evidence_label: Database["public"]["Enums"]["evidence_label"]
          id: string
          name: string
          origin: string | null
          source_id: string | null
          updated_at: string
        }
        Insert: {
          application_methods?: string | null
          cautions?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          dilutions?: string | null
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          name: string
          origin?: string | null
          source_id?: string | null
          updated_at?: string
        }
        Update: {
          application_methods?: string | null
          cautions?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          dilutions?: string | null
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          name?: string
          origin?: string | null
          source_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oils_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      pill_identification: {
        Row: {
          color: string | null
          created_at: string
          drug_name: string
          id: string
          inscription: string | null
          notes: string | null
          shape: string | null
          source_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          drug_name: string
          id?: string
          inscription?: string | null
          notes?: string | null
          shape?: string | null
          source_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          drug_name?: string
          id?: string
          inscription?: string | null
          notes?: string | null
          shape?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pill_identification_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      poison_response_steps: {
        Row: {
          created_at: string
          description: string
          id: string
          poison_type: string | null
          source_id: string | null
          step_order: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          poison_type?: string | null
          source_id?: string | null
          step_order: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          poison_type?: string | null
          source_id?: string | null
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "poison_response_steps_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_remedies: {
        Row: {
          id: string
          recipe_id: string
          remedy_id: string
        }
        Insert: {
          id?: string
          recipe_id: string
          remedy_id: string
        }
        Update: {
          id?: string
          recipe_id?: string
          remedy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_remedies_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_remedies_remedy_id_fkey"
            columns: ["remedy_id"]
            isOneToOne: false
            referencedRelation: "remedies"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          category: string | null
          cautions: string | null
          created_at: string
          evidence_label: Database["public"]["Enums"]["evidence_label"]
          id: string
          ingredients: Json | null
          method: string | null
          purpose: string | null
          source_id: string | null
          storage: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          cautions?: string | null
          created_at?: string
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          ingredients?: Json | null
          method?: string | null
          purpose?: string | null
          source_id?: string | null
          storage?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          cautions?: string | null
          created_at?: string
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          ingredients?: Json | null
          method?: string | null
          purpose?: string | null
          source_id?: string | null
          storage?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      remedies: {
        Row: {
          cautions: string | null
          condition: string
          created_at: string
          evidence_label: Database["public"]["Enums"]["evidence_label"]
          id: string
          materials: Json | null
          method: string | null
          source_id: string | null
          steps: string | null
          updated_at: string
        }
        Insert: {
          cautions?: string | null
          condition: string
          created_at?: string
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          materials?: Json | null
          method?: string | null
          source_id?: string | null
          steps?: string | null
          updated_at?: string
        }
        Update: {
          cautions?: string | null
          condition?: string
          created_at?: string
          evidence_label?: Database["public"]["Enums"]["evidence_label"]
          id?: string
          materials?: Json | null
          method?: string | null
          source_id?: string | null
          steps?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "remedies_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      remedy_acupressure: {
        Row: {
          acupressure_point_id: string
          id: string
          remedy_id: string
        }
        Insert: {
          acupressure_point_id: string
          id?: string
          remedy_id: string
        }
        Update: {
          acupressure_point_id?: string
          id?: string
          remedy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "remedy_acupressure_acupressure_point_id_fkey"
            columns: ["acupressure_point_id"]
            isOneToOne: false
            referencedRelation: "acupressure_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remedy_acupressure_remedy_id_fkey"
            columns: ["remedy_id"]
            isOneToOne: false
            referencedRelation: "remedies"
            referencedColumns: ["id"]
          },
        ]
      }
      remedy_herbs: {
        Row: {
          herb_id: string
          id: string
          remedy_id: string
        }
        Insert: {
          herb_id: string
          id?: string
          remedy_id: string
        }
        Update: {
          herb_id?: string
          id?: string
          remedy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "remedy_herbs_herb_id_fkey"
            columns: ["herb_id"]
            isOneToOne: false
            referencedRelation: "herbs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remedy_herbs_remedy_id_fkey"
            columns: ["remedy_id"]
            isOneToOne: false
            referencedRelation: "remedies"
            referencedColumns: ["id"]
          },
        ]
      }
      remedy_oils: {
        Row: {
          id: string
          oil_id: string
          remedy_id: string
        }
        Insert: {
          id?: string
          oil_id: string
          remedy_id: string
        }
        Update: {
          id?: string
          oil_id?: string
          remedy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "remedy_oils_oil_id_fkey"
            columns: ["oil_id"]
            isOneToOne: false
            referencedRelation: "oils"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remedy_oils_remedy_id_fkey"
            columns: ["remedy_id"]
            isOneToOne: false
            referencedRelation: "remedies"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          author: string | null
          citation: string | null
          created_at: string
          file_path: string | null
          id: string
          notes: string | null
          title: string
          year: number | null
        }
        Insert: {
          author?: string | null
          citation?: string | null
          created_at?: string
          file_path?: string | null
          id: string
          notes?: string | null
          title: string
          year?: number | null
        }
        Update: {
          author?: string | null
          citation?: string | null
          created_at?: string
          file_path?: string | null
          id?: string
          notes?: string | null
          title?: string
          year?: number | null
        }
        Relationships: []
      }
      symptom_differentiation: {
        Row: {
          cold_severity: string | null
          created_at: string
          flu_severity: string | null
          h1n1_severity: string | null
          id: string
          source_id: string | null
          symptom: string
        }
        Insert: {
          cold_severity?: string | null
          created_at?: string
          flu_severity?: string | null
          h1n1_severity?: string | null
          id?: string
          source_id?: string | null
          symptom: string
        }
        Update: {
          cold_severity?: string | null
          created_at?: string
          flu_severity?: string | null
          h1n1_severity?: string | null
          id?: string
          source_id?: string | null
          symptom?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptom_differentiation_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccination_schedules: {
        Row: {
          age_range: string
          created_at: string
          dosage_schedule: string | null
          id: string
          notes: string | null
          source_id: string | null
          vaccine_name: string
        }
        Insert: {
          age_range: string
          created_at?: string
          dosage_schedule?: string | null
          id?: string
          notes?: string | null
          source_id?: string | null
          vaccine_name: string
        }
        Update: {
          age_range?: string
          created_at?: string
          dosage_schedule?: string | null
          id?: string
          notes?: string | null
          source_id?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_schedules_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      evidence_label: "Traditional" | "Observed" | "Supported" | "Speculative"
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
    Enums: {
      evidence_label: ["Traditional", "Observed", "Supported", "Speculative"],
    },
  },
} as const
