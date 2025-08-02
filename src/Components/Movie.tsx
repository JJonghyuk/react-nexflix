import { AnimatePresence, motion, Variants } from "motion/react";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useWindowWidth from "../useWindowWidth";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieInfo from "./MovieInfo";

const Slider = styled(motion.div)`
  position: relative;
  top: -100px;
  min-height: 300px;
`;

const SliderTitle = styled.h2`
  padding: 0 60px;
  font-size: 30px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
`;

const SlideButton = styled(motion.button)`
  cursor: pointer;
  z-index: 1;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(24, 24, 24, 0.7);
  &.leftBtn {
    left: 0;
  }
  &.rightBtn {
    right: 0;
  }
`;

const MovieList = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  height: 200px;
`;

const MovieItem = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== "bgPhoto",
})<{ bgPhoto: string }>`
  cursor: pointer;
  display: block;
  height: 100%;
  color: #fff;
  font-size: 50px;
  border-radius: 5px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.span)`
  opacity: 0;
  position: absolute;
  bottom: 0px;
  display: block;
  padding: 10px;
  width: 100%;
  border-radius: 0 0 5px 5px;
  background-color: ${(props) => props.theme.black.lighter};
  span {
    display: block;
    font-size: 16px;
    text-align: center;
  }
`;

const btnVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
  },
};

const MovieItemVariants: Variants = {
  normal: {
    scale: 1,
  },
  active: {
    scale: 1.3,
    transition: {
      delay: 0.4,
      duration: 0.2,
      type: "tween",
    },
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

interface MovieProps {
  id: string;
  type: string;
  category: string;
  title: string;
}

function Movie({ id, type, category, title }: MovieProps) {
  const history = useHistory();
  const { data } = useQuery<IGetMoviesResult>({
    queryKey: [id, category],
    queryFn: () => getMovies({ type, category }),
  });
  console.log(data?.results);
  // // 슬라이드 버튼
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const offset = 6;
  const width = useWindowWidth();

  const sliderVariants = {
    hidden: (pageIndex: number) => ({
      x: pageIndex > 0 ? width : -width,
    }),
    visible: {
      x: 0,
    },
    exit: (pageIndex: number) => ({
      x: pageIndex > 0 ? -width : width,
    }),
  };

  const pageBtn = (newPageIndex: number) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setPageIndex(newPageIndex);

      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => {
        if (newPageIndex === 1) {
          return prev === maxIndex ? 0 : prev + 1;
        } else {
          return prev === 0 ? maxIndex : prev - 1;
        }
      });
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

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
      <Slider whileHover="hover" initial="hidden">
        <SliderTitle>{title}</SliderTitle>
        <AnimatePresence
          custom={pageIndex}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <MovieList
            variants={sliderVariants}
            custom={pageIndex}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <MovieItem
                  layoutId={`move-${id}-${movie.id}`}
                  key={`move-${id}-${movie.id}`}
                  bgPhoto={makeImagePath(
                    movie.backdrop_path || movie.poster_path,
                    "w500",
                  )}
                  variants={MovieItemVariants}
                  initial="normal"
                  whileHover="active"
                  whileFocus="active"
                  onClick={() => onMovieItemClicked(movie.id)}
                  transition={{ type: "tween" }}
                  type="button"
                >
                  <Info variants={infoVariants}>
                    {type === "movie" ? (
                      <span>{movie.title}</span>
                    ) : (
                      <span>{movie.name}</span>
                    )}
                  </Info>
                </MovieItem>
              ))}
          </MovieList>
        </AnimatePresence>
        <SlideButton
          variants={btnVariants}
          type="button"
          className="leftBtn"
          onClick={() => pageBtn(-1)}
          title="이전 슬라이드로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 -960 960 960"
            width="32px"
            fill="#fff"
          >
            <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
          </svg>
        </SlideButton>
        <SlideButton
          variants={btnVariants}
          type="button"
          className="rightBtn"
          onClick={() => pageBtn(1)}
          title="다음 슬라이드로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 -960 960 960"
            width="32px"
            fill="#fff"
          >
            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
          </svg>
        </SlideButton>
      </Slider>
      {movieClicked && <MovieInfo id={id} type={type} category={category} />}
    </>
  );
}

export default Movie;
