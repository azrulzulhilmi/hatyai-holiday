// ============================================================
//  Hat Yai Interactive Travel Map – Main Application Logic
//  Linear Design System variant. Uses Leaflet.js + Lucide Icons.
// ============================================================

// ---- LUCIDE ICON HELPER ------------------------------------
// Returns an inline SVG string from Lucide's icon registry.
// `name` uses kebab-case (e.g. 'shopping-bag').
function getIconSvg(name, size, strokeWidth) {
  size = size || 16;
  strokeWidth = strokeWidth || 1.5;

  if (typeof lucide === 'undefined' || !lucide.icons) return '';

  // Convert kebab-case to PascalCase for Lucide lookup
  var pascal = name.replace(/(^|-)(\w)/g, function(_, __, c) {
    return c.toUpperCase();
  });

  var iconData = lucide.icons[pascal];
  if (!iconData) return '';

  var el = lucide.createElement(iconData);
  el.setAttribute('width', size);
  el.setAttribute('height', size);
  el.setAttribute('stroke-width', strokeWidth);
  return el.outerHTML;
}

// ---- DISTANCE HELPER (Haversine formula) --------------------
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ---- ITINERARY DATA ----------------------------------------
const ITINERARY = [
  // Friday (29 August 2026)
  {
    id: 'friday-tbs',
    day: 'friday',
    dayLabel: 'Friday',
    date: '29 Aug 2026',
    time: '11:00 PM',
    name: 'Take Bus from TBS to Hentian Duta',
    desc: 'Departure by bus from TBS to Hentian Duta (Return RM120)',
    lat: 3.0824,
    lng: 101.7107,
    icon: 'bus',
    category: 'transport',
    showOnMap: false,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80'
  },

  // Saturday (30 August 2026)
  {
    id: 'saturday-hotel-dropoff',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '8:00 AM',
    name: 'Good Dream Premier Hatyai (Hotel)',
    desc: 'Drop off luggage at hotel basecamp. Start of Saturday journey.',
    lat: 6.9950,
    lng: 100.4850,
    icon: 'building-2',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-breakfast',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '9:00 AM',
    name: 'Breakfast \u2013 Ban Han / Dimsum',
    desc: 'Halal dimsum breakfast near Lee Garden area',
    lat: 7.0062,
    lng: 100.4718,
    icon: 'utensils',
    category: 'food',
    link: 'https://www.tiktok.com/search?q=ban+han+dim+sum+hat+yai',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-rental',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '10:00 AM',
    name: 'Rent Motorbike \u2013 Variety Tour',
    desc: 'Rent motorbike or arrange Grab rides',
    lat: 7.0075,
    lng: 100.4730,
    icon: 'bike',
    category: 'transport',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-amazon',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '11:00 AM',
    name: 'Cafe Amazon',
    desc: 'Coffee and chill at Cafe Amazon',
    lat: 7.0050,
    lng: 100.4735,
    icon: 'coffee',
    category: 'cafe',
    link: 'https://www.tiktok.com/search?q=cafe+amazon+hat+yai',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-nikukin',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '12:00 PM',
    name: 'Nikukin Hand Roll Bar',
    desc: 'Japanese-style hand roll and yakiniku lunch',
    lat: 7.0055,
    lng: 100.4725,
    icon: 'utensils',
    category: 'food',
    link: 'https://www.tiktok.com/search?q=nikukin+hat+yai',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-checkin',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '1:00 PM',
    name: 'Check In & Rest',
    desc: 'Hotel check-in at hotel basecamp',
    lat: 6.9950,
    lng: 100.4850,
    icon: 'bed-double',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-central',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '3:00 PM',
    name: 'Central Hatyai',
    desc: 'Shopping \u2013 Boots, Beautrium, Watson, Moshi Moshi, Potato Corner',
    lat: 6.9919,
    lng: 100.4830,
    icon: 'shopping-bag',
    category: 'shopping',
    link: 'https://www.tiktok.com/search?q=central+hat+yai+shopping',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-sunset',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '5:00 PM',
    name: 'Panoramic Sunset Viewpoint',
    desc: 'Scenic sunset at Hat Yai Municipal Park viewpoint',
    lat: 7.0425,
    lng: 100.5117,
    icon: 'sunset',
    category: 'scenic',
    link: 'https://www.tiktok.com/search?q=municipal+park+hat+yai+sunset',
    image: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-nightmarket',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '8:00 PM',
    name: 'Florida Night Market',
    desc: 'Street food and night market vibes',
    lat: 7.0090,
    lng: 100.4700,
    icon: 'store',
    category: 'market',
    link: 'https://www.tiktok.com/search?q=florida+night+market+hat+yai',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'saturday-hotel-return',
    day: 'saturday',
    dayLabel: 'Saturday',
    date: '30 Aug 2026',
    time: '9:30 PM',
    name: 'Good Dream Premier Hatyai (Hotel)',
    desc: 'Return to hotel basecamp for rest. End of Saturday journey.',
    lat: 6.9950,
    lng: 100.4850,
    icon: 'building-2',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
  },

  // Sunday (31 August 2026)
  {
    id: 'sunday-hotel-start',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '7:30 AM',
    name: 'Good Dream Premier Hatyai (Hotel)',
    desc: 'Depart from hotel basecamp. Start of Sunday journey.',
    lat: 6.9950,
    lng: 100.4850,
    icon: 'building-2',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-breakfast',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '8:00 AM',
    name: 'Breakfast \u2013 Makan Pagi Hatyai',
    desc: 'Morning dim sum or local breakfast spot',
    lat: 7.0048,
    lng: 100.4710,
    icon: 'utensils',
    category: 'food',
    link: 'https://www.tiktok.com/search?q=makan+pagi+hat+yai',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-songkhla',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '10:00 AM',
    name: 'Songkhla Old Town Sightseeing',
    desc: 'Sightseeing in historic Songkhla (Grab ~RM40)',
    lat: 7.1950,
    lng: 100.5900,
    icon: 'landmark',
    category: 'scenic',
    link: 'https://www.tiktok.com/search?q=songkhla+old+town+guide',
    image: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-moon',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '11:00 AM',
    name: 'Cafe Hopping \u2013 Cafe Moon',
    desc: 'Cafe hopping in Songkhla Old Town',
    lat: 7.1988,
    lng: 100.5951,
    icon: 'coffee',
    category: 'cafe',
    link: 'https://www.tiktok.com/search?q=cafe+moon+songkhla',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-lunch',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '1:00 PM',
    name: 'Lunch \u2013 Banlay Restaurant',
    desc: 'Lunch spot near Songkhla waterfront',
    lat: 7.1930,
    lng: 100.5870,
    icon: 'utensils',
    category: 'food',
    link: 'https://www.tiktok.com/search?q=banlay+songkhla',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-floating',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '3:00 PM',
    name: 'Khlong Hae Floating Market',
    desc: 'Floating market experience on the canal',
    lat: 7.0471,
    lng: 100.4741,
    icon: 'sailboat',
    category: 'market',
    link: 'https://www.tiktok.com/search?q=khlong+hae+floating+market+hat+yai',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-hiking',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '5:00 PM',
    name: 'Municipal Park Hiking',
    desc: 'Hiking at Hat Yai Municipal Park',
    lat: 7.0425,
    lng: 100.5117,
    icon: 'mountain',
    category: 'scenic',
    link: 'https://www.tiktok.com/search?q=hat+yai+municipal+park+cable+car',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-dinner',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '7:00 PM',
    name: 'Dinner \u2013 Lee Garden Plaza Area',
    desc: 'Dinner at Lee Garden Plaza area',
    lat: 7.0065,
    lng: 100.4705,
    icon: 'utensils',
    category: 'food',
    link: 'https://www.tiktok.com/search?q=lee+garden+plaza+food+hat+yai',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-massage',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '8:00 PM',
    name: 'Traditional Thai Massage',
    desc: 'Thai massage to end the day',
    lat: 7.0070,
    lng: 100.4720,
    icon: 'sparkles',
    category: 'massage',
    link: 'https://www.tiktok.com/search?q=massage+hat+yai',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'sunday-hotel-return',
    day: 'sunday',
    dayLabel: 'Sunday',
    date: '31 Aug 2026',
    time: '9:30 PM',
    name: 'Good Dream Premier Hatyai (Hotel)',
    desc: 'Return to hotel basecamp for rest. End of Sunday journey.',
    lat: 6.9950,
    lng: 100.4850,
    icon: 'building-2',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
  },

  // Monday (1 September 2026)
  {
    id: 'monday-hotel-start',
    day: 'monday',
    dayLabel: 'Monday',
    date: '1 Sep 2026',
    time: '7:30 AM',
    name: 'Good Dream Premier Hatyai (Hotel)',
    desc: 'Depart from hotel basecamp. Start of Monday journey.',
    lat: 6.9950,
    lng: 100.4850,
    icon: 'building-2',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'monday-breakfast',
    day: 'monday',
    dayLabel: 'Monday',
    date: '1 Sep 2026',
    time: '8:00 AM',
    name: 'Breakfast \u2013 Copper Wood Cafe',
    desc: 'Cafe breakfast at Copper Wood Hatyai',
    lat: 7.0030,
    lng: 100.4680,
    icon: 'coffee',
    category: 'cafe',
    link: 'https://www.tiktok.com/search?q=copper+wood+hat+yai',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'monday-makro',
    day: 'monday',
    dayLabel: 'Monday',
    date: '1 Sep 2026',
    time: '10:00 AM',
    name: 'Makro Hatyai',
    desc: 'Shopping at Makro wholesale store',
    lat: 7.0163,
    lng: 100.4907,
    icon: 'shopping-cart',
    category: 'shopping',
    link: 'https://www.tiktok.com/search?q=makro+hat+yai',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'monday-checkout',
    day: 'monday',
    dayLabel: 'Monday',
    date: '1 Sep 2026',
    time: '12:00 PM',
    name: 'Checkout',
    desc: 'Check out from hotel basecamp. Departure from hotel basecamp.',
    lat: 6.9950,
    lng: 100.4850,
    icon: 'building-2',
    category: 'hotel',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'monday-kaitod',
    day: 'monday',
    dayLabel: 'Monday',
    date: '1 Sep 2026',
    time: '1:00 PM',
    name: 'Lunch \u2013 Kai Tod Decha (Fried Chicken)',
    desc: 'Famous Hat Yai fried chicken',
    lat: 7.0084,
    lng: 100.4767,
    icon: 'utensils',
    category: 'food',
    link: 'https://www.tiktok.com/search?q=kai+tod+decha+hat+yai',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'monday-kimyong',
    day: 'monday',
    dayLabel: 'Monday',
    date: '1 Sep 2026',
    time: '2:00 PM',
    name: 'Souvenir Shopping \u2013 Kim Yong Market',
    desc: 'Last-minute souvenir shopping at Kim Yong Market',
    lat: 7.0125,
    lng: 100.4695,
    icon: 'store',
    category: 'market',
    link: 'https://www.tiktok.com/search?q=kim+yong+market+hat+yai',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'monday-return',
    day: 'monday',
    dayLabel: 'Monday',
    date: '1 Sep 2026',
    time: '5:00 PM',
    name: 'Return Motorbike & Go to Bus Station',
    desc: 'Return motorbike and head to Hat Yai bus station. End of journey.',
    lat: 7.0080,
    lng: 100.4740,
    icon: 'bus',
    category: 'transport',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80'
  },

  // EXTRA UNCONNECTED LOCATIONS (Plotted as standalone pins)
  {
    id: 'extra-beef-noodle',
    day: 'all',
    dayLabel: 'Recommended Food',
    time: 'Anytime',
    date: 'Extra Pin',
    name: 'Ayutthaya Halal Beef Noodle',
    desc: 'Authentic Thai boat noodles with rich aromatic broth and tender braised beef.',
    lat: 7.0108,
    lng: 100.4735,
    icon: 'utensils',
    category: 'food',
    connectRoute: false,
    link: 'https://www.tiktok.com/search?q=ayutthaya+boat+noodle+hat+yai',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'extra-marada',
    day: 'all',
    dayLabel: 'Recommended Food',
    time: 'Anytime',
    date: 'Extra Pin',
    name: 'Marada Halal Restaurant',
    desc: 'Highly rated halal dining destination offering a large selection of local dishes.',
    lat: 7.0312,
    lng: 100.4735,
    icon: 'utensils',
    category: 'food',
    connectRoute: false,
    link: 'https://www.tiktok.com/search?q=marada+cafe+hat+yai',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'extra-mue-chao',
    day: 'all',
    dayLabel: 'Recommended Breakfast',
    time: 'Anytime',
    date: 'Extra Pin',
    name: 'Mue Chao Breakfast Halal',
    desc: 'Popular breakfast spot serving congee, pan-fried eggs, and dim sum.',
    lat: 7.0062,
    lng: 100.4720,
    icon: 'utensils',
    category: 'food',
    connectRoute: false,
    link: 'https://www.tiktok.com/search?q=mue+chao+breakfast+hat+yai',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=80'
  }
];

