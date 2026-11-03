/* What the arcade uses from the main script in mumtea-high.html. The compiled code runs in that same scope. */
type MenuRow = [id: string, title: string, genre: string, blurb: string, icon: string];
interface Doll { name: string; look: Look }
declare const MENU: MenuRow[];
declare const DOLLS: Record<string, Doll>;
declare const stops: Array<() => void>;
declare const store: { get<T>(k: string, d: T): T; set(k: string, v: unknown): void };
declare const $: <E extends Element = HTMLElement>(s: string, r?: ParentNode) => E;
declare const $$: <E extends Element = HTMLElement>(s: string, r?: ParentNode) => E[];
declare const el: (t: string, p?: Record<string, unknown>, ...k: Array<Node | string>) => HTMLElement;
declare const tone: (f: number, d?: number) => void;
declare function award(n: number): void;
declare let bones: number;
declare function drawBones(): void;
declare function openGame(id: string, scroll?: boolean): void;
declare const supabase: { createClient(url: string, key: string, options?: unknown): any };
declare function paintDolls(): void;
declare function say(who: string, t: string): void;
declare function go(v: string, postId?: string): void;
declare function doll(o: Doll, opt?: { head?: boolean; label?: string }): string;
