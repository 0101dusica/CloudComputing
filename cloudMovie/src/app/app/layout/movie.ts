export interface Movie {
    movieId:string;
    fileName: string;
    contentType: string;
    fileSize: string;
    title: string;
    description: string;
    actors: string[];
    director: string;
    genres: string[];
    duration: string;
    createdAt: string;
    updatedAt:string;
    type: string;
    numberOfSeasons: string;
}

export interface Episode {
    episodeId:string;
    fileName: string;
    contentType: string;
    fileSize: string;
    title: string;
    description: string;
    duration: string;
    createdAt: string;
    updatedAt:string;
    seasonNumber: string;
    seriesId: string;
    episodeNumber: string;
    type: string;

}

