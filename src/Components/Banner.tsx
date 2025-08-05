import styled from "styled-components";
import { makeImagePath } from "../utils";
import { getMovies, IGetMoviesResult } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieInfo from "./MovieInfo";

const BannerWrapper = styled.div`
  height: 100vh;
`;

const BannerItem = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "bgPhoto",
})<{ bgPhoto: string }>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.white.darker};
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  text-align: left;
`;

const Title = styled.strong`
  display: block;
  width: 70%;
  font-size: 50px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Overview = styled.span`
  display: block;
  font-size: 24px;
  width: 50%;
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
`;

interface BannerProps {
  id: string;
  type: string;
  category: string;
}

function Banner({ id, type, category }: BannerProps) {
  const history = useHistory();
  const { data } = useQuery<IGetMoviesResult>({
    queryKey: [id, category],
    queryFn: () => getMovies({ type, category }),
  });

  const onMovieItemClicked = (movieId: number) => {
    history.push(`/${type}/${category}/${movieId}`);
  };
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    `/${type}/${category}/:movieId`,
  );
  const movieClicked = data?.results.some(
    (movie) => String(movie.id) === bigMovieMatch?.params.movieId,
  );
  return (
    <>
      <BannerWrapper>
        <BannerItem
          onClick={() => onMovieItemClicked(data?.results[0].id || 0)}
          bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
        >
          <Title>
            {type === "movie" ? data?.results[0].title : data?.results[0].name}
          </Title>
          <Overview>{data?.results[0].overview}</Overview>
        </BannerItem>
      </BannerWrapper>
      {movieClicked && <MovieInfo id={id} type={type} category={category} />}
    </>
  );
}

export default Banner;
