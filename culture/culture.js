// States data with cultural information
const statesData = {
    maharashtra: {
        name: 'Maharashtra',
        description: 'Home to vibrant Marathi culture, featuring the energetic Lavani dance, warli art, and festivals like Ganesh Chaturthi.',
        traditions: ['Lavani Dance', 'Warli Art', 'Ganesh Chaturthi'],
        festivals: ['Ganesh Chaturthi', 'Gudi Padwa', 'Diwali'],
        cuisine: ['Vada Pav', 'Puran Poli', 'Misal Pav'],
        art: ['Warli Painting', 'Paithani Sarees', 'Kolhapuri Chappal'],
        image: '../images/states/maharashtra.jpg'
    },
    rajasthan: {
        name: 'Rajasthan',
        description: 'Known as the Land of Kings, Rajasthan showcases rich cultural heritage through its colorful festivals, traditional music, and grand architecture.',
        traditions: ['Ghoomar Dance', 'Puppet Shows', 'Desert Culture'],
        festivals: ['Pushkar Fair', 'Desert Festival', 'Teej'],
        cuisine: ['Dal Baati Churma', 'Laal Maas', 'Ker Sangri'],
        art: ['Miniature Paintings', 'Block Printing', 'Meenakari'],
        image: '../images/states/rajasthan.jpg'
    },
    kerala: {
        name: 'Kerala',
        description: 'God\'s Own Country features unique traditions, classical art forms, and a rich cultural heritage influenced by its coastal location.',
        traditions: ['Kathakali', 'Theyyam', 'Boat Races'],
        festivals: ['Onam', 'Thrissur Pooram', 'Vishu'],
        cuisine: ['Appam', 'Kerala Fish Curry', 'Puttu'],
        art: ['Mural Paintings', 'Kalarippayattu', 'Classical Dance'],
        image: '../images/states/kerala.jpg'
    },
    // Add more states as needed
};

// Featured categories data
const categories = [
    {
        id: 'art-crafts',
        title: 'Art & Crafts',
        description: "India's artistic heritage includes diverse traditional crafts like pottery, weaving, metalwork, and painting.",
        items: [
            {
                name: 'Madhubani Painting',
                origin: 'Bihar',
                description: 'Traditional art form using natural dyes and unique geometric patterns.',
                image: '../images/wallart.jpg'
            },
            {
                name: 'Warli Art',
                origin: 'Maharashtra',
                description: 'Ancient tribal art style depicting daily life through geometric shapes.',
                image: '../images/design1.jpg'
            },
            {
                name: 'Kantha Embroidery',
                origin: 'West Bengal',
                description: 'Traditional form of embroidery used to make quilts and decorative items.',
                image: '../images/knthaembroiderry.jpg'
            }
        ],
        image: '../images/design4.jpeg'
    },
    {
        id: 'music-dance',
        title: 'Folk Music & Dance',
        description: 'Rich traditions of classical and folk performances that tell stories of our heritage.',
        items: [
            {
                name: 'Bharatanatyam',
                origin: 'Tamil Nadu',
                description: 'Classical dance form known for its grace and sculptural poses.',
                image: '../images/design2.jpeg'
            },
            {
                name: 'Kathak',
                origin: 'North India',
                description: 'Classical dance characterized by fluid movements and intricate footwork.',
                image: '../images/design3.jpeg'
            },
            {
                name: 'Ghoomar',
                origin: 'Rajasthan',
                description: 'Traditional folk dance performed by Rajasthani women on special occasions.',
                image: '../images/bg1.jpg'
            }
        ],
        image: '../images/bg2.svg'
    },
    {
        id: 'festivals',
        title: 'Festivals & Celebrations',
        description: 'Vibrant festivals that showcase the diversity and unity of Indian culture.',
        items: [
            {
                name: 'Diwali',
                origin: 'Pan India',
                description: 'Festival of lights celebrating the victory of good over evil.',
                image: '../images/bg1.jpg'
            },
            {
                name: 'Pongal',
                origin: 'Tamil Nadu',
                description: 'Harvest festival celebrating the sun god and agricultural abundance.',
                image: '../images/design1.jpg'
            },
            {
                name: 'Bihu',
                origin: 'Assam',
                description: 'Traditional festival marking the Assamese New Year and harvest season.',
                image: '../images/design4.jpeg'
            }
        ],
        image: '../images/design2.jpeg'
    },
    {
        id: 'handicrafts',
        title: 'Traditional Handicrafts',
        description: 'Ancient craftsmanship passed down through generations.',
        items: [
            {
                name: 'Coconut Craft',
                origin: 'Kerala',
                description: 'Unique handicrafts made from coconut shells and fibers.',
                image: '../images/coconutcraft.jpg'
            },
            {
                name: 'Brass Work',
                origin: 'Uttar Pradesh',
                description: 'Intricate metalwork in brass, creating decorative and functional items.',
                image: '../images/aktara.jpg'
            },
            {
                name: 'Bidri Work',
                origin: 'Karnataka',
                description: 'Metal handicraft with silver inlay work on black metal base.',
                image: '../images/wallart.jpg'
            }
        ],
        image: '../images/design3.jpeg'
    }
];

