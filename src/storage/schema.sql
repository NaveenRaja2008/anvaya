-- =========================================================================
-- ANVAYA DATABASE SCHEMA (PostgreSQL / Supabase Compatible)
-- Pre-Loan Enterprise Intelligence System
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'ENTREPRENEUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. LOCATIONS
CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(100) PRIMARY KEY,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  sub_district VARCHAR(100),
  village_or_town VARCHAR(100) NOT NULL,
  lgd_code VARCHAR(50),
  pin_code VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. LOCAL ECONOMIC DATA (DNA)
CREATE TABLE IF NOT EXISTS local_economic_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id VARCHAR(100) REFERENCES locations(id) ON DELETE CASCADE,
  demand_score INTEGER CHECK (demand_score BETWEEN 0 AND 100),
  competition_score INTEGER CHECK (competition_score BETWEEN 0 AND 100),
  supply_score INTEGER CHECK (supply_score BETWEEN 0 AND 100),
  purchasing_power_score INTEGER CHECK (purchasing_power_score BETWEEN 0 AND 100),
  connectivity_score INTEGER CHECK (connectivity_score BETWEEN 0 AND 100),
  seasonality_score INTEGER CHECK (seasonality_score BETWEEN 0 AND 100),
  local_resources_score INTEGER CHECK (local_resources_score BETWEEN 0 AND 100),
  primary_commodities JSONB,
  nearby_market_distance_km NUMERIC(6, 2),
  key_customer_segments JSONB,
  local_supply_gaps JSONB,
  is_demo_data BOOLEAN DEFAULT FALSE,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ENTREPRENEUR PROFILES
CREATE TABLE IF NOT EXISTS entrepreneur_profiles (
  id VARCHAR(100) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  location_id VARCHAR(100) REFERENCES locations(id) ON DELETE SET NULL,
  capital_available NUMERIC(12, 2) NOT NULL,
  assets JSONB NOT NULL,
  skills JSONB NOT NULL,
  work_experience_years NUMERIC(4, 1) DEFAULT 0,
  experience_description TEXT,
  interests JSONB,
  time_availability_hours_per_day NUMERIC(4, 1),
  family_support BOOLEAN DEFAULT TRUE,
  labour_availability VARCHAR(50) DEFAULT 'FAMILY',
  transport_access BOOLEAN DEFAULT FALSE,
  storage_access BOOLEAN DEFAULT FALSE,
  existing_infrastructure JSONB,
  preferred_business_type JSONB,
  risk_preference VARCHAR(20) DEFAULT 'MEDIUM',
  target_monthly_income NUMERIC(10, 2),
  has_business_idea BOOLEAN DEFAULT FALSE,
  initial_idea_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BUSINESS CATEGORIES
CREATE TABLE IF NOT EXISTS business_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  risk_tier VARCHAR(20) DEFAULT 'MODERATE',
  is_active BOOLEAN DEFAULT TRUE
);