// ---- DAY CONFIGURATION ------------------------------------
const DAY_CONFIG = {
  friday:   { label: 'Friday',    fullDate: '29 August 2026',    color: '#5e6ad2' },
  saturday: { label: 'Saturday',  fullDate: '30 August 2026',    color: '#5e6ad2' },
  sunday:   { label: 'Sunday',    fullDate: '31 August 2026',    color: '#5e6ad2' },
  monday:   { label: 'Monday',    fullDate: '1 September 2026',  color: '#5e6ad2' }
};

// ---- APP STATE ---------------------------------------------
let map;
let markersLayer;
let polylinesLayer;
let userLocationMarker = null;
let activeDay = 'all';

// ---- INITIALISE MAP ----------------------------------------
function initMap() {
  map = L.map('map', {
    center: [7.005, 100.480],
    zoom: 13,
    zoomControl: true,
    scrollWheelZoom: true
  });

  // Light tile layer (CartoDB Positron) matching the user's request for a clear white map
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  polylinesLayer = L.layerGroup().addTo(map);

  renderMapData('all');
}

// ---- RENDER MAP DATA (markers + polylines) -----------------
function renderMapData(dayFilter) {
  markersLayer.clearLayers();
  polylinesLayer.clearLayers();

  // Show stops matching selected day, plus standalone recommendations (day: 'all')
  const stops = ITINERARY.filter(s => {
    if (s.showOnMap === false) return false;
    return dayFilter === 'all' || s.day === dayFilter || s.day === 'all';
  });

  // Update stop counter (only counting connected route stops)
  const connectedCount = stops.filter(s => s.connectRoute !== false).length;
  const counter = document.getElementById('stop-count');
  if (counter) {
    counter.textContent = connectedCount + ' stop' + (connectedCount !== 1 ? 's' : '');
  }

  // Group stops by day for polylines (excluding unconnected stops)
  const byDay = {};
  stops.forEach(s => {
    if (s.connectRoute === false) return;
    if (!byDay[s.day]) byDay[s.day] = [];
    byDay[s.day].push(s);
  });

  // Draw polylines per day (excluding unconnected stops)
  Object.keys(byDay).forEach(day => {
    const dayStops = byDay[day];
    if (dayStops.length < 2) return;
    const coords = dayStops.map(s => [s.lat, s.lng]);
    const color = DAY_CONFIG[day]?.color || '#5e6ad2';

    L.polyline(coords, {
      color: color,
      weight: 2,
      opacity: .45,
      dashArray: '6 4',
      smoothFactor: 1.5
    }).addTo(polylinesLayer);
  });

  // Generate sequence numbers: hotel is always '0' (without incrementing counter)
  let routeIdx = 0;

  // Place markers
  stops.forEach(stop => {
    let markerHtml = '';

    if (stop.connectRoute === false) {
      // Unconnected stops get a solid lavender marker with their category icon inside
      const iconSvg = getIconSvg(stop.icon, 14, 2);
      markerHtml = '<div class="custom-marker custom-marker--extra">' + iconSvg + '</div>';
    } else {
      // Chronological stops get their sequence number (hotel = 0, others count sequentially from 1)
      let stopNum = '';
      if (stop.category === 'hotel') {
        stopNum = '0';
      } else {
        routeIdx++;
        stopNum = routeIdx;
      }

      const iconSvg = getIconSvg(stop.icon, 10, 2.5);
      markerHtml = 
        '<div class="custom-marker">' +
          '<span class="custom-marker__number">' + stopNum + '</span>' +
          '<span class="custom-marker__icon-badge">' + iconSvg + '</span>' +
        '</div>';
    }

    const marker = L.marker([stop.lat, stop.lng], {
      icon: L.divIcon({
        html: markerHtml,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      })
    });

    const popupContent = buildPopupHtml(stop);
    marker.bindPopup(popupContent, { maxWidth: 280, closeButton: true });
    marker.addTo(markersLayer);
  });

  // Fit map bounds
  if (stops.length > 0) {
    const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }
}

