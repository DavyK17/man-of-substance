import { createClient } from "@supabase/supabase-js";

import { dev } from "$app/environment";
import { PUBLIC_SUPABASE_KEY } from "$env/static/public";

const url = dev ? "http://127.0.0.1:54321" : "https://ilcfndcbhwqngudvsjkb.supabase.co";
export const supabase = createClient(url, PUBLIC_SUPABASE_KEY);
