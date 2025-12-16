import { createClient } from '@supabase/supabase-js'

export const supabaseServer = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // full access for server API
)
// console.log("URL:", process.env.SUPABASE_URL)
// console.log("ROLE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY)