// ---- BUILD POPUP HTML --------------------------------------
function buildPopupHtml(stop) {
  let distanceHtml = '';

  // Distance badge for chronological route stops
  if (stop.connectRoute !== false) {
    const dayStops = ITINERARY.filter(s => s.day === stop.day && s.showOnMap !== false && s.connectRoute !== false);
    const index = dayStops.findIndex(s => s.id === stop.id);
    if (index > 0) {
      const prev = dayStops[index - 1];
      const prevDist = getDistanceKm(prev.lat, prev.lng, stop.lat, stop.lng);
      distanceHtml += '<span class="popup-card__dist-badge">' + getIconSvg('navigation', 10) + ' ' + prevDist.toFixed(1) + ' km from #' + (index) + '</span>';
    }
  }

  let imgHtml = '';
  if (stop.image) {
    imgHtml = '<img class="popup-card__image" src="' + stop.image + '" alt="' + stop.name + '" />';
  }

  // Get index in route (hotel shows '0', other stops show sequential number)
  let stopNumLabel = '';
  if (stop.connectRoute !== false) {
    if (stop.category === 'hotel') {
      stopNumLabel = '0';
    } else {
      const dayStops = ITINERARY.filter(s => s.day === stop.day && s.showOnMap !== false && s.connectRoute !== false);
      let activeRouteIdx = 0;
      for (let i = 0; i < dayStops.length; i++) {
        const item = dayStops[i];
        if (item.category !== 'hotel') {
          activeRouteIdx++;
        }
        if (item.id === stop.id) {
          stopNumLabel = activeRouteIdx;
          break;
        }
      }
    }
  }

  return '<div class="popup-card">' +
    (stopNumLabel !== '' ? '<div class="popup-card__num-badge">' + stopNumLabel + '</div>' : '') +
    imgHtml +
    '<div class="popup-card__header">' +
      '<span class="popup-card__icon">' + getIconSvg(stop.icon, 18) + '</span>' +
      '<span class="popup-card__name">' + stop.name + '</span>' +
    '</div>' +
    '<div class="popup-card__body">' +
      '<div class="popup-card__time">' + getIconSvg('clock', 12) + ' ' + stop.time + ' &middot; ' + stop.date + '</div>' +
      '<p class="popup-card__desc">' + stop.desc + '</p>' +
      '<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 8px;">' +
        '<div style="display: flex; gap: 6px; align-items: center;">' +
          '<span class="popup-card__day-badge">' + stop.dayLabel + '</span>' +
          distanceHtml +
        '</div>' +
        (stop.link ? '<a href="' + stop.link + '" target="_blank" rel="noopener" class="popup-card__link">' + getIconSvg('video', 12) + ' TikTok Guide</a>' : '') +
      '</div>' +
    '</div>' +
  '</div>';
}

