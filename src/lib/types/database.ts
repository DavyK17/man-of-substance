import type { Database as DatabaseGenerated } from "./database-generated";
import type { TracklistVersion } from "./general";

import type { MergeDeep } from "type-fest";

/* DATABASE */
export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Tables: {
				tracks: {
					Row: {
						missing_from: TracklistVersion[] | null;
					};
					Insert: {
						missing_from?: TracklistVersion[] | null;
					};
					Update: {
						missing_from?: TracklistVersion[] | null;
					};
				};
			};
		};
	}
>;
