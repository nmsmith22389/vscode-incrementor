declare module 'read-package-json' {
    import type { Package } from 'normalize-package-data';

    export default function readJson(
        file: string,
        cb: (error: Error | null, data: Package) => void
    ): void;
}