// ---- DAY TOGGLE (pill tabs) --------------------------------
function initDayButtons() {
  const tabs = document.querySelectorAll('.day-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeDay = tab.dataset.day;
      renderMapData(activeDay);
      showToast('Showing: ' + (activeDay === 'all' ? 'All Days' : (DAY_CONFIG[activeDay]?.label || activeDay)));
    });
  });
}

// ---- GEOLOCATION -------------------------------------------
function initGeolocation() {
  const geoBtn = document.getElementById('geo-btn');
  const geoBtnText = document.getElementById('geo-btn-text');
  if (!geoBtn || !geoBtnText) return;

  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported');
      return;
    }

    geoBtnText.textContent = 'Locating\u2026';

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;

        if (userLocationMarker) {
          map.removeLayer(userLocationMarker);
        }

        const popupHtml =
          '<div class="popup-card">' +
            '<div class="popup-card__header">' +
              '<span class="popup-card__icon">' + getIconSvg('map-pin', 18) + '</span>' +
              '<span class="popup-card__name">You Are Here</span>' +
            '</div>' +
            '<div class="popup-card__body">' +
              '<p class="popup-card__desc">Your current GPS location</p>' +
            '</div>' +
          '</div>';

        userLocationMarker = L.marker([latitude, longitude], {
          icon: L.divIcon({
            html: '<div class="user-location-pulse"></div>',
            className: '',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        })
          .bindPopup(popupHtml)
          .addTo(map);

        map.setView([latitude, longitude], 15, { animate: true });
        showToast('Location found');
        geoBtnText.textContent = 'Find My Location';
      },
      err => {
        showToast('Could not get location');
        geoBtnText.textContent = 'Find My Location';
        console.error('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// ---- ITINERARY TIMELINE ------------------------------------
function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  container.innerHTML = '';

  const days = ['friday', 'saturday', 'sunday', 'monday'];

  days.forEach(day => {
    const config = DAY_CONFIG[day];
    const stops = ITINERARY.filter(s => s.day === day);
    if (stops.length === 0) return;

    const group = document.createElement('div');
    group.classList.add('day-group');

    // Get list of active map stops to assign numbers
    const activeMapStops = stops.filter(s => s.showOnMap !== false && s.connectRoute !== false);

    let listHtml = '<ul class="timeline-list">';
    let dayRouteIdx = 0;

    stops.forEach((s, idx) => {
      // Find index in active map stops
      const isMapped = activeMapStops.some(item => item.id === s.id);
      let stopNum = '';
      if (!isMapped) {
        stopNum = '';
      } else if (s.category === 'hotel') {
        stopNum = '0';
      } else {
        dayRouteIdx++;
        stopNum = dayRouteIdx;
      }

      const imgHtml = s.image ? 
        '<img class="timeline-item__thumbnail" src="' + s.image + '" alt="' + s.name + '" />' : 
        '<div class="timeline-item__thumbnail-placeholder"></div>';

      listHtml += '<li class="timeline-item" data-id="' + s.id + '">' +
        (stopNum !== '' ? '<span class="timeline-item__number">' + stopNum + '</span>' : '<span class="timeline-item__number-spacer"></span>') +
        '<span class="timeline-item__time">' + s.time + '</span>' +
        imgHtml +
        '<div class="timeline-item__content">' +
          '<div class="timeline-item__name">' + s.name + '</div>' +
          '<div class="timeline-item__desc">' + s.desc + '</div>' +
        '</div>' +
        '<span class="timeline-item__icon">' + getIconSvg(s.icon, 18, 1.5) + '</span>' +
      '</li>';

      // Distance divider
      if (idx < stops.length - 1) {
        const nextStop = stops[idx + 1];
        if (s.showOnMap !== false && nextStop.showOnMap !== false && s.connectRoute !== false && nextStop.connectRoute !== false) {
          const dist = getDistanceKm(s.lat, s.lng, nextStop.lat, nextStop.lng);
          listHtml += '<li class="timeline-distance">' +
            '<div class="timeline-distance__line"></div>' +
            '<span class="timeline-distance__value">' + getIconSvg('navigation', 10) + ' ' + dist.toFixed(1) + ' km</span>' +
            '<div class="timeline-distance__line"></div>' +
          '</li>';
        }
      }
    });
    listHtml += '</ul>';

    group.innerHTML =
      '<div class="day-group__header">' +
        '<div class="day-group__indicator" style="background:' + config.color + ';"></div>' +
        '<span class="day-group__label">' + config.label + '</span>' +
        '<span class="day-group__date">' + config.fullDate + '</span>' +
      '</div>' +
      listHtml;

    container.appendChild(group);
  });

  // Now, render the extra unconnected recommendations group
  const extraStops = ITINERARY.filter(s => s.connectRoute === false);
  if (extraStops.length > 0) {
    const group = document.createElement('div');
    group.classList.add('day-group');

    let listHtml = '<ul class="timeline-list">';
    extraStops.forEach(s => {
      const imgHtml = s.image ? 
        '<img class="timeline-item__thumbnail" src="' + s.image + '" alt="' + s.name + '" />' : 
        '<div class="timeline-item__thumbnail-placeholder"></div>';

      listHtml += '<li class="timeline-item" data-id="' + s.id + '">' +
        '<span class="timeline-item__number" style="background:var(--primary); border-color:var(--primary); color:var(--on-primary);">' + getIconSvg(s.icon, 12) + '</span>' +
        '<span class="timeline-item__time" style="font-size:11px; color:var(--ink-subtle);">' + s.time + '</span>' +
        imgHtml +
        '<div class="timeline-item__content">' +
          '<div class="timeline-item__name">' + s.name + '</div>' +
          '<div class="timeline-item__desc">' + s.desc + '</div>' +
        '</div>' +
        '<span class="timeline-item__icon">' + getIconSvg(s.icon, 18, 1.5) + '</span>' +
      '</li>';
    });
    listHtml += '</ul>';

    group.innerHTML =
      '<div class="day-group__header">' +
        '<div class="day-group__indicator" style="background:var(--primary);"></div>' +
        '<span class="day-group__label">Extra Food Options</span>' +
        '<span class="day-group__date">Unconnected Pins</span>' +
      '</div>' +
      listHtml;

    container.appendChild(group);
  }

  // Click timeline item -> fly to marker on map
  container.addEventListener('click', e => {
    const item = e.target.closest('.timeline-item');
    if (!item) return;
    const id = item.dataset.id;
    const stop = ITINERARY.find(s => s.id === id);
    if (!stop || stop.showOnMap === false) return;

    // Ensure the right day is showing for route stops
    if (stop.connectRoute !== false && activeDay !== 'all' && activeDay !== stop.day) {
      activeDay = stop.day;
      document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
      const dayTab = document.querySelector('.day-tab[data-day="' + stop.day + '"]');
      if (dayTab) dayTab.classList.add('active');
      renderMapData(activeDay);
    }

    map.setView([stop.lat, stop.lng], 16, { animate: true });

    // Open matching popup
    markersLayer.eachLayer(layer => {
      if (layer.getLatLng &&
          Math.abs(layer.getLatLng().lat - stop.lat) < 0.0001 &&
          Math.abs(layer.getLatLng().lng - stop.lng) < 0.0001) {
        layer.openPopup();
      }
    });

    // Scroll to map
    document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ---- TOAST NOTIFICATION ------------------------------------
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.classList.add('toast');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---- BOOT ---------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons for static HTML elements (nav, hero chips)
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  initMap();
  initDayButtons();
  initGeolocation();
  renderTimeline();

  // Default: show all days
  const allTab = document.querySelector('.day-tab[data-day="all"]');
  if (allTab) allTab.classList.add('active');
});
