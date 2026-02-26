import catRice from "@/assets/cat-rice.jpg";
import catPulses from "@/assets/cat-pulses.jpg";
import catGrains from "@/assets/cat-grains.jpg";
import catBeans from "@/assets/cat-beans.jpg";
import catOil from "@/assets/cat-oil.jpg";
import catVeggies from "@/assets/cat-veggies.jpg";
import catPaper from "@/assets/cat-paper.jpg";
import catChemicals from "@/assets/cat-chemicals.jpg";
import catScrap from "@/assets/cat-scrap.jpg";

import prodBasmati from "@/assets/prod-basmati.jpg";
import prodJasmine from "@/assets/prod-jasmine-rice.jpg";
import prodBrownRice from "@/assets/prod-brown-rice.jpg";
import prodLentils from "@/assets/prod-lentils.jpg";
import prodWheat from "@/assets/prod-wheat.jpg";
import prodCorn from "@/assets/prod-corn.jpg";
import prodDal from "@/assets/prod-dal.jpg";
import prodKidneyBeans from "@/assets/prod-kidney-beans.jpg";
import prodSunflowerOil from "@/assets/prod-sunflower-oil.jpg";
import prodCoconutOil from "@/assets/prod-coconut-oil.jpg";
import prodFruits from "@/assets/prod-fruits.jpg";
import prodOnion from "@/assets/prod-onion.jpg";
import prodPaper from "@/assets/prod-paper.jpg";
import prodChemicals from "@/assets/prod-chemicals.jpg";
import prodScrapMetal from "@/assets/prod-scrap-metal.jpg";
import prodSpices from "@/assets/prod-spices.jpg";

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  origin: string;
  description: string;
  image: string;
  port: string;
  seasonal?: boolean;
  availability?: string;
}

export const categories: Category[] = [
  { id: "rice", name: "Rice", image: catRice, description: "Premium Basmati & Non-Basmati varieties" },
  { id: "pulses", name: "Pulses", image: catPulses, description: "Lentils, chickpeas & more" },
  { id: "grains", name: "Grains", image: catGrains, description: "Wheat, corn, millet & sorghum" },
  { id: "dal", name: "Dal", image: prodDal, description: "Split lentils & traditional dals" },
  { id: "beans", name: "Beans", image: catBeans, description: "Kidney, black, soy & white beans" },
  { id: "oil", name: "Edible Oils", image: catOil, description: "Sunflower, soybean, palm & coconut oils" },
  { id: "vegetables", name: "Vegetables & Fruits", image: catVeggies, description: "Fresh produce for global markets" },
  { id: "paper", name: "Paper Products", image: catPaper, description: "A4 paper, tissue & packaging" },
  { id: "chemicals", name: "Chemicals", image: catChemicals, description: "Industrial & agricultural chemicals" },
  { id: "scrap", name: "Scrap Materials", image: catScrap, description: "Metal & industrial scrap" },
  { id: "seasonal", name: "Seasonal Commodities", image: prodSpices, description: "Seasonal agricultural products" },
];

