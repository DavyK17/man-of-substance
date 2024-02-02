import { createClient } from "@supabase/supabase-js";
import { PUBLIC_TARGET_ENV, PUBLIC_SUPABASE_KEY } from "$env/static/public";

export const supabase = createClient(
	PUBLIC_TARGET_ENV === "development"
		? "http://127.0.0.1:54321"
		: "https://xuykcmyvfzwkiyqinpdo.supabase.co",
	PUBLIC_SUPABASE_KEY
);
