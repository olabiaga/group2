import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback Plan Generator if AI API is unavailable or times out
function generateSmartFallbackPlan(params: {
  budget: number;
  currency: string;
  people: number;
  householdType: string;
  pantryItems: string[];
  existingIngredients: string;
  cookingEquipment: string;
  regionContext: string;
}) {
  const { budget, currency, people } = params;
  const isPeso = currency === '₱' || currency.toLowerCase().includes('php');
  
  // Estimate realistic allocations
  const breakfastBudget = Math.round(budget * 0.25);
  const lunchBudget = Math.round(budget * 0.40);
  const dinnerBudget = Math.round(budget * 0.35);

  return {
    summary: `Budget meal plan for ${people} people strictly calibrated under ${currency}${budget}. Focuses on filling protein (eggs, tofu/beans), seasonal greens, and zero-waste leftover repurposing.`,
    totalEstimatedCost: Math.min(budget, breakfastBudget + lunchBudget + dinnerBudget),
    currency,
    budgetRemaining: Math.max(0, budget - (breakfastBudget + lunchBudget + dinnerBudget)),
    nutritionOverview: {
      proteinScore: "Good (Eggs, Tofu / Legumes)",
      fiberScore: "High (Leafy Greens & Veggies)",
      calorieAdequacy: "Sustained Energy with Rice / Carb Base",
      highlights: [
        "Complete protein pairing: Eggs and tofu provide essential amino acids on a tight budget.",
        "Dark leafy greens provide iron, calcium, and vitamins A & C without high vegetable costs.",
        "Zero food waste: Stalks, aromatics, and morning rice carry over into evening meals."
      ]
    },
    meals: [
      {
        mealType: "Breakfast",
        recipeName: isPeso ? "Sinangag (Garlic Fried Rice) at Tortang Itlog" : "Hearty Garlic Fried Rice & Seasoned Scrambled Eggs",
        description: "Comforting, high-energy breakfast turning day-old rice and budget eggs into a protein-packed meal.",
        prepTimeMinutes: 8,
        cookTimeMinutes: 10,
        estimatedCost: breakfastBudget,
        costPerPerson: Math.round((breakfastBudget / people) * 10) / 10,
        ingredientsNeeded: [
          { name: "Day-old cooked rice / Pantry rice", quantity: `${people * 1.2} cups`, estimatedPrice: 0, isPantry: true },
          { name: "Fresh eggs", quantity: `${Math.max(2, people)} pcs`, estimatedPrice: Math.round(breakfastBudget * 0.65), isPantry: false },
          { name: "Garlic & Onions", quantity: "4 cloves garlic, 1 small onion", estimatedPrice: Math.round(breakfastBudget * 0.35), isPantry: false },
          { name: "Cooking oil & Salt", quantity: "2 tbsp oil, pinch of salt", estimatedPrice: 0, isPantry: true }
        ],
        steps: [
          "Crush leftover cold rice using damp hands or a fork to separate grains.",
          "Mince 4 garlic cloves. Heat 1 tbsp oil in a pan over medium heat and sauté minced garlic until golden brown and aromatic.",
          "Add the cold rice, sprinkle salt, and stir-fry briskly for 4-5 minutes until heated through and fragrant.",
          "In a bowl, beat eggs with a pinch of salt and diced onion. Push rice to one side or remove, cook eggs until fluffy and serve together hot."
        ],
        zeroWasteTip: "Use leftover rice from the night before; keep minced garlic skins for simmered broths.",
        fuelSaverTip: "Cook the eggs right after frying the rice in the same pan while it's already hot to save gas/power."
      },
      {
        mealType: "Lunch",
        recipeName: isPeso ? "Ginisang Monggo with Kangkong & Crispy Tokwa" : "Golden Mung Bean Stew with Greens & Crispy Tofu",
        description: "Nutritious, filling, and fiber-packed protein powerhouse dish made with budget-friendly dry mung beans and fresh market greens.",
        prepTimeMinutes: 12,
        cookTimeMinutes: 25,
        estimatedCost: lunchBudget,
        costPerPerson: Math.round((lunchBudget / people) * 10) / 10,
        ingredientsNeeded: [
          { name: "Dry Mung Beans (Monggo)", quantity: "1/2 cup (100g)", estimatedPrice: Math.round(lunchBudget * 0.35), isPantry: false },
          { name: "Firm Tofu (Tokwa)", quantity: "2 blocks / 200g", estimatedPrice: Math.round(lunchBudget * 0.35), isPantry: false },
          { name: "Fresh Kangkong / Spinach / Malunggay", quantity: "1 big bundle", estimatedPrice: Math.round(lunchBudget * 0.30), isPantry: false },
          { name: "Garlic, Onion, Soy Sauce / Patis", quantity: "For sautéing", estimatedPrice: 0, isPantry: true }
        ],
        steps: [
          "Rinse monggo and boil in 3 cups of water until tender and soft (about 18-20 minutes).",
          "Cut firm tofu into small cubes and pan-fry in minimal oil until golden and crispy. Set aside.",
          "In the pot, sauté garlic and sliced onions until translucent. Pour in the softened monggo with its cooking liquid.",
          "Simmer for 3 minutes, season with soy sauce or pinch of salt, then turn off heat and fold in fresh kangkong leaves and crispy tofu cubes. Cover for 2 minutes to gently steam."
        ],
        zeroWasteTip: "Don't discard tender kangkong upper stalks; chop them finely and add with the monggo.",
        fuelSaverTip: "Pre-soak dry mung beans in tap water for 30 minutes before cooking to cut boiling time in half."
      },
      {
        mealType: "Dinner",
        recipeName: isPeso ? "Ginisang Repolyo at Sayote with Egg Ribbon Broth" : "Savory Sautéed Cabbage & Squash with Fluffy Egg Ribbons",
        description: "Light yet satisfying dinner rich in vitamins, gentle on the stomach, using long-lasting budget vegetables.",
        prepTimeMinutes: 10,
        cookTimeMinutes: 12,
        estimatedCost: dinnerBudget,
        costPerPerson: Math.round((dinnerBudget / people) * 10) / 10,
        ingredientsNeeded: [
          { name: "Cabbage / Sayote", quantity: "1/2 head cabbage or 1 medium sayote", estimatedPrice: Math.round(dinnerBudget * 0.50), isPantry: false },
          { name: "Egg", quantity: "1-2 eggs", estimatedPrice: Math.round(dinnerBudget * 0.35), isPantry: false },
          { name: "Tomato & Onion", quantity: "1 ripe tomato, 1 small onion", estimatedPrice: Math.round(dinnerBudget * 0.15), isPantry: false },
          { name: "Soy sauce, Black pepper", quantity: "To taste", estimatedPrice: 0, isPantry: true }
        ],
        steps: [
          "Thinly shred cabbage and julienne sayote. Slice onion and tomato.",
          "Heat 1 tsp oil in a pan, sauté onion and tomato until tomatoes soften and release their sweet juices.",
          "Toss in the shredded cabbage and sayote. Sauté over high heat for 3 minutes, adding 3 tbsp of water and 1 tbsp soy sauce.",
          "Beat the egg and drizzle in a slow swirl over the steaming vegetables. Cover pan and turn off heat immediately for tender egg ribbons."
        ],
        zeroWasteTip: "Save any vegetable trimmings in a freezer bag or bowl for next day's instant broth.",
        fuelSaverTip: "Residual pan heat cooks shredded cabbage and beaten eggs in under 2 minutes with stove off."
      }
    ],
    groceryShoppingList: [
      {
        name: "Fresh Eggs",
        category: "Protein / Meat / Eggs / Tofu",
        quantity: `${Math.max(3, people + 1)} pcs`,
        estimatedCost: Math.round(budget * 0.28),
        notesOrAlternatives: "Ask sari-sari store or market stall for piece-rate discounts or medium eggs",
        targetStore: "Local wet market / Talipapa / Sari-sari store"
      },
      {
        name: "Firm Tofu (Tokwa)",
        category: "Protein / Meat / Eggs / Tofu",
        quantity: "2 blocks",
        estimatedCost: Math.round(budget * 0.20),
        notesOrAlternatives: "Very high protein per peso; can substitute with dried beans or canned sardines",
        targetStore: "Local wet market / Palengke"
      },
      {
        name: "Dry Mung Beans (Monggo)",
        category: "Staples & Canned",
        quantity: "1/2 cup (small repacked pouch)",
        estimatedCost: Math.round(budget * 0.15),
        notesOrAlternatives: "Stores indefinitely without refrigeration; unbeatable nutrition per cost",
        targetStore: "Local wet market / Sari-sari store"
      },
      {
        name: "Fresh Kangkong / Native Greens",
        category: "Produce / Vegetables",
        quantity: "1 bundle",
        estimatedCost: Math.round(budget * 0.14),
        notesOrAlternatives: "Can also use backyard malunggay (free) or pechay / spinach",
        targetStore: "Palengke / Local vegetable cart"
      },
      {
        name: "Cabbage or Sayote",
        category: "Produce / Vegetables",
        quantity: "1/2 head cabbage or 1 sayote",
        estimatedCost: Math.round(budget * 0.15),
        notesOrAlternatives: "Both veggies stay fresh for days without refrigeration and yield generous volume",
        targetStore: "Palengke / Talipapa"
      },
      {
        name: "Garlic, Onion, Tomato combo",
        category: "Seasoning / Aromatics",
        quantity: "Aromatics mini-pack (tingi)",
        estimatedCost: Math.round(budget * 0.08),
        notesOrAlternatives: "Buy 'tingi' (small portions) at sari-sari store if not in pantry",
        targetStore: "Sari-sari store / Palengke"
      }
    ],
    leftoverRepurposingGuide: [
      {
        leftover: "Day-old cold cooked rice",
        howToReuse: "Transform into breakfast Sinangag garlic fried rice; dry grains fry crispier than fresh hot rice."
      },
      {
        leftover: "Remaining Monggo stew (if any)",
        howToReuse: "Mash with a spoon, add a spoonful of flour, and pan-fry into savory Monggo fritters/patties."
      },
      {
        leftover: "Kangkong stalks & vegetable trimmings",
        howToReuse: "Dice finely into vegetable omelets or boil with garlic & water for a zero-cost savory broth base."
      }
    ],
    budgetSavingHacks: [
      "Buy in 'tingi' or bulk staples: Dry beans like monggo cost a fraction of canned foods and do not spoil.",
      "Pre-soak legumes: Soaking monggo for 30 minutes in water cuts boiling time and fuel cost by half.",
      "Residual heat cooking: Turn off the stove 2 minutes early for greens and eggs; steam finishes the cooking for free.",
      "Shop wet markets (palengke) late afternoon: Many vendors discount leafy greens by 20-40% before closing.",
      "Backyard & community greens: Free malunggay or camote tops (talbos ng kamote) can substitute store-bought greens."
    ]
  };
}