// Did You Know facts
const funFacts = [
    {
        id: 1,
        title: 'Ancient Universities',
        fact: 'Takshashila (now Taxila) was the world\'s first university, established around 700 BCE.',
        image: '../images/design1.jpg'
    },
    {
        id: 2,
        title: 'Chess Origin',
        fact: 'Chess originated in India around the 6th century, initially called "Chaturanga".',
        image: '../images/design2.jpeg'
    },
    {
        id: 3,
        title: 'Zero Invention',
        fact: 'The concept of zero was invented in India by mathematician Aryabhata.',
        image: '../images/design3.jpeg'
    },
    {
        id: 4,
        title: 'Oldest Living Language',
        fact: 'Sanskrit is considered one of the oldest living languages in the world.',
        image: '../images/design4.jpeg'
    },
    {
        id: 5,
        title: 'Yoga Heritage',
        fact: 'Yoga originated in ancient India over 5,000 years ago as a practice for physical, mental, and spiritual well-being.',
        image: '../images/bg1.jpg'
    }
];

// DOM Elements
const searchInput = document.getElementById('culture-search');
const mapContainer = document.getElementById('map-container');
const stateInfo = document.getElementById('state-info');
const categoriesContainer = document.querySelector('#categories .grid');
const funFactsContainer = document.querySelector('#fun-facts .carousel');

// Search functionality
function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Search in states
        Object.values(statesData).forEach(state => {
            const stateElement = mapContainer.querySelector(`#${state.name.toLowerCase()}`);
            if (stateElement) {
                const matches = state.name.toLowerCase().includes(searchTerm) ||
                              state.description.toLowerCase().includes(searchTerm) ||
                              state.traditions.some(t => t.toLowerCase().includes(searchTerm));
                stateElement.style.opacity = matches ? '1' : '0.3';
            }
        });
        
        // Search in categories
        const categoryCards = categoriesContainer.querySelectorAll('.card');
        categoryCards.forEach((card, index) => {
            const category = categories[index];
            const matches = category.title.toLowerCase().includes(searchTerm) ||
                          category.description.toLowerCase().includes(searchTerm) ||
                          category.items.some(item => 
                              item.name.toLowerCase().includes(searchTerm) ||
                              item.description.toLowerCase().includes(searchTerm)
                          );
            card.style.display = matches ? 'block' : 'none';
        });
        
        // Search in fun facts
        const factCards = funFactsContainer.querySelectorAll('.carousel-item');
        factCards.forEach((card, index) => {
            const fact = funFacts[index];
            const matches = fact.title.toLowerCase().includes(searchTerm) ||
                          fact.fact.toLowerCase().includes(searchTerm);
            card.style.display = matches ? 'block' : 'none';
        });
    });
}

