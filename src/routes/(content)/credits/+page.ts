import type { PageLoad } from "./$types";
import type { Credits } from "$lib/ambient";
import { credits } from "$lib";

export const load: PageLoad = (): Credits => credits;
