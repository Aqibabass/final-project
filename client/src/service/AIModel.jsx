import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};


export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget, 
                  Give me a Hotels options list with HotelName, Hotel address, Rupees, hotel image url, geo coordinates, 
                  rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, 
                  ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"tripDetails\": {\n    \"location\": \"Las Vegas, Nevada, USA\",\n    \"duration\": \"3 Days\",\n    \"budget\": \"₹30,000-45,000 (excluding flights)\",\n    \"travelers\": \"Couple\"\n  },\n  \"hotelOptions\": [\n    {\n      \"hotelName\": \"Circus Circus Hotel & Casino\",\n      \"hotelAddress\": \"2880 S Las Vegas Blvd, Las Vegas, NV 89109, USA\",\n      \"price\": \"₹3500-4500\",\n      \"hotelImageUrl\": \"https://www.vegas.com/wp-content/uploads/2017/02/circus-circus-hotel-las-vegas-pool-478x270.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.1360,\n        \"longitude\": -115.1657\n      },\n      \"rating\": 3.5,\n      \"description\": \"Affordable option on the Strip with a circus theme, free circus acts, and a large casino. Rooms are basic but clean.  Good for families and budget travelers.\"\n    },\n    {\n      \"hotelName\": \"Excalibur Hotel & Casino\",\n      \"hotelAddress\": \"3850 S Las Vegas Blvd, Las Vegas, NV 89109, USA\",\n      \"price\": \"₹4500-5500\",\n      \"hotelImageUrl\": \"https://www.vegas.com/wp-content/uploads/2017/02/excalibur-hotel-las-vegas-exterior-478x270.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.0984,\n        \"longitude\": -115.1743\n      },\n      \"rating\": 4.0,\n      \"description\": \"Medieval-themed hotel with budget-friendly rooms, a variety of restaurants, and a lively casino. Conveniently located on the south end of the Strip.\"\n    },\n    {\n      \"hotelName\": \"Luxor Hotel & Casino\",\n      \"hotelAddress\": \"3900 S Las Vegas Blvd, Las Vegas, NV 89119, USA\",\n      \"price\": \"₹5000-6000\",\n      \"hotelImageUrl\": \"https://www.vegas.com/wp-content/uploads/2017/02/luxor-hotel-las-vegas-exterior-478x270.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.0956,\n        \"longitude\": -115.1762\n      },\n      \"rating\": 4.2,\n      \"description\": \"Iconic pyramid-shaped hotel with unique rooms, a large casino, and various entertainment options.  Slightly more expensive but still relatively affordable.\"\n    }\n  ],\n  \"itinerary\": {\n    \"day1\": {\n      \"theme\": \"Exploring the Strip & Free Attractions\",\n      \"bestTimeToVisit\": \"Late Afternoon/Evening\",\n      \"places\": [\n        {\n          \"placeName\": \"Welcome to Las Vegas Sign\",\n          \"placeDetails\": \"Iconic sign for a photo opportunity. It's free to visit and a must-do for any Vegas trip.\",\n          \"placeImageUrl\": \"https://www.lasvegas.com/wp-content/uploads/2023/09/welcome-to-las-vegas-sign-2.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.0455,\n            \"longitude\": -115.1722\n          },\n          \"ticketPricing\": \"₹0\",\n          \"rating\": 4.5,\n          \"timeTravel\": \"30 minutes\"\n        },\n        {\n          \"placeName\": \"Bellagio Conservatory & Botanical Garden\",\n          \"placeDetails\": \"Stunning seasonal floral displays inside the Bellagio. Free to enter.\",\n          \"placeImageUrl\": \"https://www.bellagio.com/content/dam/MGM/bellagio/entertainment/conservatory/bellagio-conservatory-chinese-new-year-2024-720x405.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1127,\n            \"longitude\": -115.1763\n          },\n          \"ticketPricing\": \"₹0\",\n          \"rating\": 4.8,\n          \"timeTravel\": \"1.5 hours\"\n        },\n        {\n          \"placeName\": \"Bellagio Fountains\",\n          \"placeDetails\": \"Spectacular water show choreographed to music and lights, in front of the Bellagio. Free to watch. Shows every 30 minutes in the afternoon and every 15 minutes in the evening.\",\n          \"placeImageUrl\": \"https://www.vegas.com/wp-content/uploads/2017/02/bellagio-fountains-las-vegas-478x270.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1126,\n            \"longitude\": -115.1743\n          },\n          \"ticketPricing\": \"₹0\",\n          \"rating\": 4.9,\n          \"timeTravel\": \"1 hour\"\n        }\n      ]\n    },\n    \"day2\": {\n      \"theme\": \"Downtown Vegas & Budget Entertainment\",\n      \"bestTimeToVisit\": \"Afternoon/Evening\",\n      \"places\": [\n        {\n          \"placeName\": \"Fremont Street Experience\",\n          \"placeDetails\": \"A pedestrian mall with a giant LED canopy displaying light shows, free concerts, and street performers. Located in Downtown Las Vegas (Old Vegas).\",\n          \"placeImageUrl\": \"https://www.vegas.com/wp-content/uploads/2017/02/fremont-street-experience-las-vegas-478x270.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1703,\n            \"longitude\": -115.1420\n          },\n          \"ticketPricing\": \"₹0\",\n          \"rating\": 4.7,\n          \"timeTravel\": \"3-4 hours\"\n        },\n        {\n          \"placeName\": \"Downtown Container Park\",\n          \"placeDetails\": \"An open-air shopping center built from shipping containers, with restaurants, boutiques, and a playground. Free to enter (charges for some activities).\",\n          \"placeImageUrl\": \"https://downtowncontainerpark.com/wp-content/uploads/2018/03/about.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1704,\n            \"longitude\": -115.1390\n          },\n          \"ticketPricing\": \"₹0\",\n          \"rating\": 4.3,\n          \"timeTravel\": \"1.5 hours\"\n        }\n      ]\n    },\n    \"day3\": {\n      \"theme\": \"Nature & Relaxation (with a Vegas Twist)\",\n      \"bestTimeToVisit\": \"Morning/Afternoon\",\n      \"places\": [\n        {\n          \"placeName\": \"Hoover Dam\",\n          \"placeDetails\": \"A marvel of engineering, offering stunning views of Lake Mead. Requires a car or tour bus to reach.  Consider a self-guided tour to save money.\",\n          \"placeImageUrl\": \"https://www.usbr.gov/lc/hooverdam/images/31May2023_HooverDam_001.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.0162,\n            \"longitude\": -114.7372\n          },\n          \"ticketPricing\": \"₹1200-1500\",\n          \"rating\": 4.7,\n          \"timeTravel\": \"5 hours\"\n        },\n        {\n          \"placeName\": \"Lake Mead National Recreation Area\",\n          \"placeDetails\": \"A large lake formed by the Hoover Dam, offering opportunities for boating, swimming, and hiking. Entrance fee required. Pack your own snacks and drinks to save money.\",\n          \"placeImageUrl\": \"https://www.nps.gov/lake/planyourvisit/images/20210823_145507.jpg?maxwidth=1300&maxheight=1300&autorotate=false\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.2397,\n            \"longitude\": -114.4815\n          },\n          \"ticketPricing\": \"₹1000-1200\",\n          \"rating\": 4.5,\n          \"timeTravel\": \"2-3 hours\"\n        }\n      ]\n    }\n  }\n}\n```"},
      ],
    }
  ]
});
