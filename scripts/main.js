// Configure marked.js to handle code blocks and Plotly divs
marked.setOptions({
    breaks: true,
    gfm: true,
    sanitize: false
});

// Store posts data
let posts = [];

// Function to load and parse posts
async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '<div class="loading"></div>';

    try {
        // In a real implementation, you would fetch this from a JSON file
        // For now, we'll use a static array
        posts = [
            {
                id: 'hello-world',
                title: 'Hello World: Interactive Data Visualization',
                date: '2024-03-20',
                preview: 'Welcome to my data blog! In this first post, we\'ll explore some interactive visualizations using Plotly.js.',
                content: await fetch('posts/hello-world.md').then(res => res.text())
            }
            // Add more posts here as needed
        ];

        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display posts
        displayPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
}

// Function to display posts
function displayPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <h2>${post.title}</h2>
            <div class="date">${formatDate(post.date)}</div>
            <div class="preview">${post.preview}</div>
        `;

        postCard.addEventListener('click', () => displayPost(post));
        postsContainer.appendChild(postCard);
    });
}

// Function to display a single post
async function displayPost(post) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '<div class="loading"></div>';

    try {
        // Convert markdown to HTML
        const htmlContent = marked.parse(post.content);
        
        // Create post content container
        const postContent = document.createElement('div');
        postContent.className = 'post-content';
        postContent.innerHTML = `
            <h1>${post.title}</h1>
            <div class="date">${formatDate(post.date)}</div>
            ${htmlContent}
            <button onclick="displayPosts()" class="back-button">← Back to Posts</button>
        `;

        postsContainer.innerHTML = '';
        postsContainer.appendChild(postContent);

        // Initialize any Plotly charts in the post
        initializePlotlyCharts(postContent);
    } catch (error) {
        console.error('Error displaying post:', error);
        postsContainer.innerHTML = '<p>Error loading post. Please try again later.</p>';
    }
}

// Function to initialize Plotly charts
function initializePlotlyCharts(container) {
    // Find all divs with class 'plotly-graph'
    const plotlyDivs = container.getElementsByClassName('plotly-graph');
    
    Array.from(plotlyDivs).forEach(div => {
        try {
            // Parse the data from the data-plotly attribute
            const plotData = JSON.parse(div.getAttribute('data-plotly'));
            Plotly.newPlot(div, plotData.data, plotData.layout);
        } catch (error) {
            console.error('Error initializing Plotly chart:', error);
        }
    });
}

// Helper function to format dates
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', loadPosts); 