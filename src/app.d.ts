import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "$lib/types/database";
import type { Track } from "$lib/types/general";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			tracks: Track[];
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
