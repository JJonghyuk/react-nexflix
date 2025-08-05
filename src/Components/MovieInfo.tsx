import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

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

const BigInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ReleaseDate = styled.span`
  display: flex;
  position: relative;
  margin-right: 10px;
  padding-right: 10px;
  font-size: 16px;
  line-height: 1;
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0px;
    margin-top: -2px;
    width: 1px;
    height: 15px;
    background-color: ${(props) => props.theme.white.lighter};
  }
`;

const Rating = styled.span`
  display: flex;
  gap: 2px;
  margin-top: -5px;
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

function StarRating({ vote }: { vote: number }) {
  const score = vote / 2;
  const fullStars = Math.floor(score);
  const hasHalfStar = score - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Rating>
      {Array(fullStars)
        .fill(null)
        .map((_, i) => (
          <FaStar key={`full-${i}`} color="#FFD700" />
        ))}
      {hasHalfStar && <FaStarHalfAlt color="#FFD700" />}
      {Array(emptyStars)
        .fill(null)
        .map((_, i) => (
          <FaRegStar key={`empty-${i}`} color="#ccc" />
        ))}
    </Rating>
  );
}

function MovieInfo({ id, type, category }: MovieProps) {
  const history = useHistory();
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
                    <BigInfoBox>
                      {clickedMovie.release_date ? (
                        <ReleaseDate>{clickedMovie.release_date}</ReleaseDate>
                      ) : null}
                      {<StarRating vote={clickedMovie.vote_average} />}
                    </BigInfoBox>
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
