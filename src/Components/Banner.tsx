import styled from "styled-components";
import { makeImagePath } from "../utils";
import { getMovies, IGetMoviesResult } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieInfo from "./MovieInfo";

const BannerItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "bgPhoto",
})<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  width: 100%;
  height: 100vh;
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

const BannerInfo = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 20px;
  width: 180px;
  color: #fff;
  font-size: 24px;
  border-radius: 15px;
  background: rgba(109, 109, 110, 0.7);
  &:hover {
    background: rgba(109, 109, 110, 0.9);
  }
`;

const BannerInfoText = styled.span`
  margin-left: 10px;
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
      <BannerItem bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
        <Title>
          {type === "movie" ? data?.results[0].title : data?.results[0].name}
        </Title>
        <Overview>{data?.results[0].overview}</Overview>
        <BannerInfo
          onClick={() => onMovieItemClicked(data?.results[0].id || 0)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="28px"
            viewBox="0 -960 960 960"
            width="28px"
            fill="#fff"
          >
            <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
          <BannerInfoText>상세 정보</BannerInfoText>
        </BannerInfo>
      </BannerItem>
      {movieClicked && <MovieInfo id={id} type={type} category={category} />}
    </>
  );
}

export default Banner;
