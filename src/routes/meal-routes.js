const express = require("express");
const router = express.Router();
const mealController = require("../controllers/meal-controller");
const authController = require("../controllers/auth-controller");

router.post(
    "/api/meal/",
    authController.validateToken,
    mealController.validateMeal,
    mealController.createMeal
);

router.get("/api/meal/", mealController.getAllMeals);

router.get("/api/meal/:mealID", mealController.getMealById);

router.delete(
    "/api/meal/:mealID",
    authController.validateToken,
    mealController.deleteMealById
);

router.put(
    "/api/meal/:mealID",
    authController.validateToken,
    mealController.validateMeal,
    mealController.updateMealById
);

module.exports = router;
