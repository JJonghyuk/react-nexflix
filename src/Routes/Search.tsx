import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { getSearch, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { AnimatePresence, motion, Variants } from "motion/react";
import { makeImagePath } from "../utils";
import { useEffect } from "react";

const Wrapper = styled.div`
  overflow-x: hidden;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 30px;
  font-weight: 600;
`;

const SearchMovieList = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 130px 60px;
  gap: 60px 5px;
`;

const SearchMovieItem = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== "bgPhoto",
})<{ bgPhoto: string }>`
  cursor: pointer;
  flex: 0 0 calc(100% / 6 - 5px);
  display: block;
  width: 100%;
  height: 200px;
  color: #fff;
  font-size: 50px;
  border-radius: 5px;
  background-color: rgba(24, 24, 24, 1);
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
`;

const SearchMovieTitle = styled(motion.span)`
  opacity: 0;
  position: absolute;
  bottom: 0;
  display: block;
  padding: 10px;
  width: 100%;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 0 0 5px 5px;
  span {
    display: block;
    font-size: 16px;
    text-align: center;
  }
`;

const Overlay = styled(motion.div)`
  opacity: 0;
  z-index: 199;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const InfoMovie = styled(motion.div)`
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

const InfoCover = styled.div`
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

const InfoCoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
`;

const InfoContImgBox = styled.div`
  overflow: hidden;
  position: absolute;
  top: -40px;
  left: 40px;
  width: 200px;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
`;

const InfoContImg = styled.img`
  width: auto;
  height: 100%;
`;

const InfoContent = styled.div`
  z-index: 2;
  position: relative;
  top: -10%;
  padding: 20px 20px 20px 280px;
  width: 100%;
  height: 40%;
`;

const InfoTitle = styled.h2`
  margin-bottom: 10px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  font-weight: 600;
`;

const InfoOverview = styled.p`
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

const MovieItemVariants: Variants = {
  normal: {
    scale: 1,
  },
  active: {
    scale: 1.3,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

const infoVariants: Variants = {
  active: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.2,
      type: "tween",
    },
  },
};

function Search() {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  // 검색 쿼리
  const { data: searchData, isLoading: isSearchLoading } =
    useQuery<IGetMoviesResult>({
      queryKey: ["search", "searchMovie"],
      queryFn: () => getSearch(keyword!),
      enabled: !!keyword,
    });

  const infoMovieMatch = useRouteMatch<{ type: string; movieId: string }>(
    `/search/:type/:movieId`,
  );

  const onMovieItemClicked = (movieId: number, index: number) => {
    history.push(`/search/${searchData?.results[index].media_type}/${movieId}`);
  };

  const clickedMovie =
    infoMovieMatch?.params.movieId &&
    searchData?.results.find(
      (movie) => String(movie.id) === infoMovieMatch.params.movieId,
    );

  // const movieClicked = detailData?.results.some(
  //   (movie) => String(movie.id) === infoMovieMatch?.params.movieId,
  // );

  const movieInfoClose = () => {
    history.goBack();
  };

  return (
    <Wrapper>
      {isSearchLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SearchMovieList>
            <AnimatePresence>
              {searchData?.results.map((searchItem, index) => (
                <SearchMovieItem
                  layoutId={searchItem.id + ""}
                  key={searchItem.id}
                  type="button"
                  bgPhoto={makeImagePath(
                    searchItem.backdrop_path || searchItem.poster_path,
                    "w500",
                  )}
                  variants={MovieItemVariants}
                  initial="normal"
                  whileHover="active"
                  whileFocus="active"
                  exit="exit"
                  onClick={() => onMovieItemClicked(searchItem.id, index)}
                  transition={{ type: "tween" }}
                >
                  <SearchMovieTitle variants={infoVariants}>
                    {searchItem.media_type === "movie" ? (
                      <span>{searchItem.title}</span>
                    ) : (
                      <span>{searchItem.name}</span>
                    )}
                  </SearchMovieTitle>
                </SearchMovieItem>
              ))}
            </AnimatePresence>
          </SearchMovieList>
          <AnimatePresence>
            {infoMovieMatch ? (
              <>
                <Overlay
                  onClick={movieInfoClose}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <InfoMovie layoutId={infoMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <InfoCover>
                        <InfoCoverImg
                          src={makeImagePath(
                            clickedMovie.backdrop_path ||
                              clickedMovie.poster_path,
                          )}
                        />
                      </InfoCover>
                      <InfoContent>
                        <InfoContImgBox>
                          <InfoContImg
                            src={makeImagePath(
                              clickedMovie.poster_path ||
                                clickedMovie.backdrop_path,
                            )}
                          />
                        </InfoContImgBox>
                        <InfoTitle>
                          {clickedMovie.title
                            ? clickedMovie.title
                            : clickedMovie.name}
                        </InfoTitle>
                        <ReleaseDate>{clickedMovie.release_date}</ReleaseDate>
                        <Rating>{clickedMovie.vote_average}</Rating>
                        <InfoOverview>{clickedMovie.overview}</InfoOverview>
                      </InfoContent>
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
                </InfoMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Search;