// Plan Generation API Endpoint
app.post('/api/generate-plan', async (req, res) => {
  try {
    const {
      budget = 200,
      currency = '₱',
      people = 3,
      householdType = 'Family with Kids',
      pantryItems = ['Rice', 'Cooking Oil', 'Salt', 'Garlic', 'Soy Sauce'],
      existingIngredients = '',
      cookingEquipment = 'Standard 1-2 burner stove',
      regionContext = 'Philippines / Local Palengke & Sari-sari stores',
      priorities = ['High Protein', 'Zero Waste', 'Save Fuel/LPG'],
      dietaryNotes = ''
    } = req.body;

    const numericBudget = Number(budget) || 200;
    const numericPeople = Number(people) || 3;

    if (!ai) {
      console.log('No GEMINI_API_KEY found, using intelligent fallback planner.');
      const fallback = generateSmartFallbackPlan({
        budget: numericBudget,
        currency,
        people: numericPeople,
        householdType,
        pantryItems,
        existingIngredients,
        cookingEquipment,
        regionContext
      });
      return res.json({ success: true, data: fallback, isFallback: true });
    }

    const prompt = `
You are an expert community culinary economist, budget nutrition advisor, and local grocery optimizer.
Create a hyper-realistic, extremely practical 1-day meal plan and grocery shopping strategy tailored to low-income households, college students, and budget-conscious families.

USER PARAMETERS:
- Strict Daily Total Budget: ${currency}${numericBudget} (MUST NOT EXCEED THIS LIMIT!)
- Household Size: ${numericPeople} people (Average budget per person per meal: ~${currency}${(numericBudget / (numericPeople * 3)).toFixed(1)})
- Household Type: ${householdType}
- Ingredients Already In Kitchen/Pantry (DO NOT BUY AGAIN): ${pantryItems.join(', ')}
- Fresh Leftovers/Existing Items to Repurpose: ${existingIngredients || 'None specified'}
- Available Cooking Equipment: ${cookingEquipment}
- Regional / Local Market Context: ${regionContext}
- Specific Priorities: ${priorities.join(', ')}
${dietaryNotes ? `- Dietary / Preference Notes: ${dietaryNotes}` : ''}

STRICT REQUIREMENTS:
1. BUDGET INTEGRITY: The sum of estimated costs in the 'groceryShoppingList' MUST be equal to or less than ${currency}${numericBudget}. Break down item costs realistically matching actual local street/wet-market (palengke / sari-sari / discount store) pricing.
2. NO EMPTY CALORIES: Every meal must deliver real nutrition (protein from eggs, tofu/tokwa, legumes, canned fish, or budget cuts; essential micronutrients from dark leafy greens; sustaining carbs).
3. ZERO FOOD WASTE: Every ingredient bought or leftover should be fully utilized across Breakfast, Lunch, and Dinner (e.g. morning rice used for sinangag, vegetable ends for broth, half cabbage in lunch and remaining in dinner).
4. EASY & FUEL-EFFICIENT: Recipes must be simple, fool-proof, and designed to save LPG gas or electricity.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are TipidKusina AI, an empathetic, practical budget chef and local palengke/grocery planner specialized in ultra-affordable, nutritious meals with zero food waste.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            totalEstimatedCost: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            budgetRemaining: { type: Type.NUMBER },
            nutritionOverview: {
              type: Type.OBJECT,
              properties: {
                proteinScore: { type: Type.STRING },
                fiberScore: { type: Type.STRING },
                calorieAdequacy: { type: Type.STRING },
                highlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["proteinScore", "fiberScore", "calorieAdequacy", "highlights"]
            },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealType: { type: Type.STRING },
                  recipeName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  prepTimeMinutes: { type: Type.NUMBER },
                  cookTimeMinutes: { type: Type.NUMBER },
                  estimatedCost: { type: Type.NUMBER },
                  costPerPerson: { type: Type.NUMBER },
                  ingredientsNeeded: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        quantity: { type: Type.STRING },
                        estimatedPrice: { type: Type.NUMBER },
                        isPantry: { type: Type.BOOLEAN }
                      },
                      required: ["name", "quantity", "estimatedPrice", "isPantry"]
                    }
                  },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  zeroWasteTip: { type: Type.STRING },
                  fuelSaverTip: { type: Type.STRING }
                },
                required: [
                  "mealType",
                  "recipeName",
                  "description",
                  "prepTimeMinutes",
                  "cookTimeMinutes",
                  "estimatedCost",
                  "costPerPerson",
                  "ingredientsNeeded",
                  "steps",
                  "zeroWasteTip",
                  "fuelSaverTip"
                ]
              }
            },
            groceryShoppingList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER },
                  notesOrAlternatives: { type: Type.STRING },
                  targetStore: { type: Type.STRING }
                },
                required: ["name", "category", "quantity", "estimatedCost", "notesOrAlternatives", "targetStore"]
              }
            },
            leftoverRepurposingGuide: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  leftover: { type: Type.STRING },
                  howToReuse: { type: Type.STRING }
                },
                required: ["leftover", "howToReuse"]
              }
            },
            budgetSavingHacks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "summary",
            "totalEstimatedCost",
            "currency",
            "budgetRemaining",
            "nutritionOverview",
            "meals",
            "groceryShoppingList",
            "leftoverRepurposingGuide",
            "budgetSavingHacks"
          ]
        }
      }
    });

    if (!response.text) {
      throw new Error('Empty response from Gemini');
    }

    const parsedData = JSON.parse(response.text);
    return res.json({ success: true, data: parsedData, isFallback: false });
  } catch (error) {
    console.error('Error generating plan with Gemini:', error);
    // Return graceful fallback
    const fallback = generateSmartFallbackPlan({
      budget: Number(req.body?.budget) || 200,
      currency: req.body?.currency || '₱',
      people: Number(req.body?.people) || 3,
      householdType: req.body?.householdType || 'Family with Kids',
      pantryItems: req.body?.pantryItems || ['Rice', 'Cooking Oil', 'Salt', 'Garlic'],
      existingIngredients: req.body?.existingIngredients || '',
      cookingEquipment: req.body?.cookingEquipment || 'Standard stove',
      regionContext: req.body?.regionContext || 'Philippines / Local Palengke'
    });
    return res.json({ success: true, data: fallback, isFallback: true, warning: 'Generated using local smart budget algorithm due to service connectivity.' });
  }
});

// Production / Dev Vite static file handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TipidKusina server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
