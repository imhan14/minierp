import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import api from "../apis/axios";
import { useNavigate } from "react-router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authInformation } from "../redux/slices/authSlice";

interface loginData {
  username: string;
  password: string;
}
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const onSubmit = async (data: loginData) => {
    setServerError("");
    try {
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(
        authInformation({
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
        }),
      );

      if (user.role === 1) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error || "Lỗi server";
        setServerError(msg);
      } else {
        setServerError("Đã có lỗi không xác định xảy ra");
      }
    }
  };

  return (
    <div className="container flex flex-col w-full">
      <h2 className="mx-auto">Login</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-1 gap-2 flex flex-col"
      >
        <Controller
          name="username"
          control={control}
          rules={{ required: "Tên đăng nhập là bắt buộc" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username"
              fullWidth
              margin="normal"
              error={!!errors.username || !!serverError}
              helperText={errors.username?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Mật khẩu là bắt buộc",
            minLength: {
              value: 8,
              message: "Mật khẩu phải có ít nhất 8 ký tự",
            },
          }}
          render={({ field }) => (
            <FormControl sx={{ width: "full" }} variant="outlined">
              <InputLabel
                htmlFor="outlined-adornment-password"
                error={!!errors.password || !!serverError}
              >
                Password
              </InputLabel>
              <OutlinedInput
                {...field}
                type={showPassword ? "text" : "password"}
                error={!!errors.password || !!serverError}
                id="outlined-adornment-password"
                name="password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.password?.message || serverError}
              </FormHelperText>
            </FormControl>
          )}
        />

        <Button type="submit" variant="contained">
          LOGIN
        </Button>
      </form>
    </div>
  );
};

export default Login;
