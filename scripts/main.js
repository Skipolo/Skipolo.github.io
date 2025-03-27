// Configure marked.js to handle code blocks and Plotly divs
marked.setOptions({
    breaks: true,
    gfm: true,
    sanitize: false
});

// Store posts data
let posts = [];

// Function to handle hash-based routing
function handleHashRoute() {
    const hash = window.location.hash;
    if (hash) {
        const postId = hash.replace('#post-', '');
        const post = posts.find(p => p.id === postId);
        if (post) {
            displayPost(post);
        }
    } else {
        displayPosts();
    }
}

// Function to load and parse posts
async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '<div class="loading"></div>';

    try {
        // In a real implementation, you would fetch this from a JSON file
        // For now, we'll use a static array
        posts = [
            {
                id: 'census-report',
                title: 'The Great Census of Skyfall: A Report on Our Nations',
                date: '2024-03-20',
                day: 1,
                preview: 'A comprehensive census report detailing the population, economic activities, and future projections of the nations within our realm.',
                content: await fetch('posts/hello-world.md')
                    .then(res => {
                        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                        return res.text();
                    })
                    .catch(error => {
                        console.error('Error loading post content:', error);
                        return '# Error Loading Content\n\nWe apologize, but there was an error loading this article. Please try again later.';
                    })
            }
            // Add more posts here as needed
        ];

        // Sort posts by day and date
        posts.sort((a, b) => {
            if (a.day !== b.day) return a.day - b.day;
            return new Date(a.date) - new Date(b.date);
        });

        // Check if we're on a post page
        const path = window.location.pathname;
        const postId = path.split('/').pop();
        
        if (postId && postId !== 'index.html') {
            const post = posts.find(p => p.id === postId);
            if (post) {
                displayPost(post);
            } else {
                displayPosts();
            }
        } else {
            displayPosts();
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<div class="error-message">Error loading posts. Please try again later.</div>';
    }
}

// Function to display posts
function displayPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">No articles available at this time.</div>';
        return;
    }

    // Update URL to home
    window.history.pushState({ view: 'home' }, '', '/');

    // Group posts by day
    const postsByDay = {};
    posts.forEach(post => {
        if (!postsByDay[post.day]) {
            postsByDay[post.day] = [];
        }
        postsByDay[post.day].push(post);
    });

    // Display posts grouped by day
    Object.keys(postsByDay).sort((a, b) => a - b).forEach(day => {
        const daySection = document.createElement('div');
        daySection.className = 'day-section';
        
        // Add day header
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.innerHTML = `<h2>Day ${day}</h2>`;
        daySection.appendChild(dayHeader);

        // Add posts for this day
        postsByDay[day].forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <div class="date">${formatDate(post.date)}</div>
                <div class="preview">${post.preview}</div>
            `;

            postCard.addEventListener('click', () => {
                handlePostClick(post);
            });
            daySection.appendChild(postCard);
        });

        postsContainer.appendChild(daySection);
    });
}

// Function to display a single post
async function displayPost(post) {
    const container = document.getElementById('posts-container');
    container.innerHTML = `
        <div class="post-content">
            <div class="post-header">
                <h1>${post.title}</h1>
                <p class="date">${post.date}</p>
            </div>
            <div class="post-body">
                ${htmlContent.replace(/<h1[^>]*>.*?<\/h1>/, '')}
            </div>
            <button class="back-button" onclick="handleBackClick()">Return to News</button>
        </div>
    `;
}

// Function to handle back button click
function handleBackClick() {
    // Clear the hash from URL
    window.location.hash = '';
    displayPosts();
}

// Function to initialize Plotly charts
async function initializePlotlyCharts(container) {
    // Find all divs with class 'plotly-graph'
    const plotlyDivs = container.getElementsByClassName('plotly-graph');
    
    for (const div of plotlyDivs) {
        try {
            // Parse the data from the data-plotly attribute
            const plotData = JSON.parse(div.getAttribute('data-plotly'));
            
            // Ensure the div is empty before plotting
            div.innerHTML = '';
            
            // Create the plot
            await Plotly.newPlot(div, plotData.data, plotData.layout);
        } catch (error) {
            console.error('Error initializing Plotly chart:', error);
            div.innerHTML = '<div class="error-message">Error loading chart. Please try again later.</div>';
        }
    }
}

// Helper function to format dates
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view === 'post') {
        const post = posts.find(p => p.id === event.state.postId);
        if (post) {
            displayPost(post);
        }
    } else {
        displayPosts();
    }
});

// Handle URL changes
window.addEventListener('hashchange', handleHashRoute);
window.addEventListener('load', handleHashRoute);

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    
    // Handle hash changes
    window.addEventListener('hashchange', handleHashRoute);
    
    // Handle initial hash
    handleHashRoute();
}); 