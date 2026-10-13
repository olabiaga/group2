export interface Ingredient {
  name: string;
  quantity: string;
  estimatedPrice: number;
  isPantry: boolean;
}

export interface Meal {
  mealType: string;
  recipeName: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  estimatedCost: number;
  costPerPerson: number;
  ingredientsNeeded: Ingredient[];
  steps: string[];
  zeroWasteTip: string;
  fuelSaverTip: string;
}

export interface GroceryItem {
  name: string;
  category: string;
  quantity: string;
  estimatedCost: number;
  notesOrAlternatives: string;
  targetStore: string;
  checked?: boolean;
}

export interface LeftoverGuide {
  leftover: string;
  howToReuse: string;
}

export interface NutritionOverview {
  proteinScore: string;
  fiberScore: string;
  calorieAdequacy: string;
  highlights: string[];
}

export interface MealPlanResponse {
  summary: string;
  totalEstimatedCost: number;
  currency: string;
  budgetRemaining: number;
  nutritionOverview: NutritionOverview;
  meals: Meal[];
  groceryShoppingList: GroceryItem[];
  leftoverRepurposingGuide: LeftoverGuide[];
  budgetSavingHacks: string[];
}

export interface PlanRequestParams {
  budget: number;
  currency: string;
  people: number;
  householdType: string;
  pantryItems: string[];
  existingIngredients: string;
  cookingEquipment: string;
  regionContext: string;
  priorities: string[];
  dietaryNotes?: string;
}

export interface SavedPlan {
  id: string;
  title: string;
  createdAt: string;
  params: PlanRequestParams;
  data: MealPlanResponse;
}
