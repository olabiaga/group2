import { PlanRequestParams } from '../types';

export interface PresetScenario {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  params: PlanRequestParams;
}

export const COMMUNITY_PRESETS: PresetScenario[] = [
  {
    id: 'ph-family-3',
    badge: '₱200 Budget',
    title: 'Family of 3 (Palengke)',
    subtitle: '₱200/day • 3 people • Wet market staples & eggs',
    params: {
      budget: 200,
      currency: '₱',
      people: 3,
      householdType: 'Family with Kids',
      pantryItems: ['Rice', 'Cooking Oil', 'Salt', 'Soy Sauce', 'Garlic', 'Black Pepper'],
      existingIngredients: '1 egg, small piece ginger, cold leftover cooked rice',
      cookingEquipment: 'Standard 1-2 burner stove',
      regionContext: 'Philippines / Local Palengke & Talipapa',
      priorities: ['High Protein', 'Zero Waste', 'Save Fuel/LPG'],
      dietaryNotes: 'Kids love soup or savory egg dishes. Simple Filipino comfort food.'
    }
  },
  {
    id: 'college-dorm-solo',
    badge: '₱120 Solo',
    title: 'College Dormer (Rice Cooker Only)',
    subtitle: '₱120/day • 1 person • Single electric pot / rice cooker',
    params: {
      budget: 120,
      currency: '₱',
      people: 1,
      householdType: 'College Student (Dorm)',
      pantryItems: ['Rice', 'Salt', 'Soy Sauce', 'Instant noodles seasoning packet'],
      existingIngredients: '1 can century tuna, half onion',
      cookingEquipment: 'Rice cooker only (dorm hack)',
      regionContext: 'Sari-sari store & university corner stalls',
      priorities: ['Rice Cooker One-Pot', 'Quick Prep (<15m)', 'Zero Waste'],
      dietaryNotes: 'No refrigerator available. Need shelf-stable or single-meal portion ingredients.'
    }
  },
  {
    id: 'ph-family-5',
    badge: '₱350 Big Family',
    title: 'Household of 5 (High Fiber & Protein)',
    subtitle: '₱350/day • 5 people • Monggo, tofu, whole veggies & soup',
    params: {
      budget: 350,
      currency: '₱',
      people: 5,
      householdType: 'Big Family (5 members)',
      pantryItems: ['Rice', 'Cooking Oil', 'Salt', 'Garlic', 'Red Onion', 'Fish Sauce (Patis)', 'Vinegar'],
      existingIngredients: 'Leftover cabbage wedge, 2 ripe tomatoes',
      cookingEquipment: 'Standard 2-burner stove',
      regionContext: 'Philippines / Local Palengke & Talipapa',
      priorities: ['Bulk Volume for Big Family', 'High Protein', 'Save Fuel/LPG'],
      dietaryNotes: 'Stretch meals with rich broth and nutritious vegetable extenders.'
    }
  },
  {
    id: 'plant-powered-budget',
    badge: '₱180 Tofu & Greens',
    title: 'Budget Plant-Powered (Tofu & Veggies)',
    subtitle: '₱180/day • 3 people • Tokwa, legumes & seasonal leaves',
    params: {
      budget: 180,
      currency: '₱',
      people: 3,
      householdType: 'Working Housemates',
      pantryItems: ['Rice', 'Cooking Oil', 'Salt', 'Black Pepper', 'Garlic', 'Soy Sauce'],
      existingIngredients: '1 block firm tokwa, half squash (kalabasa)',
      cookingEquipment: 'Standard stove',
      regionContext: 'Local wet market',
      priorities: ['High Protein', 'Zero Waste', 'Budget Legumes'],
      dietaryNotes: 'Vegetarian-friendly, no expensive meats. High iron and calcium.'
    }
  },
  {
    id: 'usd-budget-2',
    badge: '$10 Tight Budget',
    title: 'Budget Saver ($10 for 2)',
    subtitle: '$10/day • 2 people • Eggs, beans, cabbage, oats/rice',
    params: {
      budget: 10,
      currency: '$',
      people: 2,
      householdType: 'Couple / Roommates',
      pantryItems: ['Rice', 'Cooking Oil', 'Salt', 'Black Pepper', 'Garlic powder'],
      existingIngredients: '2 eggs, half can black beans, small onion',
      cookingEquipment: 'Standard stove & skillet',
      regionContext: 'Discount supermarket / Dollar grocery',
      priorities: ['High Protein', 'Quick Prep (<20m)', 'Zero Waste'],
      dietaryNotes: 'Affordable produce, filling fiber and protein.'
    }
  }
];

export const COMMON_PANTRY_STAPLES = [
  'Rice',
  'Cooking Oil',
  'Salt',
  'Black Pepper',
  'Garlic',
  'Red Onion',
  'Soy Sauce',
  'Vinegar',
  'Fish Sauce (Patis)',
  'Brown/White Sugar',
  'Bouillon Cubes',
  'All-purpose Flour'
];

export const QUICK_LEFTOVER_SUGGESTIONS = [
  'Cold day-old rice',
  '2 fresh eggs',
  'Half head of cabbage',
  '1 can sardines in tomato sauce',
  'Small wedge of squash (kalabasa)',
  '1 block firm tofu',
  '2 ripe tomatoes',
  'Backyard malunggay leaves',
  '1 pack instant noodles'
];
