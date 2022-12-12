import { Button, Group, Modal, Radio, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters, AiOutlineLogout } from "react-icons/ai";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { addQuiz, deleteOneQuiz, getAllQuizes } from "../../apis/quizApis";

//toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Adminpanel = () => {
  const [addNewQuiz, setAddNewQuiz] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const [deleteOldQuiz, setDeleteOldQuiz] = useState(false);
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData("profile");
  const navigate = useNavigate();

  const addQuizForm = useForm({
    initialValues: {
      title: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    },
    validate: {
      title: (value) =>
        value.length > 16 ? null : "Question must be longer than 16 characters",
      option1: (value) => (value ? null : "Enter option 1"),
      option2: (value) => (value ? null : "Enter option 2"),
      option3: (value) => (value ? null : "Enter option 3"),
      option4: (value) => (value ? null : "Enter option 4"),
    },
  });

  const {
    isLoading: isnewQuizLoading,
    data: newQuiz,
    isError: isnewQuizError,
    error: newQuizError,
    isFetching: isnewQuizFetching,
    refetch: refetchnewQuiz,
  } = useQuery(
    "newQuiz",

    () =>
      addQuiz({
        newQuizData: {
          title: addQuizForm.values.title,
          options: [
            {
              option: addQuizForm.values.option1,
              correct: addQuizForm.values.option1 === correct,
            },
            {
              option: addQuizForm.values.option2,
              correct: addQuizForm.values.option2 === correct,
            },
            {
              option: addQuizForm.values.option3,
              correct: addQuizForm.values.option3 === correct,
            },
            {
              option: addQuizForm.values.option4,
              correct: addQuizForm.values.option4 === correct,
            },
          ],
        },
      }),
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (newQuiz) => newQuizSuccess(newQuiz),
      onError: (newQuizError) => newQuizErrorHandler(newQuizError),
    }
  );

  const {
    isLoading: isdeleteQuizLoading,
    data: deleteQuiz,
    isError: isdeleteQuizError,
    error: deleteQuizError,
    isFetching: isdeleteQuizFetching,
    refetch: refetchdeleteQuiz,
  } = useQuery(
    ["deleteQuiz", toBeDeleted],

    () => deleteOneQuiz({ id: toBeDeleted && toBeDeleted }),
    {
      enabled: false,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (deleteQuiz) => deleteQuizSuccess(deleteQuiz),
      onError: (deleteQuizError) => deleteQuizErrorHandler(deleteQuizError),
    }
  );

  const {
    isLoading: isallQuizLoading,
    data: allQuiz,
    isError: isallQuizError,
    error: allQuizError,
    isFetching: isallQuizFetching,
    refetch: refetchallQuiz,
  } = useQuery(
    "allQuiz",

    () => getAllQuizes(),
    {
      enabled: true,
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (allQuiz) => allQuizSuccess(allQuiz),
      onError: (allQuizError) => allQuizErrorHandler(allQuizError),
    }
  );

  function deleteQuizSuccess(deleteQuiz) {
    toast.success("Quiz deleted successfully");
    refetchallQuiz();
  }
  function deleteQuizErrorHandler() {
    toast.error(deleteQuiz.response.data.message);
  }

  function newQuizSuccess(newQuiz) {
    setAddNewQuiz(false);
    toast.success("New Quiz added successfully");
    refetchallQuiz();
    addQuizForm.reset();
  }
  function newQuizErrorHandler(newQuizError) {
    toast.error(newQuizError.response.data.message);
  }
  function allQuizSuccess(allQuiz) {}
  function allQuizErrorHandler(allQuizError) {}

  useEffect(() => {
    if (profile && profile.data.role !== "admin") {
      navigate("/dashboard");
    }
  }, []);

  function logoutHandler() {
    localStorage.removeItem("accessT");
    sessionStorage.removeItem("accessT");
    localStorage.removeItem("refreshT");
    sessionStorage.removeItem("refreshT");
    navigate("/");
  }

  return (
    <div>
      <ToastContainer position="bottom-left" />
      <Modal
        opened={deleteOldQuiz}
        onClose={() => setDeleteOldQuiz(false)}
        title="Are you sure you want to delete ?"
        centered
      >
        <Button
          onClick={() => {
            refetchdeleteQuiz();
            setDeleteOldQuiz(false);
          }}
          className="bg-red-400 hover:bg-red-500"
        >
          yes
        </Button>
        <Button
          onClick={() => setDeleteOldQuiz(false)}
          className="bg-blue-400 hover:bg-blue-500 ml-4"
        >
          No
        </Button>
      </Modal>
      <Modal
        opened={addNewQuiz}
        onClose={() => setAddNewQuiz(false)}
        title="Add new Quiz"
        centered
      >
        <form
          onSubmit={addQuizForm.onSubmit((values) => {
            refetchnewQuiz();
          })}
        >
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Enter Quiz Question"
            {...addQuizForm.getInputProps("title")}
          />
          <h2 className="mt-4 font-semibold">Answers</h2>
          <TextInput
            withAsterisk
            label="option1"
            placeholder="enter option 1"
            {...addQuizForm.getInputProps("option1")}
          />
          <TextInput
            withAsterisk
            label="option2"
            placeholder="enter option 2"
            {...addQuizForm.getInputProps("option2")}
          />
          <TextInput
            withAsterisk
            label="option3"
            placeholder="enter option 3"
            {...addQuizForm.getInputProps("option3")}
          />
          <TextInput
            withAsterisk
            label="option4"
            placeholder="enter option 4"
            {...addQuizForm.getInputProps("option4")}
          />
          {addQuizForm.values.option1 &&
            addQuizForm.values.option2 &&
            addQuizForm.values.option3 &&
            addQuizForm.values.option4 && (
              <Radio.Group
                name="correctAnswer"
                label="Choose correct answer"
                withAsterisk
                className="mt-4"
                value={correct}
                onChange={setCorrect}
              >
                <Radio
                  value={addQuizForm.values.option1}
                  label={addQuizForm.values.option1}
                />
                <Radio
                  value={addQuizForm.values.option2}
                  label={addQuizForm.values.option2}
                />
                <Radio
                  value={addQuizForm.values.option3}
                  label={addQuizForm.values.option3}
                />
                <Radio
                  value={addQuizForm.values.option4}
                  label={addQuizForm.values.option4}
                />
              </Radio.Group>
            )}
          <Group position="left" mt="md">
            <Button
              className="bg-blue-400 w-full disabled:bg-blue-200"
              disabled={isnewQuizFetching ? true : false}
              type="submit"
            >
              {isnewQuizFetching ? (
                <>
                  <AiOutlineLoading3Quarters className="text-white animate-spin" />
                  <p className="text-white ml-2">Add Quiz</p>
                </>
              ) : (
                "Add Quiz"
              )}
            </Button>
          </Group>
        </form>
      </Modal>
      <div className="bg-blue-400 p-8 flex justify-between items-center text-gray-100 rounded-b-2xl">
        <Link
          className="bg-blue-300 hover:bg-blue-200 py-2 px-4 rounded-md font-semibold"
          to="/dashboard"
        >
          Go back
        </Link>
        <div className="flex items-center">
          <img
            className="w-10 h-10 object-cover rounded-md mr-2"
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
          <div>
            <h2 className="font-semibold">
              Hello, {profile && profile.data.email}
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
      <div className="bg-gray-100 px-8 mt-4 rounded-t-2xl">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-lg font-semibold text-gray-500">Quizes</h2>
          <Button onClick={() => setAddNewQuiz(true)} className="bg-blue-400">
            Add a Quiz
          </Button>
        </div>
        <div className="pb-4">
          <table className="w-full text-left font-semibold">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Title</th>
                <th>Options</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {allQuiz &&
                allQuiz.map((quiz, index) => (
                  <tr key={quiz._id}>
                    <td>{index + 1}</td>
                    <td>{quiz.title}</td>
                    <td className="flex items-center gap-2 flex-wrap text-gray-100">
                      {quiz.options.map((unit) => (
                        <p
                          key={unit._id}
                          className="py-1 px-2 rounded-md bg-blue-300"
                        >
                          {unit.option}
                        </p>
                      ))}
                    </td>
                    <td>
                      {
                        <Button
                          className="bg-red-400 hover:bg-red-500"
                          onClick={() => {
                            setToBeDeleted(quiz._id);
                            setDeleteOldQuiz(true);
                          }}
                        >
                          Delete
                        </Button>
                      }
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Adminpanel;
