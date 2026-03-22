// 1. Initialize map
const map = L.map('map', {
    center: [38.0293, -78.4767],
    zoom: 14,
    minZoom: 12,
    maxZoom: 18,
});

// 2. Tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// 3. Category config
var CATEGORY_CONFIG = {
    restaurant:  { emoji: '🍔', color: '#e53935' },
    trail:       { emoji: '🥾', color: '#43a047' },
    gym:         { emoji: '💪', color: '#fb8c00' },
    history:     { emoji: '📚', color: '#8e24aa' },
    cafe:        { emoji: '☕', color: '#6d4c41' },
    park:        { emoji: '🌳', color: '#2e7d32' },
    arts:        { emoji: '🎨', color: '#0288d1' },
    shopping:    { emoji: '🛍️', color: '#7b1fa2' },
    hidden_gem:  { emoji: '💎', color: '#00897b' },
};

// 4. Places — with address and hours
var cvilleLocations = [
    // ── Restaurants ──
    { name: "Bodo's Bagels",           type: "restaurant", coords: [38.0355, -78.4996], budget: 8,  address: "1418 Emmet St N, Charlottesville, VA",        hours: "Mon–Fri 6:30am–5pm, Sat–Sun 7am–5pm",   desc: "A UVA staple on the Corner. Famous bagels since 1983." },
    { name: "The Pie Chest",           type: "restaurant", coords: [38.0319, -78.4855], budget: 14, address: "215 Ridge St, Charlottesville, VA",             hours: "Tue–Sat 10am–6pm, Sun 11am–4pm",         desc: "Hand-crafted sweet and savory pies on the Downtown Mall." },
    { name: "Public Fish & Oyster",    type: "restaurant", coords: [38.0291, -78.4785], budget: 45, address: "513 W Main St, Charlottesville, VA",            hours: "Mon–Thu 4–10pm, Fri–Sat 11:30am–11pm",   desc: "Elegant Chesapeake seafood on the pedestrian mall." },
    { name: "Bang! Restaurant",        type: "restaurant", coords: [38.0286, -78.4792], budget: 35, address: "213 2nd St SW, Charlottesville, VA",            hours: "Tue–Sun 5–10pm",                         desc: "Creative American bistro with award-winning cocktails." },
    { name: "Lampo Neapolitan Pizza",  type: "restaurant", coords: [38.0301, -78.4775], budget: 22, address: "205 Monticello Rd, Charlottesville, VA",        hours: "Wed–Sun 5–10pm",                         desc: "Wood-fired Neapolitan pizza right off the Downtown Mall." },
    { name: "The Fitzroy",             type: "restaurant", coords: [38.0308, -78.4780], budget: 30, address: "106 W Water St, Charlottesville, VA",           hours: "Mon–Thu 11am–10pm, Fri–Sat 11am–11pm",   desc: "Upscale comfort food with a great weekend brunch." },
    { name: "Roots Natural Kitchen",   type: "restaurant", coords: [38.0334, -78.4998], budget: 13, address: "1222 Emmet St N, Charlottesville, VA",          hours: "Mon–Sat 10:30am–9pm, Sun 11am–8pm",      desc: "Build-your-own grain bowls popular with UVA students." },
    { name: "Citizen Burger Bar",      type: "restaurant", coords: [38.0289, -78.4788], budget: 18, address: "212 E Main St, Charlottesville, VA",            hours: "Sun–Thu 11am–10pm, Fri–Sat 11am–11pm",   desc: "Local burger spot with craft patties and milkshakes." },
    { name: "Mas Tapas",               type: "restaurant", coords: [38.0296, -78.4796], budget: 28, address: "904 Monticello Rd, Charlottesville, VA",        hours: "Tue–Sun 5–10pm",                         desc: "Spanish-inspired small plates in a cozy setting." },
    { name: "The Whiskey Jar",         type: "restaurant", coords: [38.0293, -78.4790], budget: 20, address: "227 W Main St, Charlottesville, VA",            hours: "Daily 11am–2am",                         desc: "Southern comfort food and whiskey on the Downtown Mall." },
    { name: "Hot Cakes",               type: "restaurant", coords: [38.0321, -78.4852], budget: 12, address: "118 W Market St, Charlottesville, VA",          hours: "Mon–Fri 7am–2pm, Sat–Sun 8am–2pm",       desc: "Beloved brunch spot known for fluffy pancakes and eggs." },
    { name: "Peter Chang",             type: "restaurant", coords: [38.0501, -78.4932], budget: 25, address: "2162 Barracks Rd, Charlottesville, VA",         hours: "Mon–Thu 11am–9:30pm, Fri–Sat 11am–10pm", desc: "Acclaimed Sichuan Chinese cuisine, a Cville favorite." },
    // ── Trails ──
    { name: "Rivanna Trail",           type: "trail", coords: [38.0410, -78.4650], budget: 0,  address: "Trailhead: Rivanna Conservation Alliance, Charlottesville, VA", hours: "Open daily, dawn to dusk",       desc: "20-mile urban wilderness loop around Charlottesville." },
    { name: "Monticello Trail",        type: "trail", coords: [37.9918, -78.4687], budget: 0,  address: "Near Fontaine Research Park, Charlottesville, VA",               hours: "Open daily, dawn to dusk",       desc: "Scenic trail connecting UVA to Monticello." },
    { name: "Observatory Hill Trail",  type: "trail", coords: [38.0340, -78.5123], budget: 0,  address: "Observatory Hill, UVA Grounds, Charlottesville, VA",             hours: "Open daily, dawn to dusk",       desc: "Easy wooded loop near UVA, great for a morning run." },
    { name: "Shenandoah Nat'l Park",   type: "trail", coords: [38.2928, -78.6789], budget: 35, address: "3655 US-211, Luray, VA (Skyline Drive entrance)",                hours: "Open daily, seasonal hours vary",desc: "World-class hiking 25 min away — stunning Blue Ridge views." },
    { name: "Humpback Rocks Trail",    type: "trail", coords: [37.9073, -78.8715], budget: 0,  address: "Blue Ridge Pkwy Milepost 5.8, Waynesboro, VA",                   hours: "Open daily, dawn to dusk",       desc: "Short but rewarding hike with panoramic mountain views." },
    { name: "Ragged Mountain Trail",   type: "trail", coords: [38.0150, -78.5210], budget: 0,  address: "Ragged Mountain Natural Area, Charlottesville, VA",              hours: "Open daily 6am–9pm",             desc: "Peaceful natural area with lake views close to downtown." },
    { name: "Preddy Creek Trail",      type: "trail", coords: [38.1301, -78.4423], budget: 0,  address: "Preddy Creek Trail Park, Free Union, VA",                        hours: "Open daily, dawn to dusk",       desc: "Multi-use trail with creekside paths north of the city." },
    // ── Gyms ──
    { name: "ACAC Fitness",            type: "gym", coords: [38.0315, -78.4811], budget: 60, address: "500 E Market St, Charlottesville, VA",          hours: "Mon–Fri 5am–11pm, Sat–Sun 7am–9pm",      desc: "Premier local gym with pools, climbing wall, and yoga." },
    { name: "Emergence CrossFit",      type: "gym", coords: [38.0467, -78.5012], budget: 25, address: "1106 E Market St, Charlottesville, VA",         hours: "Mon–Fri 5:30am–7pm, Sat 8am–12pm",       desc: "Community CrossFit box with beginner-friendly coaches." },
    { name: "Planet Fitness",          type: "gym", coords: [38.0489, -78.4978], budget: 10, address: "1801 Seminole Trail, Charlottesville, VA",      hours: "Open 24 hours",                           desc: "Affordable gym with cardio and weights." },
    { name: "UVA AFC (Aquatic Center)",type: "gym", coords: [38.0318, -78.5098], budget: 15, address: "UVA Aquatic & Fitness Center, Charlottesville, VA", hours: "Mon–Fri 6am–10pm, Sat–Sun 8am–8pm",   desc: "UVA athletic facility open to students with pool and courts." },
    { name: "Onelife Fitness",         type: "gym", coords: [38.0556, -78.4867], budget: 35, address: "29 Berkmar Dr, Charlottesville, VA",            hours: "Mon–Fri 5am–10pm, Sat–Sun 7am–7pm",      desc: "Full-service gym with group classes and racquetball." },
    // ── History ──
    { name: "Monticello",              type: "history", coords: [37.9940, -78.4536], budget: 28, address: "931 Thomas Jefferson Pkwy, Charlottesville, VA", hours: "Daily 10am–5pm",                       desc: "Thomas Jefferson's iconic mountaintop home and UNESCO site." },
    { name: "UVA Academical Village",  type: "history", coords: [38.0336, -78.5080], budget: 0,  address: "The Lawn, UVA, Charlottesville, VA",             hours: "Open daily, always accessible",        desc: "Jefferson's original Lawn — a UNESCO World Heritage Site." },
    { name: "Michie Tavern",           type: "history", coords: [37.9956, -78.4570], budget: 20, address: "683 Thomas Jefferson Pkwy, Charlottesville, VA", hours: "Daily 11am–3pm",                       desc: "18th-century tavern museum with colonial-era dining." },
    { name: "Ash Lawn-Highland",       type: "history", coords: [37.9810, -78.4370], budget: 15, address: "1000 James Monroe Pkwy, Charlottesville, VA",   hours: "Daily 9am–6pm (Apr–Oct), 11am–5pm (Nov–Mar)", desc: "James Monroe's historic estate near Monticello." },
    { name: "Court Square",            type: "history", coords: [38.0313, -78.4793], budget: 0,  address: "Court Square, Charlottesville, VA",              hours: "Open daily, always accessible",        desc: "Historic downtown square with 19th-century architecture." },
    { name: "UVA Rotunda",             type: "history", coords: [38.0353, -78.5035], budget: 0,  address: "1826 University Ave, Charlottesville, VA",       hours: "Daily 11am–5pm",                       desc: "Jefferson's iconic centerpiece of the University of Virginia." },
    // ── Cafes ──
    { name: "Milli Coffee Roasters",   type: "cafe", coords: [38.0312, -78.4769], budget: 10, address: "709 W Main St, Charlottesville, VA",           hours: "Mon–Fri 7am–5pm, Sat–Sun 8am–5pm",        desc: "Specialty pour-over bar with single-origin beans." },
    { name: "Grit Coffee",             type: "cafe", coords: [38.0329, -78.4801], budget: 9,  address: "201 W Water St, Charlottesville, VA",          hours: "Mon–Fri 6:30am–6pm, Sat–Sun 7:30am–6pm",  desc: "Beloved local roaster with multiple Cville locations." },
    { name: "Shenandoah Joe",          type: "cafe", coords: [38.0367, -78.4985], budget: 8,  address: "2214 Fontaine Ave, Charlottesville, VA",       hours: "Mon–Fri 7am–6pm, Sat–Sun 8am–6pm",        desc: "Long-running local roastery near the Corner." },
    { name: "Mudhouse Coffee",         type: "cafe", coords: [38.0302, -78.4779], budget: 9,  address: "213 W Main St, Charlottesville, VA",           hours: "Mon–Fri 7am–7pm, Sat–Sun 8am–7pm",        desc: "Cozy Downtown Mall cafe with great espresso drinks." },
    { name: "Greenberry's Coffee",     type: "cafe", coords: [38.0331, -78.5002], budget: 8,  address: "1117 W Main St, Charlottesville, VA",          hours: "Mon–Fri 6:30am–7pm, Sat–Sun 7:30am–7pm",  desc: "Corner cafe staple for UVA students since the 90s." },
    { name: "Quirk Hotel Cafe",        type: "cafe", coords: [38.0305, -78.4777], budget: 12, address: "500 W Main St, Charlottesville, VA",           hours: "Daily 7am–3pm",                           desc: "Stylish hotel cafe with pastries and quality espresso." },
    // ── Parks ──
    { name: "Azalea Park",             type: "park", coords: [38.0102, -78.4830], budget: 0, address: "Azalea Dr, Charlottesville, VA",               hours: "Open daily, dawn to dusk",                desc: "Leafy park with walking trails and picnic areas." },
    { name: "IX Art Park",             type: "park", coords: [38.0239, -78.4820], budget: 0, address: "522 2nd St SE, Charlottesville, VA",           hours: "Open daily, event hours vary",            desc: "Open-air creative campus with murals and food trucks." },
    { name: "McIntire Park",           type: "park", coords: [38.0472, -78.4893], budget: 0, address: "250 Park St, Charlottesville, VA",             hours: "Open daily 6am–10pm",                     desc: "Large park with disc golf, tennis courts, and open fields." },
    { name: "Pen Park",                type: "park", coords: [38.0623, -78.4712], budget: 0, address: "1800 Pen Park Rd, Charlottesville, VA",        hours: "Open daily 6am–10pm",                     desc: "Spacious park with a golf course, trails, and sports fields." },
    { name: "Darden Towe Park",        type: "park", coords: [38.0401, -78.4431], budget: 0, address: "1335 Darden Towe Park Rd, Charlottesville, VA",hours: "Open daily 6am–9pm",                      desc: "Riverside park with baseball fields and walking paths." },
    { name: "Belmont Park",            type: "park", coords: [38.0214, -78.4758], budget: 0, address: "Belmont Ave, Charlottesville, VA",             hours: "Open daily, dawn to dusk",                desc: "Small neighborhood park in the vibrant Belmont district." },
    // ── Arts ──
    { name: "Virginia Discovery Museum", type: "arts", coords: [38.0293, -78.4800], budget: 10, address: "524 E Main St, Charlottesville, VA",        hours: "Tue–Sat 10am–5pm, Sun 1–5pm",             desc: "Hands-on children's museum near the Downtown Mall." },
    { name: "Second Street Gallery",   type: "arts", coords: [38.0299, -78.4782], budget: 0,  address: "115 2nd St NE, Charlottesville, VA",         hours: "Tue–Sat 11am–6pm, Sun 1–5pm",             desc: "Free contemporary art gallery in the arts district." },
    { name: "Paramount Theater",       type: "arts", coords: [38.0302, -78.4786], budget: 25, address: "215 E Main St, Charlottesville, VA",          hours: "Box office Mon–Fri 12–5pm, show nights open early", desc: "Beautifully restored 1930s theater with live performances." },
    { name: "The Fralin Museum of Art",type: "arts", coords: [38.0355, -78.5045], budget: 0,  address: "155 Rugby Rd, Charlottesville, VA",           hours: "Tue–Sun 11am–5pm",                        desc: "Free UVA art museum with rotating exhibits and collections." },
    { name: "Live Arts Theater",       type: "arts", coords: [38.0276, -78.4804], budget: 20, address: "123 E Water St, Charlottesville, VA",         hours: "Show nights only — check schedule",        desc: "Community theater with professional-quality productions." },
    { name: "McGuffey Art Center",     type: "arts", coords: [38.0276, -78.4838], budget: 0,  address: "201 2nd St NW, Charlottesville, VA",          hours: "Tue–Sat 11am–6pm, Sun 1–5pm",             desc: "Artist cooperative with open studios and free gallery walks." },
    // ── Shopping ──
    { name: "Downtown Mall",           type: "shopping", coords: [38.0294, -78.4784], budget: 0,  address: "E Main St, Charlottesville, VA",          hours: "Open daily, shop hours vary",             desc: "Charlottesville's beloved 8-block pedestrian mall." },
    { name: "Crossroads Running Co.",  type: "shopping", coords: [38.0389, -78.4972], budget: 80, address: "1309 W Main St, Charlottesville, VA",     hours: "Mon–Sat 10am–6pm, Sun 12–5pm",            desc: "Expert running store with gait analysis and quality gear." },
    { name: "The Wool Shop",           type: "shopping", coords: [38.0298, -78.4781], budget: 30, address: "311 E Main St, Charlottesville, VA",      hours: "Mon–Sat 10am–5:30pm",                     desc: "Charming yarn and fabric boutique on the Downtown Mall." },
    { name: "Cville Antique Mall",     type: "shopping", coords: [38.0267, -78.4823], budget: 20, address: "215 W Water St, Charlottesville, VA",     hours: "Mon–Sat 10am–6pm, Sun 12–5pm",            desc: "Multi-vendor antique market with eclectic vintage finds." },
    { name: "Clem's Sporting Goods",   type: "shopping", coords: [38.0345, -78.4997], budget: 40, address: "1218 W Main St, Charlottesville, VA",     hours: "Mon–Sat 9am–6pm",                         desc: "Local outdoor and sporting goods store near the Corner." },
    { name: "Market Street Wineshop",  type: "shopping", coords: [38.0306, -78.4775], budget: 25, address: "301 E Market St, Charlottesville, VA",    hours: "Mon–Sat 10am–8pm, Sun 12–6pm",            desc: "Curated wine shop with knowledgeable staff on the Mall." },
    // ── Hidden Gems ──
    { name: "The Garnet",               type: "hidden_gem", coords: [38.0214, -78.4771], budget: 15, address: "208 Monticello Rd, Charlottesville, VA",    hours: "Daily 4pm–2am",                       desc: "Tiny Belmont bar beloved by locals — no tourists, great vibe, cheap drinks." },
    { name: "Fry's Spring Beach Club",  type: "hidden_gem", coords: [38.0089, -78.5012], budget: 8,  address: "2 Fry's Spring Rd, Charlottesville, VA",    hours: "Summer daily 11am–7pm (members + guests)", desc: "Members-only local pool visitors rarely know exists. Ask a local for a guest pass." },
    { name: "Meade Park Wading Pool",   type: "hidden_gem", coords: [38.0401, -78.4823], budget: 0,  address: "700 Meade Ave, Charlottesville, VA",         hours: "Summer daily 11am–6pm",               desc: "Free splash pad tucked behind Meade Park — a local summer secret." },
    { name: "The Bridge PAI",           type: "hidden_gem", coords: [38.0323, -78.5001], budget: 0,  address: "209 Fourteenth St NW, Charlottesville, VA",  hours: "Event nights only — check social media",desc: "Student-run arts venue on the Corner with free underground events." },
    { name: "Cville Rock Gym",          type: "hidden_gem", coords: [38.0489, -78.4801], budget: 15, address: "600 Peter Jefferson Pkwy, Charlottesville, VA",hours: "Mon–Fri 6am–10pm, Sat–Sun 9am–8pm",  desc: "Small local climbing gym regulars swear by — far less crowded than chains." },
    { name: "Birdwood Golf Course Lawn",type: "hidden_gem", coords: [38.0245, -78.5301], budget: 0,  address: "410 Golf Course Dr, Charlottesville, VA",    hours: "Open daily, dawn to dusk",            desc: "A gorgeous open lawn at the edge of a golf course — locals picnic and stargaze here." },
    { name: "Pen Park Disc Golf",       type: "hidden_gem", coords: [38.0634, -78.4701], budget: 0,  address: "1800 Pen Park Rd, Charlottesville, VA",      hours: "Open daily 6am–10pm",                 desc: "18-hole disc golf course that most visitors never find. Totally free." },
    { name: "Belmont Neighborhood Walk",type: "hidden_gem", coords: [38.0218, -78.4752], budget: 0,  address: "Belmont Ave, Charlottesville, VA",           hours: "Always accessible",                   desc: "Walkable Belmont district with street art and the best local restaurants." },
    { name: "Free Saturdays at Fralin", type: "hidden_gem", coords: [38.0356, -78.5046], budget: 0,  address: "155 Rugby Rd, Charlottesville, VA",          hours: "Tue–Sun 11am–5pm (free always)",      desc: "Saturday mornings at the Fralin are completely empty — peaceful art viewing." },
    { name: "Rivanna River Rope Swing", type: "hidden_gem", coords: [38.0510, -78.4398], budget: 0,  address: "Near Rivanna River, Charlottesville, VA",    hours: "Dawn to dusk, summer best",           desc: "Local swimming hole passed down by word of mouth. No signage — locals only." },
    { name: "Charlottesville City Market",type:"hidden_gem", coords: [38.0336, -78.4831], budget: 5, address: "100 E Jefferson St, Charlottesville, VA",    hours: "Sat 7am–12pm (Apr–Dec)",              desc: "Saturday farmers market locals shop religiously. Best burritos in town." },
    { name: "The Prism Coffeehouse",    type: "hidden_gem", coords: [38.0271, -78.4811], budget: 8,  address: "214 Rugby Rd, Charlottesville, VA",          hours: "Show nights only — check schedule",   desc: "Volunteer-run listening room. One of the oldest folk venues in Virginia." },
    { name: "Observatory Hill Picnic",  type: "hidden_gem", coords: [38.0338, -78.5130], budget: 0,  address: "Observatory Hill, UVA Grounds, Charlottesville, VA", hours: "Always accessible",          desc: "Quiet hilltop clearing where locals watch sunsets. Almost no one knows this spot." },
    { name: "Miller's Downtown",        type: "hidden_gem", coords: [38.0294, -78.4796], budget: 15, address: "109 W Main St, Charlottesville, VA",         hours: "Daily 5pm–2am",                       desc: "Basement live music bar locals have kept alive for decades. No cover." },
    { name: "Ix Sculpture Walk",        type: "hidden_gem", coords: [38.0241, -78.4816], budget: 0,  address: "522 2nd St SE, Charlottesville, VA",         hours: "Always accessible",                   desc: "Rotating outdoor sculpture trail most visitors walk right past." },
];

