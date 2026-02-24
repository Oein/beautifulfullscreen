/**
 * Shared helpers for processing track metadata.
 * Used by TextData, Lay3-nextMusic, and other components.
 */

/** Remove parenthetical/bracket info and trailing segments from a title. */
export function trimTitle(title: string): string {
    return (
        title
            .replace(/\(.+?\)/g, "")
            .replace(/\[.+?\]/g, "")
            .replace(/\s-\s.+?$/, "")
            .replace(/,.+?$/, "")
            .trim() || title
    );
}

/** Get the display title, optionally trimmed. */
export function getDisplayTitle(title: string, shouldTrim: boolean): string {
    return shouldTrim ? trimTitle(title) : title;
}

/** Get artist name(s) from track metadata. */
export function getArtistName(
    metadata: Record<string, string>,
    showAll: boolean
): string {
    if (showAll) {
        return Object.keys(metadata)
            .filter((key) => key.startsWith("artist_name"))
            .sort()
            .map((key) => metadata[key])
            .join(", ");
    }
    return metadata.artist_name ?? "";
}