// Map interaction
function setupMap() {
    // Fetch SVG map from images directory
    fetch('../images/india.svg')
        .then(response => response.text())
        .then(svgContent => {
            mapContainer.innerHTML = svgContent;
            
            // Add interactivity to states
            const states = mapContainer.querySelectorAll('path');
            states.forEach(state => {
                // Add hover effects
                state.addEventListener('mouseenter', () => {
                    state.style.fill = '#E67E22';
                    state.style.cursor = 'pointer';
                });
                
                state.addEventListener('mouseleave', () => {
                    state.style.fill = '';
                });
                
                // Add click handler
                state.addEventListener('click', () => {
                    const stateId = state.id.toLowerCase();
                    if (statesData[stateId]) {
                        showStateInfo(statesData[stateId]);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error loading map:', error);
            mapContainer.innerHTML = '<p class="text-center text-red-500">Error loading map. Please try again later.</p>';
        });
}

// Display state information
function showStateInfo(state) {
    stateInfo.classList.remove('hidden');
    stateInfo.innerHTML = `
        <div class="card-body">
            <h2 class="card-title text-2xl text-[#E67E22]">${state.name}</h2>
            <p class="mb-4">${state.description}</p>
            <div class="divider">Traditional Elements</div>
            <ul class="list-disc list-inside">
                ${state.traditions.map(tradition => `<li>${tradition}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Smooth scroll to state info
    stateInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Category cards
function createCategoryCards() {
    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow';
        card.innerHTML = `
            <figure class="relative">
                <img src="${category.image}" alt="${category.title}" class="w-full h-48 object-cover"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 class="absolute bottom-4 left-4 text-white text-2xl font-bold">${category.title}</h3>
            </figure>
            <div class="card-body">
                <p class="mb-4">${category.description}</p>
                <div class="collapse collapse-plus bg-base-200">
                    <input type="checkbox" /> 
                    <div class="collapse-title text-xl font-medium">
                        Explore ${category.title}
                    </div>
                    <div class="collapse-content">
                        ${category.items.map(item => `
                            <div class="mb-4">
                                <h4 class="font-bold text-[#E67E22]">${item.name}</h4>
                                <p class="text-sm text-gray-600">Origin: ${item.origin}</p>
                                <p class="mt-2">${item.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        categoriesContainer.appendChild(card);
    });
}

// Fun facts carousel
function createFunFacts() {
    funFactsContainer.className = "carousel w-full p-4 space-x-4 rounded-box";
    
    funFacts.forEach((fact, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-item w-full md:w-1/2 lg:w-1/3`;
        slide.innerHTML = `
            <div class="card bg-base-100 shadow-xl mx-auto max-w-sm transform transition-all duration-300 hover:scale-105">
                <figure class="relative">
                    <img src="${fact.image}" alt="${fact.title}" class="w-full h-48 object-cover"/>
                    <div class="absolute top-0 left-0 bg-[#E67E22] text-white px-4 py-2 rounded-br-lg">
                        Did You Know?
                    </div>
                </figure>
                <div class="card-body">
                    <h4 class="card-title text-[#E67E22]">${fact.title}</h4>
                    <p class="text-gray-700">${fact.fact}</p>
                </div>
            </div>
        `;
        funFactsContainer.appendChild(slide);
    });

    // Add navigation buttons
    const nav = document.createElement('div');
    nav.className = 'flex justify-center w-full py-2 gap-2';
    nav.innerHTML = funFacts.map((_, index) => `
        <button class="btn btn-xs" onclick="scrollToFact(${index})">
            ${index + 1}
        </button>
    `).join('');
    funFactsContainer.parentNode.appendChild(nav);
}

// Function to scroll to specific fact
function scrollToFact(index) {
    const facts = funFactsContainer.querySelectorAll('.carousel-item');
    if (facts[index]) {
        facts[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

// Handle responsive layout
function handleResponsiveLayout() {
    const isMobile = window.innerWidth < 768;
    
    // Adjust map size for mobile
    if (mapContainer) {
        const map = mapContainer.querySelector('svg');
        if (map) {
            map.style.maxHeight = isMobile ? '300px' : '500px';
        }
    }

    // Adjust carousel behavior
    const carousel = document.querySelector('#fun-facts .carousel');
    if (carousel) {
        carousel.style.scrollSnapType = isMobile ? 'x mandatory' : 'none';
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupMap();
    createCategoryCards();
    createFunFacts();
    handleResponsiveLayout();

    // Handle window resize
    window.addEventListener('resize', handleResponsiveLayout);
});

// Add some helpful comments for future maintenance
/*
Integration Guide:

1. Dependencies:
   - Tailwind CSS
   - DaisyUI
   - SVG map of India (place in images/india.svg)

2. Data Structure:
   - Update statesData with complete information for all states
   - Add real images and content to categories
   - Expand funFacts with more interesting cultural facts

3. Customization:
   - Color scheme can be adjusted in the CSS classes (current: saffron theme)
   - Map colors and hover effects can be modified in setupMap()
   - Category layout can be adjusted in the grid classes

4. Responsive Breakpoints:
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px
*/