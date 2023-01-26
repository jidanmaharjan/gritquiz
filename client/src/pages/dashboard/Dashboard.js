import { Button, SimpleGrid } from "@mantine/core";
import React, { Fragment, useEffect, useState } from "react";

import { Modal, Progress } from "@mantine/core";

//icons import
import { AiOutlineLogout, AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { getQuiz } from "../../apis/quizApis";
import { getProfile } from "../../apis/userApis";
import axios from "axios";

const Dashboard = () => {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(null);
  const [limit, setLimit] = useState(null);
  const [category, setCategory] = useState("");
  const [playing, setPlaying] = useState(false);
  const [question, setQuestion] = useState(0);
  const [highlightAnswer, setHighlightAnswer] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [quizEnd, setQuizEnd] = useState(false);
  const [quizTime, setQuizTime] = useState(null);
  const [questionTimer, setQuestionTimer] = useState(null);

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData("profile");

  const {
    isLoading: isQuizLoading,
    data: quiz,
    isError: isQuizError,
    error: quizError,
    isFetching: isQuizFetching,
    refetch: refetchQuiz,
  } = useQuery(
    "quiz",

    () =>
      getQuiz({
        limit,
        category,
      }),
    {
      enabled: false,
      retry: false,
      onSuccess: (quiz) => quizSuccess(quiz),
      onError: (quizError) => quizErrorHandler(quizError),
    }
  );

  function quizSuccess(quiz) {}
  function quizErrorHandler(quizError) {}

  function logoutHandler() {
    // localStorage.clear();
    localStorage.removeItem("accessT");
    sessionStorage.removeItem("accessT");
    localStorage.removeItem("refreshT");
    sessionStorage.removeItem("refreshT");
    navigate("/");
  }

  useEffect(() => {
    if (playing) {
      const timer = setTimeout(() => {
        if (quizTime > 0) {
          setQuizTime((prev) => prev - 1);
        } else {
          setQuestionTimer(30);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [quizTime]);

  useEffect(() => {
    if (playing) {
      const timer = setTimeout(() => {
        if (questionTimer > 0) {
          setQuestionTimer((prev) => prev - 1);
        }
        if (!quizEnd) {
          if (questionTimer === 0) {
            setTimeout(() => {
              if (limit !== question + 1) {
                setQuizTime(3);
              }
            }, 2000);
            if (limit !== question + 1) {
              setTimeout(() => {
                increaseProgress();
                setHighlightAnswer(false);
              }, 5000);
            } else {
              setQuizEnd(true);
            }
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [questionTimer]);

  function increaseProgress() {
    if (limit === question + 1) {
      setQuizEnd(true);
    } else {
      setQuestion(question + 1);
    }
  }
  function answerHandler() {
    setHighlightAnswer(true);
    if (questionTimer < 5) {
      setQuestionTimer(30);
    }
    setTimeout(() => {
      if (playing) {
        if (limit !== question + 1) {
          setQuizTime(3);
        }
      }
    }, 2000);
    if (limit !== question + 1) {
      setTimeout(() => {
        increaseProgress();
        setHighlightAnswer(false);
      }, 5000);
    } else {
      setTimeout(() => {
        increaseProgress();
        setHighlightAnswer(false);
      }, 1000);
    }
  }

  function cAnswerHandler({ correctStatus }) {
    if (correctStatus) {
      setCorrect(correct + 1);
    }
  }

  function playAgainHandler() {
    setOpened(false);
    setSelected(null);
    setPlaying(true);
    setQuestion(0);
    setHighlightAnswer(false);
    setCorrect(0);
    setQuizEnd(false);

    setTimeout(() => refetchQuiz(), 500);
    setTimeout(() => setQuizTime(3), 500);
  }

  function changeModeHandler() {
    setOpened(false);
    setSelected(null);
    setPlaying(false);
    setQuestion(0);
    setHighlightAnswer(false);
    setCorrect(0);
    setQuizEnd(false);
  }

  return (
    <div className="bg-white w-full min-h-screen ">
      <Modal opened={quizEnd} withCloseButton={false} centered>
        <div className=" font-bold grid place-content-center text-blue-400 text-center">
          <h2 className="text-5xl text-red-400">Game Over</h2>
          <p className="text-lg mt-4">Your Score is</p>
          <h2 className="text-8xl">{correct}</h2>
          <div className="flex gap-4 mt-4">
            <Button onClick={playAgainHandler} className="bg-blue-400">
              Play Again
            </Button>
            <Button
              onClick={changeModeHandler}
              className="bg-white/90 border border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-gray-100"
            >
              Change Mode
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={quizTime > 0 ? true : false}
        withCloseButton={false}
        centered
        size={200}
      >
        <div className="text-9xl font-bold grid place-content-center text-blue-400">
          {quizTime}
        </div>
      </Modal>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        title="Confirm your answer?"
      >
        <div>
          <Button
            onClick={() => {
              answerHandler();
              setOpened(false);
            }}
            className="bg-blue-400"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpened(false)}
            className="bg-white/90 text-gray-500 border border-gray-400 ml-4 hover:bg-gray-300"
          >
            No
          </Button>
        </div>
      </Modal>
      <div className="bg-blue-400/90 p-2 rounded-b-3xl text-gray-100 fixed top-0 w-full">
        <div className="flex justify-between items-center py-4 px-8">
          <button
            onClick={changeModeHandler}
            className="flex items-center bg-blue-300 p-2 rounded-md"
          >
            <img
              className="w-10 h-10"
              src="https://cdn-icons-png.flaticon.com/512/6193/6193558.png"
              alt=""
            />
            <h2 className="text-3xl font-bold ml-4">GritQuiz</h2>
          </button>
          <div className="flex items-center">
            <Link
              className={`text-2xl p-2 bg-blue-300 hover:bg-blue-200 rounded-full mr-2 ${
                profile && profile?.data?.role !== "admin" && "hidden"
              }`}
              to="/adminpanel"
            >
              <MdOutlineAdminPanelSettings />
            </Link>
            <img
              className="w-10 h-10 object-cover rounded-md mr-2"
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
            />
            <div>
              <h2 className="font-semibold">
                Hello, {profile && profile?.data?.email}
              </h2>
              <p className="text-xs">Let's start your quiz</p>
            </div>
            <button
              onClick={logoutHandler}
              className="text-2xl p-2 bg-blue-300 hover:bg-blue-200 rounded-full ml-2"
            >
              <AiOutlineLogout />
            </button>
          </div>
        </div>
      </div>
      {playing ? (
        <>
          {(isQuizLoading || isQuizFetching) && (
            <div className="w-full min-h-screen bg-blue-400 flex justify-center items-center">
              <AiOutlineLoading3Quarters className="text-white animate-spin text-3xl" />
            </div>
          )}
          <div className="p-8 text-gray-700 text-lg font-semibold min-h-screen flex flex-col justify-center">
            <Progress
              className="mx-8"
              size="xl"
              value={
                quizEnd
                  ? 100
                  : 100 - (limit - (question + 1) + 1) * (100 / limit)
              }
            />
            {quiz && (
              <Fragment key={quiz[question]._id}>
                <div className="flex items-center gap-4 mx-8 mt-8">
                  <div className=" text-xl font-semibold  p-2 bg-blue-400 w-fit rounded-md text-gray-100">
                    Question {question + 1}
                  </div>
                  {quizTime === 0 && (
                    <div
                      className={`p-2 rounded-md ${
                        questionTimer < 31 && "bg-green-200 text-green-400"
                      } ${
                        questionTimer < 21 && "bg-amber-200 text-amber-400"
                      } ${questionTimer < 11 && "bg-red-200 text-rose-400"}`}
                    >
                      {questionTimer > 0
                        ? "Timer " + questionTimer
                        : "Time Out"}
                    </div>
                  )}
                </div>
                <div className="w-full rounded-lg p-8 text-xl font-semibold ">
                  {quiz[question].title}
                </div>
                <SimpleGrid cols={2} className="mt-4 px-8">
                  {quiz[question].options.map((option, index) => (
                    <button
                      onClick={() => {
                        setSelected(index + 1);
                        setOpened(true);
                        cAnswerHandler({ correctStatus: option.correct });
                      }}
                      disabled={highlightAnswer || questionTimer === 0}
                      className={`bg-white/80 border border-gray-300 hover:bg-blue-400 hover:text-gray-100  p-4 rounded-md ${
                        highlightAnswer &&
                        option.correct &&
                        "bg-green-400 hover:bg-green-400 text-gray-100"
                      } ${
                        highlightAnswer &&
                        index + 1 === selected &&
                        !option.correct &&
                        "bg-rose-400 hover:bg-rose-400 text-gray-100"
                      }`}
                    >
                      {option.option}
                    </button>
                  ))}
                </SimpleGrid>
              </Fragment>
            )}
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center  h-screen">
          <h2 className="text-5xl font-bold uppercase text-gray-600">
            Select quiz mode
          </h2>
          <div className="mt-12 grid grid-cols-3 gap-4 text-gray-100 text-3xl font-semibold">
            <button
              onClick={() => {
                setPlaying(true);
                setLimit(5);
                setTimeout(() => refetchQuiz(), 500);
                setQuizTime(3);
              }}
              className="bg-green-300 hover:bg-green-400 active:translate-y-1 transition-all ease-in-out hover:animate hover:animate-bounce w-44 h-40 rounded-lg"
            >
              Easy
            </button>
            <button
              onClick={() => {
                setPlaying(true);
                setLimit(10);
                setTimeout(() => refetchQuiz(), 500);
                setQuizTime(3);
              }}
              className="bg-amber-300 hover:bg-amber-400 active:translate-y-1 transition-all ease-in-out hover:animate hover:animate-bounce w-44 h-40 rounded-lg"
            >
              Medium
            </button>
            <button
              onClick={() => {
                setPlaying(true);
                setLimit(15);
                setTimeout(() => refetchQuiz(), 500);
                setQuizTime(3);
              }}
              className="bg-red-300 hover:bg-red-400 active:translate-y-1 transition-all ease-in-out hover:animate hover:animate-bounce w-44 h-40 rounded-lg"
            >
              Hard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
