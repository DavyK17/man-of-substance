import { createClient } from "@supabase/supabase-js";

import { dev } from "$app/environment";
import { PUBLIC_SUPABASE_KEY } from "$env/static/public";

export const supabase = createClient(
	dev ? "http://127.0.0.1:54321" : "https://xuykcmyvfzwkiyqinpdo.supabase.co",
	PUBLIC_SUPABASE_KEY
);