// 5. State
var activeMarkers = [];
var currentCategory = 'all';
var budgetFilterActive = false;  // budget only applies AFTER Find Places is clicked

// 6. Custom marker icon
function makeIcon(type) {
    var cfg = CATEGORY_CONFIG[type] || { emoji: '📍', color: '#555' };
    return L.divIcon({
        className: '',
        html: '<div style="width:34px;height:34px;border-radius:50%;background:white;border:2.5px solid ' + cfg.color + ';display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.25);">' + cfg.emoji + '</div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -20],
    });
}

// 7. Render places on map + sidebar
function renderLocations(places) {
    activeMarkers.forEach(function(m) { map.removeLayer(m); });
    activeMarkers = [];

    var listContainer = document.getElementById('location-list');
    var countEl = document.getElementById('result-count');
    listContainer.innerHTML = '';

    if (places.length === 0) {
        listContainer.innerHTML = '<div class="empty-state"><span class="owl-empty">🦉</span>No places match.<br>Try a different category or budget.</div>';
        if (countEl) countEl.style.display = 'none';
        return;
    }

    if (countEl) {
        countEl.style.display = 'block';
        countEl.textContent = places.length + ' place' + (places.length !== 1 ? 's' : '') + ' found';
    }

    places.forEach(function(loc) {
        var cfg = CATEGORY_CONFIG[loc.type] || { emoji: '📍', color: '#555' };
        var budgetStr = loc.budget === 0 ? 'Free' : '$' + loc.budget + '/person';
        var typeName = loc.type === 'hidden_gem' ? '💎 Local Secret' : loc.type.charAt(0).toUpperCase() + loc.type.slice(1);
        var gemBadge = loc.type === 'hidden_gem' ? '<span style="background:#e0f2f1;color:#00695c;font-size:10px;padding:2px 7px;border-radius:10px;font-weight:700;margin-left:5px;">LOCALS ONLY</span>' : '';

        var marker = L.marker(loc.coords, { icon: makeIcon(loc.type) })
            .addTo(map)
            .bindPopup(
                '<div style="min-width:210px;font-family:Nunito,sans-serif;">' +
                '<div style="font-size:15px;font-weight:bold;color:#1a1f2e;margin-bottom:3px;">' + loc.name + gemBadge + '</div>' +
                '<div style="font-size:11px;color:#aaa;margin-bottom:8px;">' + typeName + '</div>' +
                '<div style="font-size:12px;color:#555;margin-bottom:6px;">📍 ' + loc.address + '</div>' +
                '<div style="font-size:12px;color:#555;margin-bottom:8px;">🕐 ' + loc.hours + '</div>' +
                '<div style="font-size:12px;color:#444;margin-bottom:10px;">' + loc.desc + '</div>' +
                '<span style="background:#e8f5e9;color:#2e7d32;font-size:11px;padding:3px 9px;border-radius:10px;font-weight:700;">' + budgetStr + '</span>' +
                '</div>'
            );

        activeMarkers.push(marker);

        var card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML =
            '<strong>' + cfg.emoji + ' ' + loc.name + '</strong>' +
            '<div class="meta">📍 ' + loc.address + '</div>' +
            '<div class="meta">🕐 ' + loc.hours + '</div>' +
            '<span class="budget-tag' + (loc.budget === 0 ? ' free-tag' : '') + '">' + budgetStr + '</span>';
        card.onclick = (function(l, m) {
            return function() {
                map.flyTo(l.coords, 16, { duration: 0.8 });
                setTimeout(function() { m.openPopup(); }, 850);
            };
        })(loc, marker);

        listContainer.appendChild(card);
    });
}

