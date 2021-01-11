export interface PhotoEntry {
    photoUrl: string,
    score: number,
    timeUploaded: number,
    caption: string | undefined | null,
    author: string | undefined | null,
    uid: string | undefined | null
}

export interface PhotoEntryID extends PhotoEntry { id: string; }
