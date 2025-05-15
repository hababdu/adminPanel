import React, { useState } from "react";
import {
  Box,
  Typography,
  Badge,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Fade,
} from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import InfoIcon from "@mui/icons-material/Info";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Dynamic theme based on product count
const getDynamicTheme = (count) => {
  const color = count > 10 ? "#4caf50" : count > 0 ? "#1976d2" : "#f44336";
  return createTheme({
    palette: {
      primary: { main: color },
      background: { default: "#e3f2fd" },
    },
    typography: {
      body1: { fontSize: "0.95rem", fontWeight: 500 },
    },
  });
};

// Calculate product statistics
const calculateStats = (products = []) => {
  const stats = {
    total: products.length || 0, // Default to 0 if products is undefined
    active: products.filter((p) => p.is_active !== false).length || 0,
    discounted: products.filter((p) => p.discount > 0).length || 0,
    categories: {},
  };

  if (products && products.length > 0) {
    products.forEach((product) => {
      const category = product.category?.name || "N/A";
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });
  }

  return stats;
};

const ProductCount = ({ products = [] }) => {
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const stats = calculateStats(products);
  const theme = getDynamicTheme(stats.total);

  const handleOpenStats = () => setOpenStatsDialog(true);
  const handleCloseStats = () => setOpenStatsDialog(false);

  return (
    <ThemeProvider theme={theme}>
      <Fade in={true} timeout={600}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            p: 1,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: 300,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              transform: "scale(1.02)",
            },
          }}
        >
          <Tooltip title={`Jami mahsulotlar: ${stats.total}`}>
            <Badge badgeContent={stats.total} color="primary">
              <FastfoodIcon color="action" />
            </Badge>
          </Tooltip>
          <Typography variant="body1" fontWeight="bold" color="primary">
            Mahsulotlar: {stats.total}
          </Typography>
          <Tooltip title="Batafsil statistika">
            <IconButton size="small" onClick={handleOpenStats} color="primary">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      <Dialog open={openStatsDialog} onClose={handleCloseStats} maxWidth="sm" fullWidth>
        <DialogTitle>Mahsulotlar statistikasi</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body1">
              <strong>Jami mahsulotlar:</strong> {stats.total}
            </Typography>
            <Typography variant="body1">
              <strong>Faol mahsulotlar:</strong> {stats.active}
            </Typography>
            <Typography variant="body1">
              <strong>Chegirmali mahsulotlar:</strong> {stats.discounted}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Kategoriyalar bo‘yicha:
            </Typography>
            {Object.entries(stats.categories).length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(stats.categories).map(([category, count]) => (
                  <Chip
                    key={category}
                    label={`${category}: ${count}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: "0.85rem" }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Kategoriyalar mavjud emas
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStats} variant="contained">
            Yopish
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ProductCount;