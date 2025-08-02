import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "motion/react";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  opacity: 0;
  z-index: 199;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
  z-index: 200;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 45vw;
  height: 85vh;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
  &:before {
    content: "";
    z-index: 1;
    display: block;
    position: absolute;
    top: 300px;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(24, 24, 24, 1) 40%
    );
  }
`;

const BigCover = styled.div`
  position: relative;
  width: 100%;
  height: 70%;
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
  }
`;

const BigCoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
`;

const BigContImgBox = styled.div`
  overflow: hidden;
  position: absolute;
  top: -40px;
  left: 40px;
  width: 200px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
`;

const BigContImg = styled.img`
  width: auto;
  height: 100%;
`;

const BigContent = styled.div`
  z-index: 2;
  position: relative;
  top: -10%;
  padding: 20px 20px 20px 280px;
  width: 100%;
  height: 40%;
`;

const BigTitle = styled.h2`
  margin-bottom: 10px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  font-weight: 600;
`;

const BigOverview = styled.p`
  margin-top: 10px;
  font-size: 16px;
  width: 100%;
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ReleaseDate = styled.span``;

const Rating = styled.span`
  margin-left: 20px;
`;

const CloseBtn = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
`;

interface MovieProps {
  id: string;
  type: string;
  category: string;
}

function MovieInfo({ id, type, category }: MovieProps) {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { data } = useQuery<IGetMoviesResult>({
    queryKey: [id, category],
    queryFn: () => getMovies({ type, category }),
  });
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    `/${type}/${category}/:movieId`,
  );
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId,
    );
  console.log(clickedMovie);
  const movieInfoClose = () => {
    history.goBack();
  };

  return (
    <>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={movieInfoClose}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie layoutId={`move-${id}-${bigMovieMatch.params.movieId}`}>
              {clickedMovie && (
                <>
                  <BigCover>
                    <BigCoverImg
                      src={makeImagePath(clickedMovie.backdrop_path)}
                    />
                  </BigCover>
                  <BigContent>
                    <BigContImgBox>
                      <BigContImg
                        src={makeImagePath(clickedMovie.poster_path)}
                      />
                    </BigContImgBox>
                    <BigTitle>
                      {type === "movie"
                        ? clickedMovie.title
                        : clickedMovie.name}
                    </BigTitle>
                    <ReleaseDate>{clickedMovie.release_date}</ReleaseDate>
                    <Rating>{clickedMovie.vote_average}</Rating>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                  </BigContent>
                </>
              )}
              <CloseBtn type="button" onClick={movieInfoClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 -960 960 960"
                  width="30px"
                  fill="#e3e3e3"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </CloseBtn>
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default MovieInfo;