// 8. Category chip click — ONLY filters by category, budget is NEVER applied here
function selectCategory(cat, btnEl) {
    currentCategory = cat;
    budgetFilterActive = false; // reset budget filter when switching category

    // highlight selected chip
    document.querySelectorAll('.chip').forEach(function(c) { c.classList.remove('active'); });
    if (btnEl) btnEl.classList.add('active');

    // filter ONLY by category — ignore budget entirely
    var filtered = cvilleLocations.filter(function(loc) {
        return cat === 'all' || loc.type === cat;
    });
    renderLocations(filtered);
}

// 9. Find Places button — ONLY place where budget is applied
function applyFilters() {
    var minVal = document.getElementById('budgetMin').value;
    var maxVal = document.getElementById('budgetMax').value;
    var minBudget = (minVal === '' || isNaN(parseInt(minVal))) ? 0 : parseInt(minVal);
    var maxBudget = (maxVal === '' || isNaN(parseInt(maxVal))) ? 99999 : parseInt(maxVal);

    if (minBudget > maxBudget) { alert('Min budget cannot exceed max budget.'); return; }

    budgetFilterActive = true;

    var filtered = cvilleLocations.filter(function(loc) {
        var budgetOk = loc.budget >= minBudget && loc.budget <= maxBudget;
        var catOk = currentCategory === 'all' || loc.type === currentCategory;
        return budgetOk && catOk;
    });

    renderLocations(filtered);
}

// 10. Show everything on initial load
renderLocations(cvilleLocations);