# Project Brief: Hat Yai Interactive Travel Map

This project brief outlines the plan to build a clean, single page website to visualize your Hat Yai holiday. With an expanded feature set, it will serve as an interactive guide from your arrival to your departure.

## Project Overview

The goal is to create a lightweight visual map tracking your trip from your hotel basecamp (Bhava Residence) to your various food, shopping, and sightseeing destinations across Hat Yai and Songkhla.

## Tech Stack

We are keeping things straightforward while allowing room for Python magic if you decide to build a backend later.

* **HTML5:** Handles the structure of your page.
* **CSS3:** Handles the clean styling.
* **JavaScript:** Handles the logic for looping through your itinerary and making the page interactive.
* **Leaflet.js:** A free, open source library used to display the map, place location pins, and draw travel lines.

## Core Features

1. **Interactive Waypoint Markers:** Map pins marking every stop on your itinerary, organized chronologically.
2. **Route Polyline Highlight:** Colorful connecting lines drawn on the map to visualize the path from one location to the next.
3. **Media and Link Popups:** Clickable pins that display a popup card containing a brief description and your saved TikTok reference links.
4. **Day Toggle Buttons:** Interactive buttons (Sabtu, Ahad, Isnin) that filter the map to show only the route and markers for that specific day.
5. **Custom Activity Icons:** Unique map pins representing different activities (coffee cups for cafes, shopping bags for markets, beds for the hotel).
6. **Geolocation (Find My Location):** A button that uses the browser GPS to drop a dot exactly where you are standing in Hat Yai.

## Web Page Sections

A single page layout will keep development fast and user navigation effortless.

* **Hero Header:** A clean top bar with your trip title ("Hat Yai Holiday 2026") and the travel dates.
* **The Journey Map:** The main section of the screen housing the interactive Leaflet map.
* **Itinerary Timeline:** A scannable list of your schedule placed below the map for quick reading.

## Tentative Itinerary

Here is the structured schedule that will fuel your map data:

**Jumaat (29 August 2026)**

* 11:00 PM: Naik bas TBS to Hentian Duta (Return RM120)

**Sabtu (30 August 2026)**

* 8:00 AM: Drop off luggage (Bhava Residence)
* 9:00 AM: Breakfast Ban Han or Dimsum
* 10:00 AM: Sewa motor (Variety Tour) or Grab
* 11:00 AM: Cafe Amazon
* 12:00 PM: Nikukin
* 1:00 PM: Check in Hotel and Rest
* 3:00 PM: Central Hatyai (Boots, Beautrium, Watson, Moshi Moshi, Potato Corner)
* 5:00 PM: Panaromic Sunset
* 8:00 PM: Night market (Florida Market)

**Ahad (31 August 2026)**

* 8:00 AM: Breakfast Makan Pagi Hatyai
* 10:00 AM: Songkla Old Town sightseeing (Grab RM40)
* 11:00 AM: Cafe Hopping (Moon)
* 1:00 PM: Lunch Banlay
* 3:00 PM: Floating market
* 5:00 PM: Municipal City Hiking
* 7:00 PM: Dinner (Lee Garden)
* 8:00 PM: Massage

**Isnin (1 September 2026)**

* 8:00 AM: Breakfast at Copper Wood Hatyai
* 10:00 AM: Makro Hatyai
* 12:00 PM: Checkout
* 1:00 PM: Lunch Kaitod Deca
* 2:00 PM: Kim Yong Market
* 5:00 PM: Return motor and go to station bus

**Hotel Basecamp:** Bhava Residence, 26 Soi Karnjanavanit 24, Kho Hong, Hatyai District, Songkhla 90110, Thailand.

## Build Steps

Follow these sequential steps to fly through the development process:

1. **Set Up the Project Layout:**
Create an `index.html` file and write the basic structural tags. Define a dedicated container element to hold your map and the day toggle buttons.


2. **Prepare the Data Array:**
Gather the latitude and longitude coordinates for your tentative stops. Organize them into a JavaScript array of objects categorized by day.


3. **Initialize Leaflet.js:**
Link the Leaflet CSS and JavaScript files in your header. Write the script to center the map view directly onto Hat Yai.


4. **Plot Pins and Paths:**
Write a JavaScript loop to read your data array, automatically drop markers for every stop, and generate a polyline connecting them in order.


5. **Implement Filtering and Geolocation:**
Create the logic for your day toggle buttons to clear and redraw specific routes, then add the Geolocation API call for the "Find My Location" feature.