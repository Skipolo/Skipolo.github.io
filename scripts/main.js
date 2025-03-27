// Configure marked.js to handle code blocks and Plotly divs
marked.setOptions({
    breaks: true,
    gfm: true,
    sanitize: false
});

// Global variables
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
        const response = await fetch('posts/posts.json');
        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        posts = data.posts;
        
        // Sort posts by date in descending order
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Group posts by day
        const postsByDay = {};
        posts.forEach(post => {
            if (!postsByDay[post.day]) {
                postsByDay[post.day] = [];
            }
            postsByDay[post.day].push(post);
        });
        
        // Sort days in descending order, handling both numeric and string values
        const sortedDays = Object.keys(postsByDay).sort((a, b) => {
            // If both are numbers, sort numerically
            if (!isNaN(a) && !isNaN(b)) {
                return b - a;
            }
            // If one is a number and one is a string, numbers come first
            if (!isNaN(a) && isNaN(b)) return -1;
            if (isNaN(a) && !isNaN(b)) return 1;
            // If both are strings, sort alphabetically
            return b.localeCompare(a);
        });
        
        // Display posts grouped by day
        postsContainer.innerHTML = '';
        
        if (sortedDays.length === 0) {
            postsContainer.innerHTML = '<div class="no-posts">No posts available.</div>';
            return;
        }
        
        sortedDays.forEach(day => {
            const daySection = document.createElement('div');
            daySection.className = 'day-section';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.innerHTML = `<h2>${day}</h2>`;
            daySection.appendChild(dayHeader);
            
            postsByDay[day].forEach(post => {
                const postCard = document.createElement('div');
                postCard.className = 'post-card';
                postCard.innerHTML = `
                    <h3>${post.title}</h3>
                    <p class="date">${post.date}</p>
                    <p class="preview">${post.preview}</p>
                `;
                
                postCard.addEventListener('click', () => {
                    handlePostClick(post);
                });
                daySection.appendChild(postCard);
            });
            
            postsContainer.appendChild(daySection);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = `
            <div class="error-message">
                <p>Error loading posts: ${error.message}</p>
                <p>Please try again later or contact support if the problem persists.</p>
            </div>
        `;
    }
}

// Function to handle post click
function handlePostClick(post) {
    // Update URL with post ID
    const newUrl = `#post-${post.id}`;
    window.location.hash = newUrl;
    displayPost(post);
}

// Function to handle back button click
function handleBackClick() {
    // Clear the hash from URL
    window.location.hash = '';
    // Reload the posts
    loadPosts();
}

// Function to display a single post
async function displayPost(post) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '<div class="loading"></div>';

    try {
        // Fetch the markdown content
        const response = await fetch('./posts/' + post.content);
        if (!response.ok) {
            throw new Error(`Failed to load post content: ${response.status} ${response.statusText}`);
        }
        const markdownContent = await response.text();
        
        // Convert markdown to HTML
        const htmlContent = marked.parse(markdownContent);
        
        // Create post content container
        const postContent = document.createElement('div');
        postContent.className = 'post-content';
        postContent.innerHTML = `
            <div class="post-header">
                <h1>${post.title}</h1>
                <p class="date">${post.date}</p>
            </div>
            <div class="post-body">
                ${htmlContent.replace(/<h1[^>]*>.*?<\/h1>/, '')}
            </div>
            <button class="back-button" onclick="handleBackClick()">Return to News</button>
        `;

        container.innerHTML = '';
        container.appendChild(postContent);

        // Initialize any Plotly charts in the post
        await initializePlotlyCharts(postContent);
    } catch (error) {
        console.error('Error displaying post:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Error loading post: ${error.message}</p>
                <p>Please try again later or contact support if the problem persists.</p>
            </div>
            <button class="back-button" onclick="handleBackClick()">Return to News</button>
        `;
    }
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
document.addEventListener('DOMContentLoaded', loadPosts); 