// eslint-disable-next-line @typescript-eslint/no-unused-vars
import XRegExp from 'xregexp';

declare module 'xregexp' {
    function cache(pattern: string, flags?: string): RegExp;
}