export const allProducts: Product[] = [
  // Rice (12 varieties) - using different images
  { id: "basmati-1121", name: "1121 Basmati Rice", category: "rice", origin: "India", description: "Extra-long grain premium basmati, aged 2 years for superior aroma.", image: prodBasmati, port: "Mundra Port" },
  { id: "basmati-pusa", name: "Pusa Basmati Rice", category: "rice", origin: "India", description: "Medium-grain aromatic rice ideal for biryani and pilaf.", image: prodBasmati, port: "JNPT Mumbai" },
  { id: "basmati-traditional", name: "Traditional Basmati", category: "rice", origin: "India", description: "Classic aged basmati with delicate flavor.", image: catRice, port: "Mundra Port" },
  { id: "sella-basmati", name: "Sella Basmati Rice", category: "rice", origin: "India", description: "Parboiled basmati, golden hue, non-sticky.", image: prodBasmati, port: "Kandla Port" },
  { id: "ir64-rice", name: "IR 64 Non-Basmati", category: "rice", origin: "India", description: "Medium-grain rice ideal for everyday consumption.", image: catRice, port: "Kakinada Port" },
  { id: "broken-rice", name: "Broken Rice", category: "rice", origin: "Vietnam", description: "100% broken rice suitable for flour and animal feed.", image: catRice, port: "Ho Chi Minh Port" },
  { id: "jasmine-rice", name: "Jasmine Rice", category: "rice", origin: "Thailand", description: "Fragrant long-grain Thai jasmine rice.", image: prodJasmine, port: "Bangkok Port" },
  { id: "parboiled-rice", name: "Parboiled Rice", category: "rice", origin: "India", description: "Nutrient-rich parboiled rice with firm texture.", image: catRice, port: "Chennai Port" },
  { id: "sticky-rice", name: "Glutinous Rice", category: "rice", origin: "Thailand", description: "Sticky rice for desserts and Asian cuisine.", image: prodJasmine, port: "Bangkok Port" },
  { id: "brown-rice", name: "Brown Rice", category: "rice", origin: "India", description: "Whole grain brown rice, high in fiber and nutrients.", image: prodBrownRice, port: "Mundra Port" },
  { id: "sona-masoori", name: "Sona Masoori Rice", category: "rice", origin: "India", description: "Lightweight and aromatic, popular in South Indian cuisine.", image: catRice, port: "Kakinada Port" },
  { id: "ponni-rice", name: "Ponni Rice", category: "rice", origin: "India", description: "Premium South Indian variety with rich taste.", image: prodBrownRice, port: "Tuticorin Port" },

  // Pulses (10 varieties)
  { id: "red-lentils", name: "Red Lentils (Masoor)", category: "pulses", origin: "Turkey", description: "Split red lentils, quick-cooking and nutritious.", image: prodLentils, port: "Mersin Port" },
  { id: "green-lentils", name: "Green Lentils", category: "pulses", origin: "Canada", description: "Whole green lentils, firm texture ideal for salads.", image: prodLentils, port: "Vancouver Port" },
  { id: "chickpeas", name: "Kabuli Chickpeas", category: "pulses", origin: "India", description: "Large white chickpeas, premium quality for hummus.", image: catPulses, port: "Mundra Port" },
  { id: "desi-chickpeas", name: "Desi Chickpeas", category: "pulses", origin: "India", description: "Small dark chickpeas with robust, earthy flavor.", image: catPulses, port: "Kandla Port" },
  { id: "yellow-peas", name: "Yellow Peas", category: "pulses", origin: "Canada", description: "Dried yellow peas for soups and dals.", image: prodLentils, port: "Montreal Port" },
  { id: "green-peas", name: "Green Peas", category: "pulses", origin: "India", description: "Whole dried green peas, versatile and nutritious.", image: catPulses, port: "JNPT Mumbai" },
  { id: "pigeon-peas", name: "Pigeon Peas (Toor)", category: "pulses", origin: "Myanmar", description: "Unpolished pigeon peas for traditional dals.", image: prodLentils, port: "Yangon Port" },
  { id: "black-eyed-peas", name: "Black Eyed Peas", category: "pulses", origin: "Nigeria", description: "Cream-colored beans with distinctive black eye.", image: catPulses, port: "Lagos Port" },
  { id: "moth-beans", name: "Moth Beans", category: "pulses", origin: "India", description: "Small brown beans, drought-resistant crop.", image: catPulses, port: "Mundra Port" },
  { id: "urad-dal", name: "Urad Dal (Black Gram)", category: "pulses", origin: "India", description: "Split black gram for dals and South Indian dishes.", image: prodLentils, port: "Chennai Port" },

  // Grains (10 varieties)
  { id: "wheat-mp", name: "MP Wheat", category: "grains", origin: "India", description: "Premium Madhya Pradesh wheat, high protein content.", image: prodWheat, port: "Mundra Port" },
  { id: "wheat-durum", name: "Durum Wheat", category: "grains", origin: "Turkey", description: "Hard wheat variety ideal for pasta production.", image: prodWheat, port: "Mersin Port" },
  { id: "corn-yellow", name: "Yellow Corn", category: "grains", origin: "Brazil", description: "Non-GMO yellow corn for feed and food processing.", image: prodCorn, port: "Santos Port" },
  { id: "corn-white", name: "White Corn", category: "grains", origin: "South Africa", description: "Premium white maize for human consumption.", image: prodCorn, port: "Durban Port" },
  { id: "millet-pearl", name: "Pearl Millet (Bajra)", category: "grains", origin: "India", description: "Nutrient-dense millet, gluten-free superfood.", image: catGrains, port: "Kandla Port" },
  { id: "millet-finger", name: "Finger Millet (Ragi)", category: "grains", origin: "India", description: "High-calcium millet for health food products.", image: catGrains, port: "Chennai Port" },
  { id: "sorghum", name: "Sorghum (Jowar)", category: "grains", origin: "India", description: "Gluten-free grain for flour and animal feed.", image: catGrains, port: "Mundra Port" },
  { id: "barley", name: "Barley", category: "grains", origin: "Australia", description: "Feed and malting barley, high quality.", image: prodWheat, port: "Adelaide Port" },
  { id: "oats", name: "Oats", category: "grains", origin: "Canada", description: "Rolled and steel-cut oats for food processing.", image: catGrains, port: "Vancouver Port" },
  { id: "quinoa", name: "Quinoa", category: "grains", origin: "Peru", description: "Organic white quinoa, complete protein source.", image: catGrains, port: "Callao Port" },

  // Dal (10 varieties)
  { id: "chana-dal", name: "Chana Dal", category: "dal", origin: "India", description: "Split Bengal gram, staple in Indian cuisine.", image: prodDal, port: "Mundra Port" },
  { id: "toor-dal", name: "Toor Dal", category: "dal", origin: "India", description: "Split pigeon peas, most popular dal variety.", image: prodDal, port: "JNPT Mumbai" },
  { id: "moong-dal", name: "Moong Dal", category: "dal", origin: "India", description: "Split green gram, easy to digest and nutritious.", image: prodLentils, port: "Mundra Port" },
  { id: "masoor-dal", name: "Masoor Dal", category: "dal", origin: "India", description: "Split red lentils, quick-cooking staple.", image: prodLentils, port: "Kolkata Port" },
  { id: "urad-dal-split", name: "Urad Dal (Split)", category: "dal", origin: "India", description: "Split black gram for idli batter and dals.", image: prodDal, port: "Chennai Port" },
  { id: "moong-dal-yellow", name: "Yellow Moong Dal", category: "dal", origin: "India", description: "Husked and split moong for light dals.", image: prodDal, port: "Mundra Port" },
  { id: "arhar-dal", name: "Arhar Dal", category: "dal", origin: "Myanmar", description: "Premium quality pigeon pea splits.", image: prodLentils, port: "Yangon Port" },
  { id: "kulthi-dal", name: "Kulthi Dal (Horse Gram)", category: "dal", origin: "India", description: "Traditional horse gram, rich in protein.", image: prodDal, port: "Mundra Port" },
  { id: "mix-dal", name: "Mixed Dal", category: "dal", origin: "India", description: "Premium blend of five different dals.", image: prodDal, port: "JNPT Mumbai" },
  { id: "rajma-dal", name: "Rajma (Kidney Beans)", category: "dal", origin: "India", description: "Large red kidney beans from Kashmir.", image: prodKidneyBeans, port: "Mundra Port" },

  // Beans (10 varieties)
  { id: "kidney-beans", name: "Red Kidney Beans", category: "beans", origin: "India", description: "Large dark red kidney beans, premium quality.", image: prodKidneyBeans, port: "Mundra Port" },
  { id: "black-beans", name: "Black Beans", category: "beans", origin: "Brazil", description: "Dried black turtle beans for Latin American cuisine.", image: catBeans, port: "Santos Port" },
  { id: "soy-beans", name: "Soybeans", category: "beans", origin: "Brazil", description: "Non-GMO soybeans for oil extraction and food.", image: catBeans, port: "Paranagua Port" },
  { id: "navy-beans", name: "Navy Beans", category: "beans", origin: "USA", description: "Small white beans ideal for baked beans.", image: prodKidneyBeans, port: "New Orleans Port" },
  { id: "pinto-beans", name: "Pinto Beans", category: "beans", origin: "USA", description: "Speckled beans popular in Mexican cuisine.", image: catBeans, port: "Houston Port" },
  { id: "lima-beans", name: "Lima Beans", category: "beans", origin: "Peru", description: "Large butter beans, creamy texture.", image: prodKidneyBeans, port: "Callao Port" },
  { id: "mung-beans", name: "Mung Beans", category: "beans", origin: "India", description: "Whole green mung beans for sprouting.", image: catBeans, port: "JNPT Mumbai" },
  { id: "fava-beans", name: "Fava Beans", category: "beans", origin: "Egypt", description: "Large broad beans, staple in Middle Eastern cuisine.", image: catBeans, port: "Alexandria Port" },
  { id: "adzuki-beans", name: "Adzuki Beans", category: "beans", origin: "China", description: "Small red beans for Asian desserts and pastries.", image: prodKidneyBeans, port: "Shanghai Port" },
  { id: "white-beans", name: "White Kidney Beans", category: "beans", origin: "Argentina", description: "Cannellini beans, mild flavor, versatile.", image: catBeans, port: "Buenos Aires Port" },

  // Edible Oils (10 varieties)
  { id: "sunflower-oil", name: "Sunflower Oil", category: "oil", origin: "Ukraine", description: "Refined sunflower oil, high oleic acid.", image: prodSunflowerOil, port: "Odessa Port" },
  { id: "soybean-oil", name: "Soybean Oil", category: "oil", origin: "Brazil", description: "Crude and refined soybean oil for cooking.", image: catOil, port: "Santos Port" },
  { id: "palm-oil", name: "Palm Oil (RBD)", category: "oil", origin: "Malaysia", description: "Refined, bleached, deodorized palm oil.", image: catOil, port: "Port Klang" },
  { id: "coconut-oil", name: "Coconut Oil", category: "oil", origin: "Philippines", description: "Virgin and refined coconut oil, organic.", image: prodCoconutOil, port: "Manila Port" },
  { id: "olive-oil", name: "Olive Oil", category: "oil", origin: "Spain", description: "Extra virgin olive oil, cold-pressed.", image: prodSunflowerOil, port: "Valencia Port" },
  { id: "canola-oil", name: "Canola Oil", category: "oil", origin: "Canada", description: "Low erucic acid rapeseed oil for cooking.", image: catOil, port: "Vancouver Port" },
  { id: "mustard-oil", name: "Mustard Oil", category: "oil", origin: "India", description: "Cold-pressed mustard oil, pungent flavor.", image: catOil, port: "Kolkata Port" },
  { id: "groundnut-oil", name: "Groundnut Oil", category: "oil", origin: "India", description: "Cold-pressed peanut oil for deep frying.", image: prodSunflowerOil, port: "JNPT Mumbai" },
  { id: "sesame-oil", name: "Sesame Oil", category: "oil", origin: "India", description: "Premium sesame oil for cooking and flavoring.", image: catOil, port: "Chennai Port" },
  { id: "rice-bran-oil", name: "Rice Bran Oil", category: "oil", origin: "India", description: "Heart-healthy oil extracted from rice bran.", image: prodCoconutOil, port: "Kakinada Port" },

  // Vegetables & Fruits (10 varieties)
  { id: "banana", name: "Fresh Banana", category: "vegetables", origin: "Ecuador", description: "Cavendish bananas, export-grade quality.", image: prodFruits, port: "Guayaquil Port", seasonal: true, availability: "Year-round" },
  { id: "onion-red", name: "Red Onion", category: "vegetables", origin: "India", description: "Fresh red onions, carefully selected for export.", image: prodOnion, port: "JNPT Mumbai", seasonal: true, availability: "Oct-Apr" },
  { id: "potato", name: "Fresh Potato", category: "vegetables", origin: "India", description: "Farm-fresh potatoes, multiple varieties available.", image: prodOnion, port: "Mundra Port", seasonal: true, availability: "Year-round" },
  { id: "mango-alphonso", name: "Alphonso Mango", category: "vegetables", origin: "India", description: "King of mangoes, sweet and aromatic.", image: prodFruits, port: "JNPT Mumbai", seasonal: true, availability: "Apr-Jun" },
  { id: "ginger", name: "Fresh Ginger", category: "vegetables", origin: "India", description: "Premium quality ginger root for export.", image: catVeggies, port: "Cochin Port", availability: "Year-round" },
  { id: "garlic", name: "Fresh Garlic", category: "vegetables", origin: "China", description: "White garlic, large bulb size, premium quality.", image: catVeggies, port: "Qingdao Port", availability: "Year-round" },
  { id: "turmeric", name: "Turmeric", category: "vegetables", origin: "India", description: "High curcumin content turmeric fingers.", image: prodSpices, port: "Tuticorin Port", availability: "Year-round" },
  { id: "green-chilli", name: "Green Chilli", category: "vegetables", origin: "India", description: "Fresh green chillies, various heat levels.", image: catVeggies, port: "JNPT Mumbai", seasonal: true, availability: "Year-round" },
  { id: "pomegranate", name: "Pomegranate", category: "vegetables", origin: "India", description: "Bhagwa variety, deep red arils, sweet.", image: prodFruits, port: "JNPT Mumbai", seasonal: true, availability: "Sep-Feb" },
  { id: "grapes", name: "Thompson Grapes", category: "vegetables", origin: "India", description: "Seedless green grapes, export-certified.", image: prodFruits, port: "JNPT Mumbai", seasonal: true, availability: "Jan-Apr" },

  // Paper Products (10 varieties)
  { id: "a4-paper-80", name: "A4 Copy Paper 80gsm", category: "paper", origin: "Indonesia", description: "Premium white A4 paper, 500 sheets/ream.", image: prodPaper, port: "Jakarta Port" },
  { id: "a4-paper-70", name: "A4 Copy Paper 70gsm", category: "paper", origin: "Indonesia", description: "Standard weight A4 paper for everyday use.", image: catPaper, port: "Jakarta Port" },
  { id: "a3-paper", name: "A3 Copy Paper", category: "paper", origin: "Thailand", description: "Large format A3 paper, 80gsm.", image: prodPaper, port: "Bangkok Port" },
  { id: "tissue-paper", name: "Facial Tissue Paper", category: "paper", origin: "China", description: "Soft 2-ply facial tissue, multiple pack sizes.", image: catPaper, port: "Shanghai Port" },
  { id: "kraft-paper", name: "Kraft Paper", category: "paper", origin: "India", description: "Brown kraft paper for packaging, various GSM.", image: prodPaper, port: "JNPT Mumbai" },
  { id: "duplex-board", name: "Duplex Board", category: "paper", origin: "India", description: "Grey back duplex board for box manufacturing.", image: catPaper, port: "Mundra Port" },
  { id: "newsprint", name: "Newsprint Paper", category: "paper", origin: "Russia", description: "Standard newsprint for newspaper printing.", image: prodPaper, port: "St Petersburg Port" },
  { id: "thermal-paper", name: "Thermal Paper Rolls", category: "paper", origin: "China", description: "POS thermal paper rolls, BPA-free.", image: catPaper, port: "Shenzhen Port" },
  { id: "corrugated-rolls", name: "Corrugated Paper Rolls", category: "paper", origin: "India", description: "Fluting and liner paper for corrugation.", image: prodPaper, port: "Mundra Port" },
  { id: "tissue-jumbo", name: "Jumbo Tissue Rolls", category: "paper", origin: "Turkey", description: "Parent tissue rolls for converting.", image: catPaper, port: "Mersin Port" },

  // Chemicals (10 varieties)
  { id: "calcium-chloride", name: "Calcium Chloride", category: "chemicals", origin: "China", description: "Industrial-grade CaCl2 for de-icing and dust control.", image: prodChemicals, port: "Shanghai Port" },
  { id: "caustic-soda", name: "Caustic Soda (NaOH)", category: "chemicals", origin: "India", description: "Flakes and pearls for industrial applications.", image: catChemicals, port: "Kandla Port" },
  { id: "soda-ash", name: "Soda Ash", category: "chemicals", origin: "Turkey", description: "Dense and light soda ash for glass manufacturing.", image: prodChemicals, port: "Mersin Port" },
  { id: "citric-acid", name: "Citric Acid", category: "chemicals", origin: "China", description: "Food-grade citric acid, monohydrate and anhydrous.", image: catChemicals, port: "Qingdao Port" },
  { id: "sodium-bicarbonate", name: "Sodium Bicarbonate", category: "chemicals", origin: "China", description: "Food and pharma grade baking soda.", image: prodChemicals, port: "Tianjin Port" },
  { id: "calcium-carbonate", name: "Calcium Carbonate", category: "chemicals", origin: "Vietnam", description: "Ground and precipitated CaCO3 for industry.", image: catChemicals, port: "Haiphong Port" },
  { id: "zinc-oxide", name: "Zinc Oxide", category: "chemicals", origin: "India", description: "White powder for rubber and ceramic industries.", image: prodChemicals, port: "JNPT Mumbai" },
  { id: "titanium-dioxide", name: "Titanium Dioxide", category: "chemicals", origin: "China", description: "Rutile and anatase TiO2 for paints and coatings.", image: catChemicals, port: "Shanghai Port" },
  { id: "stearic-acid", name: "Stearic Acid", category: "chemicals", origin: "Malaysia", description: "Triple-pressed stearic acid for cosmetics and rubber.", image: prodChemicals, port: "Port Klang" },
  { id: "sulphur", name: "Sulphur Granules", category: "chemicals", origin: "UAE", description: "Bright yellow granular sulphur for fertilizers.", image: catChemicals, port: "Jebel Ali Port" },

  // Scrap Materials (10 varieties)
  { id: "hms-1-2", name: "HMS 1&2 (80:20)", category: "scrap", origin: "USA", description: "Heavy melting steel scrap, ISRI 200-206.", image: prodScrapMetal, port: "Houston Port" },
  { id: "used-rails", name: "Used Rails (R50-R65)", category: "scrap", origin: "Europe", description: "Used railway rails for re-melting.", image: catScrap, port: "Rotterdam Port" },
  { id: "copper-scrap", name: "Copper Wire Scrap", category: "scrap", origin: "UK", description: "Millberry copper wire scrap, 99.9% purity.", image: prodScrapMetal, port: "Felixstowe Port" },
  { id: "aluminum-scrap", name: "Aluminum Scrap (UBC)", category: "scrap", origin: "USA", description: "Used beverage cans, clean and baled.", image: catScrap, port: "Los Angeles Port" },
  { id: "pet-bottle-scrap", name: "PET Bottle Scrap", category: "scrap", origin: "Japan", description: "Clean PET bottle bales for recycling.", image: catScrap, port: "Yokohama Port" },
  { id: "occ-scrap", name: "OCC (Cardboard Scrap)", category: "scrap", origin: "Europe", description: "Old corrugated cardboard for paper recycling.", image: prodScrapMetal, port: "Hamburg Port" },
  { id: "tire-scrap", name: "Tire Scrap", category: "scrap", origin: "UAE", description: "Shredded and whole tire scrap for recycling.", image: catScrap, port: "Jebel Ali Port" },
  { id: "battery-scrap", name: "Lead Acid Battery Scrap", category: "scrap", origin: "India", description: "Drained lead acid batteries for lead recovery.", image: prodScrapMetal, port: "Mundra Port" },
  { id: "steel-plate", name: "Steel Plate Scrap", category: "scrap", origin: "South Korea", description: "Cut steel plate scrap, ideal for re-rolling.", image: catScrap, port: "Busan Port" },
  { id: "brass-scrap", name: "Brass Scrap (Honey)", category: "scrap", origin: "UAE", description: "Brass honey scrap for foundry use.", image: prodScrapMetal, port: "Jebel Ali Port" },

  // Seasonal Commodities (10 varieties)
  { id: "jaggery", name: "Organic Jaggery", category: "seasonal", origin: "India", description: "Traditional unrefined cane sugar blocks.", image: prodSpices, port: "Mundra Port", seasonal: true, availability: "Dec-Apr" },
  { id: "dry-dates", name: "Dry Dates (Chuara)", category: "seasonal", origin: "India", description: "Sun-dried dates, Rajasthan origin.", image: prodFruits, port: "Mundra Port", seasonal: true, availability: "Mar-Jun" },
  { id: "cashew-raw", name: "Raw Cashew Nuts", category: "seasonal", origin: "Tanzania", description: "In-shell raw cashew for processing.", image: prodSpices, port: "Dar es Salaam Port", seasonal: true, availability: "Oct-Feb" },
  { id: "cardamom", name: "Green Cardamom", category: "seasonal", origin: "Guatemala", description: "Bold green cardamom pods, intense aroma.", image: prodSpices, port: "Puerto Barrios", seasonal: true, availability: "Sep-Jan" },
  { id: "cloves", name: "Whole Cloves", category: "seasonal", origin: "Madagascar", description: "Aromatic clove buds for spice trade.", image: prodSpices, port: "Toamasina Port", seasonal: true, availability: "Aug-Dec" },
  { id: "cinnamon", name: "Ceylon Cinnamon Sticks", category: "seasonal", origin: "Sri Lanka", description: "True cinnamon, delicate and sweet.", image: prodSpices, port: "Colombo Port", seasonal: true, availability: "Year-round" },
  { id: "black-pepper", name: "Black Pepper", category: "seasonal", origin: "Vietnam", description: "Bold 500g/l black pepper, FAQ grade.", image: prodSpices, port: "Ho Chi Minh Port", seasonal: true, availability: "Feb-Jun" },
  { id: "cumin-seeds", name: "Cumin Seeds", category: "seasonal", origin: "India", description: "Singapore/Europe quality cumin seeds.", image: prodSpices, port: "Mundra Port", seasonal: true, availability: "Mar-Jul" },
  { id: "sesame-seeds", name: "Sesame Seeds", category: "seasonal", origin: "India", description: "Hulled and natural white sesame seeds.", image: catGrains, port: "Kandla Port", seasonal: true, availability: "Year-round" },
  { id: "peanuts", name: "Blanched Peanuts", category: "seasonal", origin: "India", description: "Java and bold blanched peanuts, sorted.", image: prodSpices, port: "JNPT Mumbai", seasonal: true, availability: "Oct-Mar" },
];

// Keep backward compatibility
export const featuredProducts = allProducts.slice(0, 6);
