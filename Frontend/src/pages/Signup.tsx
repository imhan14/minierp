import { useState } from "react";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import api from "../apis/axios";

interface SignupForm {
  full_name: string;
  username: string;
  password: string;
  confirm_password: string;
}

const Signup = () => {
  const [serverError, setServerError] = useState("");
  const [registered, setRegistered] = useState(false);
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    defaultValues: {
      full_name: "",
      username: "",
      password: "",
      confirm_password: "",
    },
  });
  const onSubmit = async (data: SignupForm) => {
    setServerError("");
    try {
      await api.post("/auth/register", data);
      setRegistered(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const response = error.response?.data as
          | { error?: string; message?: string }
          | undefined;
        setServerError(
          response?.error || response?.message || "Không thể tạo tài khoản.",
        );
      } else {
        setServerError("Đã có lỗi không xác định xảy ra.");
      }
    }
  };

  if (registered) {
    return (
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Typography
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 700 }}
        >
          Đăng ký tài khoản
        </Typography>
        <Alert severity="success">
          Tạo tài khoản thành công. Bạn có thể đăng nhập ngay bây giờ.
        </Alert>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          fullWidth
        >
          Đi đến đăng nhập
        </Button>
      </Stack>
    );
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      spacing={2}
      sx={{ width: "100%" }}
      noValidate
    >
      <Typography
        variant="h5"
        component="h1"
        textAlign="center"
        sx={{ fontWeight: 700 }}
      >
        Tạo tài khoản
      </Typography>
      <Controller
        name="full_name"
        control={control}
        rules={{ required: "Vui lòng nhập họ và tên." }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Họ và tên"
            autoComplete="name"
            fullWidth
            error={!!errors.full_name}
            helperText={errors.full_name?.message}
          />
        )}
      />
      <Controller
        name="username"
        control={control}
        rules={{ required: "Vui lòng nhập tên đăng nhập." }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Tên đăng nhập"
            autoComplete="username"
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Vui lòng nhập mật khẩu.",
          minLength: { value: 8, message: "Mật khẩu cần ít nhất 8 ký tự." },
          maxLength: { value: 16, message: "Mật khẩu tối đa 16 ký tự." },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Mật khẩu"
            type="password"
            autoComplete="new-password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message || "Từ 8 đến 16 ký tự."}
          />
        )}
      />
      <Controller
        name="confirm_password"
        control={control}
        rules={{
          required: "Vui lòng xác nhận mật khẩu.",
          validate: (value) =>
            value === getValues("password") || "Mật khẩu xác nhận không khớp.",
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Xác nhận mật khẩu"
            type="password"
            autoComplete="new-password"
            fullWidth
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
          />
        )}
      />
      {serverError && <Alert severity="error">{serverError}</Alert>}
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
      </Button>
      <Typography variant="body2" textAlign="center">
        Đã có tài khoản? <RouterLink to="/login">Đăng nhập</RouterLink>
      </Typography>
    </Stack>
  );
};

export default Signup;
