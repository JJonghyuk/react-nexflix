const API_KEY = "56f17d23761f084dca10bed06aa39dfc";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  media_type: string;
  title: string;
  name: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface MovieProps {
  type: string;
  category: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies({ type, category }: MovieProps) {
  return fetch(`${BASE_PATH}/${type}/${category}?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?query=${keyword}&api_key=${API_KEY}`,
  ).then((response) => response.json());
}

// * 이미지 불러오기
// https://image.tmdb.org/t/p/original/ + 이미지 경로