-- 6. OPPORTUNITIES
CREATE TABLE IF NOT EXISTS opportunities (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  tagline TEXT,
  category_id VARCHAR(50) REFERENCES business_categories(id),
  why_fits_person JSONB,
  why_fits_location JSONB,
  local_demand_signal TEXT,
  competition_signal TEXT,
  minimum_capital NUMERIC(12, 2) NOT NULL,
  working_capital_recommended NUMERIC(12, 2) NOT NULL,
  total_project_cost NUMERIC(12, 2) NOT NULL,
  asset_requirements JSONB,
  skill_requirements JSONB,
  key_risks JSONB,
  evidence_strength VARCHAR(20) DEFAULT 'MODERATE',
  saturation_risk VARCHAR(20) DEFAULT 'LOW',
  default_unit_economics JSONB,
  rationale TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. OPPORTUNITY EVIDENCE
CREATE TABLE IF NOT EXISTS opportunity_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id VARCHAR(100) REFERENCES opportunities(id) ON DELETE CASCADE,
  evidence_item_id VARCHAR(100),
  relevance_weight NUMERIC(3, 2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. VALIDATION EXPERIMENTS
CREATE TABLE IF NOT EXISTS validation_experiments (
  id VARCHAR(100) PRIMARY KEY,
  opportunity_id VARCHAR(100) REFERENCES opportunities(id) ON DELETE CASCADE,
  target_sample_size INTEGER DEFAULT 20,
  actual_responses_count INTEGER DEFAULT 0,
  channels JSONB,
  demand_validation_rate NUMERIC(5, 2),
  purchase_intent_score NUMERIC(5, 2),
  price_acceptance_rate NUMERIC(5, 2),
  repeat_potential_score NUMERIC(5, 2),
  average_accepted_price NUMERIC(10, 2),
  median_accepted_price NUMERIC(10, 2),
  evidence_strength VARCHAR(20) DEFAULT 'WEAK',
  is_demo_sample BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. VALIDATION RESPONSES
CREATE TABLE IF NOT EXISTS validation_responses (
  id VARCHAR(100) PRIMARY KEY,
  experiment_id VARCHAR(100) REFERENCES validation_experiments(id) ON DELETE CASCADE,
  respondent_identifier VARCHAR(100),
  respondent_type VARCHAR(50),
  is_interested BOOLEAN DEFAULT FALSE,
  purchase_intent VARCHAR(50),
  accepted_price_per_unit NUMERIC(10, 2),
  expected_monthly_quantity NUMERIC(10, 2),
  current_alternative TEXT,
  switching_factor TEXT,
  preferred_purchase_channel VARCHAR(100),
  feedback_notes TEXT,
  is_demo_data BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. BUSINESS MODELS
CREATE TABLE IF NOT EXISTS business_models (
  id VARCHAR(100) PRIMARY KEY,
  profile_id VARCHAR(100) REFERENCES entrepreneur_profiles(id) ON DELETE CASCADE,
  opportunity_id VARCHAR(100) REFERENCES opportunities(id) ON DELETE CASCADE,
  selling_price_per_unit NUMERIC(10, 2) NOT NULL,
  monthly_production_units NUMERIC(10, 2) NOT NULL,
  fixed_costs JSONB NOT NULL,
  variable_costs_per_unit JSONB NOT NULL,
  working_capital_cycle_days INTEGER DEFAULT 14,
  payment_delay_days INTEGER DEFAULT 14,
  growth_rate_annual_percent NUMERIC(5, 2) DEFAULT 5.0,
  seasonality_factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. SIMULATION RUNS
CREATE TABLE IF NOT EXISTS simulation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_model_id VARCHAR(100) REFERENCES business_models(id) ON DELETE CASCADE,
  monthly_revenue NUMERIC(12, 2) NOT NULL,
  monthly_variable_cost NUMERIC(12, 2) NOT NULL,
  monthly_fixed_cost NUMERIC(12, 2) NOT NULL,
  monthly_surplus NUMERIC(12, 2) NOT NULL,
  break_even_units NUMERIC(10, 2),
  break_even_revenue NUMERIC(12, 2),
  working_capital_required NUMERIC(12, 2),
  margin_of_safety_percentage NUMERIC(5, 2),
  cash_runway_months NUMERIC(4, 1),
  projections JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. STRESS TESTS
CREATE TABLE IF NOT EXISTS stress_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_model_id VARCHAR(100) REFERENCES business_models(id) ON DELETE CASCADE,
  demand_change_percent NUMERIC(5, 2) DEFAULT 0,
  selling_price_change_percent NUMERIC(5, 2) DEFAULT 0,
  raw_material_cost_change_percent NUMERIC(5, 2) DEFAULT 0,
  operating_fixed_cost_change_percent NUMERIC(5, 2) DEFAULT 0,
  payment_delay_additional_days INTEGER DEFAULT 0,
  supply_disruption_days INTEGER DEFAULT 0,
  transport_cost_change_percent NUMERIC(5, 2) DEFAULT 0,
  equipment_downtime_days INTEGER DEFAULT 0,
  stress_monthly_revenue NUMERIC(12, 2),
  stress_monthly_surplus NUMERIC(12, 2),
  is_business_broken BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. FAILURE CONDITIONS
CREATE TABLE IF NOT EXISTS failure_conditions (
  id VARCHAR(100) PRIMARY KEY,
  stress_test_id UUID REFERENCES stress_tests(id) ON DELETE CASCADE,
  trigger_title TEXT NOT NULL,
  impact_description TEXT NOT NULL,
  affected_metric VARCHAR(100),
  base_value NUMERIC(12, 2),
  stress_value NUMERIC(12, 2),
  failure_point_threshold NUMERIC(12, 2),
  is_breached BOOLEAN DEFAULT FALSE,
  recovery_possibility VARCHAR(50),
  recovery_strategy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. RESILIENCE RESULTS
CREATE TABLE IF NOT EXISTS resilience_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_model_id VARCHAR(100) REFERENCES business_models(id) ON DELETE CASCADE,
  resilience_score INTEGER CHECK (resilience_score BETWEEN 0 AND 100),
  resilience_rating VARCHAR(50),
  demand_tolerance_pct NUMERIC(5, 2),
  raw_material_tolerance_pct NUMERIC(5, 2),
  price_tolerance_pct NUMERIC(5, 2),
  fixed_cost_tolerance_pct NUMERIC(5, 2),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. LOAN SCHEMES
CREATE TABLE IF NOT EXISTS loan_schemes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  min_project_cost NUMERIC(12, 2),
  max_project_cost NUMERIC(12, 2),
  max_funding_percent NUMERIC(4, 2),
  max_loan_amount NUMERIC(12, 2),
  annual_interest_rate NUMERIC(5, 4),
  tenure_months INTEGER,
  moratorium_months INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. FINANCIAL PLANS
CREATE TABLE IF NOT EXISTS financial_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id VARCHAR(100) REFERENCES entrepreneur_profiles(id) ON DELETE CASCADE,
  opportunity_id VARCHAR(100) REFERENCES opportunities(id) ON DELETE CASCADE,
  project_cost NUMERIC(12, 2) NOT NULL,
  promoter_equity NUMERIC(12, 2) NOT NULL,
  recommended_loan NUMERIC(12, 2) NOT NULL,
  scheme_id VARCHAR(50) REFERENCES loan_schemes(id),
  maximum_eligible_loan NUMERIC(12, 2),
  maximum_affordable_loan NUMERIC(12, 2),
  modelled_sustainable_loan NUMERIC(12, 2),
  base_case_dscr NUMERIC(5, 2),
  stress_case_dscr NUMERIC(5, 2),
  dscr_status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. REPAYMENT SCHEDULES
CREATE TABLE IF NOT EXISTS repayment_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  financial_plan_id UUID REFERENCES financial_plans(id) ON DELETE CASCADE,
  loan_amount NUMERIC(12, 2) NOT NULL,
  interest_rate NUMERIC(5, 4) NOT NULL,
  tenure_months INTEGER NOT NULL,
  moratorium_months INTEGER NOT NULL,
  monthly_emi NUMERIC(12, 2) NOT NULL,
  total_interest_paid NUMERIC(12, 2) NOT NULL,
  schedule_installments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. EVIDENCE ITEMS (EVIDENCE REGISTER)
CREATE TABLE IF NOT EXISTS evidence_items (
  id VARCHAR(100) PRIMARY KEY,
  claim TEXT NOT NULL,
  evidence_type VARCHAR(50) NOT NULL, -- OBSERVED, INFERRED, VALIDATED, SIMULATED, USER_PROVIDED, DEMO_DATA
  source VARCHAR(255) NOT NULL,
  date_recorded DATE NOT NULL,
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  origin VARCHAR(255),
  assumptions JSONB,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. ACTION PLANS
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id VARCHAR(100) REFERENCES entrepreneur_profiles(id) ON DELETE CASCADE,
  opportunity_id VARCHAR(100) REFERENCES opportunities(id) ON DELETE CASCADE,
  decision_state VARCHAR(50) NOT NULL,
  decision_title VARCHAR(255) NOT NULL,
  milestones JSONB NOT NULL,
  what_changes_mind JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_economic_location ON local_economic_data(location_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_category ON opportunities(category_id);
CREATE INDEX IF NOT EXISTS idx_validation_opp ON validation_experiments(opportunity_id);
