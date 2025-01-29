import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
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
                  Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, 
                  rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, 
                  ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `Okay, here's a JSON format travel plan for a couple on a budget in Las Vegas for 3 days, including hotel options and a daily itinerary.\n\n
                  \`\`\`json
                  {
                    "tripDetails": {
                      "location": "Las Vegas",
                      "duration": "3 Days",
                      "budget": "Cheap",
                      "travelers": "Couple"
                    },
                    "hotelOptions": [
                      {
                        "hotelName": "Circus Circus Hotel & Casino",
                        "hotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109",
                        "price": "$50 - $100 per night",
                        "hotelImageUrl": "https://example.com/circus_circus.jpg",
                        "geoCoordinates": {
                          "latitude": 36.1446,
                          "longitude": -115.1681
                        },
                        "rating": 3.5,
                        "description": "A classic Vegas experience with a circus theme, affordable rooms, and family-friendly attractions. Good for budget travelers, but maybe not the most luxurious."
                      },
                      {
                        "hotelName": "Excalibur Hotel & Casino",
                        "hotelAddress": "3850 S Las Vegas Blvd, Las Vegas, NV 89109",
                        "price": "$60 - $120 per night",
                        "hotelImageUrl": "https://example.com/excalibur_hotel.jpg",
                        "geoCoordinates": {
                          "latitude": 36.0981,
                          "longitude": -115.1721
                        },
                        "rating": 3.8,
                        "description": "Medieval-themed hotel offering affordable rooms and a range of entertainment options, located at the south end of the Strip."
                      },
                      {
                        "hotelName": "Strat Hotel, Casino & SkyPod",
                        "hotelAddress": "2000 S Las Vegas Blvd, Las Vegas, NV 89104",
                        "price": "$40 - $90 per night",
                        "hotelImageUrl": "https://example.com/strat_hotel.jpg",
                        "geoCoordinates": {
                          "latitude": 36.1533,
                          "longitude": -115.1557
                        },
                        "rating": 3.9,
                        "description": "Located off the Strip, offering value and amazing city views from the SkyPod. Rooms are simple but functional."
                      },
                      {
                        "hotelName": "OYO Hotel and Casino Las Vegas",
                        "hotelAddress": "115 E Tropicana Ave, Las Vegas, NV 89109",
                        "price": "$35 - $80 per night",
                        "hotelImageUrl": "https://example.com/oyo_hotel.jpg",
                        "geoCoordinates": {
                          "latitude": 36.0984,
                          "longitude": -115.1698
                        },
                        "rating": 3.2,
                        "description": "A budget-friendly option located close to the Strip. Basic rooms and amenities, suitable for travelers focused on saving money."
                      }
                    ],
                    "itinerary": {
                      "day1": {
                        "theme": "Exploring the South Strip and Free Attractions",
                        "bestTimeToVisit": "Morning and Evening for cooler temperatures",
                        "places": [
                          {
                            "placeName": "Welcome to Fabulous Las Vegas Sign",
                            "placeDetails": "Iconic sign for photos. Free to visit, Located at the South end of Las Vegas Strip",
                            "placeImageUrl": "https://example.com/welcome_sign.jpg",
                            "geoCoordinates": {
                              "latitude": 36.0853,
                              "longitude": -115.1723
                            },
                            "ticketPricing": "Free",
                            "rating": 4.5,
                            "timeTravel": "10-15 minutes from South Strip hotels."
                          },
                          {
                            "placeName": "Bellagio Conservatory & Botanical Gardens",
                            "placeDetails": "Beautiful free indoor garden display, amazing to see with different themes every season.",
                            "placeImageUrl": "https://example.com/bellagio_garden.jpg",
                            "geoCoordinates": {
                              "latitude": 36.1129,
                              "longitude": -115.1744
                            },
                            "ticketPricing": "Free",
                            "rating": 4.7,
                            "timeTravel": "10 minutes by car from the Welcome sign or 30 minutes via walk."
                          },
                          {
                            "placeName": "Fountains of Bellagio",
                            "placeDetails": "Spectacular free water show with music. Happens every 30 minutes in the afternoon and every 15 minutes in the evening.",
                            "placeImageUrl": "https://example.com/bellagio_fountains.jpg",
                            "geoCoordinates": {
                              "latitude": 36.1126,
                              "longitude": -115.1740
                            },
                            "ticketPricing": "Free",
                            "rating": 4.8,
                            "timeTravel": "Located in front of the Bellagio, 0 minutes walk from the garden."
                          }
                        ]
                      },
                      "day2": {
                        "theme": "Downtown Experience and Fremont Street",
                        "bestTimeToVisit": "Afternoon and Evening for the lights and shows",
                        "places": [
                          {
                            "placeName": "Fremont Street Experience",
                            "placeDetails": "Pedestrian mall with free light shows, street performers, and live music.",
                            "placeImageUrl": "https://example.com/fremont_street.jpg",
                            "geoCoordinates": {
                              "latitude": 36.1701,
                              "longitude": -115.1401
                            },
                            "ticketPricing": "Free to enter and enjoy the shows.",
                            "rating": 4.6,
                            "timeTravel": "About 20-30 minutes by car from the Strip, or a bus ride."
                          }
                        ]
                      },
                      "day3": {
                        "theme": "Pool Time & Relaxing or more free Activities",
                        "bestTimeToVisit": "Morning for pool and afternoon or evening for activities",
                        "places": [
                          {
                            "placeName": "Hotel Pool Time",
                            "placeDetails": "Spend time relaxing by the hotel pool. (Check if the pool is free for guests or requires extra fees).",
                            "placeImageUrl": "https://example.com/hotel_pool.jpg",
                            "geoCoordinates": {
                              "latitude": 0,
                              "longitude": 0
                            },
                            "ticketPricing": "Usually free for hotel guests",
                            "rating": 4.0,
                            "timeTravel": "Onsite at the Hotel"
                          }
                        ]
                      }
                    }
                  }
                  \`\`\``
        }
      ]
    }
  ]
});
