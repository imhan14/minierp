import { Box } from "@mui/material";

export const getLabel = (
  options: { label: string; value: string }[],
  value: unknown,
) =>
  options.find((o) => o.value === String(value))?.label ?? String(value ?? "-");

export const renderBadge = (
  value: unknown,
  options: { value: string; label: string; bg: string; text: string }[],
) => {
  const status = options.find((o) => String(o.value) === String(value)) ?? {
    label: String(value ?? "N/A"),
    bg: "#f5f5f5",
    text: "#616161",
  };
  return (
    <Box
      component="span"
      sx={{
        backgroundColor: status.bg,
        color: status.text,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        fontSize: "0.7rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        display: "inline-block",
        minWidth: 64,
        textAlign: "center",
      }}
    >
      {status.label}
    </Box>
  );
};
