import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Modal,
  NumberInput,
  TypographyStylesProvider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { userLogin, verifyOtp } from "../../apis/userApis";

//toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//icons import
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Login = ({ refetchProfile }) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken =
      localStorage.getItem("refreshT") ||
      sessionStorage.getItem("refreshT") ||
      null;
    if (refreshToken) {
      navigate("/dashboard");
    }
  }, []);

  const form = useForm({
    initialValues: {
      email: "",
      keepLoggedIn: false,
      otp: null,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const {
    isLoading: isLoginLoading,
    data: login,
    isError: isloginError,
    error: loginError,
    isFetching: isLoginFetching,
    refetch: refetchLogin,
  } = useQuery(
    "login",

    () =>
      userLogin({
        email: form.values.email,
      }),
    {
      enabled: false,
      retry: false,
      onSuccess: (login) => loginSuccess(login),
      onError: (loginError) => loginErrorHandler(loginError),
    }
  );

  const {
    isLoading: isOtpLoading,
    data: otp,
    isError: isOtpError,
    error: otpError,
    isFetching: isOtpFetching,
    refetch: refetchOtp,
  } = useQuery(
    "otp",
    () =>
      verifyOtp({
        email: form.values.email,
        otp: form.values.otp,
      }),
    {
      enabled: false,
      retry: false,
      onSuccess: (otp) => otpSuccessHandler(otp),
      onError: (otpError) => otpErrorHandler(otpError),
    }
  );

  //Login Handlers
  function loginSuccess(login) {
    setOpened(true);
    toast.success(login && login.message);
    form.values.otp = null;
  }
  function loginErrorHandler(loginError) {
    toast.error(loginError.response.data.message);
  }

  //Otp Handlers
  function otpSuccessHandler(otp) {
    setOpened(false);
    toast.success(otp && otp.message);
    if (form.values.keepLoggedIn) {
      sessionStorage.removeItem("refreshT");
      sessionStorage.removeItem("accessT");
      localStorage.setItem("refreshT", otp.refreshT);
      localStorage.setItem("accessT", otp.accessT);
    } else {
      localStorage.removeItem("refreshT");
      localStorage.removeItem("accessT");
      sessionStorage.setItem("refreshT", otp.refreshT);
      sessionStorage.setItem("accessT", otp.accessT);
    }
    refetchProfile();
    navigate("/dashboard");
  }
  function otpErrorHandler(otpError) {
    toast.error(otpError.response.data.message);
    form.values.otp = null;
  }

  return (
    <div className="flex min-h-screen w-full p-4 bg-blue-400 justify-center items-center">
      <ToastContainer position="bottom-left" />
      <form
        className="w-full md:w-[40rem] bg-white/80 p-8 rounded-lg"
        onSubmit={form.onSubmit((values) => {
          refetchLogin();
        })}
      >
        <div className="flex items-end mb-4">
          <img
            className="w-16 h-16"
            src="https://cdn-icons-png.flaticon.com/512/6193/6193558.png"
            alt=""
          />
          <h2 className="text-3xl font-bold ml-4">GritQuiz</h2>
        </div>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="Enter your email address"
          {...form.getInputProps("email")}
        />
        <Checkbox
          mt="md"
          label="Keep me Logged In"
          {...form.getInputProps("keepLoggedIn", { type: "checkbox" })}
        />
        <Group position="left" mt="md">
          <Button
            className="bg-blue-400 w-full disabled:bg-blue-200"
            disabled={isLoginFetching ? true : false}
            type="submit"
          >
            {isLoginFetching ? (
              <>
                <AiOutlineLoading3Quarters className="text-white animate-spin" />
                <p className="text-white ml-2">Login</p>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Group>
      </form>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        title="Verify OTP"
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (form.values.otp === null) {
              toast.warn("Invalid OTP");
              return;
            }
            refetchOtp();
          })}
        >
          <NumberInput
            mt="sm"
            label="OTP"
            placeholder="OTP"
            min={0}
            max={9999}
            {...form.getInputProps("otp")}
          />
          <Button
            className="bg-blue-400 disabled:bg-blue-200"
            disabled={isOtpFetching ? true : false}
            type="submit"
            mt="sm"
          >
            {isOtpFetching ? (
              <>
                <AiOutlineLoading3Quarters className="text-white animate-spin" />
                <p className="text-white ml-2">Verify</p>
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Login;
